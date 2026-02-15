import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "timing",
    label: "Timing Diagram",
    diagrams: { types: ["UMLTimingDiagram"] },
    resources: [
        { name: "lifelines", types: ["UMLLifeline"] },
        { name: "timing-states", types: ["UMLTimingState"], modelTypes: ["UMLConstraint"] },
    ],
    relations: [
        { name: "time-segments", type: "UMLTimeSegment" },
    ],
}

export const timingTools = generateFamilyTools(config)
