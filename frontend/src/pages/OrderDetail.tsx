import { useEffect, useState } from 'react';
import { api } from '../api/api';
import type { Order } from '../types';
import { useParams } from 'react-router-dom';
import RecordForm from '../components/RecordForm';
import StatusBadge from '../components/StatusBadge';

export default function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    function load() {
        setLoading(true);
        api.get<Order>(`/orders/${id}`)
            .then((res) => setOrder(res.data))
            .catch(() => setError('Nao foi possivel carregar os detalhes da ordem.'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error || 'Ordem nao encontrada.'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in p-4 lg:p-0">
            <div className="flex items-center gap-5 border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-extrabold text-slate-900">
                    Detalhes da Ordem <span className="text-blue-600 font-mono">#{order.orderNumber}</span>
                </h1>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Produto Associado</p>
                    <p className="text-lg font-bold text-slate-800">{order.product?.name}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Status Atual</p>
                    <StatusBadge status={order.status} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Meta de Producao</p>
                    <p className="text-lg font-black text-slate-700">{order.targetQuantity} unid.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                        Registrar Apontamento
                    </h2>
                    {order.status === 'FINISHED' ? (
                        <p className="text-sm text-slate-500 italic">
                            Esta ordem esta finalizada. Nao e possivel registrar novos apontamentos.
                        </p>
                    ) : (
                        <RecordForm orderId={id} onSuccess={load} />
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                        <h2 className="text-lg font-bold text-slate-800">Historico</h2>
                        <span className="text-sm font-bold text-slate-500">{order.records?.length || 0} registros</span>
                    </div>

                    {order.records && order.records.length > 0 ? (
                        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {order.records.map((r) => (
                                <li key={r.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        {r.type === 'GOOD' ? (
                                            <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider">GOOD</span>
                                        ) : (
                                            <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider">SCRAP</span>
                                        )}
                                        <span className="text-sm text-slate-500">
                                            {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                        {r.note && (
                                            <span className="text-sm text-slate-400 italic">{r.note}</span>
                                        )}
                                    </div>
                                    <span className="font-bold text-slate-700">+{r.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center p-6 text-slate-400">
                            Nenhum apontamento registrado ainda.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}