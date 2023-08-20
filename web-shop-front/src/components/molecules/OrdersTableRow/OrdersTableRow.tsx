import moment from "moment";
import { OrderReturnValue, OrderStatus } from "../../../models/Order";
import { getRole } from "../../../services/token-service";
import { getSelectStatusOptions } from "../../../utils/Util";
import ProductTableField from "../../atoms/ProductTableField/ProductTableField";

interface OrdersTableRowProps {
  index: number;
  order: OrderReturnValue;
  orderStatuses: OrderStatus[];
  onClick: (itemId: number) => void;
  handleOrderStatusChange: (orderStatus: OrderStatus, orderId: number) => void;
  handleButtonClick: (orderId: number) => void;
}

const OrdersTableRow = ({
  index,
  order,
  orderStatuses,
  onClick,
  handleOrderStatusChange,
  handleButtonClick,
}: OrdersTableRowProps) => {
  const getClassNames = () => {
    if (index % 2 !== 0) return "bg-white";
    else return "bg-gray-50";
  };
  return (
    <tr className={getClassNames()}>
      {getRole() === "ADMIN" ? (
        <>
          <ProductTableField
            data={order.id}
            type="data"
            itemId={order.id}
            onClick={onClick}
          />
          <ProductTableField
            data={order.userEmail}
            type="data"
            itemId={order.id}
            onClick={onClick}
          />
        </>
      ) : (
        <></>
      )}

      <ProductTableField
        data={moment(order.date).format("DD.MM.YYYY")}
        type="data"
        itemId={order.id}
        onClick={onClick}
      />
      <ProductTableField
        data={`$${order.price}`}
        type="data"
        itemId={order.id}
        onClick={onClick}
      />
      {order.status === "ACCEPTED" && getRole() === "ADMIN" ? (
        <ProductTableField
          data={order.status}
          type="select"
          selected={orderStatuses.filter((os) => os.name === order.status)[0]}
          selectOptions={getSelectStatusOptions(order.status, orderStatuses)}
          itemId={order.id}
          onClick={onClick}
          onSelect={handleOrderStatusChange}
        />
      ) : (
        <ProductTableField
          data={order.status}
          type="data"
          itemId={order.id}
          onClick={onClick}
        />
      )}
      <ProductTableField
        data="Details"
        type="details"
        itemId={order.id}
        onClick={onClick}
      />
      {getRole() === "USER" && order.status === "SHIPPED" ? (
        <ProductTableField
          data={"Mark as delivered"}
          itemId={order.id}
          type="button"
          onClick={handleButtonClick}
        />
      ) : (
        <ProductTableField
          data=""
          type=""
          itemId={order.id}
          onClick={onClick}
        />
      )}
    </tr>
  );
};

export default OrdersTableRow;
