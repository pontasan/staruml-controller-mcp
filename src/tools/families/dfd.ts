import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "dfd",
    label: "DFD Diagram",
    diagrams: { types: ["DFDDiagram"] },
    resources: [
        { name: "external-entities", types: ["DFDExternalEntity"] },
        { name: "processes", types: ["DFDProcess"] },
        { name: "data-stores", types: ["DFDDataStore"] },
    ],
    relations: [
        { name: "data-flows", type: "DFDDataFlow" },
    ],
}

export const dfdTools = generateFamilyTools(config)
