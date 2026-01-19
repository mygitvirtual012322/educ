import { NextResponse } from 'next/server';

// Mock database in memory (would be a real DB in prod)
// We'll export this to use in the admin route, but in Next.js app router 
// persisting state across route invocations can be tricky in dev without a real DB.
// For this demo, we can just log or maybe use a global cache if needed, 
// but realistically we should just handle the upload and return success.

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string;
        const cpf = formData.get('cpf') as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Simulating file save logic
        // In a real app: upload to S3/Blob Storage and save URL to DB
        // const buffer = Buffer.from(await file.arrayBuffer());
        // const filename =  file.name.replaceAll(" ", "_");
        // await writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer);

        console.log(`[UPLOAD] Received ${type} for ${cpf}: ${file.name} (${file.size} bytes)`);

        return NextResponse.json({
            success: true,
            message: "File uploaded successfully",
            filename: file.name
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
