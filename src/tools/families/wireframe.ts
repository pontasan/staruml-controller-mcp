import { generateFamilyTools } from "../family-factory.js"
import type { FamilyConfig } from "./types.js"

const config: FamilyConfig = {
    prefix: "wireframe",
    label: "Wireframe Diagram",
    diagrams: { types: ["WFWireframeDiagram"] },
    resources: [
        {
            name: "frames",
            types: ["WFFrame", "WFMobileFrame", "WFWebFrame", "WFDesktopFrame"],
        },
        {
            name: "widgets",
            types: [
                "WFButton", "WFText", "WFRadio", "WFCheckbox", "WFSwitch", "WFLink",
                "WFTabList", "WFTab", "WFInput", "WFDropdown", "WFPanel", "WFImage",
                "WFSeparator", "WFAvatar", "WFSlider",
            ],
        },
    ],
    relations: [],
}

export const wireframeTools = generateFamilyTools(config)
