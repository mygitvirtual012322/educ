import { NextResponse } from 'next/server';
import { updateSession, trackEvent } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { step, metadata, sessionId: bodySessionId } = body;

        // Track session via ID (preferred) or IP (fallback)
        const ip = request.headers.get("x-forwarded-for") || "unknown_session";
        const sessionId = bodySessionId || ip;

        // Update live status
        await updateSession(sessionId, step, metadata);

        // Log historical event for funnel
        await trackEvent(sessionId, step, metadata);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ error: "Failed to track" }, { status: 500 });
    }
}
