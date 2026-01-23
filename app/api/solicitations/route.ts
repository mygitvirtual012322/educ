import { NextResponse } from 'next/server';
import { getAllSolicitations, createOrUpdateSolicitation, updateSession, getOnlineUsersCount } from '@/lib/db';

export async function GET(request: Request) {
    try {
        // Track session (IP or simplified ID)
        const ip = request.headers.get("x-forwarded-for") || "unknown_session";
        // Create a simpler transient ID if IP is not available or reliable in local
        const sessionId = ip === "unknown_session" ? "local_user_" + Date.now() : ip;
        // In reality, each browser refresh might generate a new date if we stick to date.now, 
        // but for local dev with single user it works to trigger 'active'.
        // Better: just use "admin_viewer" or similar if we want to just track "is someone looking".
        // BUT user wanted "Real". 
        // Let's use IP. If local, it's ::1.
        await updateSession(ip);

        const solicitations = await getAllSolicitations();
        const onlineUsers = await getOnlineUsersCount();

        return NextResponse.json({
            solicitations,
            onlineUsers
        });
    } catch (error) {
        console.error("API GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.cpf) {
            return NextResponse.json({ error: "CPF required" }, { status: 400 });
        }

        const updated = await createOrUpdateSolicitation(body);
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }
}
