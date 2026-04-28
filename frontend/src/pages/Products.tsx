import { useEffect, useState } from 'react';
import { api } from '../api/api';
import type { Product } from '../types';
import ProductForm from '../components/ProductForm';

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    function load() {
        setLoading(true);
        api.get<Product[]>('/products')
            .then((res) => setProducts(res.data))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-4 lg:p-0">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-200 pb-4">
                Gestão de Produtos
            </h1>

            <ProductForm onSuccess={load} />

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4 mt-8">
                <h2 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">
                    Lista de Produtos Cadastrados
                </h2>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
                        </div>
                    ) : products.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                                    <th className="p-3 font-semibold border-b border-slate-200" style={{ width: '80px' }}>ID</th>
                                    <th className="p-3 font-semibold border-b border-slate-200">Nome do Produto</th>
                                    <th className="p-3 font-semibold border-b border-slate-200">Codigo (SKU)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-3 font-mono text-sm text-slate-500">#{p.id}</td>
                                        <td className="p-3 font-bold text-slate-800">{p.name}</td>
                                        <td className="p-3">
                                            <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md font-mono text-sm">
                                                {p.sku}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center p-12 text-slate-500 bg-white rounded-2xl">
                            <p className="text-lg font-medium">Nenhum produto cadastrado ainda.</p>
                            <p className="text-sm mt-1">Utilize o formulario acima para adicionar o seu primeiro produto.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}