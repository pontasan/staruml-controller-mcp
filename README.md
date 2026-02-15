# StarUML Controller MCP Servers

A collection of 25 diagram-specific [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) servers that enable AI assistants like Claude to programmatically create and edit any StarUML diagram — UML, ERD, Sequence, BPMN, C4, SysML, Wireframe, MindMap, AWS, Azure, GCP, Flowchart, DFD, and more.

Each server is built on a shared core infrastructure ([staruml-controller-mcp-core](https://github.com/pontasan/staruml-controller-mcp-core)) providing 63 common tools, plus diagram-specific tools tailored to each diagram type.

<p align="center">
  <img src="images/image1.gif" alt="AI generating a Web Shopping ER diagram in StarUML" width="800">
  <br>
  <em>An AI tool creating a complete Web Shopping ER diagram through the StarUML Controller API</em>
</p>

<p align="center">
  <img src="images/image3.gif" alt="AI generating a Login Check sequence diagram from source code" width="800">
  <br>
  <em>An AI tool analyzing source code and generating a sequence diagram</em>
</p>

## Architecture

<p align="center">
  <img src="images/architecture.svg" alt="Architecture overview: Claude Code communicates with MCP servers via MCP protocol, which connect to StarUML's staruml-controller extension via HTTP REST API" width="800">
</p>

## Prerequisites

- **Node.js 18+**
- **StarUML** with the [StarUML Controller](https://github.com/pontasan/staruml-controller) extension installed and running

## Starting the StarUML Controller Server

Before using any MCP server, you need to start the StarUML Controller server:

1. **Launch StarUML** and open a project (or create a new one)

2. From the menu bar, select **Tools > StarUML Controller > Start Server...**

<p align="center">
  <img src="images/image4.jpg" alt="Tools menu showing StarUML Controller submenu with Start Server and Stop Server options" width="700">
</p>

3. A dialog appears asking for the port number. Enter a port (default: `12345`) and click **OK**

<p align="center">
  <img src="images/image5.jpg" alt="Port number input dialog with default value 12345" width="400">
</p>

4. The HTTP server starts and all diagrams become accessible via the MCP tools

To stop, select **Tools > StarUML Controller > Stop Server** from the menu bar.

## Available MCP Servers

### Core Infrastructure

| Package | Description |
|---|---|
| [staruml-controller-mcp-core](https://github.com/pontasan/staruml-controller-mcp-core) | Shared infrastructure + 63 common tools (general, project, utility, diagrams, notes, shapes, views, elements) |

### UML Diagrams (13 servers)

| Server | Diagram Type | Specific Tools | Total Tools |
|---|---|---|---|
| [staruml-controller-class-mcp](https://github.com/pontasan/staruml-controller-class-mcp) | Class / Package | 74 | 137 |
| [staruml-controller-usecase-mcp](https://github.com/pontasan/staruml-controller-usecase-mcp) | Use Case | 47 | 110 |
| [staruml-controller-activity-mcp](https://github.com/pontasan/staruml-controller-activity-mcp) | Activity | 54 | 117 |
| [staruml-controller-statemachine-mcp](https://github.com/pontasan/staruml-controller-statemachine-mcp) | State Machine | 27 | 90 |
| [staruml-controller-seq-mcp](https://github.com/pontasan/staruml-controller-seq-mcp) | Sequence | 40 | 103 |
| [staruml-controller-communication-mcp](https://github.com/pontasan/staruml-controller-communication-mcp) | Communication | 15 | 78 |
| [staruml-controller-component-mcp](https://github.com/pontasan/staruml-controller-component-mcp) | Component | 35 | 98 |
| [staruml-controller-deployment-mcp](https://github.com/pontasan/staruml-controller-deployment-mcp) | Deployment | 45 | 108 |
| [staruml-controller-object-mcp](https://github.com/pontasan/staruml-controller-object-mcp) | Object | 17 | 80 |
| [staruml-controller-composite-mcp](https://github.com/pontasan/staruml-controller-composite-mcp) | Composite Structure | 40 | 103 |
| [staruml-controller-timing-mcp](https://github.com/pontasan/staruml-controller-timing-mcp) | Timing | 20 | 83 |
| [staruml-controller-overview-mcp](https://github.com/pontasan/staruml-controller-overview-mcp) | Interaction Overview | 25 | 88 |
| [staruml-controller-profile-mcp](https://github.com/pontasan/staruml-controller-profile-mcp) | Profile | 25 | 88 |

### Non-UML Diagrams (12 servers)

| Server | Diagram Type | Specific Tools | Total Tools |
|---|---|---|---|
| [staruml-controller-erd-mcp](https://github.com/pontasan/staruml-controller-erd-mcp) | ERD | 36 | 99 |
| [staruml-controller-bpmn-mcp](https://github.com/pontasan/staruml-controller-bpmn-mcp) | BPMN | 84 | 147 |
| [staruml-controller-c4-mcp](https://github.com/pontasan/staruml-controller-c4-mcp) | C4 | 15 | 78 |
| [staruml-controller-sysml-mcp](https://github.com/pontasan/staruml-controller-sysml-mcp) | SysML | 81 | 144 |
| [staruml-controller-flowchart-mcp](https://github.com/pontasan/staruml-controller-flowchart-mcp) | Flowchart | 15 | 78 |
| [staruml-controller-dfd-mcp](https://github.com/pontasan/staruml-controller-dfd-mcp) | DFD | 25 | 88 |
| [staruml-controller-wireframe-mcp](https://github.com/pontasan/staruml-controller-wireframe-mcp) | Wireframe | 15 | 78 |
| [staruml-controller-mindmap-mcp](https://github.com/pontasan/staruml-controller-mindmap-mcp) | MindMap | 15 | 78 |
| [staruml-controller-infoflow-mcp](https://github.com/pontasan/staruml-controller-infoflow-mcp) | Information Flow | 15 | 78 |
| [staruml-controller-aws-mcp](https://github.com/pontasan/staruml-controller-aws-mcp) | AWS | 15 | 78 |
| [staruml-controller-azure-mcp](https://github.com/pontasan/staruml-controller-azure-mcp) | Azure | 15 | 78 |
| [staruml-controller-gcp-mcp](https://github.com/pontasan/staruml-controller-gcp-mcp) | GCP | 15 | 78 |

## Common Tools (63)

Every MCP server includes 63 shared tools provided by the core package:

<details>
<summary>Click to expand</summary>

### General (9 tools)

| Tool | Description |
|---|---|
| `get_status` | Get server status, version, and endpoint list |
| `get_element` | Get any element by ID |
| `list_element_tags` | List tags on an element |
| `create_element_tag` | Create a tag on an element |
| `get_tag` | Get tag details |
| `update_tag` | Update a tag |
| `delete_tag` | Delete a tag |
| `save_project` | Save project to a .mdj file |
| `open_project` | Open a .mdj project file |

### Project (6 tools)

| Tool | Description |
|---|---|
| `project_new` | Create a new empty project |
| `project_close` | Close the current project |
| `project_import` | Import a .mdj fragment into the project |
| `project_export` | Export a model fragment to a .mdj file |
| `project_export_all` | Export all diagrams as images (PNG/SVG/JPEG/PDF) |
| `project_export_doc` | Export project documentation (HTML/Markdown) |

### Utility (6 tools)

| Tool | Description |
|---|---|
| `undo` | Undo the last action |
| `redo` | Redo the last undone action |
| `search` | Search elements by keyword with optional type filter |
| `validate` | Run model validation |
| `mermaid_import` | Import a Mermaid diagram definition |
| `generate_diagram` | Generate a diagram from natural language (requires AI extension) |

### Diagrams (15 tools)

| Tool | Description |
|---|---|
| `diagram_list` | List all diagrams (optionally filter by type) |
| `diagram_create` | Create a new diagram of any type |
| `diagram_get` | Get diagram details by ID |
| `diagram_update` | Update diagram name |
| `diagram_delete` | Delete a diagram |
| `diagram_list_elements` | List all elements on a diagram |
| `diagram_list_views` | List all views on a diagram |
| `diagram_create_element` | Create a node element on a diagram |
| `diagram_create_relation` | Create a relation between elements |
| `diagram_export` | Export diagram as image (PNG/SVG/JPEG/PDF) |
| `diagram_layout` | Auto-layout diagram with configurable direction |
| `diagram_open` | Open/activate a diagram in the editor |
| `diagram_zoom` | Set diagram zoom level |
| `diagram_create_view_of` | Create a view of an existing model on a diagram |
| `diagram_link_object` | Create a UMLLinkObject on an object diagram |

### Notes, Note Links, Free Lines (11 tools)

| Tool | Description |
|---|---|
| `note_list` | List all notes on a diagram |
| `note_create` | Create a note with text and position |
| `note_get` | Get note details |
| `note_update` | Update note text |
| `note_delete` | Delete a note |
| `note_link_list` | List all note links on a diagram |
| `note_link_create` | Create a link between a note and an element |
| `note_link_delete` | Delete a note link |
| `free_line_list` | List all free lines on a diagram |
| `free_line_create` | Create a free line on a diagram |
| `free_line_delete` | Delete a free line |

### Shapes (5 tools)

| Tool | Description |
|---|---|
| `shape_list` | List all shapes on a diagram |
| `shape_create` | Create a shape (Text, TextBox, Rect, RoundRect, Ellipse, Hyperlink, Image) |
| `shape_get` | Get shape details |
| `shape_update` | Update shape text |
| `shape_delete` | Delete a shape |

### Views (4 tools)

| Tool | Description |
|---|---|
| `view_update` | Move/resize a view (left, top, width, height) |
| `view_update_style` | Update visual style (fillColor, lineColor, fontColor, fontSize, etc.) |
| `view_reconnect` | Reconnect an edge to different source/target |
| `view_align` | Align/distribute multiple views |

### Elements (7 tools)

| Tool | Description |
|---|---|
| `element_update` | Update any element's name and documentation |
| `element_delete` | Delete any element by ID |
| `element_list_relationships` | List all relationships of an element |
| `element_list_views` | List all views of an element across diagrams |
| `element_relocate` | Move element to a different parent |
| `element_create_child` | Create a child element (attribute, operation, etc.) |
| `element_reorder` | Reorder element within parent (up/down) |

</details>

## Quick Start

1. **Build the core package**

```bash
git clone https://github.com/pontasan/staruml-controller-mcp-core.git
cd staruml-controller-mcp-core
npm install
npm run build
```

2. **Build the MCP server you need** (e.g., ERD)

```bash
git clone https://github.com/pontasan/staruml-controller-erd-mcp.git
cd staruml-controller-erd-mcp
npm install
npm run build
```

3. **Add to Claude Code**

```bash
claude mcp add staruml-erd node /absolute/path/to/staruml-controller-erd-mcp/dist/index.js
```

Or add to **Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "staruml-erd": {
      "command": "node",
      "args": ["/absolute/path/to/staruml-controller-erd-mcp/dist/index.js"]
    }
  }
}
```

## License

MIT
