import { NextResponse } from 'next/server';
import { getDB, createOrUpdateSolicitation } from '@/lib/db';

export async function GET() {
    try {
        const data = getDB();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.cpf) {
            return NextResponse.json({ error: "CPF required" }, { status: 400 });
        }

        const updated = createOrUpdateSolicitation(body);
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }
}
