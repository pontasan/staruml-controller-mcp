import { z } from "zod"
import type { ToolDefinition } from "../tool-registry.js"

export const viewTools: ToolDefinition[] = [
    {
        name: "view_update",
        description:
            "Update a view's position and size (left, top, width, height).",
        method: "PUT",
        pathTemplate: "/api/views/:id",
        inputSchema: z.object({
            id: z.string().describe("View ID"),
            left: z.number().optional().describe("Left position (X)"),
            top: z.number().optional().describe("Top position (Y)"),
            width: z.number().optional().describe("Width"),
            height: z.number().optional().describe("Height"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "view_update_style",
        description:
            "Update a view's visual style (colors, font, line style, shadow).",
        method: "PUT",
        pathTemplate: "/api/views/:id/style",
        inputSchema: z.object({
            id: z.string().describe("View ID"),
            fillColor: z.string().optional().describe("Fill color (e.g., '#FFFF00')"),
            lineColor: z.string().optional().describe("Line color (e.g., '#000000')"),
            fontColor: z.string().optional().describe("Font color"),
            fontFace: z.string().optional().describe("Font face name (e.g., 'Arial')"),
            fontSize: z.number().optional().describe("Font size in points"),
            fontStyle: z.number().optional().describe("Font style (0=normal, 1=bold, 2=italic, 3=bold+italic)"),
            lineStyle: z.number().optional().describe("Line style"),
            showShadow: z.boolean().optional().describe("Show shadow"),
            autoResize: z.boolean().optional().describe("Auto resize"),
            stereotypeDisplay: z.string().optional().describe("Stereotype display mode"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "view_reconnect",
        description:
            "Reconnect an edge view (relation) to different source and/or target elements.",
        method: "PUT",
        pathTemplate: "/api/views/:id/reconnect",
        inputSchema: z.object({
            id: z.string().describe("Edge view ID"),
            newSourceId: z
                .string()
                .optional()
                .describe("New source element ID (model or view ID)"),
            newTargetId: z
                .string()
                .optional()
                .describe("New target element ID (model or view ID)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "view_align",
        description:
            "Align or distribute multiple views. Actions: align-left, align-right, align-center, align-top, align-bottom, align-middle, space-equally-horizontally, space-equally-vertically, set-width-equally, set-height-equally, set-size-equally, send-to-back, bring-to-front.",
        method: "POST",
        pathTemplate: "/api/views/align",
        inputSchema: z.object({
            viewIds: z
                .array(z.string())
                .min(2)
                .describe("Array of view IDs to align (minimum 2)"),
            action: z
                .enum([
                    "align-left", "align-right", "align-center",
                    "align-top", "align-bottom", "align-middle",
                    "space-equally-horizontally", "space-equally-vertically",
                    "set-width-equally", "set-height-equally", "set-size-equally",
                    "send-to-back", "bring-to-front",
                ])
                .describe("Alignment action to perform"),
        }),
    },
]
