export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export interface HttpResponse {
    status: number
    body: unknown
}

const TIMEOUT_MS = 10000

export function encodeId(id: string): string {
    return encodeURIComponent(id)
}

export async function request(
    method: HttpMethod,
    host: string,
    port: number,
    path: string,
    body?: Record<string, unknown>
): Promise<HttpResponse> {
    const url = `http://${host}:${port}${path}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
        const options: RequestInit = {
            method,
            signal: controller.signal,
        }
        if (body !== undefined && (method === "POST" || method === "PUT")) {
            options.headers = { "Content-Type": "application/json; charset=utf-8" }
            options.body = JSON.stringify(body)
        }

        let res: Response
        try {
            res = await fetch(url, options)
        } catch (err: unknown) {
            if (err instanceof Error && err.name === "AbortError") {
                throw new Error(
                    `Request to StarUML timed out after ${TIMEOUT_MS}ms. Is StarUML running with the Controller extension?`
                )
            }
            throw new Error(
                `Could not connect to StarUML at ${host}:${port}. ` +
                    `Make sure StarUML is running with the Controller extension enabled. ` +
                    `Original error: ${err instanceof Error ? err.message : String(err)}`
            )
        }

        let data: unknown
        try {
            data = await res.json()
        } catch {
            throw new Error(
                `StarUML returned an invalid (non-JSON) response (HTTP ${res.status}).`
            )
        }

        return { status: res.status, body: data }
    } finally {
        clearTimeout(timeoutId)
    }
}
