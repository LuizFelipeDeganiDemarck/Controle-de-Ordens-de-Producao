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
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2"
            />
            <input
                placeholder="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="border p-2"
            />
            <button className="bg-blue-500 text-white px-4">Salvar</button>
        </form>
    );
}