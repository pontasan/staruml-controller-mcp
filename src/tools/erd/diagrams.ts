import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const erdDiagramTools: ToolDefinition[] = [
    {
        name: "erd_list_diagrams",
        description: "List all ERD diagrams in the project.",
        method: "GET",
        pathTemplate: "/api/erd/diagrams",
        inputSchema: z.object({}),
    },
    {
        name: "erd_create_diagram",
        description: "Create a new ERD diagram under the specified data model.",
        method: "POST",
        pathTemplate: "/api/erd/diagrams",
        inputSchema: z.object({
            parentId: z.string().describe("Parent ERDDataModel ID"),
            name: z.string().optional().describe("Diagram name (default: 'ERDDiagram1')"),
        }),
    },
    {
        name: "erd_get_diagram",
        description: "Get the details of the specified ERD diagram.",
        method: "GET",
        pathTemplate: "/api/erd/diagrams/:id",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_update_diagram",
        description: "Update the specified ERD diagram.",
        method: "PUT",
        pathTemplate: "/api/erd/diagrams/:id",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            name: z.string().optional().describe("Diagram name"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_delete_diagram",
        description: "Delete the specified ERD diagram.",
        method: "DELETE",
        pathTemplate: "/api/erd/diagrams/:id",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
]
