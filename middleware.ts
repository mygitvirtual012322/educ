import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect all /admin routes, but allow /admin/login
    // Also protect API routes that are admin-specific if needed, but for now just the UI
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
        const token = request.cookies.get('admin_token');

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
}
