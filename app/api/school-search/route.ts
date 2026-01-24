import { NextResponse } from 'next/server';

// Fallback list to ensure robustness if external API fails
const FALLBACK_SCHOOLS = [
    "ESCOLA MUNICIPAL PROFESSOR PAULO FREIRE",
    "CIEP 123 BRIZOLÃO",
    "ESCOLA ESTADUAL CECÍLIA MEIRELES",
    "COLÉGIO PEDRO II",
    "ESCOLA MUNICIPAL DARCY RIBEIRO",
    "ESCOLA MUNICIPAL DE ENSINO FUNDAMENTAL TIRADENTES",
    "ESCOLA ESTADUAL PRESIDENTE VARGAS",
    "ESCOLA MUNICIPAL ANÍSIO TEIXEIRA",
    "ESCOLA ESTADUAL DOUTOR ULYSSES GUIMARÃES",
    "ESCOLA MUNICIPAL CORA CORALINA",
    "ESCOLA ESTADUAL RUI BARBOSA",
    "ESCOLA MUNICIPAL MONTEIRO LOBATO",
    "ESCOLA ESTADUAL ALBERT EINSTEIN",
    "ESCOLA MUNICIPAL DOM PEDRO I",
    "ESCOLA ESTADUAL JOÃO XXIII"
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Fetch from the public education API (HTTP) with a shorter timeout to fallback quickly
        const res = await fetch(`http://educacao.dadosabertosbr.org/api/escolas/busca/avancada?nome=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(3000) // 3s timeout to not keep user waiting too long
        });

        if (!res.ok) {
            throw new Error(`External API error: ${res.status}`);
        }

        const data = await res.json();
        const schoolsList = data[1];

        if (Array.isArray(schoolsList)) {
            const results = schoolsList.map((item: any) => {
                if (item.nome) return item.nome;
                if (Array.isArray(item) && item[1]) return item[1];
                return null;
            }).filter(Boolean);

            // If valid results, return them
            if (results.length > 0) {
                return NextResponse.json({ results });
            }
        }

        // If API returned empty, try fallback
        throw new Error("Empty API results, trying fallback");

    } catch (error) {
        console.warn("School search API failed or empty, using fallback:", error);

        // Filter fallback list
        const results = FALLBACK_SCHOOLS.filter(s =>
            s.toLowerCase().includes(query.toLowerCase())
        );

        return NextResponse.json({ results });
    }
}
