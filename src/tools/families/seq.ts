import type { FamilyConfig } from "./types.js"
import { generateFamilyTools } from "../family-factory.js"

const MESSAGE_SORT = [
    "synchCall", "asynchCall", "asynchSignal",
    "createMessage", "deleteMessage", "reply",
] as const

const INTERACTION_OPERATOR = [
    "alt", "opt", "par", "loop", "critical", "neg",
    "assert", "strict", "seq", "ignore", "consider", "break",
] as const

const config: FamilyConfig = {
    prefix: "seq",
    label: "Sequence Diagram",
    container: {
        name: "interactions",
        createFields: ["name", "documentation"],
        updateFields: ["name", "documentation"],
    },
    diagrams: {
        types: ["UMLSequenceDiagram"],
        parentIdRequired: true,
        createFields: [
            "documentation",
            { name: "width", schema: { zodType: "number", description: "Frame width in pixels (default: 692)" } },
            { name: "height", schema: { zodType: "number", description: "Frame height in pixels (default: 592)" } },
        ],
    },
    resources: [
        {
            name: "lifelines",
            types: ["UMLLifeline"],
            parentScoped: { parentResource: "interactions", paramName: "id" },
            createFields: [
                "name",
                "documentation",
                "diagramId",
                { name: "x", schema: { zodType: "number", description: "X coordinate of the view" } },
                { name: "y", schema: { zodType: "number", description: "Y coordinate of the view" } },
                { name: "height", schema: { zodType: "number", description: "Lifeline height in pixels (default: 200)" } },
            ],
            updateFields: ["name", "documentation"],
        },
        {
            name: "combined-fragments",
            types: ["UMLCombinedFragment"],
            parentScoped: { parentResource: "interactions", paramName: "id" },
            createFields: [
                "name",
                { name: "interactionOperator", schema: { zodType: "enum", enumValues: INTERACTION_OPERATOR, description: "Interaction operator (default: 'alt')" } },
                "documentation",
                "diagramId",
                { name: "x", schema: { zodType: "number", description: "X position on diagram" } },
                { name: "y", schema: { zodType: "number", description: "Y position on diagram" } },
                { name: "width", schema: { zodType: "number", description: "Width on diagram (default: 350)" } },
                { name: "height", schema: { zodType: "number", description: "Height on diagram (default: 200)" } },
            ],
            updateFields: [
                "name",
                { name: "interactionOperator", schema: { zodType: "enum", enumValues: INTERACTION_OPERATOR, description: "Interaction operator" } },
                "documentation",
            ],
            children: [
                {
                    name: "operands",
                    type: "UMLInteractionOperand",
                    field: "operands",
                    fullCrud: true,
                    standalonePrefix: "operands",
                    createFields: ["name", "guard", "documentation"],
                    updateFields: ["name", "guard", "documentation"],
                },
            ],
        },
        {
            name: "state-invariants",
            types: ["UMLStateInvariant"],
            parentScoped: { parentResource: "interactions", paramName: "id" },
            createFields: [
                "name",
                "covered",
                "invariant",
                "documentation",
                "diagramId",
                { name: "x", schema: { zodType: "number", description: "X position on diagram" } },
                { name: "y", schema: { zodType: "number", description: "Y position on diagram" } },
            ],
            updateFields: ["name", "covered", "invariant", "documentation"],
        },
        {
            name: "interaction-uses",
            types: ["UMLInteractionUse"],
            parentScoped: { parentResource: "interactions", paramName: "id" },
            createFields: [
                "name",
                "refersTo",
                "arguments",
                "returnValue",
                "documentation",
                "diagramId",
                { name: "x", schema: { zodType: "number", description: "X position on diagram" } },
                { name: "y", schema: { zodType: "number", description: "Y position on diagram" } },
                { name: "width", schema: { zodType: "number", description: "Width on diagram (default: 350)" } },
                { name: "height", schema: { zodType: "number", description: "Height on diagram (default: 100)" } },
            ],
            updateFields: ["name", "refersTo", "arguments", "returnValue", "documentation"],
        },
    ],
    relations: [
        {
            name: "messages",
            type: "UMLMessage",
            parentScoped: { parentResource: "interactions", paramName: "id" },
            noSourceTarget: true,
            createFields: [
                "name",
                { name: "messageSort", schema: { zodType: "enum", enumValues: MESSAGE_SORT, description: "Message sort (default: synchCall)" } },
                "documentation",
                { name: "source", schema: { required: true, description: "Source lifeline ID" } },
                { name: "target", schema: { required: true, description: "Target lifeline ID" } },
                { name: "diagramId", schema: { required: true, description: "UMLSequenceDiagram ID" } },
                { name: "y", schema: { zodType: "number", description: "Vertical position (y-coordinate) on diagram" } },
                { name: "activationHeight", schema: { zodType: "number", description: "Activation bar height on target lifeline (for synchCall)" } },
            ],
            updateFields: [
                "name",
                { name: "messageSort", schema: { zodType: "enum", enumValues: MESSAGE_SORT, description: "Message sort" } },
                "documentation",
            ],
        },
    ],
}

export const seqTools = generateFamilyTools(config)
