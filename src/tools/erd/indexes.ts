import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const erdIndexTools: ToolDefinition[] = [
    {
        name: "erd_list_indexes",
        description: "List all indexes of the specified entity.",
        method: "GET",
        pathTemplate: "/api/erd/entities/:id/indexes",
        inputSchema: z.object({
            id: z.string().describe("Entity ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_create_index",
        description:
            "Create a new index on the specified entity. Provide both a name and the full CREATE INDEX statement.",
        method: "POST",
        pathTemplate: "/api/erd/entities/:id/indexes",
        inputSchema: z.object({
            id: z.string().describe("Entity ID"),
            name: z.string().describe("Index name"),
            definition: z
                .string()
                .describe("Full CREATE INDEX statement (e.g., 'CREATE INDEX idx_email ON users (email)')"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_get_index",
        description: "Get the details of the specified index.",
        method: "GET",
        pathTemplate: "/api/erd/indexes/:id",
        inputSchema: z.object({
            id: z.string().describe("Index ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_update_index",
        description: "Update the specified index name and/or definition.",
        method: "PUT",
        pathTemplate: "/api/erd/indexes/:id",
        inputSchema: z.object({
            id: z.string().describe("Index ID"),
            name: z.string().optional().describe("New index name"),
            definition: z.string().optional().describe("New full CREATE INDEX statement"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_delete_index",
        description: "Delete the specified index.",
        method: "DELETE",
        pathTemplate: "/api/erd/indexes/:id",
        inputSchema: z.object({
            id: z.string().describe("Index ID"),
        }),
        pathParams: { id: "id" },
    },
]
