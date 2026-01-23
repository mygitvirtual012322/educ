"use client";

import { GovHeader } from "@/components/GovHeader";
import { Search, Filter, Download, Eye, MoreHorizontal, CheckCircle2, Clock, XCircle, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { Solicitation } from "@/lib/db";

export default function AdminPage() {
    const [solicitacoes, setSolicitacoes] = useState<Solicitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitation | null>(null);
    const [onlineUsers, setOnlineUsers] = useState(0);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/solicitations');
            const data = await res.json();

            if (data.solicitations && Array.isArray(data.solicitations)) {
                setSolicitacoes(data.solicitations.reverse());
                setOnlineUsers(data.onlineUsers || 0);
            } else if (Array.isArray(data)) {
                // Fallback for old API response structure if not yet updated
                setSolicitacoes(data.reverse());
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll every 5 seconds for updates
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (cpf: string, newStatus: string) => {
        // Optimistic update
        setSolicitacoes(prev => prev.map(s => s.cpf === cpf ? { ...s, status: newStatus as any } : s));
        if (selectedSolicitacao && selectedSolicitacao.cpf === cpf) {
            setSelectedSolicitacao({ ...selectedSolicitacao, status: newStatus as any });
        }

        try {
            await fetch('/api/solicitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, status: newStatus })
            });
            fetchData(); // Refresh to ensure sync
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aprovado': return 'bg-green-100 text-green-700';
            case 'analise': return 'bg-blue-100 text-blue-700';
            case 'rejeitado': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gov-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                        <h1 className="font-bold text-lg text-slate-800">Painel Administrativo</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-bold text-green-700">{onlineUsers} usuários online</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-700">Admin User</p>
                                <p className="text-xs text-slate-500">Super Admin</p>
                            </div>
                            <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">AD</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">Solicitações Recentes</h2>
                        <p className="text-slate-500 text-sm">Gerencie os pedidos de cartão e documentação.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchData} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
                            <RotateCcw className="h-4 w-4" />
                            Atualizar
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                            placeholder="Buscar por nome, CPF ou protocolo..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gov-blue-500 outline-none"
                        />
                    </div>
                    <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50 font-medium">
                        <Filter className="h-4 w-4" />
                        Filtros
                    </button>
                    <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50 font-medium">
                        Status: Todos
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                <th className="p-4">Beneficiário</th>
                                <th className="p-4">CPF Resp.</th>
                                <th className="p-4">Data</th>
                                <th className="p-4">Valor</th>
                                <th className="p-4 text-center">Docs</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading && solicitacoes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        Carregando dados...
                                    </td>
                                </tr>
                            ) : solicitacoes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        Nenhuma solicitação encontrada.
                                    </td>
                                </tr>
                            ) : (
                                solicitacoes.map((sol) => (
                                    <tr
                                        key={sol.cpf}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedSolicitacao(sol)}
                                    >
                                        <td className="p-4">
                                            <p className="font-bold text-slate-800 text-sm uppercase">{sol.nome}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{sol.email}</p>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 font-mono">{sol.cpf}</td>
                                        <td className="p-4 text-sm text-slate-600">{sol.created_at}</td>
                                        <td className="p-4 text-sm font-bold text-green-700">R$ {sol.valor || '0,00'}</td>
                                        <td className="p-4 text-center">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                                                {Object.keys(sol.docs || {}).length}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(sol.status)}`}>
                                                {sol.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-slate-400 hover:text-gov-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors font-bold text-xs border border-slate-200">
                                                Ver Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Detail Modal */}
                {selectedSolicitacao && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Detalhes da Solicitação</h3>
                                    <p className="text-sm text-slate-500">CPF: {selectedSolicitacao.cpf}</p>
                                </div>
                                <button onClick={() => setSelectedSolicitacao(null)} className="text-slate-400 hover:text-slate-600">
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Status & Actions */}
                                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Status Atual</p>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${getStatusColor(selectedSolicitacao.status)}`}>
                                            {selectedSolicitacao.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedSolicitacao.cpf, 'rejeitado')}
                                            className="px-4 py-2 rounded-lg border border-red-200 text-red-700 font-bold text-sm hover:bg-red-50"
                                        >
                                            Rejeitar
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedSolicitacao.cpf, 'aprovado')}
                                            className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 shadow-md shadow-green-200"
                                        >
                                            Aprovar Solicitação
                                        </button>
                                    </div>
                                </div>

                                {/* Personal Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Nome Completo</p>
                                        <p className="font-medium">{selectedSolicitacao.nome}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Email</p>
                                        <p className="font-medium">{selectedSolicitacao.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Nome da Mãe</p>
                                        <p className="font-medium">{selectedSolicitacao.nome_mae || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Data Nascimento</p>
                                        <p className="font-medium">{selectedSolicitacao.nascimento || '-'}</p>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 my-2"></div>

                                {/* Payment Info */}
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                                        Informações de Pagamento (PIX)
                                    </h4>
                                    {selectedSolicitacao.pix_copy_paste ? (
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-2">Código Copia e Cola (Gerado)</p>
                                            <textarea
                                                readOnly
                                                className="w-full text-xs font-mono text-slate-600 bg-white p-3 rounded-lg border border-slate-200 h-24 resize-none mb-2 focus:outline-none"
                                                value={selectedSolicitacao.pix_copy_paste}
                                            />
                                            <button
                                                onClick={() => navigator.clipboard.writeText(selectedSolicitacao.pix_copy_paste || "")}
                                                className="text-xs font-bold text-gov-blue-600 hover:text-gov-blue-700 flex items-center gap-1"
                                            >
                                                <CheckCircle2 className="h-3 w-3" />
                                                Copiar Código
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">Nenhum pagamento PIX gerado ainda.</p>
                                    )}
                                </div>

                                <div className="h-px bg-slate-100 my-2"></div>

                                {/* Documents */}
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                        Documentos Anexados
                                    </h4>
                                    {Object.keys(selectedSolicitacao.docs || {}).length > 0 ? (
                                        <div className="space-y-2">
                                            {Object.entries(selectedSolicitacao.docs || {}).map(([key, val]) => {
                                                const fileUrl = val as string;
                                                return (
                                                    <a
                                                        key={key}
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-gov-blue-500 hover:shadow-md transition-all cursor-pointer group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-gov-blue-600 group-hover:text-white transition-colors">
                                                                <Eye className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700 capitalize group-hover:text-gov-blue-700">{key.replace(/_/g, " ")}</p>
                                                                <p className="text-xs text-slate-400 truncate max-w-[200px]">Ver documento</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-bold group-hover:bg-green-100">Abrir</span>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">Nenhum documento enviado ainda.</p>
                                    )}
                                </div>

                            </div>

                            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
                                ID da Transação: {selectedSolicitacao.transaction_id || 'N/A'}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
