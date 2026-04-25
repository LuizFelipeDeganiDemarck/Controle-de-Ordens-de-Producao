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
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Produtos</h1>

            <ProductForm onSuccess={load} />

            <ul>
                {products.map((p: any) => (
                    <li key={p.id}>
                        {p.name} - {p.sku}
                    </li>
                ))}
            </ul>
        </div>
    );
}