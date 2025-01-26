import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/account`;
 
      // Forward the request to the server
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: req.body,
        duplex: "half"
      });
  
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error connecting to server:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }