import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const content = searchParams.get("content");
    const targetUrl = `http://localhost:4000/prompt?content=${content}`;

    try {
        const response = await fetch(targetUrl, {
            headers: { "Accept": "text/event-stream" },
        });

        if (!response.body) {
            return new Response("No response body", { status: 500 });
        }

        return new Response(response.body, {
            headers: {
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