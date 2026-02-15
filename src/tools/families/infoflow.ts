import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "infoflow",
    label: "Information Flow Diagram",
    diagrams: { types: ["UMLInformationFlowDiagram"] },
    resources: [
        { name: "info-items", types: ["UMLInformationItem"] },
    ],
    relations: [
        { name: "information-flows", type: "UMLInformationFlow" },
    ],
}

export const infoflowTools = generateFamilyTools(config)
