import { useEffect, useState } from "react";
import { api } from "../api/api";

type DashboardData = {
    totalOrders: number;
    openOrders: number;
    finishedOrders: number;
    goodQuantity: number;
};

export default function Dashboard() {
    const [data, setData] = useState<DashboardData>({
        totalOrders: 0,
        openOrders: 0,
        finishedOrders: 0,
        goodQuantity: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/dashboard/production")
            .then((res) => {
                const d = res.data;

                setData({
                    totalOrders: Number(d.total_orders),
                    openOrders: Number(d.open_orders),
                    finishedOrders: Number(d.finished_orders),
                    goodQuantity: Number(d.total_good),
                });
            })
            .catch((err) => {
                console.error("Erro ao carregar dashboard:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-4">Carregando dashboard...</div>;
    }

    return (
        <div className="grid grid-cols-4 gap-4 p-4">
            <div className="bg-blue-100 p-4 rounded-xl shadow">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{data.totalOrders}</p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-xl shadow">
                <p className="text-sm text-gray-600">Abertas</p>
                <p className="text-2xl font-bold">{data.openOrders}</p>
            </div>

            <div className="bg-green-100 p-4 rounded-xl shadow">
                <p className="text-sm text-gray-600">Finalizadas</p>
                <p className="text-2xl font-bold">{data.finishedOrders}</p>
            </div>

            <div className="bg-purple-100 p-4 rounded-xl shadow">
                <p className="text-sm text-gray-600">Produzido</p>
                <p className="text-2xl font-bold">{data.goodQuantity}</p>
            </div>
        </div>
    );
}