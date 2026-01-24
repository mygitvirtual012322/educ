import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Fetch from the public education API (HTTP)
        // Using server-side fetch to avoid Mixed Content errors on frontend
        const res = await fetch(`http://educacao.dadosabertosbr.org/api/escolas/busca/avancada?nome=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(5000) // 5s timeout
        });

        if (!res.ok) {
            throw new Error(`External API error: ${res.status}`);
        }

        const data = await res.json();

        // The API returns an array of schools or sometimes slightly different structure
        // Usually: [ [ID, "NAME", ...], ... ]
        // Let's parse it safely.

        // Example check: is it an array?
        if (Array.isArray(data) && Array.isArray(data[1])) {
            // Some formats are [count, [schools...]]
            // The format seems to be: [ count, [ { "id": 123, "nome": "ESCOLA..." } ... ] ] ? 
            // Or actually [ count, [ [ID, "NAME", STATE, CITY, ...], ... ] ]

            // Based on common usage of this API:
            // It returns a list of objects or arrays.
            // We will map whatever we get to a simple string list for now.

            const schoolsList = data[1];
            if (Array.isArray(schoolsList)) {
                const results = schoolsList.map((item: any) => {
                    // If item is object with nome
                    if (item.nome) return item.nome;
                    // If item is array, index 1 is usually name
                    if (Array.isArray(item) && item[1]) return item[1];
                    return null;
                }).filter(Boolean);

                return NextResponse.json({ results });
            }
        }

        return NextResponse.json({ results: [] });

    } catch (error) {
        console.error("School search error:", error);
        // Fallback or empty
        return NextResponse.json({ results: [] });
    }
}
