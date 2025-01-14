import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      const apiUrl = `http://localhost:4000/session`;
  
      console.log('cookie', req.headers.get('cookie') || '')

      // Forward the request to the localhost server
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

    const setCookieHeader = response.headers.get('set-cookie');

    const data = await response.json();

    const nextResponse = NextResponse.json(data, { status: response.status });

    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }

    return nextResponse
    } catch (error) {
      console.error('Error connecting to localhost server:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }