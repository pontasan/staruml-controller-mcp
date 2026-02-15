import { z } from "zod"
import type { ToolDefinition } from "../tool-registry.js"

export const shapeTools: ToolDefinition[] = [
    {
        name: "shape_list",
        description: "List all shapes on a diagram.",
        method: "GET",
        pathTemplate: "/api/diagrams/:id/shapes",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "shape_create",
        description:
            "Create a shape (rectangle, ellipse, etc.) on a diagram.",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/shapes",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            type: z
                .enum(["Text", "TextBox", "Rect", "RoundRect", "Ellipse", "Hyperlink", "Image"])
                .describe("Shape type"),
            text: z.string().optional().describe("Shape text"),
            x1: z.number().optional().describe("X coordinate"),
            y1: z.number().optional().describe("Y coordinate"),
            x2: z.number().optional().describe("X2 coordinate"),
            y2: z.number().optional().describe("Y2 coordinate"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "shape_get",
        description: "Get shape details by ID.",
        method: "GET",
        pathTemplate: "/api/shapes/:id",
        inputSchema: z.object({
            id: z.string().describe("Shape (view) ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "shape_update",
        description: "Update a shape's text or properties.",
        method: "PUT",
        pathTemplate: "/api/shapes/:id",
        inputSchema: z.object({
            id: z.string().describe("Shape (view) ID"),
            text: z.string().optional().describe("New shape text"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "shape_delete",
        description: "Delete a shape from a diagram.",
        method: "DELETE",
        pathTemplate: "/api/shapes/:id",
        inputSchema: z.object({
            id: z.string().describe("Shape (view) ID"),
        }),
        pathParams: { id: "id" },
    },
]
