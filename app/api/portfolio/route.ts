import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const headersObject = Object.fromEntries(req.headers);
    const { searchParams } = new URL(req.url);
    const account = searchParams.get('account')

    const apiUrl = `${process.env.NEXT_PUBLIC_EXPRESS_URL}:${process.env.NEXT_PUBLIC_EXPRESS_PORT}/portfolio?account=${account}`;

    // Forward the request to the server
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        ...headersObject,
        'X-Real-IP': req.headers.get('x-real-ip') || '',
        'X-Forwarded-For': req.headers.get('x-forwarded-for') || '',
        'X-Forwarded-Proto': req.headers.get('x-forwarded-proto') || 'http',
        'X-Forwarded-Host': req.headers.get('x-forwarded-host') || req.headers.get('host') || '',
        'X-NginX-Proxy': req.headers.get('x-nginx-proxy') || 'true',
        'Host': req.headers.get('host') || '',
        cookie: req.headers.get('cookie') || '',
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