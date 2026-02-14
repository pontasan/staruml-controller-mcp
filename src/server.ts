import { createRequire } from "node:module"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { registerAll } from "./tool-registry.js"
import { generalTools } from "./tools/general.js"
import { erdDiagramTools } from "./tools/erd/diagrams.js"
import { erdDataModelTools } from "./tools/erd/data-models.js"
import { erdEntityTools } from "./tools/erd/entities.js"
import { erdColumnTools } from "./tools/erd/columns.js"
import { erdSequenceTools } from "./tools/erd/sequences.js"
import { erdIndexTools } from "./tools/erd/indexes.js"
import { erdRelationshipTools } from "./tools/erd/relationships.js"
import { erdDdlTools } from "./tools/erd/ddl.js"
import { seqInteractionTools } from "./tools/seq/interactions.js"
import { seqDiagramTools } from "./tools/seq/diagrams.js"
import { seqLifelineTools } from "./tools/seq/lifelines.js"
import { seqMessageTools } from "./tools/seq/messages.js"
import { seqCombinedFragmentTools } from "./tools/seq/combined-fragments.js"
import { seqOperandTools } from "./tools/seq/operands.js"
import { seqStateInvariantTools } from "./tools/seq/state-invariants.js"
import { seqInteractionUseTools } from "./tools/seq/interaction-uses.js"

const require = createRequire(import.meta.url)
const pkg = require("../package.json") as { version: string }

export function createServer(): McpServer {
    const server = new McpServer({
        name: "staruml-controller",
        version: pkg.version,
    })

    const allTools = [
        ...generalTools,
        ...erdDiagramTools,
        ...erdDataModelTools,
        ...erdEntityTools,
        ...erdColumnTools,
        ...erdSequenceTools,
        ...erdIndexTools,
        ...erdRelationshipTools,
        ...erdDdlTools,
        ...seqInteractionTools,
        ...seqDiagramTools,
        ...seqLifelineTools,
        ...seqMessageTools,
        ...seqCombinedFragmentTools,
        ...seqOperandTools,
        ...seqStateInvariantTools,
        ...seqInteractionUseTools,
    ]

    registerAll(server, allTools)

    return server
}
