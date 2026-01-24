import { NextResponse } from 'next/server';
import { updateSession, trackEvent } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { step, metadata, sessionId: bodySessionId } = body;

        // Track session via ID (preferred) or IP (fallback)
        const forwardedFor = request.headers.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(',')[0] : "unknown_ip";
        const sessionId = bodySessionId || ip;

        // Simplify Location: If metadata has city/uf, use it.
        let location = null;
        if (metadata?.city && metadata?.uf) {
            location = `${metadata.city} - ${metadata.uf}`;
        } else if (metadata?.localidade && metadata?.uf) {
            location = `${metadata.localidade} - ${metadata.uf}`;
        }

        // Update live status with IP and Location
        await updateSession(sessionId, step, metadata, ip, location || undefined);

        // Log historical event for funnel
        await trackEvent(sessionId, step, metadata);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ error: "Failed to track" }, { status: 500 });
    }
}
