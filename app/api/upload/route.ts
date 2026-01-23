import { NextResponse } from 'next/server';
import { createOrUpdateSolicitation } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string;
        const cpf = formData.get('cpf') as string;

        if (!file || !cpf || !type) {
            return NextResponse.json({ error: "Missing file, cpf or type" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Create safe filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${cpf}_${type}_${Date.now()}_${safeName}`;

        // Ensure directory exists
        const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
        const uploadDir = path.join(DATA_DIR, "uploads");

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore if exists
        }

        // Write file
        await writeFile(path.join(uploadDir, filename), buffer);
        console.log(`[UPLOAD] Saved ${filename} to ${uploadDir}`);

        // Update DB with the file name (URL path via Dynamic Route)
        await createOrUpdateSolicitation({
            cpf,
            docs: {
                [type]: `/api/file/uploads/${filename}` // Use dynamic route to serve
            }
        });

        return NextResponse.json({
            success: true,
            message: "File uploaded successfully",
            filename: filename
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
