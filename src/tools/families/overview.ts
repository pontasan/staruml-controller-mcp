import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "overview",
    label: "Interaction Overview Diagram",
    diagrams: { types: ["UMLInteractionOverviewDiagram"] },
    resources: [
        { name: "interaction-uses", types: ["UMLInteractionUseInOverview"], modelTypes: ["UMLAction"] },
        { name: "interactions", types: ["UMLInteractionInOverview"], modelTypes: ["UMLAction"] },
        {
            name: "control-nodes",
            types: [
                "UMLInitialNode", "UMLActivityFinalNode", "UMLFlowFinalNode",
                "UMLForkNode", "UMLJoinNode", "UMLMergeNode", "UMLDecisionNode",
            ],
        },
    ],
    relations: [
        { name: "control-flows", type: "UMLControlFlow" },
    ],
}

export const overviewTools = generateFamilyTools(config)
