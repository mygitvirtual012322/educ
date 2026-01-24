import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Simple hardcoded credentials (can be moved to env vars later)
        // User requested "proteja com senha, tudo certinho"
        const validUser = process.env.ADMIN_USER || 'admin';
        const validPass = process.env.ADMIN_PASS || 'admin123';

        if (username === validUser && password === validPass) {
            // Set cookie
            (await cookies()).set('admin_token', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
