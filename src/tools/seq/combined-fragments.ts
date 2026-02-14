import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

const INTERACTION_OPERATOR = [
    "alt", "opt", "par", "loop", "critical", "neg",
    "assert", "strict", "seq", "ignore", "consider", "break",
] as const

export const seqCombinedFragmentTools: ToolDefinition[] = [
    {
        name: "seq_list_combined_fragments",
        description: "List all combined fragments of the specified interaction.",
        method: "GET",
        pathTemplate: "/api/seq/interactions/:id/combined-fragments",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_create_combined_fragment",
        description:
            "Create a new combined fragment. Optionally create a view on a diagram with position and size.",
        method: "POST",
        pathTemplate: "/api/seq/interactions/:id/combined-fragments",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
            name: z.string().optional().describe("Fragment name"),
            interactionOperator: z
                .enum(INTERACTION_OPERATOR)
                .optional()
                .describe("Interaction operator (default: 'alt')"),
            documentation: z.string().optional().describe("Description"),
            diagramId: z.string().optional().describe("UMLSequenceDiagram ID to create a view on"),
            x: z.number().optional().describe("X position on diagram"),
            y: z.number().optional().describe("Y position on diagram"),
            width: z.number().optional().describe("Width on diagram (default: 350)"),
            height: z.number().optional().describe("Height on diagram (default: 200)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_get_combined_fragment",
        description: "Get the details of the specified combined fragment including operands.",
        method: "GET",
        pathTemplate: "/api/seq/combined-fragments/:id",
        inputSchema: z.object({
            id: z.string().describe("Combined fragment ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_update_combined_fragment",
        description: "Update the specified combined fragment.",
        method: "PUT",
        pathTemplate: "/api/seq/combined-fragments/:id",
        inputSchema: z.object({
            id: z.string().describe("Combined fragment ID"),
            name: z.string().optional().describe("Fragment name"),
            interactionOperator: z
                .enum(INTERACTION_OPERATOR)
                .optional()
                .describe("Interaction operator"),
            documentation: z.string().optional().describe("Description"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_delete_combined_fragment",
        description: "Delete the specified combined fragment. Child operands are cascade deleted automatically.",
        method: "DELETE",
        pathTemplate: "/api/seq/combined-fragments/:id",
        inputSchema: z.object({
            id: z.string().describe("Combined fragment ID"),
        }),
        pathParams: { id: "id" },
    },
]
