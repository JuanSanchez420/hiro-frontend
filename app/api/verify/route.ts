import { NextRequest, NextResponse } from "next/server";

// Extend the RequestInit interface to include the "duplex" property.
interface EnhancedRequestInit extends RequestInit {
  duplex?: "half";
}

export async function POST(req: NextRequest) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/api/verify`;

    const fetchOptions: EnhancedRequestInit = {
      method: "POST",
      headers: {
        ...req.headers,
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
      body: req.body,
      duplex: "half",
    };

    const response = await fetch(apiUrl, fetchOptions);
    const headers = new Headers(response.headers);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status, headers });
  } catch (error) {
    console.error("Error connecting to server:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}