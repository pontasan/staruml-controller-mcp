import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

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

export const erdColumnTools: ToolDefinition[] = [
    {
        name: "erd_list_columns",
        description: "List all columns of the specified entity.",
        method: "GET",
        pathTemplate: "/api/erd/entities/:id/columns",
        inputSchema: z.object({
            id: z.string().describe("Entity ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_create_column",
        description: "Add a new column to the specified entity.",
        method: "POST",
        pathTemplate: "/api/erd/entities/:id/columns",
        inputSchema: z.object({
            id: z.string().describe("Entity ID"),
            name: z.string().optional().describe("Column name (default: 'new_column')"),
            type: z.enum(COLUMN_TYPES).optional().describe("SQL data type"),
            length: z.string().optional().describe("Length/precision (e.g., '255')"),
            primaryKey: z.boolean().optional().describe("Primary key flag (default: false)"),
            foreignKey: z.boolean().optional().describe("Foreign key flag (default: false)"),
            nullable: z.boolean().optional().describe("Nullable flag (default: false)"),
            unique: z.boolean().optional().describe("Unique constraint flag (default: false)"),
            documentation: z.string().optional().describe("Description"),
            referenceToId: z.string().optional().describe("Foreign key target column ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_get_column",
        description: "Get the details of the specified column.",
        method: "GET",
        pathTemplate: "/api/erd/columns/:id",
        inputSchema: z.object({
            id: z.string().describe("Column ID"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_update_column",
        description:
            "Update the specified column. Only the specified fields are updated. Set referenceToId to null to remove a foreign key reference.",
        method: "PUT",
        pathTemplate: "/api/erd/columns/:id",
        inputSchema: z.object({
            id: z.string().describe("Column ID"),
            name: z.string().optional().describe("Column name"),
            type: z.enum(COLUMN_TYPES).optional().describe("SQL data type"),
            length: z.string().optional().describe("Length/precision"),
            primaryKey: z.boolean().optional().describe("Primary key flag"),
            foreignKey: z.boolean().optional().describe("Foreign key flag"),
            nullable: z.boolean().optional().describe("Nullable flag"),
            unique: z.boolean().optional().describe("Unique constraint flag"),
            documentation: z.string().optional().describe("Description"),
            referenceToId: z
                .string()
                .nullable()
                .optional()
                .describe("Foreign key target column ID (null to remove reference)"),
        }),
        pathParams: { id: "id" },
    },
    {
        name: "erd_delete_column",
        description: "Delete the specified column. Blocked if other columns reference it via referenceTo.",
        method: "DELETE",
        pathTemplate: "/api/erd/columns/:id",
        inputSchema: z.object({
            id: z.string().describe("Column ID"),
        }),
        pathParams: { id: "id" },
    },
]
