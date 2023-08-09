import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { OrderReturnValue } from "../../../models/Order";
import {
  changeOrderStatus,
  getOrdersUser,
} from "../../../services/order-service";
import { getNavbarLinks } from "../../../utils/Util";
import OrderDetails from "../../molecules/OrderDetails/OrderDetails";
import LoadingSpinner from "../../organisms/LoadingSpinner/LoadingSpinner";
import Modal from "../../organisms/Modal/Modal";
import Navbar from "../../organisms/Navbar/Navbar";
import OrdersTable from "../../organisms/OrdersTable/OrdersTable";

const OrderHistoryPage = () => {
  const pageSize = 5;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderReturnValue[]>([]);
  const [page, setPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [numberOfOrders, setNumberOfOrders] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<OrderReturnValue>({
    id: -1,
    date: new Date(),
    orderItems: [],
    price: -1,
    status: "",
    userEmail: "",
  });

  useEffect(() => {
    sessionStorage.setItem("role", "User");
    getOrdersUser(2, page, pageSize)
      .then((res) => {
        if (res.data.statusCode === 200) {
          setOrders(res.data.body.orders);
          setNumberOfOrders(res.data.body.numberOfOrders);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageClick = (newPage: number) => {
    setPage(newPage);
    setIsLoading(true);
    getOrdersUser(2, page, pageSize)
      .then((res) => {
        if (res.data.statusCode === 200) {
          setOrders(res.data.body.orders);
          setIsLoading(false);
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDetailsClick = (orderId: number) => {
    const order = orders.filter((order) => {
      return order.id === orderId;
    });
    setShowModal(true);
    setSelectedOrder(order[0]);
  };

  const handleCloseModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowModal(false);
    setSelectedOrder({
      id: -1,
      date: new Date(),
      orderItems: [],
      price: -1,
      status: "",
      userEmail: "",
    });
  };

  const handleButtonClick = (orderId: number) => {
    changeOrderStatus(orderId, 4)
      .then((res) => {
        if (res.data.statusCode === 200) {
          let order = orders.filter((ord) => ord.id === orderId)[0];
          order.status = "RECIEVED";
          setOrders(
            [...orders.filter((order) => order.id !== orderId), order].sort(
              function (order1: OrderReturnValue, order2: OrderReturnValue) {
                return order1.id - order2.id;
              }
            )
          );
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <React.Fragment>
          <Navbar navbarLinks={getNavbarLinks("User")} />
          <div className="mt-10 grid grid-cols-6 overflow-auto rounded-lg">
            <OrdersTable
              orders={orders}
              onClick={handleDetailsClick}
              orderStatuses={[]}
              handleOrderStatusChange={() => {}}
              handleButtonClick={handleButtonClick}
            />
            <div className="col-start-2 col-span-4">
              <ResponsivePagination
                current={page}
                total={Math.ceil(numberOfOrders / pageSize)}
                onPageChange={handlePageClick}
                className="grid grid-cols-10 mt-11"
              />
            </div>
          </div>
          {showModal ? (
            <Modal
              show={showModal}
              modalHeaderText="Order details"
              handleCloseModal={handleCloseModal}
            >
              <OrderDetails order={selectedOrder} />
            </Modal>
          ) : (
            <></>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default OrderHistoryPage;
