import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "communication",
    label: "Communication Diagram",
    diagrams: { types: ["UMLCommunicationDiagram"] },
    resources: [
        { name: "lifelines", types: ["UMLLifeline"] },
    ],
    relations: [
        { name: "connectors", type: "UMLConnector" },
    ],
}

export const communicationTools = generateFamilyTools(config)
