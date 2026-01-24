import { NextResponse } from 'next/server';
import { getAllSolicitations, createOrUpdateSolicitation, updateSession, getOnlineUsersCount, getAnalyticsStats, getActiveSessions } from '@/lib/db';

export async function GET(request: Request) {
    try {
        // Track session (IP or simplified ID)
        // const ip = request.headers.get("x-forwarded-for") || "unknown_session";
        // await updateSession(ip, 'admin_panel', { action: 'view_dashboard' });

        const solicitations = await getAllSolicitations();
        const onlineUsers = await getOnlineUsersCount();
        const analytics = await getAnalyticsStats();
        const activeSessions = await getActiveSessions();

        return NextResponse.json({
            solicitations,
            onlineUsers,
            analytics,
            activeSessions
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
    export async function DELETE(request: Request) {
        try {
            const { searchParams } = new URL(request.url);
            const cpf = searchParams.get('cpf');

            if (!cpf) {
                return NextResponse.json({ error: "CPF/ID required" }, { status: 400 });
            }

            const success = await import('@/lib/db').then(mod => mod.deleteSolicitation(cpf));

            if (success) {
                return NextResponse.json({ success: true });
            } else {
                return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
            }
        } catch (error) {
            return NextResponse.json({ error: "Internal Error" }, { status: 500 });
        }
    }
