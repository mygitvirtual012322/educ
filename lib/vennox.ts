export interface VennoxPaymentResponse {
    uuid: string;
    description: string;
    amount: number;
    payment: {
        pix: {
            qrcode: string;
            qrcode_text: string;
        };
    };
    created_at: string;
}

export async function createPixTransaction(data: {
    name: string,
    cpf: string,
    email: string
}): Promise<VennoxPaymentResponse | null> {

    const SECRET_KEY = process.env.VENNOX_API_KEY;
    const COMPANY_ID = process.env.VENNOX_COMPANY_ID;

    if (!SECRET_KEY || !COMPANY_ID) {
        console.error("VennoxPay credentials not configured");
        return null;
    }

    // Auth Header construction (Basic Auth)
    const credentials = Buffer.from(`${SECRET_KEY}:${COMPANY_ID}`).toString("base64");

    const payload = {
        name: data.name,
        tax_id: data.cpf.replace(/\D/g, ""), // CPF numbers only
        email: data.email,
        amount: 2490, // R$ 24,90 in cents
        payment_method: "pix",
        description: "TAXA EMITIR"
    };

    try {
        const response = await fetch("https://api.vennoxpay.com.br/functions/v1/transactions", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("VennoxPay Error:", response.status, errorText);
            return null;
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("VennoxPay Exception:", error);
        return null;
    }
}
