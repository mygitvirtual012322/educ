import { NextResponse } from 'next/server';
import { createPixTransaction } from '@/lib/vennox';
import { createOrUpdateSolicitation } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nome, cpf, email } = body;

        if (!cpf) {
            return NextResponse.json({ error: "CPF is required" }, { status: 400 });
        }

        // Generate PIX
        const transaction = await createPixTransaction({
            name: nome || "Beneficiário",
            cpf,
            email: email || "email@naoinformado.com"
        });

        if (!transaction) {
            return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
        }

        // Save transaction ID to DB (optional improvement)
        createOrUpdateSolicitation({
            cpf,
            // You might want to store the transaction ID in a 'payment_id' field or similar
            // For now we just ensure the record exists
        });

        return NextResponse.json({
            success: true,
            qr_code_base64: transaction.payment.pix.qrcode, // Base64 Image
            qr_code_text: transaction.payment.pix.qrcode_text, // Copy Paste code
            transaction_id: transaction.uuid
        });

    } catch (error) {
        console.error("Checkout API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
