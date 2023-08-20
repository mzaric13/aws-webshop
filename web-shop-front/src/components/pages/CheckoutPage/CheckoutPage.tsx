import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import { Order } from "../../../models/Order";
import User from "../../../models/User";
import { createOrderBE, executePayment } from "../../../services/order-service";
import { createOrderItems, getNavbarLinks } from "../../../utils/Util";
import ShoppingCartItems from "../../molecules/ShoppingCartItems/ShoppingCartItems";
import CheckoutFormFields from "../../organisms/CheckoutFormFields/CheckoutFormFields";
import LoadingSpinner from "../../organisms/LoadingSpinner/LoadingSpinner";
import Navbar from "../../organisms/Navbar/Navbar";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    address: "Srbija, Vojvodina, Zmaj Jovina 5, 21000 Novi Sad",
    birthdate: "2001-06-12",
    familyName: "Markovic",
    givenName: "Marko",
    username: "kupac1@mail.com",
    password: "",
    phoneNumber: "+381638436842",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { cartItems, emptyCart } = useShoppingCart();

  useEffect(() => {
    if (cartItems.length === 0) navigate("/products");
    setIsLoading(false);
  }, []);

  const calculatePrice = (): number => {
    let price = 0;
    for (let cartItem of cartItems)
      price += cartItem.item.price * cartItem.quantity;
    return price;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.name);
  };

  const onCreate = (data: any, actions: any): Promise<string> => {
    const order: Order = {
      userId: 2,
      price: calculatePrice(),
      orderItems: createOrderItems(cartItems),
    };
    return createOrderBE(order)
      .then((res) => {
        if (res.data.statusCode === 200) {
          localStorage.setItem("dbOrderId", res.data.body.orderId);
          return res.data.body.token;
        }
        return "";
      })
      .catch((err) => {
        console.log(err);
        return "";
      });
  };

  const onApprove = async (data: any, actions: any) => {
    await executePayment(
      localStorage.getItem("dbOrderId") as string,
      data["paymentID"],
      data["payerID"],
      data["facilitatorAccessToken"]
    )
      .then((res) => {
        localStorage.removeItem("dbOrderId");
        if (res.status === 200) {
          emptyCart();
          navigate("/payment-success");
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        localStorage.removeItem("dbOrderId");
        toast.error("Error executing order", { position: "top-right" });
      });
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <React.Fragment>
          <Navbar navbarLinks={getNavbarLinks("USER")} />
          <div className="container p-12 mx-auto">
            <div className="flex flex-col w-full px-0 mx-auto md:flex-row">
              <div className="flex flex-col md:w-full">
                <h2 className="mb-4 font-bold md:text-xl text-heading ">
                  Shipping Address
                </h2>
                <CheckoutFormFields
                  user={user}
                  handleInputChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col w-full ml-0 lg:ml-12 lg:w-3/5">
                <ShoppingCartItems />
                <div className="mt-36">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>${calculatePrice()}</p>
                  </div>
                  <div className="mt-6">
                    <PayPalScriptProvider
                      options={{
                        clientId:
                          "AdYtlW4S3OAJTJTgeL1w_htmIAYFQhDJuFh9Ao9BMOnC9MiThvAaXy9JrSEyJJiXqhh1xtWuEZ-PYT89",
                      }}
                    >
                      <PayPalButtons
                        fundingSource="paypal"
                        createOrder={onCreate}
                        onApprove={onApprove}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default CheckoutPage;
