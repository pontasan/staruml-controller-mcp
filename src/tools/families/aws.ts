import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "aws",
    label: "AWS Diagram",
    diagrams: { types: ["AWSDiagram"] },
    resources: [
        {
            name: "elements",
            types: [
                "AWSGroup", "AWSGenericGroup", "AWSAvailabilityZone",
                "AWSSecurityGroup", "AWSService", "AWSResource", "AWSGeneralResource", "AWSCallout",
            ],
        },
    ],
    relations: [
        { name: "arrows", type: "AWSArrow" },
    ],
}

export const awsTools = generateFamilyTools(config)
