import { useState } from "react";
import { api } from "../api/api";

export default function ProductForm({ onSuccess }: any) {
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");

    async function handleSubmit(e: any) {
        e.preventDefault();

        await api.post("/products", { name, sku });

        setName("");
        setSku("");
        onSuccess();
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Adicionar Novo Produto</h2>
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