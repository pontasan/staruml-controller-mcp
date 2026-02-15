import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "class",
    label: "Class/Package Diagram",
    diagrams: { types: ["UMLClassDiagram", "UMLPackageDiagram"] },
    resources: [
        {
            name: "classes",
            types: ["UMLClass"],
            children: [
                { name: "attributes", type: "UMLAttribute", field: "attributes", createFields: ["name", "type", "visibility", "isStatic", "defaultValue"] },
                { name: "operations", type: "UMLOperation", field: "operations", createFields: ["name", "visibility", "isStatic"] },
                { name: "receptions", type: "UMLReception", field: "receptions" },
                { name: "template-parameters", type: "UMLTemplateParameter", field: "templateParameters" },
            ],
        },
        {
            name: "interfaces",
            types: ["UMLInterface"],
            children: [
                { name: "attributes", type: "UMLAttribute", field: "attributes", createFields: ["name", "type", "visibility"] },
                { name: "operations", type: "UMLOperation", field: "operations", createFields: ["name", "visibility"] },
            ],
        },
        {
            name: "enumerations",
            types: ["UMLEnumeration"],
            children: [
                { name: "literals", type: "UMLEnumerationLiteral", field: "literals" },
            ],
        },
        {
            name: "data-types",
            types: ["UMLDataType", "UMLPrimitiveType", "UMLSignal"],
        },
        {
            name: "packages",
            types: ["UMLPackage", "UMLModel", "UMLSubsystem"],
        },
    ],
    relations: [
        { name: "associations", type: "UMLAssociation", hasEnds: true, endFields: ["name", "navigable", "aggregation", "multiplicity"] },
        { name: "generalizations", type: "UMLGeneralization" },
        { name: "dependencies", type: "UMLDependency" },
        { name: "interface-realizations", type: "UMLInterfaceRealization" },
        { name: "realizations", type: "UMLRealization" },
        { name: "template-bindings", type: "UMLTemplateBinding" },
    ],
}

export const classTools = generateFamilyTools(config)
