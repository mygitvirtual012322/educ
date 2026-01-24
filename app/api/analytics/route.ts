import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { step, metadata } = body;

        // Track session via IP or header
        const ip = request.headers.get("x-forwarded-for") || "unknown_session";
        const sessionId = ip; // In a real app, use a cookie-based ID

        await updateSession(sessionId, step, metadata);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ error: "Failed to track" }, { status: 500 });
    }
}
