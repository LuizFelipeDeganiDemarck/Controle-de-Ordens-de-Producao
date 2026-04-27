import { useEffect, useState } from 'react';
import { api } from '../api/api';
import type { Order } from '../types';
import OrderForm from '../components/OrderForm';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filterOrderNumber, setFilterOrderNumber] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    function getOrders() {
        setLoading(true);
        api.get<Order[]>('/orders')
            .then((res) => setOrders(res.data))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        getOrders();
    }, []);

    const filteredOrders = orders.filter((o) => {
        const matchNumber = o.orderNumber
            ?.toLowerCase()
            .includes(filterOrderNumber.toLowerCase());

        const matchStatus = filterStatus ? o.status === filterStatus : true;

        return matchNumber && matchStatus;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [filterOrderNumber, filterStatus]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-4 lg:p-0">
            <h1 className="text-2xl font-extrabold text-slate-900 border-b border-slate-200 pb-4">
                Gestao de Ordens
            </h1>

            <OrderForm onSuccess={getOrders} />

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Filtros de Busca</h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Buscar por número..."
                            value={filterOrderNumber}
                            onChange={(e) => setFilterOrderNumber(e.target.value)}
                            className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64 transition-all"
                        />

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white w-full sm:w-48 transition-all"
                        >
                            <option value="">Todos os Status</option>
                            <option value="OPEN">Aberto</option>
                            <option value="IN_PROGRESS">Em Andamento</option>
                            <option value="FINISHED">Finalizado</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
                        </div>
                    ) : currentOrders.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                                    <th className="p-3 font-semibold border-b border-slate-200">Numero</th>
                                    <th className="p-3 font-semibold border-b border-slate-200">Status</th>
                                    <th className="p-3 font-semibold border-b border-slate-200">Produto</th>
                                    <th className="p-3 font-semibold border-b border-slate-200 text-right">Aceitas</th>
                                    <th className="p-3 font-semibold border-b border-slate-200 text-right">Refugadas</th>
                                    <th className="p-3 font-semibold border-b border-slate-200 text-right">Total</th>
                                    <th className="p-3 font-semibold border-b border-slate-200 text-center">% Concluida</th>
                                    <th className="p-3 font-semibold border-b border-slate-200 text-center">% Refugada</th>
                                    <th className="p-3 font-semibold border-b border-slate-200 text-center">Acoes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentOrders.map((o) => (
                                    <tr key={o.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-3 font-mono text-sm text-slate-700">{o.orderNumber}</td>
                                        <td className="p-3">
                                            <StatusBadge status={o.status} />
                                        </td>
                                        <td className="p-3 font-medium text-slate-800">{o.product?.name}</td>
                                        <td className="p-3 text-right text-emerald-600 font-semibold">{o.totalGood}</td>
                                        <td className="p-3 text-right text-rose-600 font-semibold">{o.totalScrap}</td>
                                        <td className="p-3 text-right font-bold text-slate-700">{o.targetQuantity}</td>

                                        <td className="p-3 text-center">
                                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs font-bold">
                                                {o.targetQuantity
                                                    ? (((o.totalGood ?? 0) / o.targetQuantity) * 100).toFixed(1)
                                                    : 0}%
                                            </span>
                                        </td>

                                        <td className="p-3 text-center">
                                            <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-md text-xs font-bold">
                                                {o.targetQuantity
                                                    ? (((o.totalScrap ?? 0) / o.targetQuantity) * 100).toFixed(1)
                                                    : 0}%
                                            </span>
                                        </td>

                                        <td className="p-3 text-center">
                                            <Link
                                                to={`/orders/${o.id}`}
                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors"
                                            >
                                                {o.status !== 'FINISHED' ? 'Editar' : 'Visualizar'}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center p-10 text-slate-500">
                            <p className="text-lg font-medium">Nenhuma ordem encontrada.</p>
                            <p className="text-sm mt-1">Ajuste os filtros ou crie uma nova ordem de producao.</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                        <span className="text-sm text-slate-500">
                            Mostrando{' '}
                            <span className="font-medium text-slate-800">{startIndex + 1}</span> a{' '}
                            <span className="font-medium text-slate-800">
                                {Math.min(startIndex + itemsPerPage, filteredOrders.length)}
                            </span>{' '}
                            de{' '}
                            <span className="font-medium text-slate-800">{filteredOrders.length}</span> ordens
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Anterior
                            </button>
                            <span className="px-4 py-2 text-sm font-medium text-slate-700">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Proxima
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}