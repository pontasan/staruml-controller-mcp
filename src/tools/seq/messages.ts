import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

const MESSAGE_SORT = [
    "synchCall", "asynchCall", "asynchSignal",
    "createMessage", "deleteMessage", "reply",
] as const

export const seqMessageTools: ToolDefinition[] = [
    {
        name: "seq_list_messages",
        description: "List all messages of the specified interaction.",
        method: "GET",
        pathTemplate: "/api/seq/interactions/:id/messages",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_create_message",
        description:
            "Create a new message between two lifelines. Requires source/target lifeline IDs and a diagramId. Recommended y positioning: start at 150, increment by 50.",
        method: "POST",
        pathTemplate: "/api/seq/interactions/:id/messages",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
            name: z.string().optional().describe("Message name"),
            messageSort: z
                .enum(MESSAGE_SORT)
                .optional()
                .describe("Message sort (default: synchCall)"),
            documentation: z.string().optional().describe("Description"),
            source: z.string().describe("Source lifeline ID"),
            target: z.string().describe("Target lifeline ID"),
            diagramId: z.string().describe("UMLSequenceDiagram ID"),
            y: z.number().optional().describe("Vertical position (y-coordinate) on diagram"),
            activationHeight: z
                .number()
                .optional()
                .describe("Activation bar height on target lifeline (for synchCall)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_get_message",
        description: "Get the details of the specified message.",
        method: "GET",
        pathTemplate: "/api/seq/messages/:id",
        inputSchema: z.object({
            id: z.string().describe("Message ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_update_message",
        description: "Update the specified message.",
        method: "PUT",
        pathTemplate: "/api/seq/messages/:id",
        inputSchema: z.object({
            id: z.string().describe("Message ID"),
            name: z.string().optional().describe("Message name"),
            messageSort: z
                .enum(MESSAGE_SORT)
                .optional()
                .describe("Message sort"),
            documentation: z.string().optional().describe("Description"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_delete_message",
        description: "Delete the specified message.",
        method: "DELETE",
        pathTemplate: "/api/seq/messages/:id",
        inputSchema: z.object({
            id: z.string().describe("Message ID"),
        }),
        pathParams: { id: "id" },
    },
]
