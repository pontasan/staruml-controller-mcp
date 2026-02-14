import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z, ZodRawShape, ZodObject } from "zod"
import { request, encodeId } from "./http-client.js"
import type { HttpMethod } from "./http-client.js"
import { format, formatError } from "./response-formatter.js"

export interface ToolDefinition {
    name: string
    description: string
    method: HttpMethod
    pathTemplate: string
    inputSchema: ZodObject<ZodRawShape>
    pathParams?: Record<string, string>
    queryParams?: string[]
    buildBody?: (params: Record<string, unknown>) => Record<string, unknown>
}

export function registerAll(
    server: McpServer,
    definitions: ToolDefinition[]
): void {
    for (const def of definitions) {
        register(server, def)
    }
}

function register(server: McpServer, def: ToolDefinition): void {
    const schemaWithConnection = def.inputSchema.extend({
        host: z
            .string()
            .optional()
            .default("localhost")
            .describe("StarUML Controller server host (default: localhost)"),
        port: z
            .number()
            .int()
            .min(1)
            .max(65535)
            .optional()
            .default(12345)
            .describe("StarUML Controller server port (default: 12345)"),
    })

    server.tool(
        def.name,
        def.description,
        schemaWithConnection.shape,
        async (params: Record<string, unknown>) => {
            try {
                const host = params.host as string
                const port = params.port as number
                const path = buildPath(def, params)
                const body = buildRequestBody(def, params)

                const response = await request(def.method, host, port, path, body)
                return format(response)
            } catch (err: unknown) {
                return formatError(
                    def.name,
                    err instanceof Error ? err : new Error(String(err))
                )
            }
        }
    )
}

export function buildPath(
    def: ToolDefinition,
    params: Record<string, unknown>
): string {
    let path = def.pathTemplate

    if (def.pathParams) {
        for (const [templateKey, paramName] of Object.entries(def.pathParams)) {
            const value = params[paramName]
            if (typeof value !== "string") {
                throw new Error(
                    `Path parameter "${paramName}" must be a string for tool "${def.name}", got ${typeof value}`
                )
            }
            path = path.replace(`:${templateKey}`, encodeId(value))
        }
    }

    if (def.queryParams && def.queryParams.length > 0) {
        const queryParts: string[] = []
        for (const qp of def.queryParams) {
            const value = params[qp]
            if (value !== undefined && value !== null) {
                queryParts.push(
                    `${encodeURIComponent(qp)}=${encodeURIComponent(String(value))}`
                )
            }
        }
        if (queryParts.length > 0) {
            path += `?${queryParts.join("&")}`
        }
    }

    return path
}

export function buildRequestBody(
    def: ToolDefinition,
    params: Record<string, unknown>
): Record<string, unknown> | undefined {
    if (def.method === "GET" || def.method === "DELETE") {
        return undefined
    }

    if (def.buildBody) {
        return def.buildBody(params)
    }

    const excluded = new Set<string>(["host", "port"])
    if (def.pathParams) {
        for (const paramName of Object.values(def.pathParams)) {
            excluded.add(paramName)
        }
    }
    if (def.queryParams) {
        for (const qp of def.queryParams) {
            excluded.add(qp)
        }
    }

    const body: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(params)) {
        if (!excluded.has(key) && value !== undefined) {
            body[key] = value
        }
    }
    return body
}
