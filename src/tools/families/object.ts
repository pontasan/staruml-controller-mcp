import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "object",
    label: "Object Diagram",
    diagrams: { types: ["UMLObjectDiagram"] },
    resources: [
        {
            name: "objects",
            types: ["UMLObject"],
            children: [
                { name: "slots", type: "UMLSlot", field: "slots" },
            ],
        },
    ],
    relations: [
        { name: "links", type: "UMLLink" },
    ],
}

export const objectTools = generateFamilyTools(config)
