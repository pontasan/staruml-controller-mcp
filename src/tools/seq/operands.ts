import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const seqOperandTools: ToolDefinition[] = [
    {
        name: "seq_list_operands",
        description: "List all operands of the specified combined fragment.",
        method: "GET",
        pathTemplate: "/api/seq/combined-fragments/:id/operands",
        inputSchema: z.object({
            id: z.string().describe("Combined fragment ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_create_operand",
        description: "Add a new operand to the specified combined fragment.",
        method: "POST",
        pathTemplate: "/api/seq/combined-fragments/:id/operands",
        inputSchema: z.object({
            id: z.string().describe("Combined fragment ID"),
            name: z.string().optional().describe("Operand name"),
            guard: z.string().optional().describe("Guard condition"),
            documentation: z.string().optional().describe("Description"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_get_operand",
        description: "Get the details of the specified operand.",
        method: "GET",
        pathTemplate: "/api/seq/operands/:id",
        inputSchema: z.object({
            id: z.string().describe("Operand ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_update_operand",
        description: "Update the specified operand.",
        method: "PUT",
        pathTemplate: "/api/seq/operands/:id",
        inputSchema: z.object({
            id: z.string().describe("Operand ID"),
            name: z.string().optional().describe("Operand name"),
            guard: z.string().optional().describe("Guard condition"),
            documentation: z.string().optional().describe("Description"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_delete_operand",
        description:
            "Delete the specified operand. Blocked if the parent combined fragment has only 1 operand remaining.",
        method: "DELETE",
        pathTemplate: "/api/seq/operands/:id",
        inputSchema: z.object({
            id: z.string().describe("Operand ID"),
        }),
        pathParams: { id: "id" },
    },
]
