import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "azure",
    label: "Azure Diagram",
    diagrams: { types: ["AzureDiagram"] },
    resources: [
        {
            name: "elements",
            types: ["AzureGroup", "AzureService", "AzureCallout"],
        },
    ],
    relations: [
        { name: "connectors", type: "AzureConnector" },
    ],
}

export const azureTools = generateFamilyTools(config)
