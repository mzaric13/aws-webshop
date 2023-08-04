import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AppRouter from "./components/router/AppRouter";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";

function App() {
  return (
    <BrowserRouter>
      <ShoppingCartProvider>
        <AppRouter />
      </ShoppingCartProvider>
    </BrowserRouter>
  );
}

export default App;
