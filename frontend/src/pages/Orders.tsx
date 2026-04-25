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
                        <th>Quantidade Aceitas</th>
                        <th>Quantidade Refugada</th>
                        <th>Total Pedido</th>
                        <th>Apontamentos</th>
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
                            <td>{o.totalGood}</td>
                            <td>{o.totalScrap}</td>
                            <td>{o.targetQuantity}</td>
                            <td>
                                {o.status !== 'FINISHED' &&
                                    <Link to={`/orders/${o.id}`} className="text-blue-500">
                                        Editar
                                    </Link>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}