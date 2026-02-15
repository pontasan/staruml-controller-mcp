import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "profile",
    label: "Profile Diagram",
    diagrams: { types: ["UMLProfileDiagram"] },
    resources: [
        { name: "profiles", types: ["UMLProfile"] },
        { name: "stereotypes", types: ["UMLStereotype"] },
        { name: "metaclasses", types: ["UMLMetaClass"] },
    ],
    relations: [
        { name: "extensions", type: "UMLExtension" },
    ],
}

export const profileTools = generateFamilyTools(config)
