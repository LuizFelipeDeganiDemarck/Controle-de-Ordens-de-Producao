import { useEffect, useState } from "react";
import { api } from "../api/api";

interface DashboardData {
    totalOrders: number;
    openOrders: number;
    finishedOrders: number;
    inProgressOrders: number;
    totalGood: number;
    totalScrap: number;
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData>({
        totalOrders: 0,
        openOrders: 0,
        finishedOrders: 0,
        inProgressOrders: 0,
        totalGood: 0,
        totalScrap: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/dashboard/production")
            .then((res) => {
                const d = res.data;

                setData({
                    totalOrders: Number(d.totalOrders || 0),
                    openOrders: Number(d.openOrders || 0),
                    finishedOrders: Number(d.finishedOrders || 0),
                    inProgressOrders: Number(d.inProgressOrders || 0),
                    totalGood: Number(d.totalGood || 0),
                    totalScrap: Number(d.totalScrap || 0),
                });
                setLoading(false);

            })
            .catch((err) => {
                console.error("Erro ao carregar dashboard:", err);
                setLoading(false);

            })
    }, []);

    if (loading) {
        return <div className="p-4">Carregando dashboard...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-200 pb-4">
                    Visão Geral das Ordens
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-400 group-hover:bg-slate-500 transition-colors"></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total de Ordens</p>
                        <p className="text-4xl font-black text-slate-800">{data.totalOrders}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-400 group-hover:bg-blue-500 transition-colors"></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Abertas</p>
                        <p className="text-4xl font-black text-blue-600">{data.openOrders}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400 group-hover:bg-amber-500 transition-colors"></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Em Andamento</p>
                        <p className="text-4xl font-black text-amber-500">{data.inProgressOrders}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400 group-hover:bg-emerald-500 transition-colors"></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Finalizadas</p>
                        <p className="text-4xl font-black text-emerald-600">{data.finishedOrders}</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-200 pb-4 mt-12">
                    Desempenho de Produção
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400 group-hover:bg-emerald-500 transition-colors"></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Quantidade Produzida</p>
                        <p className="text-5xl font-black text-emerald-600">{data.totalGood}</p>
                        <p className="text-sm font-medium text-emerald-600/80 mt-2 bg-emerald-50 inline-block px-3 py-1 rounded-full">Prontas para envio</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-400 group-hover:bg-rose-500 transition-colors"></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Quantidade Refugada</p>
                        <p className="text-5xl font-black text-rose-600">{data.totalScrap}</p>
                        <p className="text-sm font-medium text-rose-600/80 mt-2 bg-rose-50 inline-block px-3 py-1 rounded-full">Perda total</p>
                    </div>
                </div>
            </div>
        </div>
    );
}