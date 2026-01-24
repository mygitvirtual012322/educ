import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return NextResponse.json({ error: 'No DB URL' });

    const pool = new Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        try {
            // Add columns if they don't exist
            await client.query(`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS current_step VARCHAR(50);`);
            await client.query(`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';`);

            return NextResponse.json({ success: true, message: 'Migration applied: added current_step and metadata columns' });
        } finally {
            client.release();
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    } finally {
        await pool.end();
    }
}
