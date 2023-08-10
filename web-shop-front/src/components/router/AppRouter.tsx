import { Route, Routes } from "react-router-dom";
import AddItemPage from "../pages/AddItemPage/AddItemPage";
import AdminHomePage from "../pages/AdminHomePage/AdminHomePage";
import AdminOrdersPage from "../pages/AdminOrdersPage/AdminOrdersPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import HomePage from "../pages/HomePage/HomePage";
import OrderHistoryPage from "../pages/OrderHistoryPage/OrderHistoryPage";
import PaymentStatusPage from "../pages/PaymentStatusPage/PaymentStatusPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/admin-products" element={<AdminHomePage />} />
      <Route path="/add-product" element={<AddItemPage />} />
      <Route path="/product/:itemId" element={<ProductPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment-success" element={<PaymentStatusPage />} />
      <Route path="/admin-orders" element={<AdminOrdersPage />} />
      <Route path="/orders-history" element={<OrderHistoryPage />} />
    </Routes>
  );
};

export default AppRouter;
