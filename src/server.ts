import { createRequire } from "node:module"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { registerAll } from "./tool-registry.js"
import { generalTools } from "./tools/general.js"
import { projectTools } from "./tools/project.js"
import { utilityTools } from "./tools/utility.js"
import { diagramTools } from "./tools/diagrams.js"
import { noteTools } from "./tools/notes.js"
import { shapeTools } from "./tools/shapes.js"
import { viewTools } from "./tools/views.js"
import { elementTools } from "./tools/elements.js"
import { allFamilyTools } from "./tools/families/index.js"

const require = createRequire(import.meta.url)
const pkg = require("../package.json") as { version: string }

export function createServer(): McpServer {
    const server = new McpServer({
        name: "staruml-controller",
        version: pkg.version,
    })

    const allTools = [
        ...generalTools,
        ...projectTools,
        ...utilityTools,
        ...diagramTools,
        ...noteTools,
        ...shapeTools,
        ...viewTools,
        ...elementTools,
        ...allFamilyTools,
    ]

    registerAll(server, allTools)

    return server
}
