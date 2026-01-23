import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Protect /admin routes
    // Protect /admin routes
    // TEMPORARY DEBUG: Disabled Auth to verify route access
    /*
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const basicAuth = request.headers.get('authorization')

        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1]
            const [user, pwd] = atob(authValue).split(':')

            // TODO: Move to Environment Variables for real production
            const validUser = process.env.ADMIN_USER || 'admin'
            const validPass = process.env.ADMIN_PASS || 'admin123'

            if (user === validUser && pwd === validPass) {
                return NextResponse.next()
            }
        }

        return new NextResponse('Authentication Required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
            },
        })
    }
    */

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
