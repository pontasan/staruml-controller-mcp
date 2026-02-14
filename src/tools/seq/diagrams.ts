import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const seqDiagramTools: ToolDefinition[] = [
    {
        name: "seq_list_diagrams",
        description: "List all sequence diagrams in the project.",
        method: "GET",
        pathTemplate: "/api/seq/diagrams",
        inputSchema: z.object({}),
    },
    {
        name: "seq_create_diagram",
        description:
            "Create a new sequence diagram under the specified interaction. Optionally set frame width/height.",
        method: "POST",
        pathTemplate: "/api/seq/diagrams",
        inputSchema: z.object({
            parentId: z.string().describe("Parent UMLInteraction ID"),
            name: z.string().optional().describe("Diagram name (default: 'SequenceDiagram1')"),
            documentation: z.string().optional().describe("Description"),
            width: z.number().optional().describe("Frame width in pixels (default: 692)"),
            height: z.number().optional().describe("Frame height in pixels (default: 592)"),
        }),
    },
    {
        name: "seq_get_diagram",
        description: "Get the details of the specified sequence diagram.",
        method: "GET",
        pathTemplate: "/api/seq/diagrams/:id",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_update_diagram",
        description: "Update the specified sequence diagram.",
        method: "PUT",
        pathTemplate: "/api/seq/diagrams/:id",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            name: z.string().optional().describe("Diagram name"),
            documentation: z.string().optional().describe("Description"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "seq_delete_diagram",
        description: "Delete the specified sequence diagram.",
        method: "DELETE",
        pathTemplate: "/api/seq/diagrams/:id",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
]
