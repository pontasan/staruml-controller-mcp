import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const seqStateInvariantTools: ToolDefinition[] = [
    {
        name: "seq_list_state_invariants",
        description: "List all state invariants of the specified interaction.",
        method: "GET",
        pathTemplate: "/api/seq/interactions/:id/state-invariants",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_create_state_invariant",
        description:
            "Create a new state invariant in the specified interaction. Optionally associate with a lifeline via covered and create a view on a diagram.",
        method: "POST",
        pathTemplate: "/api/seq/interactions/:id/state-invariants",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
            name: z.string().optional().describe("State invariant name"),
            covered: z.string().optional().describe("Lifeline ID that this state invariant covers"),
            invariant: z.string().optional().describe("Invariant expression"),
            documentation: z.string().optional().describe("Description"),
            diagramId: z.string().optional().describe("UMLSequenceDiagram ID to create a view on"),
            x: z.number().optional().describe("X position on diagram"),
            y: z.number().optional().describe("Y position on diagram"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_get_state_invariant",
        description: "Get the details of the specified state invariant.",
        method: "GET",
        pathTemplate: "/api/seq/state-invariants/:id",
        inputSchema: z.object({
            id: z.string().describe("State invariant ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_update_state_invariant",
        description: "Update the specified state invariant.",
        method: "PUT",
        pathTemplate: "/api/seq/state-invariants/:id",
        inputSchema: z.object({
            id: z.string().describe("State invariant ID"),
            name: z.string().optional().describe("State invariant name"),
            covered: z.string().optional().describe("Lifeline ID"),
            invariant: z.string().optional().describe("Invariant expression"),
            documentation: z.string().optional().describe("Description"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_delete_state_invariant",
        description: "Delete the specified state invariant.",
        method: "DELETE",
        pathTemplate: "/api/seq/state-invariants/:id",
        inputSchema: z.object({
            id: z.string().describe("State invariant ID"),
        }),
        pathParams: { id: "id" },
    },
]
