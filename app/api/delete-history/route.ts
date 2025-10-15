import { NextRequest, NextResponse } from "next/server";

const targetUrl = `${process.env.NEXT_PUBLIC_EXPRESS_URL}:${process.env.NEXT_PUBLIC_EXPRESS_PORT}/delete-history`;

export async function DELETE(req: NextRequest) {
  try {
    const headersObject = Object.fromEntries(req.headers);

    const response = await fetch(targetUrl, {
      method: 'DELETE',
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
    });

    const headers = new Headers(response.headers);
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Error connecting to delete-history endpoint:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
