/** Rich field schema for enum, boolean, number support */
export interface FieldSchema {
    zodType?: "string" | "number" | "boolean" | "enum"
    enumValues?: readonly string[]
    description?: string
    required?: boolean
    nullable?: boolean
}

/** A field definition: simple string name or rich schema */
export type FieldDef = string | { name: string; schema: FieldSchema }

/** Container resource (e.g., data-models, interactions) */
export interface ContainerConfig {
    /** URL path name (e.g., 'data-models') */
    name: string
    /** Fields on POST */
    createFields?: FieldDef[]
    /** Fields on PUT */
    updateFields?: FieldDef[]
}

export interface ChildConfig {
    /** Plural name for URL path (e.g., 'attributes') */
    name: string
    /** StarUML type for createModel (e.g., 'UMLAttribute') */
    type: string
    /** Parent field name (e.g., 'attributes', 'ownedElements') */
    field: string
    /** Additional fields on POST (e.g., ['name', 'type', 'visibility']) */
    createFields?: FieldDef[]
    /** If true, generate get/update/delete in addition to list/create */
    fullCrud?: boolean
    /** Standalone path prefix for get/update/delete (e.g., 'columns') */
    standalonePrefix?: string
    /** Fields on PUT */
    updateFields?: FieldDef[]
}

export interface ResourceConfig {
    /** Plural name for URL path (e.g., 'classes') */
    name: string
    /** StarUML factory type(s) used for create (e.g., ['UMLClass']) */
    types: string[]
    /** Actual model type(s) returned by StarUML (when different from factory types) */
    modelTypes?: string[]
    /** Child resources */
    children?: ChildConfig[]
    /** Additional fields on POST (beyond name, type, position) */
    createFields?: FieldDef[]
    /** Fields allowed on PUT (default: ['name', 'documentation']) */
    updateFields?: FieldDef[]
    /** Parent-scoped list/create (e.g., lifelines under interactions) */
    parentScoped?: {
        parentResource: string
        paramName: string
    }
    /** Additional query parameters for list */
    listQueryParams?: string[]
}

export interface RelationConfig {
    /** Plural name for URL path (e.g., 'associations') */
    name: string
    /** StarUML type (e.g., 'UMLAssociation') */
    type: string
    /** Whether this relation has end1/end2 properties */
    hasEnds?: boolean
    /** Fields on each end (e.g., ['name', 'navigable', 'aggregation', 'multiplicity']) */
    endFields?: string[]
    /** Additional fields on POST (e.g., ['guard']) */
    createFields?: FieldDef[]
    /** Fields allowed on PUT (default: ['name', 'documentation']) */
    updateFields?: FieldDef[]
    /** Parent-scoped list/create */
    parentScoped?: {
        parentResource: string
        paramName: string
    }
    /** If true, omit sourceId/targetId from schema */
    noSourceTarget?: boolean
    /** Additional query parameters for list */
    listQueryParams?: string[]
}

export interface FamilyConfig {
    /** URL prefix (e.g., 'class') */
    prefix: string
    /** Human-readable label (e.g., 'Class/Package Diagram') */
    label: string
    /** Diagram type configuration */
    diagrams?: {
        types: string[]
        /** Additional fields on create diagram POST */
        createFields?: FieldDef[]
        /** If true, parentId is required (not optional) */
        parentIdRequired?: boolean
    }
    /** Container resource (e.g., data-models, interactions) */
    container?: ContainerConfig
    /** Node-type resources */
    resources: ResourceConfig[]
    /** Edge-type relations */
    relations: RelationConfig[]
    /** Custom tools appended as-is */
    customTools?: import("../../tool-registry.js").ToolDefinition[]
}
