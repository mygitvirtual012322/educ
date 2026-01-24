import { NextResponse } from 'next/server';
import { createPixTransaction } from '@/lib/vennox';
import { createOrUpdateSolicitation } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nome, cpf, email, address, phone } = body;

        if (!cpf) {
            return NextResponse.json({ error: "CPF is required" }, { status: 400 });
        }

        // Generate PIX
        const result = await createPixTransaction({
            name: nome || "Beneficiário",
            cpf,
            email: email || "email@naoinformado.com",
            address,
            phone
        });

        if (!result.success || !result.data) {
            console.error("[CHECKOUT API] Transaction failed:", result.error);
            // Return 500 for credentials missing to alert monitoring, 400 for others
            const status = result.error === "Credentials missing" ? 500 : 400;
            return NextResponse.json({ error: result.error || "Failed to create transaction" }, { status: status });
        }

        const transaction = result.data;

        // Save transaction ID and PIX info to DB
        await createOrUpdateSolicitation({
            cpf,
            transaction_id: transaction.uuid,
            pix_copy_paste: transaction.payment.pix.qrcode_text
        });

        // Pushcut Notification: Pending
        try {
            const pushcutUrl = "https://api.pushcut.io/XPTr5Kloj05Rr37Saz0D1/notifications/Pendente%20delivery";
            fetch(pushcutUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "Nova Solicitação Gerada",
                    text: `Cliente: ${nome || "Cliente"} - Valor: R$ 24,90 #LOWTICKET`,
                    image: "https://educabank.com.br/logo.png" // Optional
                })
            }).catch(err => console.error("Pushcut Pending Error:", err));
        } catch (e) {
            console.error("Pushcut Logic Error:", e);
        }

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
