import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const erdSequenceTools: ToolDefinition[] = [
    {
        name: "erd_list_sequences",
        description: "List all sequences of the specified entity. Sequences are used in DDL generation.",
        method: "GET",
        pathTemplate: "/api/erd/entities/:id/sequences",
        inputSchema: z.object({
            id: z.string().describe("Entity ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_create_sequence",
        description: "Create a new sequence on the specified entity.",
        method: "POST",
        pathTemplate: "/api/erd/entities/:id/sequences",
        inputSchema: z.object({
            id: z.string().describe("Entity ID"),
            name: z.string().describe("Sequence name"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_get_sequence",
        description: "Get the details of the specified sequence.",
        method: "GET",
        pathTemplate: "/api/erd/sequences/:id",
        inputSchema: z.object({
            id: z.string().describe("Sequence ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_update_sequence",
        description: "Update the specified sequence name.",
        method: "PUT",
        pathTemplate: "/api/erd/sequences/:id",
        inputSchema: z.object({
            id: z.string().describe("Sequence ID"),
            name: z.string().optional().describe("New sequence name"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_delete_sequence",
        description: "Delete the specified sequence.",
        method: "DELETE",
        pathTemplate: "/api/erd/sequences/:id",
        inputSchema: z.object({
            id: z.string().describe("Sequence ID"),
        }),
        pathParams: { id: "id" },
    },
]
