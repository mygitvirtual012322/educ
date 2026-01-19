"use client";

import { GovHeader } from "@/components/GovHeader";
import { CheckCircle2, Copy, Calendar, Truck, AlertTriangle, ArrowRight, Lock, Info, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { PartnerCarousel } from "@/components/PartnerCarousel";

function AprovadoContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const nome = searchParams.get('nome') || "NOME DO BENEFICIÁRIO";
    const limitParam = searchParams.get('limit');

    // Generate realistic data
    const [cardNumber, setCardNumber] = useState(".... .... .... ....");
    const [limit, setLimit] = useState("0,00");

    useEffect(() => {
        // Visa-like pattern starting with 4
        const block4 = Math.floor(1000 + Math.random() * 9000);
        setCardNumber(`**** **** **** ${block4}`);

        // Set limit from params or default
        if (limitParam) {
            setLimit(limitParam.replace('.', ','));
        } else {
            setLimit("350,00");
        }
    }, [limitParam]);

    const handleCopyNumber = () => {
        navigator.clipboard.writeText(cardNumber.replace(/\\s/g, ''));
        alert("Número copiado!");
    };

    const handleContinue = () => {
        const params = new URLSearchParams(searchParams.toString());
        router.push(`/entrega?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 collection-page-container">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
                
                .card-font {
                    font-family: 'Share Tech Mono', monospace;
                }

                /* Premium Silver Foil Effect */
                .premium-silver {
                    background: linear-gradient(
                        to bottom,
                        #ffffff 0%,
                        #f0f0f0 40%,
                        #a0a0a0 50%, 
                        #e0e0e0 60%,
                        #ffffff 100%
                    );
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    color: transparent;
                    filter: drop-shadow(1px 2px 0px rgba(0,0,0,0.6));
                }
            `}</style>

            <GovHeader />

            <main className="container-centered py-10 pb-24">
                <div className="max-w-4xl mx-auto">

                    {/* PAGE HEADER */}
                    <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-sm mb-6 uppercase tracking-wider shadow-sm border border-green-200">
                            <CheckCircle2 className="h-4 w-4" />
                            Aprovação Concluída
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                            Benefício Liberado com Sucesso!
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-2">
                            O sistema aprovou sua solicitação. Seu cartão já foi emitido e está pronto para entrega.
                        </p>
                        <p className="text-sm text-slate-500 flex items-center justify-center gap-1">
                            <Info className="h-4 w-4" /> Uma notificação oficial foi enviada para o seu e-mail.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8 items-start">

                        {/* LEFT COLUMN: THE CARD */}
                        <div className="md:col-span-12 lg:col-span-5 relative group perspective-1000">
                            <div className="relative w-full aspect-[1.586] rounded-2xl shadow-2xl transition-transform duration-500 transform group-hover:scale-[1.02] bg-slate-900 overflow-hidden ring-1 ring-white/10">
                                {/* Background */}
                                <Image
                                    src="/card-mockup-clean.png"
                                    alt="Cartão Futuro Escolar"
                                    fill
                                    className="object-cover"
                                    priority
                                    style={{ filter: 'contrast(1.15) saturate(1.1)' }}
                                />

                                {/* CARD INFO LAYOUT */}
                                <div className="absolute inset-0 z-20 select-none">
                                    {/* Number */}
                                    <div className="absolute top-[64%] left-[10%] w-full">
                                        <div className="text-[20px] md:text-[23px] card-font premium-silver tracking-[0.16em] leading-none">
                                            {cardNumber}
                                        </div>
                                    </div>

                                    {/* Name & Validity */}
                                    <div className="absolute bottom-[10%] left-[8%] right-[22%] flex justify-between items-end">
                                        <div className="text-[12px] md:text-[13px] uppercase card-font premium-silver tracking-[0.15em] opacity-90 truncate max-w-[60%]">
                                            {nome.toUpperCase()}
                                        </div>

                                        <div className="flex items-center gap-2 opacity-90">
                                            <div className="text-[5px] text-white/80 uppercase font-bold leading-tight text-right">
                                                Valid<br />Thru
                                            </div>
                                            <div className="text-[12px] card-font premium-silver tracking-widest">
                                                12/30
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Glare Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 opacity-40 pointer-events-none mix-blend-overlay z-30"></div>
                            </div>

                            <div className="text-center mt-4 bg-yellow-50 border border-yellow-100 p-3 rounded-lg">
                                <p className="text-xs text-yellow-800 font-bold flex items-center justify-center gap-1 mb-1">
                                    <Lock className="h-3 w-3" /> Cartão Virtual via App
                                </p>
                                <p className="text-[10px] text-yellow-700 opacity-80">
                                    Aguarde 3 horas para a liberação dos dados completos do cartão virtual no aplicativo.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: DETAILS */}
                        <div className="md:col-span-12 lg:col-span-7 space-y-6">

                            {/* Limit Box */}
                            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Valor Liberado</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-slate-700">R$</span>
                                    <span className="text-5xl font-extrabold text-gov-green-600 tracking-tight">{limit}</span>
                                </div>
                                <div className="mt-4 flex gap-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        <CheckCircle2 className="h-4 w-4 text-gov-green-600" />
                                        <span>Status: <strong>Aprovado</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Retroactive Analysis Warning */}
                            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100 flex gap-4 items-start">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-yellow-800">
                                    <p className="font-bold mb-1">Termo de Ciência</p>
                                    <p className="opacity-90 leading-relaxed">
                                        A conferência detalhada dos documentos ocorrerá posteriormente. Caso sejam encontradas inconsistências ou irregularidades nos dados, <strong>o benefício será cancelado automaticamente</strong> e o cartão bloqueado.
                                    </p>
                                </div>
                            </div>

                            {/* Shipping/Action Info */}
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-white p-2 rounded-lg text-gov-blue-600 shadow-sm">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg">Solicitar Envio do Cartão</h3>
                                </div>
                                <p className="text-slate-600 text-sm mb-4">
                                    Seu cartão físico já está separado na central de distribuição. Confirme o envio para recebê-lo em casa.
                                </p>

                                <button
                                    onClick={handleContinue}
                                    className="w-full bg-gov-green-600 hover:bg-gov-green-700 text-white text-lg font-bold py-5 rounded-xl shadow-lg shadow-green-900/10 transition-all transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-2"
                                >
                                    Confirmar Entrega
                                    <ArrowRight className="h-6 w-6" />
                                </button>

                                <p className="text-center text-xs text-slate-400 mt-3">
                                    Pagamento de taxa única de envio necessário na próxima etapa.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* PARTNERS SECTION */}
                    <div className="mt-16 border-t border-slate-200 pt-10 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <div className="text-center mb-6 max-w-2xl mx-auto">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Ampla Rede Credenciada</h3>
                            <p className="text-slate-500 text-sm">
                                Estas são apenas algumas das principais redes parceiras. O Cartão Futuro Escolar é aceito em mais de <strong>12.000 papelarias e livrarias</strong> em todo o Brasil.
                            </p>
                        </div>
                        <PartnerCarousel title="" className="opacity-80" />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default function AprovadoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-gov-blue-600 animate-spin" />
            </div>
        }>
            <AprovadoContent />
        </Suspense>
    );
}
