import { NextResponse } from 'next/server';
import { updateSolicitationStatus, getSolicitation } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("[WEBHOOK] Venoxx Received:", JSON.stringify(body));

        // Adjust based on Venoxx actual payload documentation/inspection
        // Usually contains status: 'paid' or 'approved' and transaction info
        const { status, referenceId, paymentId } = body;

        // Check if status indicates success
        // Venoxx often uses 'paid' or 'approved'
        if (status === 'paid' || status === 'approved' || body.status === 'succeeded') {

            // We need to find the CPF associated with this transaction if not provided directly
            // For now, assuming we might need to look it up or usage of custom fields if implemented
            // Ideally Venoxx sends back the 'customer' object with document

            let cpf = body.customer?.document?.number || body.customer?.document;
            let name = body.customer?.name || "Cliente";

            // If we don't have CPF in payload, we might need to search DB by transaction_id (uuid)
            // Implementation of `updateSolicitationStatus` expects CPF.
            // Let's assume for this MVP that the payload has the document or we can add a lookup function later.

            if (cpf) {
                await updateSolicitationStatus(cpf, 'aprovado');
                console.log(`[WEBHOOK] Updated status for CPF ${cpf} to APPROVED`);

                // Pushcut Notification: Approved
                try {
                    const pushcutUrl = "https://api.pushcut.io/XPTr5Kloj05Rr37Saz0D1/notifications/Aprovado%20delivery";
                    fetch(pushcutUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            title: "Pagamento Aprovado! 🤑",
                            text: `Cliente: ${name} - R$ 24,90 #LOWTICKET`,
                            input: `CPF: ${cpf}`
                        })
                    }).catch(err => console.error("Pushcut Approved Error:", err));
                } catch (e) {
                    console.error("Pushcut Logic Error:", e);
                }
            } else {
                console.warn("[WEBHOOK] CPF not found in payload", body);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
