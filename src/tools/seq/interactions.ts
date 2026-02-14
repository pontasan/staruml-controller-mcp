import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const seqInteractionTools: ToolDefinition[] = [
    {
        name: "seq_list_interactions",
        description:
            "List all interactions in the project. An interaction is the parent container for lifelines, messages, combined fragments, and sequence diagrams.",
        method: "GET",
        pathTemplate: "/api/seq/interactions",
        inputSchema: z.object({}),
    },
    {
        name: "seq_create_interaction",
        description: "Create a new interaction under the project root.",
        method: "POST",
        pathTemplate: "/api/seq/interactions",
        inputSchema: z.object({
            name: z.string().optional().describe("Interaction name (default: 'Interaction1')"),
            documentation: z.string().optional().describe("Description"),
        }),
    },
    {
        name: "seq_get_interaction",
        description:
            "Get the details of the specified interaction including participants, messages, and fragments.",
        method: "GET",
        pathTemplate: "/api/seq/interactions/:id",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_update_interaction",
        description: "Update the specified interaction.",
        method: "PUT",
        pathTemplate: "/api/seq/interactions/:id",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
            name: z.string().optional().describe("Interaction name"),
            documentation: z.string().optional().describe("Description"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_delete_interaction",
        description:
            "Delete the specified interaction. Blocked if it contains lifelines, messages, fragments, or diagrams.",
        method: "DELETE",
        pathTemplate: "/api/seq/interactions/:id",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
        }),
        pathParams: { id: "id" },
    },
]
