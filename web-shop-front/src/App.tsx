import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AppRouter from "./components/router/AppRouter";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <ShoppingCartProvider>
          <PayPalScriptProvider
            options={{
              clientId:
                "AdYtlW4S3OAJTJTgeL1w_htmIAYFQhDJuFh9Ao9BMOnC9MiThvAaXy9JrSEyJJiXqhh1xtWuEZ-PYT89",
            }}
          >
            <AppRouter />
          </PayPalScriptProvider>
        </ShoppingCartProvider>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
