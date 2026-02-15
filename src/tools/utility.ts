import { z } from "zod"
import type { ToolDefinition } from "../tool-registry.js"

export const utilityTools: ToolDefinition[] = [
    {
        name: "undo",
        description: "Undo the last action in StarUML.",
        method: "POST",
        pathTemplate: "/api/undo",
        inputSchema: z.object({}),
    },
    {
        name: "redo",
        description: "Redo the last undone action in StarUML.",
        method: "POST",
        pathTemplate: "/api/redo",
        inputSchema: z.object({}),
    },
    {
        name: "search",
        description:
            "Search for elements by keyword. Searches element names and documentation.",
        method: "GET",
        pathTemplate: "/api/search",
        inputSchema: z.object({
            keyword: z.string().describe("Search keyword"),
            type: z
                .string()
                .optional()
                .describe("Filter by element type (e.g., 'UMLClass', 'ERDEntity')"),
        }),
        queryParams: ["keyword", "type"],
    },
    {
        name: "validate",
        description:
            "Run model validation on the current project. Returns a list of validation issues.",
        method: "POST",
        pathTemplate: "/api/validate",
        inputSchema: z.object({}),
    },
    {
        name: "mermaid_import",
        description:
            "Import a Mermaid diagram definition and create the corresponding StarUML diagram.",
        method: "POST",
        pathTemplate: "/api/mermaid/import",
        inputSchema: z.object({
            code: z.string().describe("Mermaid diagram code"),
            parentId: z
                .string()
                .optional()
                .describe("Parent element ID (default: project root)"),
        }),
    },
    {
        name: "generate_diagram",
        description:
            "Generate a diagram from a natural language description using AI. Requires the description of what to create.",
        method: "POST",
        pathTemplate: "/api/diagrams/generate",
        inputSchema: z.object({
            description: z
                .string()
                .describe("Natural language description of the diagram to generate"),
            type: z
                .string()
                .optional()
                .describe("Diagram type hint (e.g., 'class', 'sequence', 'erd')"),
            parentId: z
                .string()
                .optional()
                .describe("Parent element ID (default: project root)"),
        }),
    },
]
