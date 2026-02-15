import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "composite",
    label: "Composite Structure Diagram",
    diagrams: { types: ["UMLCompositeStructureDiagram"] },
    resources: [
        { name: "ports", types: ["UMLPort"] },
        { name: "parts", types: ["UMLPart"], modelTypes: ["UMLAttribute"] },
        { name: "collaborations", types: ["UMLCollaboration"] },
        { name: "collaboration-uses", types: ["UMLCollaborationUse"] },
    ],
    relations: [
        { name: "role-bindings", type: "UMLRoleBinding" },
        { name: "dependencies", type: "UMLDependency" },
        { name: "realizations", type: "UMLRealization" },
    ],
}

export const compositeTools = generateFamilyTools(config)
