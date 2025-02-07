import { NextRequest, NextResponse } from "next/server";

// Extend the RequestInit interface to include the "duplex" property.
interface EnhancedRequestInit extends RequestInit {
  duplex?: "half";
}

export async function POST(req: NextRequest) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/set-session`;

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

export async function GET(req: NextRequest) {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/get-session`;

      // Forward the request to the server
      const response = await fetch(apiUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          cookie: req.headers.get('cookie') || '',
          'Content-Type': 'application/json',
        },
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
        credentials: 'include',
      });

    const headers = new Headers(response.headers);

    const data = await response.json();
    return NextResponse.json(data, {
      status: response.status,
      headers: headers
    });
    } catch (error) {
      console.error('Error connecting to server:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }