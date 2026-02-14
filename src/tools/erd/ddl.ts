import { z } from "zod"
import type { ToolDefinition } from "../../tool-registry.js"

export const erdDdlTools: ToolDefinition[] = [
    {
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
    },
]
