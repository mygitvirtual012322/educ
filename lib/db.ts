import fs from 'fs';
import path from 'path';

// Database Schema
export interface Solicitation {
    id: string; // Using CPF as ID since it's unique per user context for this app
    cpf: string;
    nome: string;
    email: string;
    nascimento: string;
    nome_mae: string;
    num_filhos: number;
    valor: string;
    status: 'pendente' | 'analise' | 'aprovado' | 'rejeitado';
    created_at: string;
    docs: {
        rg?: string;
        comprovante?: string;
        [key: string]: string | undefined;
    };
}

const DB_PATH = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_PATH, 'db.json');

// Ensure DB exists
function initDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.mkdirSync(DB_PATH, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([]), 'utf-8');
    }
}

export function getDB(): Solicitation[] {
    initDB();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export function saveDB(data: Solicitation[]) {
    initDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getSolicitation(cpf: string): Solicitation | undefined {
    // Only numbers
    const cleanCPF = cpf.replace(/\D/g, "");
    return getDB().find(s => s.cpf.replace(/\D/g, "") === cleanCPF);
}

export function createOrUpdateSolicitation(data: Partial<Solicitation> & { cpf: string }) {
    const db = getDB();
    const cleanCPF = data.cpf.replace(/\D/g, "");
    const index = db.findIndex(s => s.cpf.replace(/\D/g, "") === cleanCPF);

    // Formatting date
    const now = new Date().toLocaleDateString('pt-BR');

    if (index >= 0) {
        // Update
        const existing = db[index];
        db[index] = {
            ...existing,
            ...data,
            docs: { ...existing.docs, ...(data.docs || {}) }
        };
    } else {
        // Create
        const newItem: Solicitation = {
            id: cleanCPF,
            cpf: data.cpf,
            nome: data.nome || "Beneficiário",
            email: data.email || "",
            nascimento: data.nascimento || "",
            nome_mae: data.nome_mae || "",
            num_filhos: data.num_filhos || 1,
            valor: data.valor || "350,00",
            status: data.status || 'pendente',
            created_at: now,
            docs: data.docs || {}
        };
        db.push(newItem);
    }

    saveDB(db);
    return getSolicitation(data.cpf);
}

export function updateSolicitationStatus(cpf: string, status: Solicitation['status']) {
    const db = getDB();
    const cleanCPF = cpf.replace(/\D/g, "");
    const index = db.findIndex(s => s.cpf.replace(/\D/g, "") === cleanCPF);

    if (index >= 0) {
        db[index].status = status;
        saveDB(db);
        return true;
    }
    return false;
}
