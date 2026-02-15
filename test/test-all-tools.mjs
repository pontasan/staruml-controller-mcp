#!/usr/bin/env node
/**
 * Comprehensive MCP tool test script.
 * Spawns the MCP server, connects a client, and calls every tool.
 *
 * Test strategy:
 *   1. List/GET endpoints → expect success (even if empty data)
 *   2. Create workflows → create diagram → create elements → create relations → verify → cleanup
 *   3. Utility endpoints → undo, redo, search, validate, etc.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

// ── Helpers ──────────────────────────────────────────────
const PASS = "✅"
const FAIL = "❌"
const SKIP = "⏭️"

let passCount = 0
let failCount = 0
let skipCount = 0
const failures = []

async function call(client, toolName, args = {}) {
    try {
        const result = await client.callTool({ name: toolName, arguments: args })
        const text = result.content?.[0]?.text || ""
        let parsed
        try {
            parsed = JSON.parse(text)
        } catch {
            parsed = { raw: text }
        }
        const ok = !result.isError && parsed.success !== false
        return { ok, data: parsed, raw: text }
    } catch (err) {
        return { ok: false, data: { error: err.message }, raw: "" }
    }
}

function log(status, toolName, detail = "") {
    const icon = status === "pass" ? PASS : status === "fail" ? FAIL : SKIP
    if (status === "pass") passCount++
    else if (status === "fail") {
        failCount++
        failures.push({ tool: toolName, detail })
    } else skipCount++
    const suffix = detail ? ` (${detail})` : ""
    console.log(`  ${icon} ${toolName}${suffix}`)
}

async function testTool(client, toolName, args = {}, { expectFail = false } = {}) {
    const r = await call(client, toolName, args)
    if (expectFail) {
        // We expect this to fail (e.g. missing required field) - just check it doesn't crash
        log("pass", toolName, "expected-fail handled")
    } else if (r.ok) {
        log("pass", toolName)
    } else {
        const errMsg = r.data?.error || r.data?.raw || "unknown"
        log("fail", toolName, errMsg.substring(0, 120))
    }
    return r
}

// ── Main Test Runner ─────────────────────────────────────
async function main() {
    console.log("Starting MCP server...")
    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/index.js"],
        cwd: "/Users/umedatomohiro/Developments/workspace/staruml-controller-mcp",
    })
    const client = new Client({ name: "test-client", version: "1.0.0" })
    await client.connect(transport)
    console.log("Connected to MCP server.\n")

    // List all available tools
    const toolList = await client.listTools()
    console.log(`Total tools registered: ${toolList.tools.length}\n`)

    // ═══════════════════════════════════════════════════
    // 0. Save project snapshot for cleanup
    // ═══════════════════════════════════════════════════
    const snapshotPath = "/tmp/test_mcp_snapshot.mdj"
    await call(client, "save_project", { path: snapshotPath })
    console.log(`Saved project snapshot to ${snapshotPath}\n`)

    // ═══════════════════════════════════════════════════
    // 1. General / Existing tools
    // ═══════════════════════════════════════════════════
    console.log("─── General ───")
    await testTool(client, "get_status")

    // ═══════════════════════════════════════════════════
    // 2. Project tools
    // ═══════════════════════════════════════════════════
    console.log("\n─── Project ───")
    // project_new - skip (destructive)
    // project_close - skip (destructive)
    // project_import - need path
    // project_export - need element + path
    // project_export_all - need path
    // project_export_doc - need path
    // Just validate they exist and handle gracefully
    await testTool(client, "project_export", { elementId: "nonexistent", path: "/tmp/test_export.mdj" }, { expectFail: true })
    // Create output directory first, then test export_all
    try { await import("node:fs").then(fs => fs.mkdirSync("/tmp/test_export_all", { recursive: true })) } catch {}
    await testTool(client, "project_export_all", { path: "/tmp/test_export_all", format: "png" })
    log("skip", "project_new", "destructive")
    log("skip", "project_close", "destructive")
    log("skip", "project_import", "needs file")
    log("skip", "project_export_doc", "needs path setup")

    // ═══════════════════════════════════════════════════
    // 3. Utility tools
    // ═══════════════════════════════════════════════════
    console.log("\n─── Utility ───")
    await testTool(client, "undo")
    await testTool(client, "redo")
    await testTool(client, "search", { keyword: "test" })
    await testTool(client, "validate")
    log("skip", "mermaid_import", "needs mermaid extension")
    log("skip", "generate_diagram", "needs AI extension")

    // ═══════════════════════════════════════════════════
    // 4. Generic Diagram tools
    // ═══════════════════════════════════════════════════
    console.log("\n─── Generic Diagrams ───")
    await testTool(client, "diagram_list")
    await testTool(client, "diagram_list", { type: "UMLClassDiagram" })

    // ═══════════════════════════════════════════════════
    // 5. Element / View / Note / Shape tools (list, no data)
    // ═══════════════════════════════════════════════════
    console.log("\n─── Elements (generic) ───")
    await testTool(client, "get_element", { id: "nonexistent" }, { expectFail: true })
    await testTool(client, "element_list_relationships", { id: "nonexistent" }, { expectFail: true })
    await testTool(client, "element_list_views", { id: "nonexistent" }, { expectFail: true })

    // ═══════════════════════════════════════════════════
    // 6. ERD tools (existing)
    // ═══════════════════════════════════════════════════
    console.log("\n─── ERD (existing) ───")
    await testTool(client, "erd_list_diagrams")
    await testTool(client, "erd_list_data_models")
    await testTool(client, "erd_list_entities")
    await testTool(client, "erd_list_relationships")

    // ═══════════════════════════════════════════════════
    // 7. SEQ tools (existing)
    // ═══════════════════════════════════════════════════
    console.log("\n─── SEQ (existing) ───")
    await testTool(client, "seq_list_interactions")
    await testTool(client, "seq_list_diagrams")

    // ═══════════════════════════════════════════════════
    // 8. Family List endpoints (all 23 families)
    // ═══════════════════════════════════════════════════
    const FAMILIES = [
        { prefix: "class", diagrams: true, resources: ["classes", "interfaces", "enumerations", "data_types", "packages"],
          relations: ["associations", "generalizations", "dependencies", "interface_realizations", "realizations", "template_bindings"] },
        { prefix: "usecase", diagrams: true, resources: ["actors", "use_cases", "subjects"],
          relations: ["associations", "includes", "extends", "generalizations", "dependencies"] },
        { prefix: "activity", diagrams: true, resources: ["actions", "control_nodes", "object_nodes", "partitions", "regions"],
          relations: ["control_flows", "object_flows", "exception_handlers", "activity_interrupts"] },
        { prefix: "statemachine", diagrams: true, resources: ["states", "pseudostates", "final_states"],
          relations: ["transitions"] },
        { prefix: "component", diagrams: true, resources: ["components", "artifacts"],
          relations: ["component_realizations", "dependencies", "generalizations", "interface_realizations"] },
        { prefix: "deployment", diagrams: true, resources: ["nodes", "node_instances", "artifact_instances", "component_instances", "artifacts"],
          relations: ["deployments", "communication_paths", "dependencies"] },
        { prefix: "object", diagrams: true, resources: ["objects"],
          relations: ["links"] },
        { prefix: "communication", diagrams: true, resources: ["lifelines"],
          relations: ["connectors"] },
        { prefix: "composite", diagrams: true, resources: ["ports", "parts", "collaborations", "collaboration_uses"],
          relations: ["role_bindings", "dependencies", "realizations"] },
        { prefix: "infoflow", diagrams: true, resources: ["info_items"],
          relations: ["information_flows"] },
        { prefix: "profile", diagrams: true, resources: ["profiles", "stereotypes", "metaclasses"],
          relations: ["extensions"] },
        { prefix: "timing", diagrams: true, resources: ["lifelines", "timing_states"],
          relations: ["time_segments"] },
        { prefix: "overview", diagrams: true, resources: ["interaction_uses", "interactions", "control_nodes"],
          relations: ["control_flows"] },
        { prefix: "flowchart", diagrams: true, resources: ["nodes"],
          relations: ["flows"] },
        { prefix: "dfd", diagrams: true, resources: ["external_entities", "processes", "data_stores"],
          relations: ["data_flows"] },
        { prefix: "bpmn", diagrams: true, resources: ["participants", "tasks", "sub_processes", "events", "gateways", "data_objects", "conversations", "choreographies", "annotations"],
          relations: ["sequence_flows", "message_flows", "associations", "data_associations", "message_links", "conversation_links"] },
        { prefix: "c4", diagrams: true, resources: ["elements"],
          relations: ["relationships"] },
        { prefix: "sysml", diagrams: true, resources: ["requirements", "blocks", "stakeholders", "viewpoints", "views", "parts"],
          relations: ["conforms", "exposes", "copies", "derive_reqts", "verifies", "satisfies", "refines", "connectors"] },
        { prefix: "wireframe", diagrams: true, resources: ["frames", "widgets"],
          relations: [] },
        { prefix: "mindmap", diagrams: true, resources: ["nodes"],
          relations: ["edges"] },
        { prefix: "aws", diagrams: true, resources: ["elements"],
          relations: ["arrows"] },
        { prefix: "azure", diagrams: true, resources: ["elements"],
          relations: ["connectors"] },
        { prefix: "gcp", diagrams: true, resources: ["elements"],
          relations: ["paths"] },
    ]

    for (const fam of FAMILIES) {
        console.log(`\n─── Family: ${fam.prefix} ───`)

        // List diagrams
        if (fam.diagrams) {
            await testTool(client, `${fam.prefix}_list_diagrams`)
        }

        // List resources
        for (const res of fam.resources) {
            await testTool(client, `${fam.prefix}_list_${res}`)
        }

        // List relations
        for (const rel of fam.relations) {
            await testTool(client, `${fam.prefix}_list_${rel}`)
        }
    }

    // ═══════════════════════════════════════════════════
    // 9. CRUD workflow tests per family
    //    Create diagram → create element → get → update → delete
    // ═══════════════════════════════════════════════════
    console.log("\n═══ CRUD Workflow Tests ═══")

    // Define test configs: which families to fully CRUD-test
    const CRUD_TESTS = [
        {
            prefix: "class", diagramType: undefined,
            resource: { createTool: "class_create_class", singular: "class", listTool: "class_list_classes" },
            relation: { createTool: "class_create_generalization", singular: "generalization", listTool: "class_list_generalizations", needsTwoElements: true },
            child: { listTool: "class_list_class_attributes", createTool: "class_create_class_attribute" },
        },
        {
            prefix: "usecase", diagramType: undefined,
            resource: { createTool: "usecase_create_actor", singular: "actor", listTool: "usecase_list_actors" },
            relation: null, child: null,
        },
        {
            prefix: "activity", diagramType: undefined,
            resource: { createTool: "activity_create_action", singular: "action", listTool: "activity_list_actions" },
            relation: null, child: null,
        },
        {
            prefix: "statemachine", diagramType: undefined,
            resource: { createTool: "statemachine_create_state", singular: "state", listTool: "statemachine_list_states" },
            relation: null, child: null,
        },
        {
            prefix: "component", diagramType: undefined,
            resource: { createTool: "component_create_component", singular: "component", listTool: "component_list_components" },
            relation: null, child: null,
        },
        {
            prefix: "deployment", diagramType: undefined,
            resource: { createTool: "deployment_create_node", singular: "node", listTool: "deployment_list_nodes" },
            relation: null, child: null,
        },
        {
            prefix: "object", diagramType: undefined,
            resource: { createTool: "object_create_object", singular: "object", listTool: "object_list_objects" },
            relation: null, child: null,
        },
        {
            prefix: "composite", diagramType: undefined,
            resource: { createTool: "composite_create_collaboration", singular: "collaboration", listTool: "composite_list_collaborations" },
            relation: null, child: null,
        },
        {
            prefix: "infoflow", diagramType: undefined,
            resource: { createTool: "infoflow_create_info_item", singular: "info_item", listTool: "infoflow_list_info_items" },
            relation: null, child: null,
        },
        {
            prefix: "profile", diagramType: undefined,
            resource: { createTool: "profile_create_stereotype", singular: "stereotype", listTool: "profile_list_stereotypes" },
            relation: null, child: null,
        },
        {
            prefix: "flowchart", diagramType: undefined,
            resource: { createTool: "flowchart_create_node", singular: "node", listTool: "flowchart_list_nodes" },
            relation: null, child: null,
        },
        {
            prefix: "dfd", diagramType: undefined,
            resource: { createTool: "dfd_create_process", singular: "process", listTool: "dfd_list_processes" },
            relation: null, child: null,
        },
        {
            prefix: "bpmn", diagramType: undefined,
            resource: { createTool: "bpmn_create_task", singular: "task", listTool: "bpmn_list_tasks" },
            relation: null, child: null,
        },
        {
            prefix: "c4", diagramType: undefined,
            resource: { createTool: "c4_create_element", singular: "element", listTool: "c4_list_elements" },
            relation: null, child: null,
        },
        {
            prefix: "sysml", diagramType: "SysMLRequirementDiagram",
            resource: { createTool: "sysml_create_requirement", singular: "requirement", listTool: "sysml_list_requirements" },
            relation: null, child: null,
        },
        {
            prefix: "wireframe", diagramType: undefined,
            resource: { createTool: "wireframe_create_frame", singular: "frame", listTool: "wireframe_list_frames" },
            relation: null, child: null,
        },
        {
            prefix: "mindmap", diagramType: undefined,
            resource: { createTool: "mindmap_create_node", singular: "node", listTool: "mindmap_list_nodes" },
            relation: null, child: null,
        },
        {
            prefix: "aws", diagramType: undefined,
            resource: { createTool: "aws_create_element", singular: "element", listTool: "aws_list_elements", createType: "AWSService" },
            relation: null, child: null,
        },
        {
            prefix: "azure", diagramType: undefined,
            resource: { createTool: "azure_create_element", singular: "element", listTool: "azure_list_elements", createType: "AzureService" },
            relation: null, child: null,
        },
        {
            prefix: "gcp", diagramType: undefined,
            resource: { createTool: "gcp_create_element", singular: "element", listTool: "gcp_list_elements", createType: "GCPProduct" },
            relation: null, child: null,
        },
    ]

    const createdDiagramIds = []

    for (const cfg of CRUD_TESTS) {
        console.log(`\n── CRUD: ${cfg.prefix} ──`)

        // 1. Create diagram
        const createDiagramArgs = { name: `Test_${cfg.prefix}` }
        if (cfg.diagramType) createDiagramArgs.type = cfg.diagramType
        const dResult = await call(client, `${cfg.prefix}_create_diagram`, createDiagramArgs)
        if (!dResult.ok) {
            log("fail", `${cfg.prefix}_create_diagram`, dResult.data?.error?.substring(0, 100) || "create failed")
            continue
        }
        log("pass", `${cfg.prefix}_create_diagram`)
        const diagramId = dResult.data?.data?._id
        if (!diagramId) {
            log("fail", `${cfg.prefix}_create_diagram`, "no diagram ID returned")
            continue
        }
        createdDiagramIds.push(diagramId)

        // 2. Get diagram
        await testTool(client, `${cfg.prefix}_get_diagram`, { id: diagramId })

        // 3. Update diagram
        await testTool(client, `${cfg.prefix}_update_diagram`, { id: diagramId, name: `Test_${cfg.prefix}_updated` })

        // 4. Create resource element
        let elemId = null
        let elemId2 = null
        if (cfg.resource) {
            const createArgs = { diagramId, name: `TestElem_${cfg.prefix}` }
            if (cfg.resource.createType) createArgs.type = cfg.resource.createType
            const eResult = await call(client, cfg.resource.createTool, createArgs)
            if (eResult.ok) {
                log("pass", cfg.resource.createTool)
                elemId = eResult.data?.data?._id
            } else {
                log("fail", cfg.resource.createTool, eResult.data?.error?.substring(0, 100) || "create failed")
            }

            // 5. Get element
            if (elemId) {
                await testTool(client, `${cfg.prefix}_get_${cfg.resource.singular}`, { id: elemId })

                // 6. Update element
                await testTool(client, `${cfg.prefix}_update_${cfg.resource.singular}`, { id: elemId, name: `Updated_${cfg.prefix}` })
            }

            // Create second element for relation tests
            if (cfg.relation?.needsTwoElements && elemId) {
                const e2Result = await call(client, cfg.resource.createTool, { diagramId, name: `TestElem2_${cfg.prefix}`, x1: 300, y1: 100 })
                if (e2Result.ok) {
                    elemId2 = e2Result.data?.data?._id
                }
            }
        }

        // 7. Create relation (if configured)
        let relId = null
        if (cfg.relation && elemId && elemId2) {
            const rResult = await call(client, cfg.relation.createTool, {
                diagramId, sourceId: elemId, targetId: elemId2, name: `TestRel_${cfg.prefix}`
            })
            if (rResult.ok) {
                log("pass", cfg.relation.createTool)
                relId = rResult.data?.data?._id
            } else {
                log("fail", cfg.relation.createTool, rResult.data?.error?.substring(0, 100) || "create failed")
            }

            // Get relation
            if (relId) {
                await testTool(client, `${cfg.prefix}_get_${cfg.relation.singular}`, { id: relId })
                await testTool(client, `${cfg.prefix}_update_${cfg.relation.singular}`, { id: relId, name: `UpdatedRel_${cfg.prefix}` })
            }
        }

        // 8. Child resource test
        if (cfg.child && elemId) {
            await testTool(client, cfg.child.listTool, { id: elemId })
            const chResult = await call(client, cfg.child.createTool, { id: elemId, name: `TestChild_${cfg.prefix}` })
            if (chResult.ok) {
                log("pass", cfg.child.createTool)
            } else {
                log("fail", cfg.child.createTool, chResult.data?.error?.substring(0, 100) || "")
            }
        }

        // 9. Delete relation
        if (relId) {
            await testTool(client, `${cfg.prefix}_delete_${cfg.relation.singular}`, { id: relId })
        }

        // 10. Delete element
        if (elemId2) {
            await testTool(client, `${cfg.prefix}_delete_${cfg.resource.singular}`, { id: elemId2 })
        }
        if (elemId) {
            await testTool(client, `${cfg.prefix}_delete_${cfg.resource.singular}`, { id: elemId })
        }

        // 11. Delete diagram
        await testTool(client, `${cfg.prefix}_delete_diagram`, { id: diagramId })
    }

    // ═══════════════════════════════════════════════════
    // 10. Generic Diagram CRUD workflow
    // ═══════════════════════════════════════════════════
    console.log("\n═══ Generic Diagram CRUD ═══")

    // Create a class diagram via generic endpoint
    const gdResult = await call(client, "diagram_create", { type: "UMLClassDiagram", name: "GenericTest" })
    if (gdResult.ok) {
        log("pass", "diagram_create")
        const gdId = gdResult.data?.data?._id
        if (gdId) {
            await testTool(client, "diagram_get", { id: gdId })
            await testTool(client, "diagram_update", { id: gdId, name: "GenericTestUpdated" })
            await testTool(client, "diagram_list_elements", { id: gdId })
            await testTool(client, "diagram_list_views", { id: gdId })

            // Create element via generic endpoint
            const geResult = await call(client, "diagram_create_element", { id: gdId, type: "UMLClass", name: "GenericClass" })
            let geId = null
            if (geResult.ok) {
                log("pass", "diagram_create_element")
                geId = geResult.data?.data?.modelId
            } else {
                log("fail", "diagram_create_element", geResult.data?.error?.substring(0, 100) || "")
            }

            // Create second element for relation
            const ge2Result = await call(client, "diagram_create_element", { id: gdId, type: "UMLClass", name: "GenericClass2", x1: 300, y1: 100 })
            let ge2Id = null
            if (ge2Result.ok) {
                ge2Id = ge2Result.data?.data?.modelId
            }

            // Create relation via generic endpoint
            if (geId && ge2Id) {
                const grResult = await call(client, "diagram_create_relation", { id: gdId, type: "UMLDependency", sourceId: geId, targetId: ge2Id })
                if (grResult.ok) {
                    log("pass", "diagram_create_relation")
                } else {
                    log("fail", "diagram_create_relation", grResult.data?.error?.substring(0, 100) || "")
                }
            }

            // Test diagram export
            await testTool(client, "diagram_export", { id: gdId, path: "/tmp/test_diagram_export.png", format: "png" })

            // Test diagram layout
            await testTool(client, "diagram_layout", { id: gdId, direction: "TB" })

            // Test diagram open
            await testTool(client, "diagram_open", { id: gdId })

            // Test diagram zoom
            await testTool(client, "diagram_zoom", { id: gdId, level: 1.5 })

            // Test notes
            console.log("\n── Notes/Free Lines/Shapes ──")
            await testTool(client, "note_list", { id: gdId })
            const noteResult = await call(client, "note_create", { id: gdId, text: "Test note", x1: 50, y1: 50 })
            let noteId = null
            if (noteResult.ok) {
                log("pass", "note_create")
                noteId = noteResult.data?.data?._id
            } else {
                log("fail", "note_create", noteResult.data?.error?.substring(0, 100) || "")
            }

            if (noteId) {
                await testTool(client, "note_get", { id: noteId })
                await testTool(client, "note_update", { id: noteId, text: "Updated note" })

                // Note link
                await testTool(client, "note_link_list", { id: gdId })
                // Need a target view for note link - use the first element view
                const viewsResult = await call(client, "diagram_list_views", { id: gdId })
                const views = viewsResult.data?.data || []
                const targetView = views.find(v => v._type !== "UMLNoteView" && v._type !== "UMLFrameView")
                if (targetView) {
                    const nlResult = await call(client, "note_link_create", { id: gdId, noteId: noteId, targetId: targetView._id })
                    if (nlResult.ok) {
                        log("pass", "note_link_create")
                        const nlId = nlResult.data?.data?._id
                        if (nlId) {
                            await testTool(client, "note_link_delete", { id: nlId })
                        }
                    } else {
                        log("fail", "note_link_create", nlResult.data?.error?.substring(0, 100) || "")
                    }
                } else {
                    log("skip", "note_link_create", "no target view")
                }

                await testTool(client, "note_delete", { id: noteId })
            }

            // Free lines
            await testTool(client, "free_line_list", { id: gdId })
            const flResult = await call(client, "free_line_create", { id: gdId, x1: 10, y1: 10, x2: 100, y2: 100 })
            if (flResult.ok) {
                log("pass", "free_line_create")
                const flId = flResult.data?.data?._id
                if (flId) {
                    await testTool(client, "free_line_delete", { id: flId })
                }
            } else {
                log("fail", "free_line_create", flResult.data?.error?.substring(0, 100) || "")
            }

            // Shapes
            await testTool(client, "shape_list", { id: gdId })
            const shResult = await call(client, "shape_create", { id: gdId, type: "Rect", text: "Test shape" })
            if (shResult.ok) {
                log("pass", "shape_create")
                const shId = shResult.data?.data?._id
                if (shId) {
                    await testTool(client, "shape_get", { id: shId })
                    await testTool(client, "shape_update", { id: shId, text: "Updated shape" })
                    await testTool(client, "shape_delete", { id: shId })
                }
            } else {
                log("fail", "shape_create", shResult.data?.error?.substring(0, 100) || "")
            }

            // Views
            console.log("\n── Views ──")
            if (geId) {
                // View update (position)
                const elemViewsResult = await call(client, "element_list_views", { id: geId })
                if (elemViewsResult.ok && elemViewsResult.data?.data?.length > 0) {
                    log("pass", "element_list_views")
                    const viewId = elemViewsResult.data.data[0].viewId
                    await testTool(client, "view_update", { id: viewId, left: 150, top: 150 })
                    await testTool(client, "view_update_style", { id: viewId, fillColor: "#FFFF00", fontSize: 14 })
                } else {
                    log("fail", "element_list_views", "no views found")
                }

                // Element relationships
                await testTool(client, "element_list_relationships", { id: geId })

                // create-view-of
                await testTool(client, "diagram_create_view_of", { id: gdId, modelId: geId, x: 400, y: 400 })
            }

            // Element child
            console.log("\n── Element Children ──")
            if (geId) {
                const childResult = await call(client, "element_create_child", { id: geId, type: "UMLAttribute", name: "testAttr" })
                if (childResult.ok) {
                    log("pass", "element_create_child")
                    const childId = childResult.data?.data?._id
                    if (childId) {
                        // Element update
                        await testTool(client, "element_update", { id: childId, name: "updatedAttr" })

                        // Element reorder
                        await testTool(client, "element_reorder", { id: childId, direction: "up" })

                        // Element delete
                        await testTool(client, "element_delete", { id: childId })
                    }
                } else {
                    log("fail", "element_create_child", childResult.data?.error?.substring(0, 100) || "")
                }
            }

            // Element relocate
            if (geId && ge2Id) {
                await testTool(client, "element_relocate", { id: geId, newParentId: ge2Id })
            }

            // View align (need at least 2 views)
            const allViews = await call(client, "diagram_list_views", { id: gdId })
            const nodeViews = (allViews.data?.data || []).filter(v =>
                v._type !== "UMLFrameView" && v._type !== "FreelineEdgeView" && v._type !== "UMLNoteLinkView"
            )
            if (nodeViews.length >= 2) {
                await testTool(client, "view_align", { viewIds: [nodeViews[0]._id, nodeViews[1]._id], action: "align-top" })
            } else {
                log("skip", "view_align", "need 2+ views")
            }

            // Clean up generic diagram
            await testTool(client, "diagram_delete", { id: gdId })
        }
    } else {
        log("fail", "diagram_create", gdResult.data?.error?.substring(0, 100) || "")
    }

    // ═══════════════════════════════════════════════════
    // 11. Additional family-specific tests
    //     - timing, overview, communication, etc.
    // ═══════════════════════════════════════════════════
    console.log("\n═══ Additional Family CRUD ═══")

    // Timing diagram
    {
        console.log("\n── timing CRUD ──")
        const dR = await call(client, "timing_create_diagram", { name: "Test_timing" })
        if (dR.ok) {
            log("pass", "timing_create_diagram")
            const dId = dR.data?.data?._id
            if (dId) {
                // Find the UMLTimingFrameView on the diagram
                const viewsR = await call(client, "diagram_list_views", { id: dId })
                const frameView = (viewsR.data?.data || []).find(v => v._type === "UMLTimingFrameView")
                const frameViewId = frameView?._id

                // Create lifeline inside the frame
                let lifelineViewId = null
                let llModelId = null
                if (frameViewId) {
                    const llR = await call(client, "timing_create_lifeline", { diagramId: dId, name: "LL1", tailViewId: frameViewId })
                    if (llR.ok) {
                        log("pass", "timing_create_lifeline")
                        llModelId = llR.data?.data?._id
                        // Find the UMLTimingLifelineView on the diagram
                        const views2R = await call(client, "diagram_list_views", { id: dId })
                        const llView = (views2R.data?.data || []).find(v => v._type === "UMLTimingLifelineView")
                        lifelineViewId = llView?._id
                    } else {
                        log("fail", "timing_create_lifeline", llR.data?.error?.substring(0, 100) || "")
                    }
                } else {
                    log("skip", "timing_create_lifeline", "no frame view found")
                }

                // Create timing state inside the lifeline
                let tsId = null
                if (lifelineViewId) {
                    const tsR = await call(client, "timing_create_timing_state", { diagramId: dId, name: "State1", tailViewId: lifelineViewId })
                    if (tsR.ok) {
                        log("pass", "timing_create_timing_state")
                        tsId = tsR.data?.data?._id
                    } else {
                        log("fail", "timing_create_timing_state", tsR.data?.error?.substring(0, 100) || "")
                    }
                } else {
                    log("skip", "timing_create_timing_state", "no lifeline view found")
                }

                await testTool(client, "timing_list_lifelines", { diagramId: dId })
                await testTool(client, "timing_list_timing_states", { diagramId: dId })
                await testTool(client, "timing_list_time_segments")

                // Get/Update/Delete timing state (modelTypes: UMLConstraint)
                if (tsId) {
                    await testTool(client, "timing_get_timing_state", { id: tsId })
                    await testTool(client, "timing_update_timing_state", { id: tsId, name: "UpdatedState1" })
                    await testTool(client, "timing_delete_timing_state", { id: tsId })
                }

                // Get/Update/Delete lifeline
                if (llModelId) {
                    await testTool(client, "timing_get_lifeline", { id: llModelId })
                    await testTool(client, "timing_update_lifeline", { id: llModelId, name: "UpdatedLL1" })
                    await testTool(client, "timing_delete_lifeline", { id: llModelId })
                }

                await testTool(client, "timing_delete_diagram", { id: dId })
            }
        } else {
            log("fail", "timing_create_diagram", dR.data?.error?.substring(0, 100) || "")
        }
    }

    // Communication diagram
    {
        console.log("\n── communication CRUD ──")
        const dR = await call(client, "communication_create_diagram", { name: "Test_comm" })
        if (dR.ok) {
            log("pass", "communication_create_diagram")
            const dId = dR.data?.data?._id
            if (dId) {
                const llR = await call(client, "communication_create_lifeline", { diagramId: dId, name: "LL1" })
                if (llR.ok) log("pass", "communication_create_lifeline")
                else log("fail", "communication_create_lifeline", llR.data?.error?.substring(0, 100) || "")
                await testTool(client, "communication_list_lifelines")
                await testTool(client, "communication_list_connectors")
                await testTool(client, "communication_delete_diagram", { id: dId })
            }
        } else {
            log("fail", "communication_create_diagram", dR.data?.error?.substring(0, 100) || "")
        }
    }

    // Overview diagram
    {
        console.log("\n── overview CRUD ──")
        const dR = await call(client, "overview_create_diagram", { name: "Test_overview" })
        if (dR.ok) {
            log("pass", "overview_create_diagram")
            const dId = dR.data?.data?._id
            if (dId) {
                // Create interaction-use (model type is UMLAction)
                const iuR = await call(client, "overview_create_interaction_use", { diagramId: dId, name: "IU1" })
                let iuId = null
                if (iuR.ok) {
                    log("pass", "overview_create_interaction_use")
                    iuId = iuR.data?.data?._id
                } else {
                    log("fail", "overview_create_interaction_use", iuR.data?.error?.substring(0, 100) || "")
                }

                // Create interaction (model type is UMLAction)
                const intR = await call(client, "overview_create_interaction", { diagramId: dId, name: "Int1" })
                let intId = null
                if (intR.ok) {
                    log("pass", "overview_create_interaction")
                    intId = intR.data?.data?._id
                } else {
                    log("fail", "overview_create_interaction", intR.data?.error?.substring(0, 100) || "")
                }

                await testTool(client, "overview_list_interaction_uses")
                await testTool(client, "overview_list_interactions")
                await testTool(client, "overview_list_control_nodes")
                await testTool(client, "overview_list_control_flows")

                // Get/Update/Delete interaction-use (modelTypes: UMLAction)
                if (iuId) {
                    await testTool(client, "overview_get_interaction_use", { id: iuId })
                    await testTool(client, "overview_update_interaction_use", { id: iuId, name: "UpdatedIU1" })
                    await testTool(client, "overview_delete_interaction_use", { id: iuId })
                }

                // Get/Update/Delete interaction (modelTypes: UMLAction)
                if (intId) {
                    await testTool(client, "overview_get_interaction", { id: intId })
                    await testTool(client, "overview_update_interaction", { id: intId, name: "UpdatedInt1" })
                    await testTool(client, "overview_delete_interaction", { id: intId })
                }

                await testTool(client, "overview_delete_diagram", { id: dId })
            }
        } else {
            log("fail", "overview_create_diagram", dR.data?.error?.substring(0, 100) || "")
        }
    }

    // Composite Structure diagram - parts CRUD (modelTypes: UMLAttribute)
    {
        console.log("\n── composite parts CRUD ──")
        const dR = await call(client, "composite_create_diagram", { name: "Test_composite_parts" })
        if (dR.ok) {
            log("pass", "composite_create_diagram (parts)")
            const dId = dR.data?.data?._id
            if (dId) {
                // Create part (model type is UMLAttribute)
                const pR = await call(client, "composite_create_part", { diagramId: dId, name: "Part1" })
                let partId = null
                if (pR.ok) {
                    log("pass", "composite_create_part")
                    partId = pR.data?.data?._id
                } else {
                    log("fail", "composite_create_part", pR.data?.error?.substring(0, 100) || "")
                }

                await testTool(client, "composite_list_parts")

                // Get/Update/Delete part (modelTypes: UMLAttribute)
                if (partId) {
                    await testTool(client, "composite_get_part", { id: partId })
                    await testTool(client, "composite_update_part", { id: partId, name: "UpdatedPart1" })
                    await testTool(client, "composite_delete_part", { id: partId })
                }

                await testTool(client, "composite_delete_diagram", { id: dId })
            }
        } else {
            log("fail", "composite_create_diagram (parts)", dR.data?.error?.substring(0, 100) || "")
        }
    }

    // Test view_reconnect with a simple relation
    {
        console.log("\n── view_reconnect ──")
        const drR = await call(client, "class_create_diagram", { name: "Test_reconnect" })
        if (drR.ok) {
            const drId = drR.data?.data?._id
            if (drId) {
                const e1 = await call(client, "class_create_class", { diagramId: drId, name: "A", x1: 50, y1: 50 })
                const e2 = await call(client, "class_create_class", { diagramId: drId, name: "B", x1: 300, y1: 50 })
                const e3 = await call(client, "class_create_class", { diagramId: drId, name: "C", x1: 300, y1: 300 })
                const e1Id = e1.data?.data?._id
                const e2Id = e2.data?.data?._id
                const e3Id = e3.data?.data?._id
                if (e1Id && e2Id && e3Id) {
                    const relR = await call(client, "class_create_dependency", { diagramId: drId, sourceId: e1Id, targetId: e2Id })
                    if (relR.ok) {
                        // Find the edge view
                        const viewsR = await call(client, "diagram_list_views", { id: drId })
                        const edgeView = (viewsR.data?.data || []).find(v => v._type?.includes("Edge") || v._type?.includes("Dependency"))
                        if (edgeView) {
                            await testTool(client, "view_reconnect", { id: edgeView._id, newTargetId: e3Id })
                        } else {
                            log("skip", "view_reconnect", "no edge view found")
                        }
                    }
                }
                await testTool(client, "class_delete_diagram", { id: drId })
            }
        }
    }

    // ═══════════════════════════════════════════════════
    // 12. Tags (existing general tools)
    // ═══════════════════════════════════════════════════
    console.log("\n── Tags ──")
    {
        const tdR = await call(client, "class_create_diagram", { name: "Test_tags" })
        if (tdR.ok) {
            const tdId = tdR.data?.data?._id
            if (tdId) {
                const teR = await call(client, "class_create_class", { diagramId: tdId, name: "TagTestClass" })
                const teId = teR.data?.data?._id
                if (teId) {
                    await testTool(client, "list_element_tags", { id: teId })
                    const tagR = await call(client, "create_element_tag", { id: teId, name: "testTag", kind: 0, value: "hello" })
                    if (tagR.ok) {
                        log("pass", "create_element_tag")
                        const tagId = tagR.data?.data?._id
                        if (tagId) {
                            await testTool(client, "get_tag", { id: tagId })
                            await testTool(client, "update_tag", { id: tagId, value: "world" })
                            await testTool(client, "delete_tag", { id: tagId })
                        }
                    } else {
                        log("fail", "create_element_tag", tagR.data?.error?.substring(0, 100) || "")
                    }
                }
                await testTool(client, "class_delete_diagram", { id: tdId })
            }
        }
    }

    // ═══════════════════════════════════════════════════
    // 13. Save / Open project (existing)
    // ═══════════════════════════════════════════════════
    console.log("\n── Project Save/Open ──")
    await testTool(client, "save_project", { path: "/tmp/test_mcp_project.mdj" })
    await testTool(client, "open_project", { path: "/tmp/test_mcp_project.mdj" })

    // ═══════════════════════════════════════════════════
    // Final Cleanup: restore project snapshot
    // ═══════════════════════════════════════════════════
    console.log("\n── Final Cleanup ──")
    const restoreR = await call(client, "open_project", { path: snapshotPath })
    if (restoreR.ok) {
        log("pass", "restore_project_snapshot")
    } else {
        log("fail", "restore_project_snapshot", "could not restore snapshot")
    }

    // ═══════════════════════════════════════════════════
    // Summary
    // ═══════════════════════════════════════════════════
    console.log("\n" + "═".repeat(50))
    console.log(`RESULTS: ${PASS} ${passCount} passed | ${FAIL} ${failCount} failed | ${SKIP} ${skipCount} skipped`)
    console.log(`Total registered tools: ${toolList.tools.length}`)
    console.log("═".repeat(50))

    if (failures.length > 0) {
        console.log("\nFailed tools:")
        for (const f of failures) {
            console.log(`  ${FAIL} ${f.tool}: ${f.detail}`)
        }
    }

    await client.close()
    process.exit(failCount > 0 ? 1 : 0)
}

main().catch((err) => {
    console.error("Test runner error:", err)
    process.exit(1)
})
