import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "gcp",
    label: "GCP Diagram",
    diagrams: { types: ["GCPDiagram"] },
    resources: [
        {
            name: "elements",
            types: ["GCPUser", "GCPZone", "GCPProduct", "GCPService"],
        },
    ],
    relations: [
        { name: "paths", type: "GCPPath" },
    ],
}

export const gcpTools = generateFamilyTools(config)
