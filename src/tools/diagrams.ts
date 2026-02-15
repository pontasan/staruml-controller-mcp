import { z } from "zod"
import type { ToolDefinition } from "../tool-registry.js"

const ALLOWED_DIAGRAM_TYPES = [
    "UMLClassDiagram", "UMLPackageDiagram", "UMLObjectDiagram",
    "UMLComponentDiagram", "UMLDeploymentDiagram", "UMLUseCaseDiagram",
    "UMLStatechartDiagram", "UMLActivityDiagram", "UMLCommunicationDiagram",
    "UMLCompositeStructureDiagram", "UMLProfileDiagram",
    "UMLTimingDiagram", "UMLInteractionOverviewDiagram", "UMLInformationFlowDiagram",
    "FCFlowchartDiagram", "DFDDiagram",
    "BPMNDiagram", "C4Diagram",
    "SysMLRequirementDiagram", "SysMLBlockDefinitionDiagram",
    "SysMLInternalBlockDiagram", "SysMLParametricDiagram",
    "WFWireframeDiagram", "MMMindmapDiagram",
    "AWSDiagram", "AzureDiagram", "GCPDiagram",
] as const

export const diagramTools: ToolDefinition[] = [
    // --- Generic Diagram CRUD ---
    {
        name: "diagram_list",
        description: "List all diagrams in the project. Optionally filter by type.",
        method: "GET",
        pathTemplate: "/api/diagrams",
        inputSchema: z.object({
            type: z.string().optional().describe("Filter by diagram type (e.g., 'UMLClassDiagram')"),
        }),
        queryParams: ["type"],
    },
    {
        name: "diagram_create",
        description:
            "Create a new diagram of any type. Supports all diagram types (UML, BPMN, C4, SysML, Flowchart, etc.).",
        method: "POST",
        pathTemplate: "/api/diagrams",
        inputSchema: z.object({
            type: z.enum(ALLOWED_DIAGRAM_TYPES).describe("Diagram type to create"),
            name: z.string().optional().describe("Diagram name"),
            parentId: z.string().optional().describe("Parent element ID (default: project root)"),
        }),
    },
    {
        name: "diagram_get",
        description: "Get diagram details by ID (any diagram type).",
        method: "GET",
        pathTemplate: "/api/diagrams/:id",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "diagram_update",
        description: "Update a diagram name.",
        method: "PUT",
        pathTemplate: "/api/diagrams/:id",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            name: z.string().optional().describe("New diagram name"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "diagram_delete",
        description: "Delete a diagram and its associated elements.",
        method: "DELETE",
        pathTemplate: "/api/diagrams/:id",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },

    // --- Diagram elements/relations ---
    {
        name: "diagram_list_elements",
        description:
            "List all elements (views) on a diagram, including their positions and model references.",
        method: "GET",
        pathTemplate: "/api/diagrams/:id/elements",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "diagram_create_element",
        description:
            "Create a new element (node) on a diagram. Supports all element types.",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/elements",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            type: z.string().describe("Element type (e.g., 'UMLClass', 'UMLAction', 'FCProcess')"),
            name: z.string().optional().describe("Element name"),
            x1: z.number().optional().describe("X coordinate (default: 100)"),
            y1: z.number().optional().describe("Y coordinate (default: 100)"),
            x2: z.number().optional().describe("X2 coordinate (default: 200)"),
            y2: z.number().optional().describe("Y2 coordinate (default: 180)"),
            pseudostateKind: z.string().optional().describe("Kind for UMLPseudostate (e.g., 'initial', 'choice', 'fork')"),
            attachToViewId: z.string().optional().describe("View ID to attach to (for elements requiring a tail view)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "diagram_create_relation",
        description:
            "Create a new relation (edge) between two elements on a diagram.",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/relations",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            type: z.string().describe("Relation type (e.g., 'UMLAssociation', 'UMLDependency', 'FCFlow')"),
            sourceId: z.string().describe("Source element ID (model or view ID)"),
            targetId: z.string().describe("Target element ID (model or view ID)"),
            name: z.string().optional().describe("Relation name"),
        }),
        pathParams: { id: "id" },
    },

    // --- Diagram operations ---
    {
        name: "diagram_export",
        description:
            "Export a diagram as an image file (PNG, SVG, JPEG, or PDF).",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/export",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            path: z.string().describe("Absolute path to save the image file"),
            format: z
                .enum(["png", "svg", "jpeg", "pdf"])
                .optional()
                .describe("Image format (default: png)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "diagram_layout",
        description:
            "Apply automatic layout to a diagram. Arranges elements using hierarchical layout algorithm.",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/layout",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            direction: z
                .enum(["TB", "BT", "LR", "RL"])
                .optional()
                .describe("Layout direction: TB (top-to-bottom), BT, LR, RL (default: TB)"),
            separations: z
                .object({
                    node: z.number().optional().describe("Node separation (default: 20)"),
                    edge: z.number().optional().describe("Edge separation (default: 10)"),
                    rank: z.number().optional().describe("Rank separation (default: 50)"),
                })
                .optional()
                .describe("Separation values"),
            edgeLineStyle: z
                .number()
                .optional()
                .describe("Edge line style (default: 1)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "diagram_open",
        description:
            "Open/activate a diagram in the StarUML editor, making it the current diagram.",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/open",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "diagram_zoom",
        description: "Set the zoom level of a diagram (0.1 to 10).",
        method: "PUT",
        pathTemplate: "/api/diagrams/:id/zoom",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            level: z.number().min(0.1).max(10).describe("Zoom level (1.0 = 100%)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "diagram_create_view_of",
        description:
            "Create a view of an existing model element on a diagram. Useful for showing the same element on multiple diagrams.",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/create-view-of",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            modelId: z.string().describe("Model element ID to create a view of"),
            x: z.number().optional().describe("X position (default: 100)"),
            y: z.number().optional().describe("Y position (default: 100)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "diagram_link_object",
        description:
            "Create a UMLLinkObject on a diagram connecting two existing model elements.",
        method: "POST",
        pathTemplate: "/api/diagrams/:id/link-object",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
            sourceId: z.string().describe("Source object model ID"),
            targetId: z.string().describe("Target object model ID"),
            name: z.string().optional().describe("Link object name"),
            x1: z.number().optional().describe("X1 coordinate"),
            y1: z.number().optional().describe("Y1 coordinate"),
            x2: z.number().optional().describe("X2 coordinate"),
            y2: z.number().optional().describe("Y2 coordinate"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "diagram_list_views",
        description: "List all views on a diagram with their position and size info.",
        method: "GET",
        pathTemplate: "/api/diagrams/:id/views",
        inputSchema: z.object({
            id: z.string().describe("Diagram ID"),
        }),
        pathParams: { id: "id" },
    },
]
