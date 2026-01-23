import { NextResponse } from 'next/server';

export async function GET() {
    const vars = {
        NODE_ENV: process.env.NODE_ENV,
        VENNOX_API_KEY_EXISTS: !!process.env.VENNOX_API_KEY,
        VENNOX_API_KEY_PREFIX: process.env.VENNOX_API_KEY ? process.env.VENNOX_API_KEY.substring(0, 5) + '...' : 'MISSING',
        VENNOX_COMPANY_ID_EXISTS: !!process.env.VENNOX_COMPANY_ID,
        VENNOX_COMPANY_ID: process.env.VENNOX_COMPANY_ID,
        ALL_KEYS: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')) // Show safe keys only
    };

    return NextResponse.json(vars);
}
