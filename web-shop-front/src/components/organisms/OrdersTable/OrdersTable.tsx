import { OrderReturnValue, OrderStatus } from "../../../models/Order";
import { getRole } from "../../../services/token-service";
import OrdersTableRow from "../../molecules/OrdersTableRow/OrdersTableRow";

interface OrdersTableProps {
  orders: OrderReturnValue[];
  orderStatuses: OrderStatus[];
  onClick: (itemId: number) => void;
  handleOrderStatusChange: (orderStatus: OrderStatus, orderId: number) => void;
  handleButtonClick: (orderId: number) => void;
}

const OrdersTable = ({
  orders,
  orderStatuses,
  onClick,
  handleOrderStatusChange,
  handleButtonClick,
}: OrdersTableProps) => {
  return (
    <table className="mt-1 col-start-2 col-span-4 table-fixed rounded-xl">
      <thead className="bg-gray-50 border-b-4 border-gray-200">
        <tr>
          {getRole() === "ADMIN" ? (
            <>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Order id
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                User
              </th>{" "}
            </>
          ) : (
            <></>
          )}
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Date
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Total
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Status
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left"></th>
          {getRole() === "USER" ? (
            <th className="p-3 text-sm font-semibold tracking-wide text-left"></th>
          ) : (
            <></>
          )}
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <OrdersTableRow
            order={order}
            key={index}
            index={index}
            orderStatuses={orderStatuses}
            onClick={onClick}
            handleOrderStatusChange={handleOrderStatusChange}
            handleButtonClick={handleButtonClick}
          />
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
