import { z } from "zod"
import type { ToolDefinition } from "../tool-registry.js"

const ALLOWED_CHILD_TYPES = [
    "UMLAttribute", "UMLOperation", "UMLParameter", "UMLEnumerationLiteral",
    "UMLPort", "UMLReception", "UMLExtensionPoint", "UMLSlot",
    "UMLTemplateParameter", "UMLRegion", "UMLConstraint",
    "UMLInteractionOperand",
    "SysMLProperty", "SysMLOperation", "SysMLFlowProperty",
    "UMLInputPin", "UMLOutputPin",
    "BPMNCompensateEventDefinition", "BPMNCancelEventDefinition",
    "BPMNErrorEventDefinition", "BPMNLinkEventDefinition",
    "BPMNSignalEventDefinition", "BPMNTimerEventDefinition",
    "BPMNEscalationEventDefinition", "BPMNMessageEventDefinition",
    "BPMNTerminateEventDefinition", "BPMNConditionalEventDefinition",
] as const

export const elementTools: ToolDefinition[] = [
    {
        name: "element_update",
        description:
            "Update any element's name and/or documentation.",
        method: "PUT",
        pathTemplate: "/api/elements/:id",
        inputSchema: z.object({
            id: z.string().describe("Element ID"),
            name: z.string().optional().describe("New element name"),
            documentation: z.string().optional().describe("New documentation"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "element_delete",
        description:
            "Delete any element by ID. Automatically handles type-specific cleanup.",
        method: "DELETE",
        pathTemplate: "/api/elements/:id",
        inputSchema: z.object({
            id: z.string().describe("Element ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "element_list_relationships",
        description:
            "List all relationships connected to a specific element.",
        method: "GET",
        pathTemplate: "/api/elements/:id/relationships",
        inputSchema: z.object({
            id: z.string().describe("Element ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "element_list_views",
        description:
            "List all views (visual representations) of an element across all diagrams.",
        method: "GET",
        pathTemplate: "/api/elements/:id/views",
        inputSchema: z.object({
            id: z.string().describe("Element ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "element_relocate",
        description:
            "Move an element to a different parent in the model hierarchy.",
        method: "PUT",
        pathTemplate: "/api/elements/:id/relocate",
        inputSchema: z.object({
            id: z.string().describe("Element ID to relocate"),
            newParentId: z.string().describe("New parent element ID"),
            field: z
                .string()
                .optional()
                .describe("Parent field to move into (default: 'ownedElements')"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "element_create_child",
        description:
            "Create a child element under a parent (e.g., attribute under class, operation under interface).",
        method: "POST",
        pathTemplate: "/api/elements/:id/children",
        inputSchema: z.object({
            id: z.string().describe("Parent element ID"),
            type: z
                .enum(ALLOWED_CHILD_TYPES)
                .describe("Child element type"),
            name: z.string().optional().describe("Child element name"),
            field: z
                .string()
                .optional()
                .describe("Parent field to create in (auto-detected if not specified)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "element_reorder",
        description:
            "Reorder an element within its parent (move up or down in the list).",
        method: "PUT",
        pathTemplate: "/api/elements/:id/reorder",
        inputSchema: z.object({
            id: z.string().describe("Element ID to reorder"),
            direction: z
                .enum(["up", "down"])
                .describe("Direction to move: 'up' or 'down'"),
        }),
        pathParams: { id: "id" },
    },
]
