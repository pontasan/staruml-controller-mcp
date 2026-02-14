import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const seqInteractionUseTools: ToolDefinition[] = [
    {
        name: "seq_list_interaction_uses",
        description: "List all interaction uses of the specified interaction.",
        method: "GET",
        pathTemplate: "/api/seq/interactions/:id/interaction-uses",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_create_interaction_use",
        description:
            "Create a new interaction use in the specified interaction. An interaction use references another interaction (like a subroutine call).",
        method: "POST",
        pathTemplate: "/api/seq/interactions/:id/interaction-uses",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
            name: z.string().optional().describe("Interaction use name"),
            refersTo: z.string().optional().describe("Referenced UMLInteraction ID"),
            arguments: z.string().optional().describe("Arguments"),
            returnValue: z.string().optional().describe("Return value"),
            documentation: z.string().optional().describe("Description"),
            diagramId: z.string().optional().describe("UMLSequenceDiagram ID to create a view on"),
            x: z.number().optional().describe("X position on diagram"),
            y: z.number().optional().describe("Y position on diagram"),
            width: z.number().optional().describe("Width on diagram (default: 350)"),
            height: z.number().optional().describe("Height on diagram (default: 100)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_get_interaction_use",
        description: "Get the details of the specified interaction use.",
        method: "GET",
        pathTemplate: "/api/seq/interaction-uses/:id",
        inputSchema: z.object({
            id: z.string().describe("Interaction use ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_update_interaction_use",
        description: "Update the specified interaction use.",
        method: "PUT",
        pathTemplate: "/api/seq/interaction-uses/:id",
        inputSchema: z.object({
            id: z.string().describe("Interaction use ID"),
            name: z.string().optional().describe("Interaction use name"),
            refersTo: z.string().optional().describe("Referenced UMLInteraction ID"),
            arguments: z.string().optional().describe("Arguments"),
            returnValue: z.string().optional().describe("Return value"),
            documentation: z.string().optional().describe("Description"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_delete_interaction_use",
        description: "Delete the specified interaction use.",
        method: "DELETE",
        pathTemplate: "/api/seq/interaction-uses/:id",
        inputSchema: z.object({
            id: z.string().describe("Interaction use ID"),
        }),
        pathParams: { id: "id" },
    },
]
