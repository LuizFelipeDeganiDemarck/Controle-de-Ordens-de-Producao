import { useState } from 'react';
import { api } from '../api/api';

interface Props {
    onSuccess: () => void;
}

export default function ProductForm({ onSuccess }: Props) {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await api.post('/products', { name, sku });
            setName('');
            setSku('');
            setSuccess('Produto cadastrado com sucesso.');
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao cadastrar produto.');
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Adicionar Novo Produto</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                    placeholder="Nome do Produto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-1/2 transition-all"
                    required
                />
                <input
                    placeholder="Código SKU"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-1/4 transition-all uppercase"
                    required
                />
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors w-full sm:w-auto shadow-sm"
                    type="submit"
                >
                    Cadastrar
                </button>
            </form>
        </div>
    );
}