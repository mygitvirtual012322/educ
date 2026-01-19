"use client";

import { GovHeader } from "@/components/GovHeader";
import { Search, Filter, Download, Eye, MoreHorizontal, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useState } from "react";

export default function AdminPage() {
    // Mock Data simulating DB records
    const [solicitacoes, setSolicitacoes] = useState([
        { id: 1, nome: "JOÃO SILVA SANTOS", cpf: "123.***.***-00", data: "19/01/2026", status: "analise", docs: 3, valor: "700,00" },
        { id: 2, nome: "MARIA OLIVEIRA", cpf: "456.***.***-11", data: "19/01/2026", status: "aprovado", docs: 4, valor: "350,00" },
        { id: 3, nome: "PEDRO ALVES", cpf: "789.***.***-22", data: "18/01/2026", status: "pendente", docs: 1, valor: "1.050,00" },
        { id: 4, nome: "ANA COSTA", cpf: "321.***.***-33", data: "18/01/2026", status: "rejeitado", docs: 2, valor: "350,00" },
    ]);

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
                        <h1 className="font-bold text-lg text-slate-800">Admin Panel</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-700">Admin User</p>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                        <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">Solicitações Recentes</h2>
                        <p className="text-slate-500 text-sm">Gerencie os pedidos de cartão e documentação.</p>
                    </div>
                    <button className="bg-gov-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gov-blue-700 transition-colors">
                        <Download className="h-4 w-4" />
                        Exportar CSV
                    </button>
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
                            {solicitacoes.map((sol) => (
                                <tr key={sol.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800 text-sm">{sol.nome}</p>
                                        <p className="text-xs text-slate-500">Protocolo: #{2026000 + sol.id}</p>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 font-mono">{sol.cpf}</td>
                                    <td className="p-4 text-sm text-slate-600">{sol.data}</td>
                                    <td className="p-4 text-sm font-bold text-green-700">R$ {sol.valor}</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                                            {sol.docs}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(sol.status)}`}>
                                            {sol.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-gov-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4 text-sm text-slate-500">
                    <p>Mostrando 4 de 128 registros</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50">Anterior</button>
                        <button className="px-3 py-1 bg-gov-blue-600 text-white rounded font-bold">1</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white">2</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white">3</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white">Próximo</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
