import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "usecase",
    label: "Use Case Diagram",
    diagrams: { types: ["UMLUseCaseDiagram"] },
    resources: [
        { name: "actors", types: ["UMLActor"] },
        {
            name: "use-cases",
            types: ["UMLUseCase"],
            children: [
                { name: "extension-points", type: "UMLExtensionPoint", field: "extensionPoints" },
            ],
        },
        { name: "subjects", types: ["UMLUseCaseSubject"] },
    ],
    relations: [
        { name: "associations", type: "UMLAssociation", hasEnds: true, endFields: ["name", "navigable", "aggregation", "multiplicity"] },
        { name: "includes", type: "UMLInclude" },
        { name: "extends", type: "UMLExtend" },
        { name: "generalizations", type: "UMLGeneralization" },
        { name: "dependencies", type: "UMLDependency" },
    ],
}

export const usecaseTools = generateFamilyTools(config)
