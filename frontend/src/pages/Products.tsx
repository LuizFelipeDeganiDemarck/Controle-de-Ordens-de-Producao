import { useEffect, useState } from "react";
import { api } from "../api/api";
import ProductForm from "../components/ProductForm";

export default function Products() {
    const [products, setProducts] = useState([]);

    function load() {
        api.get("/products").then((res) => setProducts(res.data));
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-200 pb-4">
                Gestão de Produtos
            </h1>

            <ProductForm onSuccess={load} />

            <div className="mt-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Lista de Produtos Cadastrados</h2>
                
                {products.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Nome do Produto</th>
                                <th>Código (SKU)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p: any) => (
                                <tr key={p.id}>
                                    <td className="text-slate-500">#{p.id}</td>
                                    <td className="font-bold text-slate-800">{p.name}</td>
                                    <td>
                                        <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md font-mono text-sm">
                                            {p.sku}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center p-12 text-slate-500 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                        <p className="text-lg font-medium">Nenhum produto cadastrado ainda.</p>
                        <p className="text-sm mt-1">Utilize o formulário acima para adicionar o seu primeiro produto.</p>
                    </div>
                )}
            </div>
        </div>
    );
}