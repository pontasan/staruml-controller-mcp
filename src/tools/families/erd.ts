import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"
import type { FamilyConfig } from "./types.js"
import { generateFamilyTools } from "../family-factory.js"

const COLUMN_TYPES = [
    "CHAR", "VARCHAR", "TEXT", "CLOB",
    "BOOLEAN",
    "SMALLINT", "INTEGER", "INT", "BIGINT", "TINYINT",
    "FLOAT", "DOUBLE", "REAL", "DECIMAL", "NUMERIC",
    "DATE", "TIME", "DATETIME", "TIMESTAMP",
    "BLOB", "BINARY", "VARBINARY",
    "UUID", "JSON", "JSONB", "XML",
    "SERIAL", "BIGSERIAL",
] as const

const erdDdlTool: ToolDefinition = {
    name: "erd_generate_ddl",
    description:
        "Generate PostgreSQL DDL from the ER diagram and write it to the specified absolute path. " +
        "Includes CREATE TABLE, constraints, indexes, sequences, and comments. " +
        "ER diagrams are the source of truth for database schema. Always update ER diagrams first, then use this tool.",
    method: "POST",
    pathTemplate: "/api/erd/postgresql/ddl",
    inputSchema: z.object({
        path: z.string().describe("Absolute path for the output DDL file"),
        dataModelId: z
            .string()
            .optional()
            .describe("If specified, only entities under this data model are included"),
    }),
}

const config: FamilyConfig = {
    prefix: "erd",
    label: "ERD",
    container: {
        name: "data-models",
        createFields: ["name"],
        updateFields: ["name"],
    },
    diagrams: {
        types: ["ERDDiagram"],
        parentIdRequired: true,
    },
    resources: [
        {
            name: "entities",
            types: ["ERDEntity"],
            listQueryParams: ["dataModelId", "diagramId"],
            createFields: [
                { name: "parentId", schema: { required: true, description: "Parent ERDDataModel ID" } },
                "name",
                "documentation",
                "diagramId",
                { name: "x1", schema: { zodType: "number" } },
                { name: "y1", schema: { zodType: "number" } },
                { name: "x2", schema: { zodType: "number" } },
                { name: "y2", schema: { zodType: "number" } },
            ],
            updateFields: ["name", "documentation"],
            children: [
                {
                    name: "columns",
                    type: "ERDColumn",
                    field: "columns",
                    fullCrud: true,
                    standalonePrefix: "columns",
                    createFields: [
                        "name",
                        { name: "type", schema: { zodType: "enum", enumValues: COLUMN_TYPES, description: "SQL data type" } },
                        { name: "length", schema: { description: "Length/precision (e.g., '255')" } },
                        { name: "primaryKey", schema: { zodType: "boolean", description: "Primary key flag (default: false)" } },
                        { name: "foreignKey", schema: { zodType: "boolean", description: "Foreign key flag (default: false)" } },
                        { name: "nullable", schema: { zodType: "boolean", description: "Nullable flag (default: false)" } },
                        { name: "unique", schema: { zodType: "boolean", description: "Unique constraint flag (default: false)" } },
                        "documentation",
                        { name: "referenceToId", schema: { description: "Foreign key target column ID" } },
                    ],
                    updateFields: [
                        "name",
                        { name: "type", schema: { zodType: "enum", enumValues: COLUMN_TYPES, description: "SQL data type" } },
                        { name: "length", schema: { description: "Length/precision" } },
                        { name: "primaryKey", schema: { zodType: "boolean", description: "Primary key flag" } },
                        { name: "foreignKey", schema: { zodType: "boolean", description: "Foreign key flag" } },
                        { name: "nullable", schema: { zodType: "boolean", description: "Nullable flag" } },
                        { name: "unique", schema: { zodType: "boolean", description: "Unique constraint flag" } },
                        "documentation",
                        { name: "referenceToId", schema: { nullable: true, description: "Foreign key target column ID (null to remove reference)" } },
                    ],
                },
                {
                    name: "indexes",
                    type: "Tag",
                    field: "tags",
                    fullCrud: true,
                    standalonePrefix: "indexes",
                    createFields: [
                        { name: "name", schema: { required: true, description: "Index name" } },
                        { name: "definition", schema: { required: true, description: "Full CREATE INDEX statement (e.g., 'CREATE INDEX idx_email ON users (email)')" } },
                    ],
                    updateFields: ["name", "definition"],
                },
                {
                    name: "sequences",
                    type: "Tag",
                    field: "tags",
                    fullCrud: true,
                    standalonePrefix: "sequences",
                    createFields: [
                        { name: "name", schema: { required: true, description: "Sequence name" } },
                    ],
                    updateFields: ["name"],
                },
            ],
        },
    ],
    relations: [
        {
            name: "relationships",
            type: "ERDRelationship",
            hasEnds: true,
            endFields: ["reference", "cardinality", "name"],
            noSourceTarget: true,
            listQueryParams: ["dataModelId"],
            createFields: [
                { name: "parentId", schema: { required: true, description: "Parent ERDDataModel ID" } },
                { name: "end1_reference", schema: { required: true, description: "Entity ID for endpoint 1" } },
                { name: "end2_reference", schema: { required: true, description: "Entity ID for endpoint 2" } },
                { name: "diagramId", schema: { required: true, description: "Diagram ID where entity views are placed" } },
                { name: "identifying", schema: { zodType: "boolean", description: "Identifying relationship flag" } },
            ],
            updateFields: [
                "name",
                { name: "identifying", schema: { zodType: "boolean", description: "Identifying relationship flag" } },
            ],
        },
    ],
    customTools: [erdDdlTool],
}

export const erdTools = generateFamilyTools(config)
