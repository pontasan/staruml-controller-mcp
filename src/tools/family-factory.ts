import { z, type ZodRawShape, type ZodTypeAny } from "zod"
import type { ToolDefinition } from "../tool-registry.js"
import type {
    FamilyConfig,
    ResourceConfig,
    RelationConfig,
    ChildConfig,
    ContainerConfig,
    FieldDef,
    FieldSchema,
} from "./families/types.js"

/**
 * Convert a hyphenated plural name to a singular underscore name for tool naming.
 * e.g., 'data-types' → 'data_type', 'classes' → 'class'
 */
function toSingular(plural: string): string {
    const underscored = plural.replace(/-/g, "_")
    // Simple English pluralization rules (covers our cases)
    if (underscored.endsWith("ies")) {
        return underscored.slice(0, -3) + "y"
    }
    if (underscored.endsWith("sses") || underscored.endsWith("shes") || underscored.endsWith("ches") || underscored.endsWith("xes")) {
        return underscored.slice(0, -2)
    }
    if (underscored.endsWith("s") && !underscored.endsWith("ss")) {
        return underscored.slice(0, -1)
    }
    return underscored
}

/**
 * Convert a hyphenated name to underscore name for tool naming.
 * e.g., 'control-flows' → 'control_flows'
 */
function toUnderscore(name: string): string {
    return name.replace(/-/g, "_")
}

/**
 * Resolve a FieldDef into a name and Zod schema.
 */
function resolveField(field: FieldDef): { name: string; zodSchema: ZodTypeAny } {
    if (typeof field === "string") {
        return { name: field, zodSchema: z.string().optional().describe(field) }
    }
    const { name, schema } = field
    let zodSchema = buildZodFromSchema(schema, name)
    return { name, zodSchema }
}

function buildZodFromSchema(schema: FieldSchema, name: string): ZodTypeAny {
    const desc = schema.description || name

    let base: ZodTypeAny
    switch (schema.zodType) {
        case "number":
            base = z.number().describe(desc)
            break
        case "boolean":
            base = z.boolean().describe(desc)
            break
        case "enum":
            if (schema.enumValues && schema.enumValues.length > 0) {
                base = z.enum(schema.enumValues as unknown as [string, ...string[]]).describe(desc)
            } else {
                base = z.string().describe(desc)
            }
            break
        default:
            base = z.string().describe(desc)
            break
    }

    if (schema.nullable) {
        base = base.nullable()
    }
    if (!schema.required) {
        base = base.optional()
    }

    return base
}

/**
 * Extract the field name from a FieldDef.
 */
function fieldName(field: FieldDef): string {
    return typeof field === "string" ? field : field.name
}

/**
 * Add FieldDef[] to a ZodRawShape, skipping already-present keys.
 */
function addFieldsToShape(shape: ZodRawShape, fields: FieldDef[], skipKeys?: Set<string>): void {
    for (const f of fields) {
        const { name, zodSchema } = resolveField(f)
        if (skipKeys?.has(name)) continue
        if (!(name in shape)) {
            shape[name] = zodSchema
        }
    }
}

/**
 * Generate all MCP ToolDefinition[] from a FamilyConfig.
 */
export function generateFamilyTools(config: FamilyConfig): ToolDefinition[] {
    const tools: ToolDefinition[] = []
    const prefix = config.prefix.replace(/-/g, "_")

    // Container
    if (config.container) {
        tools.push(...generateContainerTools(prefix, config, config.container))
    }

    // Diagrams
    if (config.diagrams) {
        tools.push(...generateDiagramTools(prefix, config))
    }

    // Resources
    for (const res of config.resources) {
        tools.push(...generateResourceTools(prefix, config, res))

        // Children
        if (res.children) {
            for (const child of res.children) {
                if (child.fullCrud) {
                    tools.push(...generateFullCrudChildTools(prefix, config, res, child))
                } else {
                    tools.push(...generateChildTools(prefix, config, res, child))
                }
            }
        }
    }

    // Relations
    for (const rel of config.relations) {
        tools.push(...generateRelationTools(prefix, config, rel))
    }

    // Custom tools
    if (config.customTools) {
        tools.push(...config.customTools)
    }

    return tools
}

// ============================================================
// Container tools (e.g., data-models, interactions)
// ============================================================

function generateContainerTools(
    prefix: string,
    config: FamilyConfig,
    container: ContainerConfig
): ToolDefinition[] {
    const tools: ToolDefinition[] = []
    const plural = toUnderscore(container.name)
    const singular = toSingular(container.name)
    const humanName = container.name.replace(/-/g, " ")
    const label = config.label

    // List
    tools.push({
        name: `${prefix}_list_${plural}`,
        description: `List all ${label} ${humanName} in the project.`,
        method: "GET",
        pathTemplate: `/api/${config.prefix}/${container.name}`,
        inputSchema: z.object({}),
    })

    // Create
    const createShape: ZodRawShape = {}
    if (container.createFields) {
        addFieldsToShape(createShape, container.createFields)
    }
    tools.push({
        name: `${prefix}_create_${singular}`,
        description: `Create a new ${label} ${humanName}.`,
        method: "POST",
        pathTemplate: `/api/${config.prefix}/${container.name}`,
        inputSchema: z.object(createShape),
    })

    // Get
    tools.push({
        name: `${prefix}_get_${singular}`,
        description: `Get ${label} ${humanName} details by ID.`,
        method: "GET",
        pathTemplate: `/api/${config.prefix}/${container.name}/:id`,
        inputSchema: z.object({
            id: z.string().describe(`${humanName} ID`),
        }),
        pathParams: { id: "id" },
    })

    // Update
    const updateShape: ZodRawShape = {
        id: z.string().describe(`${humanName} ID`),
    }
    if (container.updateFields) {
        addFieldsToShape(updateShape, container.updateFields)
    }
    tools.push({
        name: `${prefix}_update_${singular}`,
        description: `Update a ${label} ${humanName}.`,
        method: "PUT",
        pathTemplate: `/api/${config.prefix}/${container.name}/:id`,
        inputSchema: z.object(updateShape),
        pathParams: { id: "id" },
    })

    // Delete
    tools.push({
        name: `${prefix}_delete_${singular}`,
        description: `Delete a ${label} ${humanName}.`,
        method: "DELETE",
        pathTemplate: `/api/${config.prefix}/${container.name}/:id`,
        inputSchema: z.object({
            id: z.string().describe(`${humanName} ID`),
        }),
        pathParams: { id: "id" },
    })

    return tools
}

// ============================================================
// Diagram tools
// ============================================================

function generateDiagramTools(
    prefix: string,
    config: FamilyConfig
): ToolDefinition[] {
    const diagrams = config.diagrams!
    const label = config.label

    const tools: ToolDefinition[] = []

    // List diagrams
    tools.push({
        name: `${prefix}_list_diagrams`,
        description: `List all ${label} diagrams.`,
        method: "GET",
        pathTemplate: `/api/${config.prefix}/diagrams`,
        inputSchema: z.object({}),
    })

    // Create diagram
    const createShape: ZodRawShape = {}
    createShape.name = z.string().optional().describe("Diagram name")
    if (diagrams.parentIdRequired) {
        createShape.parentId = z.string().describe("Parent element ID")
    } else {
        createShape.parentId = z.string().optional().describe("Parent element ID")
    }
    if (diagrams.types.length > 1) {
        createShape.type = z
            .enum(diagrams.types as [string, ...string[]])
            .optional()
            .describe(`Diagram type (default: ${diagrams.types[0]})`)
    }
    if (diagrams.createFields) {
        addFieldsToShape(createShape, diagrams.createFields)
    }

    tools.push({
        name: `${prefix}_create_diagram`,
        description: `Create a new ${label} diagram.`,
        method: "POST",
        pathTemplate: `/api/${config.prefix}/diagrams`,
        inputSchema: z.object(createShape),
    })

    // Get diagram
    tools.push({
        name: `${prefix}_get_diagram`,
        description: `Get ${label} diagram details by ID.`,
        method: "GET",
        pathTemplate: `/api/${config.prefix}/diagrams/:id`,
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    })

    // Update diagram
    const updateShape: ZodRawShape = {
        id: z.string().describe("Diagram ID"),
        name: z.string().optional().describe("New diagram name"),
    }
    // Add documentation to update if it's in createFields
    if (diagrams.createFields) {
        for (const f of diagrams.createFields) {
            const fname = fieldName(f)
            if (fname === "documentation" && !(fname in updateShape)) {
                updateShape[fname] = z.string().optional().describe("Description")
            }
        }
    }

    tools.push({
        name: `${prefix}_update_diagram`,
        description: `Update a ${label} diagram name.`,
        method: "PUT",
        pathTemplate: `/api/${config.prefix}/diagrams/:id`,
        inputSchema: z.object(updateShape),
        pathParams: { id: "id" },
    })

    // Delete diagram
    tools.push({
        name: `${prefix}_delete_diagram`,
        description: `Delete a ${label} diagram.`,
        method: "DELETE",
        pathTemplate: `/api/${config.prefix}/diagrams/:id`,
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    })

    return tools
}

// ============================================================
// Resource tools
// ============================================================

function generateResourceTools(
    prefix: string,
    config: FamilyConfig,
    res: ResourceConfig
): ToolDefinition[] {
    const tools: ToolDefinition[] = []
    const resPlural = toUnderscore(res.name)
    const resSingular = toSingular(res.name)
    const humanName = res.name.replace(/-/g, " ")
    const label = config.label

    // Determine list/create paths
    let listPath: string
    let createPath: string
    let listIdParam: string | undefined
    let listIdParamName: string | undefined

    if (res.parentScoped) {
        // Parent-scoped: /api/{prefix}/{parent}/:id/{name}
        listPath = `/api/${config.prefix}/${res.parentScoped.parentResource}/:id/${res.name}`
        createPath = listPath
        listIdParam = "id"
        listIdParamName = res.parentScoped.paramName
    } else {
        listPath = `/api/${config.prefix}/${res.name}`
        createPath = listPath
    }

    // Standalone paths for get/update/delete
    const standalonePath = `/api/${config.prefix}/${res.name}/:id`

    // List
    const listShape: ZodRawShape = {}
    if (res.parentScoped) {
        listShape.id = z.string().describe(`${res.parentScoped.parentResource.replace(/-/g, " ")} ID`)
    }
    // Query params
    const queryParams: string[] = []
    if (!res.parentScoped) {
        listShape.diagramId = z.string().optional().describe("Filter by diagram ID")
        queryParams.push("diagramId")
    }
    if (res.listQueryParams) {
        for (const qp of res.listQueryParams) {
            if (!(qp in listShape)) {
                listShape[qp] = z.string().optional().describe(`Filter by ${qp}`)
                queryParams.push(qp)
            }
        }
    }

    tools.push({
        name: `${prefix}_list_${resPlural}`,
        description: res.parentScoped
            ? `List ${humanName} of the specified ${res.parentScoped.parentResource.replace(/-/g, " ")}.`
            : `List ${humanName} in ${label}. Optionally filter by diagramId.`,
        method: "GET",
        pathTemplate: listPath,
        inputSchema: z.object(listShape),
        ...(res.parentScoped ? { pathParams: { id: "id" } } : {}),
        ...(queryParams.length > 0 ? { queryParams } : {}),
    })

    // Create
    const createShape: ZodRawShape = {}
    if (res.parentScoped) {
        createShape.id = z.string().describe(`${res.parentScoped.parentResource.replace(/-/g, " ")} ID`)
    }
    if (!res.parentScoped) {
        // Only auto-add diagramId as required if not explicitly in createFields
        const hasExplicitDiagramId = res.createFields?.some(f => fieldName(f) === "diagramId")
        if (!hasExplicitDiagramId) {
            createShape.diagramId = z.string().describe("Diagram ID")
        }
    }
    createShape.name = z.string().optional().describe(`${humanName} name`)
    if (res.types.length > 1) {
        createShape.type = z
            .enum(res.types as [string, ...string[]])
            .optional()
            .describe(`Element type (default: ${res.types[0]})`)
    }
    if (!res.parentScoped) {
        // Only auto-add position fields if not explicitly in createFields
        const cfNames = new Set(res.createFields?.map(fieldName) ?? [])
        if (!cfNames.has("x1")) createShape.x1 = z.number().optional().describe("X coordinate")
        if (!cfNames.has("y1")) createShape.y1 = z.number().optional().describe("Y coordinate")
        if (!cfNames.has("x2")) createShape.x2 = z.number().optional().describe("X2 coordinate")
        if (!cfNames.has("y2")) createShape.y2 = z.number().optional().describe("Y2 coordinate")
        createShape.tailViewId = z.string().optional().describe("Container view ID (for elements that require placement inside a specific view)")
    }
    if (res.createFields) {
        addFieldsToShape(createShape, res.createFields)
    }

    tools.push({
        name: `${prefix}_create_${resSingular}`,
        description: res.parentScoped
            ? `Create a new ${humanName} in the specified ${res.parentScoped.parentResource.replace(/-/g, " ")}.`
            : `Create a new ${humanName} element in ${label}.`,
        method: "POST",
        pathTemplate: createPath,
        inputSchema: z.object(createShape),
        ...(res.parentScoped ? { pathParams: { id: "id" } } : {}),
    })

    // Get
    tools.push({
        name: `${prefix}_get_${resSingular}`,
        description: `Get ${humanName} details by ID.`,
        method: "GET",
        pathTemplate: standalonePath,
        inputSchema: z.object({
            id: z.string().describe(`${humanName} ID`),
        }),
        pathParams: { id: "id" },
    })

    // Update
    const updateFields = res.updateFields || ["name", "documentation"]
    const updateShape: ZodRawShape = {
        id: z.string().describe(`${humanName} ID`),
    }
    for (const f of updateFields) {
        const { name, zodSchema } = resolveField(f)
        if (!(name in updateShape)) {
            updateShape[name] = zodSchema
        }
    }
    const updateFieldNames = updateFields.map(fieldName)

    tools.push({
        name: `${prefix}_update_${resSingular}`,
        description: `Update a ${humanName} in ${label}. Fields: ${updateFieldNames.join(", ")}.`,
        method: "PUT",
        pathTemplate: standalonePath,
        inputSchema: z.object(updateShape),
        pathParams: { id: "id" },
    })

    // Delete
    tools.push({
        name: `${prefix}_delete_${resSingular}`,
        description: `Delete a ${humanName} from ${label}.`,
        method: "DELETE",
        pathTemplate: standalonePath,
        inputSchema: z.object({
            id: z.string().describe(`${humanName} ID`),
        }),
        pathParams: { id: "id" },
    })

    return tools
}

// ============================================================
// Child tools (list + create only)
// ============================================================

function generateChildTools(
    prefix: string,
    config: FamilyConfig,
    res: ResourceConfig,
    child: ChildConfig
): ToolDefinition[] {
    const tools: ToolDefinition[] = []
    const parentSingular = toSingular(res.name)
    const childPlural = toUnderscore(child.name)
    const childSingular = toSingular(child.name)
    const parentHuman = res.name.replace(/-/g, " ")
    const childHuman = child.name.replace(/-/g, " ")

    // List children
    tools.push({
        name: `${prefix}_list_${parentSingular}_${childPlural}`,
        description: `List ${childHuman} of a ${parentHuman}.`,
        method: "GET",
        pathTemplate: `/api/${config.prefix}/${res.name}/:id/${child.name}`,
        inputSchema: z.object({
            id: z.string().describe(`${parentHuman} ID`),
        }),
        pathParams: { id: "id" },
    })

    // Create child
    const createShape: ZodRawShape = {
        id: z.string().describe(`${parentHuman} ID`),
    }
    createShape.name = z.string().optional().describe(`${childHuman} name`)
    if (child.createFields) {
        addFieldsToShape(createShape, child.createFields, new Set(["name"]))
    }

    tools.push({
        name: `${prefix}_create_${parentSingular}_${childSingular}`,
        description: `Create a new ${childHuman} on a ${parentHuman}.`,
        method: "POST",
        pathTemplate: `/api/${config.prefix}/${res.name}/:id/${child.name}`,
        inputSchema: z.object(createShape),
        pathParams: { id: "id" },
    })

    return tools
}

// ============================================================
// Full CRUD child tools (list + create + get + update + delete)
// ============================================================

function generateFullCrudChildTools(
    prefix: string,
    config: FamilyConfig,
    res: ResourceConfig,
    child: ChildConfig
): ToolDefinition[] {
    const tools: ToolDefinition[] = []
    const childPlural = toUnderscore(child.name)
    const childSingular = toSingular(child.name)
    const parentHuman = res.name.replace(/-/g, " ")
    const childHuman = child.name.replace(/-/g, " ")
    const standalonePrefix = child.standalonePrefix || child.name

    // List/create path: under parent
    const parentPath = `/api/${config.prefix}/${res.name}/:id/${child.name}`
    // Standalone path: for get/update/delete
    const standalonePath = `/api/${config.prefix}/${standalonePrefix}/:id`

    // List
    tools.push({
        name: `${prefix}_list_${childPlural}`,
        description: `List all ${childHuman} of the specified ${parentHuman}.`,
        method: "GET",
        pathTemplate: parentPath,
        inputSchema: z.object({
            id: z.string().describe(`${parentHuman} ID`),
        }),
        pathParams: { id: "id" },
    })

    // Create
    const createShape: ZodRawShape = {
        id: z.string().describe(`${parentHuman} ID`),
    }
    createShape.name = z.string().optional().describe(`${childHuman} name`)
    if (child.createFields) {
        addFieldsToShape(createShape, child.createFields, new Set(["name"]))
    }

    tools.push({
        name: `${prefix}_create_${childSingular}`,
        description: `Add a new ${childHuman} to the specified ${parentHuman}.`,
        method: "POST",
        pathTemplate: parentPath,
        inputSchema: z.object(createShape),
        pathParams: { id: "id" },
    })

    // Get
    tools.push({
        name: `${prefix}_get_${childSingular}`,
        description: `Get the details of the specified ${childHuman}.`,
        method: "GET",
        pathTemplate: standalonePath,
        inputSchema: z.object({
            id: z.string().describe(`${childHuman} ID`),
        }),
        pathParams: { id: "id" },
    })

    // Update
    const updateShape: ZodRawShape = {
        id: z.string().describe(`${childHuman} ID`),
    }
    const updateFields = child.updateFields || ["name"]
    for (const f of updateFields) {
        const { name, zodSchema } = resolveField(f)
        if (!(name in updateShape)) {
            updateShape[name] = zodSchema
        }
    }

    tools.push({
        name: `${prefix}_update_${childSingular}`,
        description: `Update the specified ${childHuman}.`,
        method: "PUT",
        pathTemplate: standalonePath,
        inputSchema: z.object(updateShape),
        pathParams: { id: "id" },
    })

    // Delete
    tools.push({
        name: `${prefix}_delete_${childSingular}`,
        description: `Delete the specified ${childHuman}.`,
        method: "DELETE",
        pathTemplate: standalonePath,
        inputSchema: z.object({
            id: z.string().describe(`${childHuman} ID`),
        }),
        pathParams: { id: "id" },
    })

    return tools
}

// ============================================================
// Relation tools
// ============================================================

function generateRelationTools(
    prefix: string,
    config: FamilyConfig,
    rel: RelationConfig
): ToolDefinition[] {
    const tools: ToolDefinition[] = []
    const relPlural = toUnderscore(rel.name)
    const relSingular = toSingular(rel.name)
    const humanName = rel.name.replace(/-/g, " ")
    const label = config.label

    // Determine list/create paths
    let listPath: string
    let createPath: string

    if (rel.parentScoped) {
        listPath = `/api/${config.prefix}/${rel.parentScoped.parentResource}/:id/${rel.name}`
        createPath = listPath
    } else {
        listPath = `/api/${config.prefix}/${rel.name}`
        createPath = listPath
    }

    const standalonePath = `/api/${config.prefix}/${rel.name}/:id`

    // List
    const listShape: ZodRawShape = {}
    if (rel.parentScoped) {
        listShape.id = z.string().describe(`${rel.parentScoped.parentResource.replace(/-/g, " ")} ID`)
    }
    const queryParams: string[] = []
    if (!rel.parentScoped) {
        listShape.diagramId = z.string().optional().describe("Filter by diagram ID")
        queryParams.push("diagramId")
    }
    if (rel.listQueryParams) {
        for (const qp of rel.listQueryParams) {
            if (!(qp in listShape)) {
                listShape[qp] = z.string().optional().describe(`Filter by ${qp}`)
                queryParams.push(qp)
            }
        }
    }

    tools.push({
        name: `${prefix}_list_${relPlural}`,
        description: rel.parentScoped
            ? `List ${humanName} of the specified ${rel.parentScoped.parentResource.replace(/-/g, " ")}.`
            : `List ${humanName} in ${label}. Optionally filter by diagramId.`,
        method: "GET",
        pathTemplate: listPath,
        inputSchema: z.object(listShape),
        ...(rel.parentScoped ? { pathParams: { id: "id" } } : {}),
        ...(queryParams.length > 0 ? { queryParams } : {}),
    })

    // Create
    const createShape: ZodRawShape = {}
    if (rel.parentScoped) {
        createShape.id = z.string().describe(`${rel.parentScoped.parentResource.replace(/-/g, " ")} ID`)
    }
    if (!rel.noSourceTarget) {
        createShape.diagramId = z.string().describe("Diagram ID")
        createShape.sourceId = z.string().describe("Source element ID")
        createShape.targetId = z.string().describe("Target element ID")
    }
    createShape.name = z.string().optional().describe("Relation name")

    // Process createFields BEFORE end fields so required end fields take precedence
    if (rel.createFields) {
        addFieldsToShape(createShape, rel.createFields)
    }
    if (rel.hasEnds) {
        const endFields = rel.endFields || [
            "name",
            "navigable",
            "aggregation",
            "multiplicity",
        ]
        for (const ef of endFields) {
            for (const side of ["end1", "end2"]) {
                const key = `${side}_${ef}`
                if (!(key in createShape)) {
                    if (ef === "navigable") {
                        createShape[key] = z
                            .boolean()
                            .optional()
                            .describe(`${side} ${ef}`)
                    } else {
                        createShape[key] = z
                            .string()
                            .optional()
                            .describe(`${side} ${ef}`)
                    }
                }
            }
        }
    }

    const createBuildBody = rel.hasEnds
        ? buildRelationBodyWithEnds(rel)
        : undefined

    tools.push({
        name: `${prefix}_create_${relSingular}`,
        description: `Create a new ${humanName} in ${label}.`,
        method: "POST",
        pathTemplate: createPath,
        inputSchema: z.object(createShape),
        ...(rel.parentScoped ? { pathParams: { id: "id" } } : {}),
        buildBody: createBuildBody,
    })

    // Get
    tools.push({
        name: `${prefix}_get_${relSingular}`,
        description: `Get ${humanName} details by ID.`,
        method: "GET",
        pathTemplate: standalonePath,
        inputSchema: z.object({
            id: z.string().describe(`${humanName} ID`),
        }),
        pathParams: { id: "id" },
    })

    // Update
    const updateFields = rel.updateFields || ["name", "documentation"]
    const updateShape: ZodRawShape = {
        id: z.string().describe(`${humanName} ID`),
    }
    for (const f of updateFields) {
        const { name, zodSchema } = resolveField(f)
        if (name !== "end1" && name !== "end2" && !(name in updateShape)) {
            updateShape[name] = zodSchema
        }
    }
    if (rel.hasEnds) {
        const endFields = rel.endFields || [
            "name",
            "navigable",
            "aggregation",
            "multiplicity",
        ]
        for (const ef of endFields) {
            for (const side of ["end1", "end2"]) {
                const key = `${side}_${ef}`
                if (ef === "navigable") {
                    updateShape[key] = z
                        .boolean()
                        .optional()
                        .describe(`${side} ${ef}`)
                } else {
                    updateShape[key] = z
                        .string()
                        .optional()
                        .describe(`${side} ${ef}`)
                }
            }
        }
    }

    const updateBuildBody = rel.hasEnds
        ? buildRelationUpdateBodyWithEnds(rel)
        : undefined

    const updateFieldNames = updateFields.map(fieldName)

    tools.push({
        name: `${prefix}_update_${relSingular}`,
        description: `Update a ${humanName} in ${label}. Fields: ${updateFieldNames.join(", ")}${rel.hasEnds ? ", end1, end2" : ""}.`,
        method: "PUT",
        pathTemplate: standalonePath,
        inputSchema: z.object(updateShape),
        pathParams: { id: "id" },
        buildBody: updateBuildBody,
    })

    // Delete
    tools.push({
        name: `${prefix}_delete_${relSingular}`,
        description: `Delete a ${humanName} from ${label}.`,
        method: "DELETE",
        pathTemplate: standalonePath,
        inputSchema: z.object({
            id: z.string().describe(`${humanName} ID`),
        }),
        pathParams: { id: "id" },
    })

    return tools
}

// ============================================================
// Body builders for relations with ends
// ============================================================

function buildRelationBodyWithEnds(
    rel: RelationConfig
): (params: Record<string, unknown>) => Record<string, unknown> {
    const endFields = rel.endFields || [
        "name",
        "navigable",
        "aggregation",
        "multiplicity",
    ]

    return (params: Record<string, unknown>) => {
        const body: Record<string, unknown> = {}

        // Standard fields (skip end_ prefixed, id, host, port)
        if (!rel.noSourceTarget) {
            body.diagramId = params.diagramId
            body.sourceId = params.sourceId
            body.targetId = params.targetId
        }
        if (params.name !== undefined) body.name = params.name

        // Build end1/end2 objects
        for (const side of ["end1", "end2"]) {
            const endObj: Record<string, unknown> = {}
            let hasEndField = false
            for (const ef of endFields) {
                const key = `${side}_${ef}`
                if (params[key] !== undefined) {
                    endObj[ef] = params[key]
                    hasEndField = true
                }
            }
            if (hasEndField) {
                body[side] = endObj
            }
        }

        // Extra create fields
        const skipFields = new Set(["name"])
        if (!rel.noSourceTarget) {
            skipFields.add("diagramId")
            skipFields.add("sourceId")
            skipFields.add("targetId")
        }
        // Skip end-prefixed fields (handled above)
        for (const ef of endFields) {
            skipFields.add(`end1_${ef}`)
            skipFields.add(`end2_${ef}`)
        }
        if (rel.createFields) {
            for (const f of rel.createFields) {
                const fname = fieldName(f)
                if (params[fname] !== undefined && !skipFields.has(fname)) {
                    body[fname] = params[fname]
                }
            }
        }

        return body
    }
}

function buildRelationUpdateBodyWithEnds(
    rel: RelationConfig
): (params: Record<string, unknown>) => Record<string, unknown> {
    const endFields = rel.endFields || [
        "name",
        "navigable",
        "aggregation",
        "multiplicity",
    ]
    const updateFields = rel.updateFields || ["name", "documentation"]

    return (params: Record<string, unknown>) => {
        const body: Record<string, unknown> = {}

        // Regular update fields
        for (const f of updateFields) {
            const fname = fieldName(f)
            if (params[fname] !== undefined && fname !== "end1" && fname !== "end2") {
                body[fname] = params[fname]
            }
        }

        // Build end1/end2 objects
        for (const side of ["end1", "end2"]) {
            const endObj: Record<string, unknown> = {}
            let hasEndField = false
            for (const ef of endFields) {
                const key = `${side}_${ef}`
                if (params[key] !== undefined) {
                    endObj[ef] = params[key]
                    hasEndField = true
                }
            }
            if (hasEndField) {
                body[side] = endObj
            }
        }

        return body
    }
}
