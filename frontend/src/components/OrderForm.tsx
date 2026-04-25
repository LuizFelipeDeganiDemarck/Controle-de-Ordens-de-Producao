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
            productId: Number(productId),
            orderNumber,
            targetQuantity,
        });

        onSuccess();
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
                placeholder="Número"
                onChange={(e) => setOrderNumber(e.target.value)}
                className="border p-2"
            />

            <input
                type="number"
                placeholder="Quantidade"
                onChange={(e) => setTargetQuantity(Number(e.target.value))}
                className="border p-2"
            />

            <select onChange={(e) => setProductId(e.target.value)}>
                <option>Produto</option>
                {products.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}
            </select>

            <button className="bg-green-500 text-white px-4">Criar</button>
        </form>
    );
}