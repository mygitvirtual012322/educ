import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL;
    const isPrd = process.env.NODE_ENV === 'production';

    const debugInfo = {
        NODE_ENV: process.env.NODE_ENV,
        HAS_DB_URL: !!dbUrl,
        DB_URL_PREFIX: dbUrl ? dbUrl.substring(0, 15) + '...' : 'MISSING',
        SSL_CONFIG: isPrd ? { rejectUnauthorized: false } : 'undefined'
    };

    if (!dbUrl) {
        return NextResponse.json({ status: 'ERROR', message: 'DATABASE_URL is missing', debugInfo }, { status: 500 });
    }

    const pool = new Pool({
        connectionString: dbUrl,
        ssl: isPrd ? { rejectUnauthorized: false } : undefined,
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
            const version = await client.query('SELECT version()');

            return NextResponse.json({
                status: 'SUCCESS',
                message: 'Connected to Database',
                version: version.rows[0].version,
                tables: res.rows.map(r => r.table_name),
                debugInfo
            });
        } finally {
            client.release();
        }
    } catch (error: any) {
        return NextResponse.json({
            status: 'ERROR',
            message: 'Connection Failed',
            error: error.message,
            stack: error.stack,
            debugInfo
        }, { status: 500 });
    } finally {
        await pool.end();
    }
}
