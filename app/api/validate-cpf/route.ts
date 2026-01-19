import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const cpf = searchParams.get("cpf");

    if (!cpf) {
        return NextResponse.json({ error: "CPF obrigatório" }, { status: 400 });
    }

    // Remove non-digits
    const cleanCpf = cpf.replace(/\D/g, "");

    if (cleanCpf.length !== 11) {
        return NextResponse.json({ error: "CPF inválido" }, { status: 400 });
    }

    try {
        const externalApiUrl = `https://cartaoaprovacredito.com/api/getCpf.php?cpf=${cleanCpf}`;

        // User-Agent is crucial to bypass the desktop check redirection
        const response = await fetch(externalApiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching CPF data:", error);
        return NextResponse.json(
            { error: "Erro ao consultar dados", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
