import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Dashboard from "./pages/Dashboard";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-gray-800 text-white p-4 shadow-md">
                    <div className="container mx-auto flex items-center gap-6">
                        <span className="font-bold text-xl mr-4">Controle de Produção</span>
                        <Link to="/" className="hover:text-blue-300 transition-colors">Dashboard</Link>
                        <Link to="/products" className="hover:text-blue-300 transition-colors">Produtos</Link>
                        <Link to="/orders" className="hover:text-blue-300 transition-colors">Ordens</Link>
                    </div>
                </nav>
                <main className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/orders/:id" element={<OrderDetail />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}