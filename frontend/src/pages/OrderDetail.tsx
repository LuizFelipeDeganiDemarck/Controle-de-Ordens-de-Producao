import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useParams } from "react-router-dom";
import RecordForm from "../components/RecordForm";

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);

    function load() {
        api.get(`/orders/${id}`).then((res) => setOrder(res.data));
    }

    useEffect(() => {
        load();
    }, []);

    if (!order) return <p>Carregando...</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">
                Ordem {order.orderNumber}
            </h1>

            <p>Status: {order.status}</p>

            <RecordForm orderId={id} onSuccess={load} />

            <h2 className="mt-4 font-bold">Apontamentos</h2>

            <ul>
                {order.records?.map((r: any) => (
                    <li key={r.id}>
                        {r.type} - {r.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
}