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

            // Create Events Table for robust funnel tracking
            await client.query(`
                CREATE TABLE IF NOT EXISTS analytics_events (
                    id SERIAL PRIMARY KEY,
                    session_id VARCHAR(255) NOT NULL,
                    step VARCHAR(50) NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW(),
                    metadata JSONB DEFAULT '{}'
                );
            `);

            return NextResponse.json({ success: true, message: 'Migration applied: added columns and analytics_events table' });
        } finally {
            client.release();
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    } finally {
        await pool.end();
    }
}
