import { useState } from "react";
import { api } from "../api/api";

export default function RecordForm({ orderId, onSuccess }: any) {
    const [type, setType] = useState("GOOD");
    const [quantity, setQuantity] = useState(0);

    async function handleSubmit(e: any) {
        e.preventDefault();

        await api.post(`/orders/${orderId}/records`, {
            type,
            quantity,
        }).catch((err) => {
            alert(err.response?.data?.error || "Erro ao registrar");
        });

        setQuantity(0);
        onSuccess();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-1/3 transition-all bg-white"
            >
                <option value="GOOD">GOOD</option>
                <option value="SCRAP">SCRAP</option>
            </select>

            <input
                placeholder="Quantidade"
                type="number"
                min="1"
                value={quantity || ""}
                onChange={(e) => setQuantity(Number(e.target.value))}
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
    );
}