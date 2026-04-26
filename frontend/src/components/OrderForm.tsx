import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function OrderForm({ onSuccess }: any) {
    const [products, setProducts] = useState<any[]>([]);
    const [productId, setProductId] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [targetQuantity, setTargetQuantity] = useState(0);

    useEffect(() => {
        api.get("/products").then((res) => setProducts(res.data));
    }, []);

    async function handleSubmit(e: any) {
        e.preventDefault();

        await api.post("/orders", {
            product_id: Number(productId),
            order_number: orderNumber,
            target_quantity: targetQuantity,
        }).then(() => {
            setOrderNumber("");
            setTargetQuantity(0);
            setProductId("");
            onSuccess();
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Nova Ordem de Produção</h2>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <input
                    placeholder="Número da Ordem"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-1/4 transition-all"
                    required
                />

                <select 
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-1/4 transition-all bg-white"
                    required
                >
                    <option value="" disabled>Selecione o Produto</option>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    min="1"
                    placeholder="Quantidade"
                    value={targetQuantity || ""}
                    onChange={(e) => setTargetQuantity(Number(e.target.value))}
                    className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-1/4 transition-all"
                    required
                />

                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors w-full md:w-auto shadow-sm" 
                    type="submit"
                > 
                    Criar Ordem
                </button>
            </form>
        </div>
    );
}