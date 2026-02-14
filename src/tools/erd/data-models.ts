import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const erdDataModelTools: ToolDefinition[] = [
    {
        name: "erd_list_data_models",
        description:
            "List all ERD data models in the project. A data model is the parent container for entities, relationships, and diagrams.",
        method: "GET",
        pathTemplate: "/api/erd/data-models",
        inputSchema: z.object({}),
    },
    {
        name: "erd_create_data_model",
        description: "Create a new ERD data model under the project root.",
        method: "POST",
        pathTemplate: "/api/erd/data-models",
        inputSchema: z.object({
            name: z.string().optional().describe("Data model name (default: 'ERDDataModel1')"),
        }),
    },
    {
        name: "erd_get_data_model",
        description: "Get the details of the specified data model.",
        method: "GET",
        pathTemplate: "/api/erd/data-models/:id",
        inputSchema: z.object({
            id: z.string().describe("Data model ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_update_data_model",
        description: "Update the specified data model (rename).",
        method: "PUT",
        pathTemplate: "/api/erd/data-models/:id",
        inputSchema: z.object({
            id: z.string().describe("Data model ID"),
            name: z.string().optional().describe("Data model name"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_delete_data_model",
        description:
            "Delete the specified data model. Blocked if it contains entities, relationships, or diagrams.",
        method: "DELETE",
        pathTemplate: "/api/erd/data-models/:id",
        inputSchema: z.object({
            id: z.string().describe("Data model ID"),
        }),
        pathParams: { id: "id" },
    },
]
