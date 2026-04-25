import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Dashboard from "./pages/Dashboard";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
            </Routes>
        </BrowserRouter>
    );
}