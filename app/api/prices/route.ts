import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tokens = searchParams.get('tokens')
    const hours = searchParams.get('hours')

    const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/api/prices?tokens=${tokens}&hours=${hours}`;

    // Forward the request to the server
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        cookie: req.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
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