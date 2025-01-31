import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/reset`;
  
      // Forward the request to the server
      const response = await fetch(apiUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      });
  
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error connecting to server:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }