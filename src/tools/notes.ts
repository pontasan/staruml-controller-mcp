import { z } from "zod"
import type { ToolDefinition } from "../tool-registry.js"

export const noteTools: ToolDefinition[] = [
    // --- Notes ---
    {
        name: "note_list",
        description: "List all notes on a diagram.",
        method: "GET",
        pathTemplate: "/api/diagrams/:id/notes",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "note_create",
        description: "Create a note on a diagram with optional text and position.",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/notes",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            text: z.string().optional().describe("Note text content"),
            x1: z.number().optional().describe("X coordinate (default: 100)"),
            y1: z.number().optional().describe("Y coordinate (default: 100)"),
            x2: z.number().optional().describe("X2 coordinate (default: 250)"),
            y2: z.number().optional().describe("Y2 coordinate (default: 180)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "note_get",
        description: "Get note details by ID.",
        method: "GET",
        pathTemplate: "/api/notes/:id",
        inputSchema: z.object({
            id: z.string().describe("Note (view) ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "note_update",
        description: "Update a note's text.",
        method: "PUT",
        pathTemplate: "/api/notes/:id",
        inputSchema: z.object({
            id: z.string().describe("Note (view) ID"),
            text: z.string().optional().describe("New note text"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "note_delete",
        description: "Delete a note from a diagram.",
        method: "DELETE",
        pathTemplate: "/api/notes/:id",
        inputSchema: z.object({
            id: z.string().describe("Note (view) ID"),
        }),
        pathParams: { id: "id" },
    },

    // --- Note Links ---
    {
        name: "note_link_list",
        description: "List all note links on a diagram.",
        method: "GET",
        pathTemplate: "/api/diagrams/:id/note-links",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "note_link_create",
        description:
            "Create a note link connecting a note to another element on the diagram.",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/note-links",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            noteId: z.string().describe("Note view ID (source)"),
            targetId: z.string().describe("Target view ID to link to"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "note_link_delete",
        description: "Delete a note link.",
        method: "DELETE",
        pathTemplate: "/api/note-links/:id",
        inputSchema: z.object({
            id: z.string().describe("Note link (view) ID"),
        }),
        pathParams: { id: "id" },
    },

    // --- Free Lines ---
    {
        name: "free_line_list",
        description: "List all free lines on a diagram.",
        method: "GET",
        pathTemplate: "/api/diagrams/:id/free-lines",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "free_line_create",
        description: "Create a free line on a diagram.",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/free-lines",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            x1: z.number().optional().describe("Start X coordinate"),
            y1: z.number().optional().describe("Start Y coordinate"),
            x2: z.number().optional().describe("End X coordinate"),
            y2: z.number().optional().describe("End Y coordinate"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "free_line_delete",
        description: "Delete a free line.",
        method: "DELETE",
        pathTemplate: "/api/free-lines/:id",
        inputSchema: z.object({
            id: z.string().describe("Free line (view) ID"),
        }),
        pathParams: { id: "id" },
    },
]
