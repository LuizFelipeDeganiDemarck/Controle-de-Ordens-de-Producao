import { useState } from 'react';
import { api } from '../api/api';

interface Props {
    orderId: string | undefined;
    onSuccess: () => void;
}

export default function RecordForm({ orderId, onSuccess }: Props) {
    const [type, setType] = useState<'GOOD' | 'SCRAP'>('GOOD');
    const [quantity, setQuantity] = useState<number | ''>('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await api.post(`/orders/${orderId}/records`, { type, quantity });
            setQuantity('');
            setSuccess('Apontamento registrado com sucesso.');
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao registrar apontamento.');
        }
    }

    return (
        <div>
            {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'GOOD' | 'SCRAP')}
                    className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-1/3 transition-all bg-white"
                >
                    <option value="GOOD">GOOD</option>
                    <option value="SCRAP">SCRAP</option>
                </select>

                <input
                    placeholder="Quantidade"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-1/3 transition-all"
                    required
                />

                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors w-full sm:w-auto shadow-sm"
                    type="submit"
                >
                    Registrar
                </button>
            </form>
        </div>
    );
}