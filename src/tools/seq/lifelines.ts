import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const seqLifelineTools: ToolDefinition[] = [
    {
        name: "seq_list_lifelines",
        description: "List all lifelines of the specified interaction.",
        method: "GET",
        pathTemplate: "/api/seq/interactions/:id/lifelines",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_create_lifeline",
        description:
            "Add a new lifeline to the specified interaction. Optionally create a view on a diagram with position and height. Recommended spacing: x=250px apart starting at 150.",
        method: "POST",
        pathTemplate: "/api/seq/interactions/:id/lifelines",
        inputSchema: z.object({
            id: z.string().describe("Interaction ID"),
            name: z.string().optional().describe("Lifeline name (default: 'Lifeline1')"),
            documentation: z.string().optional().describe("Description"),
            diagramId: z.string().optional().describe("UMLSequenceDiagram ID to create a view on"),
            x: z.number().optional().describe("X coordinate of the view"),
            y: z.number().optional().describe("Y coordinate of the view"),
            height: z.number().optional().describe("Lifeline height in pixels (default: 200)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_get_lifeline",
        description: "Get the details of the specified lifeline.",
        method: "GET",
        pathTemplate: "/api/seq/lifelines/:id",
        inputSchema: z.object({
            id: z.string().describe("Lifeline ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_update_lifeline",
        description: "Update the specified lifeline.",
        method: "PUT",
        pathTemplate: "/api/seq/lifelines/:id",
        inputSchema: z.object({
            id: z.string().describe("Lifeline ID"),
            name: z.string().optional().describe("Lifeline name"),
            documentation: z.string().optional().describe("Description"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_delete_lifeline",
        description:
            "Delete the specified lifeline. Blocked if messages reference it as source/target or state invariants reference it via covered.",
        method: "DELETE",
        pathTemplate: "/api/seq/lifelines/:id",
        inputSchema: z.object({
            id: z.string().describe("Lifeline ID"),
        }),
        pathParams: { id: "id" },
    },
]
