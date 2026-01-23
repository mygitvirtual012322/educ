import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    // Determine Data Directory (Same logic as db.ts)
    const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');

    // safe join
    const filePath = path.join(DATA_DIR, ...params.path);

    // Security Check: Ensure path is within DATA_DIR to prevent directory traversal
    const relative = path.relative(DATA_DIR, filePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
        return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = mime.getType(filePath) || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    });
}
