import { z } from "zod"
import type { ToolDefinition } from "../tool-registry.js"

export const projectTools: ToolDefinition[] = [
    {
        name: "project_new",
        description: "Create a new empty StarUML project.",
        method: "POST",
        pathTemplate: "/api/project/new",
        inputSchema: z.object({}),
    },
    {
        name: "project_close",
        description: "Close the current StarUML project.",
        method: "POST",
        pathTemplate: "/api/project/close",
        inputSchema: z.object({}),
    },
    {
        name: "project_import",
        description:
            "Import a .mdj fragment into the current project. Merges the fragment under the specified parent.",
        method: "POST",
        pathTemplate: "/api/project/import",
        inputSchema: z.object({
            path: z
                .string()
                .describe("Absolute path to the .mdj fragment file to import"),
            parentId: z
                .string()
                .optional()
                .describe("Parent element ID to import under (default: project root)"),
        }),
    },
    {
        name: "project_export",
        description:
            "Export a fragment of the project (a specific element and its children) to a .mdj file.",
        method: "POST",
        pathTemplate: "/api/project/export",
        inputSchema: z.object({
            elementId: z.string().describe("Element ID to export"),
            path: z
                .string()
                .describe("Absolute path to save the exported .mdj file"),
        }),
    },
    {
        name: "project_export_all",
        description:
            "Export all diagrams in the project as image files (PNG, SVG, JPEG, or PDF) to a directory.",
        method: "POST",
        pathTemplate: "/api/project/export-all",
        inputSchema: z.object({
            path: z
                .string()
                .describe("Absolute path to the output directory"),
            format: z
                .enum(["png", "svg", "jpeg", "pdf"])
                .optional()
                .describe("Image format (default: png)"),
        }),
    },
    {
        name: "project_export_doc",
        description:
            "Export project documentation to a file (HTML or Markdown).",
        method: "POST",
        pathTemplate: "/api/project/export-doc",
        inputSchema: z.object({
            path: z
                .string()
                .describe("Absolute path to save the documentation file"),
            format: z
                .enum(["html", "markdown"])
                .optional()
                .describe("Documentation format (default: html)"),
        }),
    },
]
