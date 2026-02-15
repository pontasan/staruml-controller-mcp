import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "component",
    label: "Component Diagram",
    diagrams: { types: ["UMLComponentDiagram"] },
    resources: [
        { name: "components", types: ["UMLComponent"] },
        { name: "artifacts", types: ["UMLArtifact"] },
    ],
    relations: [
        { name: "component-realizations", type: "UMLComponentRealization" },
        { name: "dependencies", type: "UMLDependency" },
        { name: "generalizations", type: "UMLGeneralization" },
        { name: "interface-realizations", type: "UMLInterfaceRealization" },
    ],
}

export const componentTools = generateFamilyTools(config)
