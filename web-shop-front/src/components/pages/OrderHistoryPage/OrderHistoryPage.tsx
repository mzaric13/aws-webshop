import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { OrderReturnValue, OrderStatus } from "../../../models/Order";
import { User } from "../../../models/User";
import {
  changeOrderStatus,
  getOrderStatuses,
  getOrdersUser,
} from "../../../services/order-service";
import { getLoggedUser } from "../../../services/user-service";
import { getNavbarLinks } from "../../../utils/Util";
import OrderDetails from "../../molecules/OrderDetails/OrderDetails";
import Pagination from "../../molecules/Pagination/Pagination";
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
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [numberOfOrders, setNumberOfOrders] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<User>({
    id: -1,
    address: ",,, ",
    birthdate: new Date(),
    familyName: "",
    givenName: "",
    email: "",
    phoneNumber: "",
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderReturnValue>({
    id: -1,
    date: new Date(),
    orderItems: [],
    price: -1,
    status: "",
    userEmail: "",
  });

  useEffect(() => {
    getOrderStatuses()
      .then((res) => {
        if (res.data.statusCode === 200) {
          setOrderStatuses([...res.data.body]);
        }
      })
      .catch((err) => console.log(err));
    getLoggedUser()
      .then((res) => {
        if (res.data.statusCode === 200) {
          setLoggedUser(res.data.body);
          getOrdersUser(res.data.body.id, page, pageSize)
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
        } else {
          toast.error(res.data.body as unknown as string);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageClick = (newPage: number) => {
    setPage(newPage);
    setIsLoading(true);
    getOrdersUser(loggedUser.id, newPage, pageSize)
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

  const handleClick = (number: string) => {
    if (
      (number === "Previous" && page === 1) ||
      (number === "Next" && page === Math.ceil(numberOfOrders / pageSize))
    ) {
      return;
    } else {
      let newPage: number = 0;
      if (number === "Previous") newPage = page - 1;
      else if (number === "Next") newPage = page + 1;
      else newPage = Number(number);
      handlePageClick(newPage);
    }
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
    const status = orderStatuses.filter(
      (status) => status.name === "RECIEVED"
    )[0];
    changeOrderStatus(orderId, status.id, status.name)
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
          <Navbar navbarLinks={getNavbarLinks("USER")} />
          <div className="mt-10 grid grid-cols-6 overflow-auto rounded-lg">
            <OrdersTable
              orders={orders}
              onClick={handleDetailsClick}
              orderStatuses={[]}
              handleOrderStatusChange={() => {}}
              handleButtonClick={handleButtonClick}
            />
            <div className="col-start-2 col-span-4">
              <Pagination
                page={page}
                numberOfPages={Math.ceil(numberOfOrders / pageSize)}
                onPageClick={handleClick}
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
