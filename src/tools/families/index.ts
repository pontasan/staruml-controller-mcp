import type { ToolDefinition } from "../../tool-registry.js"
import { classTools } from "./class.js"
import { usecaseTools } from "./usecase.js"
import { activityTools } from "./activity.js"
import { statemachineTools } from "./statemachine.js"
import { componentTools } from "./component.js"
import { deploymentTools } from "./deployment.js"
import { objectTools } from "./object.js"
import { communicationTools } from "./communication.js"
import { compositeTools } from "./composite.js"
import { infoflowTools } from "./infoflow.js"
import { profileTools } from "./profile.js"
import { timingTools } from "./timing.js"
import { overviewTools } from "./overview.js"
import { flowchartTools } from "./flowchart.js"
import { dfdTools } from "./dfd.js"
import { bpmnTools } from "./bpmn.js"
import { c4Tools } from "./c4.js"
import { sysmlTools } from "./sysml.js"
import { wireframeTools } from "./wireframe.js"
import { mindmapTools } from "./mindmap.js"
import { awsTools } from "./aws.js"
import { azureTools } from "./azure.js"
import { gcpTools } from "./gcp.js"
import { erdTools } from "./erd.js"
import { seqTools } from "./seq.js"

export const allFamilyTools: ToolDefinition[] = [
    ...classTools,
    ...usecaseTools,
    ...activityTools,
    ...statemachineTools,
    ...componentTools,
    ...deploymentTools,
    ...objectTools,
    ...communicationTools,
    ...compositeTools,
    ...infoflowTools,
    ...profileTools,
    ...timingTools,
    ...overviewTools,
    ...flowchartTools,
    ...dfdTools,
    ...bpmnTools,
    ...c4Tools,
    ...sysmlTools,
    ...wireframeTools,
    ...mindmapTools,
    ...awsTools,
    ...azureTools,
    ...gcpTools,
    ...erdTools,
    ...seqTools,
]
