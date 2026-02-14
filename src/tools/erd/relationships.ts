import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const erdRelationshipTools: ToolDefinition[] = [
    {
        name: "erd_list_relationships",
        description: "List all relationships (associations between tables). Supports filtering by dataModelId.",
        method: "GET",
        pathTemplate: "/api/erd/relationships",
        inputSchema: z.object({
            dataModelId: z.string().optional().describe("Filter by data model ID"),
        }),
        queryParams: ["dataModelId"],
    },
    {
        name: "erd_create_relationship",
        description:
            "Create a new relationship (association) between two entities. Both entities must have views on the specified diagram.",
        method: "POST",
        pathTemplate: "/api/erd/relationships",
        inputSchema: z.object({
            parentId: z.string().describe("Parent ERDDataModel ID"),
            end1_reference: z.string().describe("Entity ID for endpoint 1"),
            end1_cardinality: z.string().optional().describe("Cardinality for endpoint 1 (default: '1')"),
            end1_name: z.string().optional().describe("Name for endpoint 1"),
            end2_reference: z.string().describe("Entity ID for endpoint 2"),
            end2_cardinality: z
                .string()
                .optional()
                .describe("Cardinality for endpoint 2 (default: '0..*')"),
            end2_name: z.string().optional().describe("Name for endpoint 2"),
            name: z.string().optional().describe("Relationship name"),
            identifying: z.boolean().optional().describe("Identifying relationship flag"),
            diagramId: z
                .string()
                .describe("Diagram ID where entity views are placed"),
        }),
        buildBody: (params: Record<string, unknown>) => {
            const body: Record<string, unknown> = {
                parentId: params.parentId,
                diagramId: params.diagramId,
                end1: {
                    reference: params.end1_reference,
                    ...(params.end1_cardinality !== undefined && {
                        cardinality: params.end1_cardinality,
                    }),
                    ...(params.end1_name !== undefined && { name: params.end1_name }),
                },
                end2: {
                    reference: params.end2_reference,
                    ...(params.end2_cardinality !== undefined && {
                        cardinality: params.end2_cardinality,
                    }),
                    ...(params.end2_name !== undefined && { name: params.end2_name }),
                },
            }
            if (params.name !== undefined) {
                body.name = params.name
            }
            if (params.identifying !== undefined) {
                body.identifying = params.identifying
            }
            return body
        },
    },
    {
        name: "erd_get_relationship",
        description: "Get the details of the specified relationship.",
        method: "GET",
        pathTemplate: "/api/erd/relationships/:id",
        inputSchema: z.object({
            id: z.string().describe("Relationship ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_update_relationship",
        description:
            "Update the specified relationship. Supports updating name, identifying flag, and end1/end2 properties (name, cardinality, reference).",
        method: "PUT",
        pathTemplate: "/api/erd/relationships/:id",
        inputSchema: z.object({
            id: z.string().describe("Relationship ID"),
            name: z.string().optional().describe("Relationship name"),
            identifying: z.boolean().optional().describe("Identifying relationship flag"),
            end1_name: z.string().optional().describe("Endpoint 1 name"),
            end1_cardinality: z.string().optional().describe("Endpoint 1 cardinality"),
            end1_reference: z.string().optional().describe("Endpoint 1 referenced entity ID"),
            end2_name: z.string().optional().describe("Endpoint 2 name"),
            end2_cardinality: z.string().optional().describe("Endpoint 2 cardinality"),
            end2_reference: z.string().optional().describe("Endpoint 2 referenced entity ID"),
        }),
        pathParams: { id: "id" },
        buildBody: (params: Record<string, unknown>) => {
            const body: Record<string, unknown> = {}
            if (params.name !== undefined) {
                body.name = params.name
            }
            if (params.identifying !== undefined) {
                body.identifying = params.identifying
            }

            const end1: Record<string, unknown> = {}
            if (params.end1_name !== undefined) {
                end1.name = params.end1_name
            }
            if (params.end1_cardinality !== undefined) {
                end1.cardinality = params.end1_cardinality
            }
            if (params.end1_reference !== undefined) {
                end1.reference = params.end1_reference
            }
            if (Object.keys(end1).length > 0) {
                body.end1 = end1
            }

            const end2: Record<string, unknown> = {}
            if (params.end2_name !== undefined) {
                end2.name = params.end2_name
            }
            if (params.end2_cardinality !== undefined) {
                end2.cardinality = params.end2_cardinality
            }
            if (params.end2_reference !== undefined) {
                end2.reference = params.end2_reference
            }
            if (Object.keys(end2).length > 0) {
                body.end2 = end2
            }

            return body
        },
    },
    {
        name: "erd_delete_relationship",
        description: "Delete the specified relationship.",
        method: "DELETE",
        pathTemplate: "/api/erd/relationships/:id",
        inputSchema: z.object({
            id: z.string().describe("Relationship ID"),
        }),
        pathParams: { id: "id" },
    },
]
