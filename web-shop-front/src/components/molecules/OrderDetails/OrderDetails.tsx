import { OrderReturnValue } from "../../../models/Order";
import OrderItemDetails from "../../atoms/OrderItemDetails/OrderItemDetails";

interface OrderDetailsProps {
  order: OrderReturnValue;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <div className="p-10">
      <div className="flow-root">
        <ul className="-my-6 mb-8">
          {order.orderItems.map((orderItem, index) => (
            <OrderItemDetails key={index} orderItem={orderItem} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
