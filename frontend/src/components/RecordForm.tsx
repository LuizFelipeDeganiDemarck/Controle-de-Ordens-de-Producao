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
        });

        onSuccess();
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <select onChange={(e) => setType(e.target.value)}>
                <option value="GOOD">GOOD</option>
                <option value="SCRAP">SCRAP</option>
            </select>

            <input
                placeholder="Quantidade"
                type="number"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border p-2"
            />

            <button className="bg-purple-500 text-white px-4">
                Adicionar
            </button>
        </form>
    );
}