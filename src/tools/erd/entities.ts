import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const erdEntityTools: ToolDefinition[] = [
    {
        name: "erd_list_entities",
        description: "List entities (tables). Supports filtering by dataModelId or diagramId.",
        method: "GET",
        pathTemplate: "/api/erd/entities",
        inputSchema: z.object({
            dataModelId: z.string().optional().describe("Filter by data model ID"),
            diagramId: z.string().optional().describe("Filter by diagram ID"),
        }),
        queryParams: ["dataModelId", "diagramId"],
    },
    {
        name: "erd_create_entity",
        description:
            "Create a new entity (table) under the specified data model. Optionally create a view on a diagram.",
        method: "POST",
        pathTemplate: "/api/erd/entities",
        inputSchema: z.object({
            parentId: z.string().describe("Parent ERDDataModel ID"),
            name: z.string().optional().describe("Entity name (default: 'NewEntity')"),
            documentation: z.string().optional().describe("Description"),
            diagramId: z.string().optional().describe("Diagram ID to create a view on"),
            x1: z.number().optional().describe("Top-left X coordinate (default: 100)"),
            y1: z.number().optional().describe("Top-left Y coordinate (default: 100)"),
            x2: z.number().optional().describe("Bottom-right X coordinate (default: 300)"),
            y2: z.number().optional().describe("Bottom-right Y coordinate (default: 200)"),
        }),
    },
    {
        name: "erd_get_entity",
        description: "Get entity details including columns and tags.",
        method: "GET",
        pathTemplate: "/api/erd/entities/:id",
        inputSchema: z.object({
            id: z.string().describe("Entity ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_update_entity",
        description: "Update the specified entity.",
        method: "PUT",
        pathTemplate: "/api/erd/entities/:id",
        inputSchema: z.object({
            id: z.string().describe("Entity ID"),
            name: z.string().optional().describe("Entity name"),
            documentation: z.string().optional().describe("Description"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_delete_entity",
        description:
            "Delete the specified entity and all its columns/tags. Blocked if referenced by relationships or other columns.",
        method: "DELETE",
        pathTemplate: "/api/erd/entities/:id",
        inputSchema: z.object({
            id: z.string().describe("Entity ID"),
        }),
        pathParams: { id: "id" },
    },
]
