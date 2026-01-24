"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { GovHeader } from "@/components/GovHeader";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push("/admin");
            } else {
                setError("Credenciais inválidas. Tente novamente.");
            }
        } catch (err) {
            setError("Erro ao conectar. Verifique sua rede.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <GovHeader />

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-200">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gov-blue-50 text-gov-blue-600 rounded-full mb-4">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Acesso Restrito</h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Área administrativa do Governo Federal
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">
                                Usuário
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue-600 outline-none transition-all"
                                placeholder="Ex: admin"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue-600 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gov-blue-600 hover:bg-gov-blue-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                "Entrar no Painel"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">
                            Este sistema é monitorado. O acesso não autorizado é proibido.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
