import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "statemachine",
    label: "State Machine Diagram",
    diagrams: { types: ["UMLStatechartDiagram"] },
    resources: [
        {
            name: "states",
            types: ["UMLState", "UMLSubmachineState"],
            children: [
                { name: "regions", type: "UMLRegion", field: "regions" },
            ],
        },
        {
            name: "pseudostates",
            types: ["UMLPseudostate"],
            createFields: ["pseudostateKind"],
        },
        { name: "final-states", types: ["UMLFinalState"] },
    ],
    relations: [
        {
            name: "transitions",
            type: "UMLTransition",
            updateFields: ["name", "documentation", "guard"],
            createFields: ["guard"],
        },
    ],
}

export const statemachineTools = generateFamilyTools(config)
