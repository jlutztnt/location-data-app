// This is a proxy route that forwards auth requests to the Cloudflare Worker backend
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.workers.dev' 
  : 'http://127.0.0.1:8787';

export async function GET(request: NextRequest) {
  return forwardToBackend(request);
}

export async function POST(request: NextRequest) {
  return forwardToBackend(request);
}

export async function PUT(request: NextRequest) {
  return forwardToBackend(request);
}

export async function DELETE(request: NextRequest) {
  return forwardToBackend(request);
}

async function forwardToBackend(request: NextRequest) {
  const url = new URL(request.url);
  const authPath = url.pathname.replace('/api/auth', '/api/auth');
  
  // Forward the request to the Cloudflare Worker backend
  const backendUrl = `${BACKEND_URL}${authPath}${url.search}`;
  
  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
        'Cookie': request.headers.get('Cookie') || '',
        'User-Agent': request.headers.get('User-Agent') || '',
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? await request.arrayBuffer() 
        : undefined,
    });

    // Create response with the same status and headers
    const responseBody = await response.arrayBuffer();
    const nextResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Forward important headers
    response.headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith('set-cookie') || 
          key.toLowerCase() === 'content-type' ||
          key.toLowerCase() === 'cache-control') {
        nextResponse.headers.set(key, value);
      }
    });

    return nextResponse;
  } catch (error) {
    console.error('Auth proxy error:', error);
    return NextResponse.json(
      { error: 'Authentication service unavailable' }, 
      { status: 503 }
    );
  }
}
