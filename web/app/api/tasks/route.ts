import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function proxy(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const method = request.method;
        const id = searchParams.get('id');

        // Construct backend URL
        let backendUrl = `${process.env.BACKEND_URL}/tasks`;
        if (id) {
            backendUrl += `/${id}`;
        } else {
            // Forward query params if no ID
            const queryString = searchParams.toString();
            if (queryString) {
                backendUrl += `?${queryString}`;
            }
        }

        // Get authentication token
        const cookieStore = await cookies();
        const tokenToken = cookieStore.get('token');
        const token = tokenToken?.value;
        console.log("Tasks Proxy: Cookie found?", !!tokenToken, "Token value length:", token ? token.length : 0);

        // Prepare headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Prepare request options
        const options: RequestInit = {
            method,
            headers,
        };

        // Forward body for non-GET/HEAD requests
        if (method !== 'GET' && method !== 'HEAD') {
            try {
                const body = await request.json();
                options.body = JSON.stringify(body);
            } catch (error) {
                // Ignore JSON parse error (empty body)
            }
        }

        // Call Backend
        const res = await fetch(backendUrl, options);

        // Parse response
        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await res.json();
        } else {
            data = {}; // Handle empty or non-json response
        }

        return NextResponse.json(data, { status: res.status });

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: String(error) },
            { status: 500 }
        );
    }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE };
