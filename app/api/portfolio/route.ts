import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const account = searchParams.get('account')

    const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/portfolio?account=${account}`;

    // Forward the request to the server
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error connecting to server:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}