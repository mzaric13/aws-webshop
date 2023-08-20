import { Route, Routes, useNavigate } from "react-router-dom";
import { configuteAxios } from "../../services/axios-config";
import AddItemPage from "../pages/AddItemPage/AddItemPage";
import AdminHomePage from "../pages/AdminHomePage/AdminHomePage";
import AdminOrdersPage from "../pages/AdminOrdersPage/AdminOrdersPage";
import AdminPriceListsPage from "../pages/AdminPriceListsPage/AdminPriceListsPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import OrderHistoryPage from "../pages/OrderHistoryPage/OrderHistoryPage";
import PaymentStatusPage from "../pages/PaymentStatusPage/PaymentStatusPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import AdminRoutes from "./AdminRoutes";
import SharedRoutes from "./SharedRoutes";
import UserRoutes from "./UserRoutes";

const AppRouter = () => {
  const navigate = useNavigate();
  configuteAxios(navigate);
  return (
    <Routes>
      <Route element={<SharedRoutes />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/products" element={<HomePage />} />
        <Route path="/product/:itemId" element={<ProductPage />} />
      </Route>
      <Route element={<AdminRoutes />}>
        <Route path="/admin-products" element={<AdminHomePage />} />
        <Route path="/add-product" element={<AddItemPage />} />
        <Route path="/admin-orders" element={<AdminOrdersPage />} />
        <Route path="/admin-price-lists" element={<AdminPriceListsPage />} />
      </Route>
      <Route element={<UserRoutes />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-success" element={<PaymentStatusPage />} />
        <Route path="/orders-history" element={<OrderHistoryPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
