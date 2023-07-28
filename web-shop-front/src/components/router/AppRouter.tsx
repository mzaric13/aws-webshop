import { Route, Routes } from "react-router-dom";
import AdminHomePage from "../pages/AdminHomePage/AdminHomePage";
import HomePage from "../pages/HomePage/HomePage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/admin-products" element={<AdminHomePage />} />
    </Routes>
  );
};

export default AppRouter;
