import { Route, Routes } from "react-router-dom";
import AddItemPage from "../pages/AddItemPage/AddItemPage";
import AdminHomePage from "../pages/AdminHomePage/AdminHomePage";
import HomePage from "../pages/HomePage/HomePage";
import ProductPage from "../pages/ProductPage/ProductPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/admin-products" element={<AdminHomePage />} />
      <Route path="/add-product" element={<AddItemPage />} />
      <Route path="/product/:itemId" element={<ProductPage />} />
    </Routes>
  );
};

export default AppRouter;
