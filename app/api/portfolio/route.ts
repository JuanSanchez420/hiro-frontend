import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      console.log('Requesting portfolio data from localhost server');
      const apiUrl = `http://localhost:4000/portfolio`;
  
      // Forward the request to the localhost server
      const response = await fetch(apiUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          'Content-Type': 'application/json',
        },
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      });
  
      const data = await response.json();
      console.log('Received portfolio data from localhost server:', data);
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error connecting to localhost server:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }