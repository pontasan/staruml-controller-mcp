import { z } from "zod"
import type { ToolDefinition } from "../tool-registry.js"

export const generalTools: ToolDefinition[] = [
    {
        name: "get_status",
        description:
            "Get StarUML Controller server status, version, and list of available endpoints.",
        method: "GET",
        pathTemplate: "/api/status",
        inputSchema: z.object({}),
    },
    {
        name: "get_element",
        description:
            "Get any StarUML element by its ID. Returns the element serialized in a format appropriate for its type (ERDEntity, ERDColumn, UMLLifeline, etc.).",
        method: "GET",
        pathTemplate: "/api/elements/:id",
        inputSchema: z.object({
            id: z.string().describe("Element ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "list_element_tags",
        description:
            "List all tags attached to the specified element (entity, column, or any other element).",
        method: "GET",
        pathTemplate: "/api/elements/:id/tags",
        inputSchema: z.object({
            id: z.string().describe("Element ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "create_element_tag",
        description:
            "Create a new tag on the specified element. Tags are key-value metadata. Kind: 0=string, 1=boolean, 2=number, 3=reference, 4=hidden.",
        method: "POST",
        pathTemplate: "/api/elements/:id/tags",
        inputSchema: z.object({
            id: z.string().describe("Element ID"),
            name: z.string().optional().describe("Tag name (default: 'new_tag')"),
            kind: z
                .number()
                .int()
                .min(0)
                .max(4)
                .optional()
                .describe("Tag kind: 0=string, 1=boolean, 2=number, 3=reference, 4=hidden"),
            value: z
                .union([z.string(), z.number(), z.boolean()])
                .optional()
                .describe("Tag value"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "get_tag",
        description: "Get the details of a specific tag by its ID.",
        method: "GET",
        pathTemplate: "/api/tags/:id",
        inputSchema: z.object({
            id: z.string().describe("Tag ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "update_tag",
        description:
            "Update the specified tag. Only the specified fields are updated. Kind: 0=string, 1=boolean, 2=number, 3=reference, 4=hidden.",
        method: "PUT",
        pathTemplate: "/api/tags/:id",
        inputSchema: z.object({
            id: z.string().describe("Tag ID"),
            name: z.string().optional().describe("Tag name"),
            kind: z
                .number()
                .int()
                .min(0)
                .max(4)
                .optional()
                .describe("Tag kind: 0=string, 1=boolean, 2=number, 3=reference, 4=hidden"),
            value: z
                .union([z.string(), z.number(), z.boolean()])
                .optional()
                .describe("Tag value"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "delete_tag",
        description: "Delete the specified tag.",
        method: "DELETE",
        pathTemplate: "/api/tags/:id",
        inputSchema: z.object({
            id: z.string().describe("Tag ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "save_project",
        description:
            "Save the StarUML project to the specified absolute path. Extension must be .mdj.",
        method: "POST",
        pathTemplate: "/api/project/save",
        inputSchema: z.object({
            path: z.string().describe("Absolute path to save the project (must end with .mdj)"),
        }),
    },
    {
        name: "open_project",
        description:
            "Open an existing StarUML project from the specified absolute path. Extension must be .mdj.",
        method: "POST",
        pathTemplate: "/api/project/open",
        inputSchema: z.object({
            path: z.string().describe("Absolute path to the .mdj file to open"),
        }),
    },
]
