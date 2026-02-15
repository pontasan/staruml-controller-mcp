import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "mindmap",
    label: "MindMap Diagram",
    diagrams: { types: ["MMMindmapDiagram"] },
    resources: [
        { name: "nodes", types: ["MMNode"] },
    ],
    relations: [
        { name: "edges", type: "MMEdge" },
    ],
}

export const mindmapTools = generateFamilyTools(config)
