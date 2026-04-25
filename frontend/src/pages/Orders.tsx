import { useEffect, useState } from "react";
import { api } from "../api/api";
import OrderForm from "../components/OrderForm";
import StatusBadge from "../components/StatusBadge";
import { Link } from "react-router-dom";

export default function Orders() {
    const [orders, setOrders] = useState([]);

    function load() {
        api.get("/orders").then((res) => setOrders(res.data));
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Ordens</h1>

            <OrderForm onSuccess={load} />

            <table className="w-full border">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Status</th>
                        <th>Produto</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o: any) => (
                        <tr key={o.id}>
                            <td>{o.orderNumber}</td>
                            <td>
                                <StatusBadge status={o.status} />
                            </td>
                            <td>{o.product?.name}</td>
                            <td>
                                <Link to={`/orders/${o.id}`} className="text-blue-500">
                                    Ver
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}