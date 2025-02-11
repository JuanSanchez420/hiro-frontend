import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const headersObject = Object.fromEntries(req.headers);
    const { searchParams } = new URL(req.url);
    const content = searchParams.get("content");
    const demo = searchParams.get("demo");

    const targetUrl = `${process.env.NEXT_PUBLIC_EXPRESS_URL}:${process.env.NEXT_PUBLIC_EXPRESS_PORT}/${demo ? `prompt-demo` : "prompt"}?content=${content}`;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                ...headersObject,
                'X-Real-IP': req.headers.get('x-real-ip') || '',
                'X-Forwarded-For': req.headers.get('x-forwarded-for') || '',
                'X-Forwarded-Proto': req.headers.get('x-forwarded-proto') || 'http',
                'X-Forwarded-Host': req.headers.get('x-forwarded-host') || req.headers.get('host') || '',
                'X-NginX-Proxy': req.headers.get('x-nginx-proxy') || 'true',
                'Host': req.headers.get('host') || '',
                cookie: req.headers.get('cookie') || '',
                'Content-Type': 'application/json',
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