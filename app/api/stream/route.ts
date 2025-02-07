import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const content = searchParams.get("content");
    const demo = searchParams.get("demo");

    const targetUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/${demo ? `prompt-demo` : "prompt"}?content=${content}`;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                ...req.headers,
                cookie: req.headers.get('cookie') || '',
                "Accept": "text/event-stream"
            },
            credentials: "include",
        });

        const headers = new Headers(response.headers);

        if (!response.body) {
            return new Response("No response body", { status: 500 });
        }

        return new Response(response.body, {
            headers: {
                ...headers,
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        console.error("Error proxying request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}