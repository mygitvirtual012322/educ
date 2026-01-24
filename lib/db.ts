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
                docs JSONB DEFAULT '{}'
            );
        `);

        // Create sessions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id VARCHAR(255) PRIMARY KEY,
                last_seen TIMESTAMP NOT NULL,
                current_step VARCHAR(50),
                metadata JSONB DEFAULT '{}'
            );
        `);

        console.log('[DB] Tables initialized successfully');
    } catch (error) {
        console.error('[DB] Initialization error:', error);
    } finally {
        client.release();
    }
}

// Auto-initialize on module load
initDB().catch(console.error);

export async function getAllSolicitations(): Promise<Solicitation[]> {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM solicitations ORDER BY created_at DESC');
        return result.rows.map(row => ({
            ...row,
            docs: row.docs || {}
        }));
    } catch (error) {
        console.error('[DB] Error fetching solicitations:', error);
        return [];
    } finally {
        client.release();
    }
}

export async function getSolicitation(cpf: string): Promise<Solicitation | undefined> {
    const cleanCPF = cpf.replace(/\D/g, "");
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM solicitations WHERE id = $1',
            [cleanCPF]
        );
        if (result.rows.length > 0) {
            return {
                ...result.rows[0],
                docs: result.rows[0].docs || {}
            };
        }
        return undefined;
    } catch (error) {
        console.error('[DB] Error fetching solicitation:', error);
        return undefined;
    } finally {
        client.release();
    }
}

export async function createOrUpdateSolicitation(data: Partial<Solicitation> & { cpf: string }): Promise<Solicitation | undefined> {
    const cleanCPF = data.cpf.replace(/\D/g, "");
    const now = new Date().toLocaleDateString('pt-BR');

    try {
        const client = await pool.connect();
        try {
            // Check if exists
            const existing = await getSolicitation(data.cpf);

            if (existing) {
                // Update
                const updates: string[] = [];
                const values: any[] = [];
                let paramIndex = 1;

                if (data.nome) {
                    updates.push(`nome = $${paramIndex++}`);
                    values.push(data.nome);
                }
                if (data.email) {
                    updates.push(`email = $${paramIndex++}`);
                    values.push(data.email);
                }
                if (data.nascimento) {
                    updates.push(`nascimento = $${paramIndex++}`);
                    values.push(data.nascimento);
                }
                if (data.nome_mae) {
                    updates.push(`nome_mae = $${paramIndex++}`);
                    values.push(data.nome_mae);
                }
                if (data.num_filhos !== undefined) {
                    updates.push(`num_filhos = $${paramIndex++}`);
                    values.push(data.num_filhos);
                }
                if (data.valor) {
                    updates.push(`valor = $${paramIndex++}`);
                    values.push(data.valor);
                }
                if (data.status) {
                    updates.push(`status = $${paramIndex++}`);
                    values.push(data.status);
                }
                if (data.transaction_id) {
                    updates.push(`transaction_id = $${paramIndex++}`);
                    values.push(data.transaction_id);
                }
                if (data.pix_copy_paste) {
                    updates.push(`pix_copy_paste = $${paramIndex++}`);
                    values.push(data.pix_copy_paste);
                }
                if (data.docs) {
                    // Merge docs
                    const mergedDocs = { ...existing.docs, ...data.docs };
                    updates.push(`docs = $${paramIndex++}`);
                    values.push(JSON.stringify(mergedDocs));
                }

                if (updates.length > 0) {
                    values.push(cleanCPF);
                    await client.query(
                        `UPDATE solicitations SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
                        values
                    );
                }
            } else {
                // Create
                await client.query(
                    `INSERT INTO solicitations (id, cpf, nome, email, nascimento, nome_mae, num_filhos, valor, status, created_at, docs)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                    [
                        cleanCPF,
                        data.cpf,
                        data.nome || "Beneficiário",
                        data.email || "",
                        data.nascimento || "",
                        data.nome_mae || "",
                        data.num_filhos || 1,
                        data.valor || "350,00",
                        data.status || 'pendente',
                        now,
                        JSON.stringify(data.docs || {})
                    ]
                );
            }

            return await getSolicitation(data.cpf);
        } catch (error) {
            console.error('[DB] Error creating/updating solicitation:', error);
            return undefined;
        } finally {
            client.release();
        }
    } catch (connectionError) {
        console.error('[DB] Database not available or connection error:', connectionError);
        // Important: In production, we do NOT want to return a mock object if the DB fails. 
        // We should fail explicitly so the user (and we) know something is wrong.
        return undefined;
    }
}

export async function updateSolicitationStatus(cpf: string, status: Solicitation['status']): Promise<boolean> {
    const cleanCPF = cpf.replace(/\D/g, "");
    const client = await pool.connect();
    try {
        await client.query(
            'UPDATE solicitations SET status = $1 WHERE id = $2',
            [status, cleanCPF]
        );
        return true;
    } catch (error) {
        console.error('[DB] Error updating status:', error);
        return false;
    } finally {
        client.release();
    }
}

// Session (Online Users) Tracking
export async function updateSession(sessionId: string, step?: string, metadata?: any): Promise<void> {
    const client = await pool.connect();
    try {
        let query = `
            INSERT INTO sessions (id, last_seen, current_step, metadata) 
            VALUES ($1, NOW(), $2, $3) 
            ON CONFLICT (id) 
            DO UPDATE SET last_seen = NOW()
        `;

        const params: any[] = [sessionId, step || null, metadata ? JSON.stringify(metadata) : '{}'];

        if (step) {
            query += `, current_step = $2`;
        }
        if (metadata) {
            query += `, metadata = $3`;
        }

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
