import QRCode from 'qrcode';

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
    email: string,
    phone?: string,
    address?: {
        street: string,
        number: string,
        neighborhood: string,
        city: string,
        state: string,
        zipCode: string
    }
}): Promise<{ success: boolean, data?: VennoxPaymentResponse, error?: string }> {

    const SECRET_KEY = process.env.VENNOX_API_KEY;
    const COMPANY_ID = process.env.VENNOX_COMPANY_ID;

    if (!SECRET_KEY || !COMPANY_ID) {
        console.error("VennoxPay credentials not configured");
        return { success: false, error: "Credentials missing" };
    }

    // Auth Header construction (Basic Auth)
    // DEBUG: Print first few chars of API Key to verify it's loaded
    console.log(`[VENNOX] Init transaction. Key loaded: ${SECRET_KEY?.substring(0, 8)}..., Company: ${COMPANY_ID}`);

    const credentials = Buffer.from(`${SECRET_KEY}:${COMPANY_ID}`).toString("base64");

    const userPhone = data.phone || "11999999999"; // Fallback if missing
    const userAddress = data.address || {
        street: "Rua Exemplo",
        number: "123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "01001000"
    };

    const payload = {
        customer: {
            name: data.name,
            email: data.email,
            phone: userPhone,
            document: {
                number: data.cpf.replace(/\D/g, ""),
                type: "CPF"
            },
            address: {
                street: userAddress.street,
                streetNumber: userAddress.number,
                zipCode: userAddress.zipCode.replace(/\D/g, ""),
                neighborhood: userAddress.neighborhood,
                city: userAddress.city,
                state: userAddress.state,
                country: "BR"
            }
        },
        paymentMethod: "PIX",
        amount: 2490, // R$ 24,90 in cents
        items: [
            {
                title: "TAXA EMITIR",
                unitPrice: 2490,
                quantity: 1,
                tangible: false
            }
        ],
        shipping: {
            street: userAddress.street,
            streetNumber: userAddress.number,
            zipCode: userAddress.zipCode.replace(/\D/g, ""),
            neighborhood: userAddress.neighborhood,
            city: userAddress.city,
            state: userAddress.state,
            country: "BR"
        },
        description: "TAXA EMITIR"
    };

    console.log("Vennox Payload:", JSON.stringify(payload));

    try {
        const response = await fetch("https://api.vennoxpay.com.br/functions/v1/transactions", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok || result.status === 'refused') {
            const errorMsg = result.refusedReason?.description || result.message || "Transaction Refused";
            console.error("VennoxPay Error:", result);
            return { success: false, error: errorMsg };
        }

        console.log("VENNOX SUCCESS RESPONSE:", JSON.stringify(result, null, 2));

        // Check if environment is sandbox/test from response
        if (result.environment === 'sandbox' || result.mode === 'test') {
            console.warn("[VENNOX] WARNING: Transaction created in SANDBOX/TEST mode.");
        }

        // Generate QR Code Image from EMV string
        const emvCode = result.pix?.qrcode || "";
        const qrCodeImage = emvCode ? await QRCode.toDataURL(emvCode) : "";

        // Map API response to internal interface
        const paymentData: VennoxPaymentResponse = {
            uuid: result.id,
            description: result.description || "TAXA EMITIR",
            amount: result.amount,
            payment: {
                pix: {
                    qrcode: qrCodeImage.split(',')[1],
                    qrcode_text: emvCode
                }
            },
            created_at: result.createdAt
        };

        return { success: true, data: paymentData };

    } catch (error) {
        console.error("VennoxPay Exception:", error);
        return { success: false, error: "Connection Error" };
    }
}
