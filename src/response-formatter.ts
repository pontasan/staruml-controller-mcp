import type { HttpResponse } from "./http-client.js"

export function format(
    response: HttpResponse
): { content: Array<{ type: "text"; text: string }>; isError?: boolean } {
    const body = response.body as Record<string, unknown>
    const isError = response.status >= 400 || body?.success === false

    return {
        content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }],
        isError: isError || undefined,
    }
}

export function formatError(
    toolName: string,
    error: Error
): { content: Array<{ type: "text"; text: string }>; isError: true } {
    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(
                    {
                        success: false,
                        error: error.message,
                        tool: toolName,
                        hint: "Make sure StarUML is running with the Controller extension enabled on the correct port.",
                    },
                    null,
                    2
                ),
            },
        ],
        isError: true,
    }
}
