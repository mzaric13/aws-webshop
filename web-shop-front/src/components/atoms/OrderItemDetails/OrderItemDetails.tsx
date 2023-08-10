import { OrderItemReturnValue } from "../../../models/Order";

interface OrderItemDetailsProps {
  orderItem: OrderItemReturnValue;
}

const OrderItemDetails = ({ orderItem }: OrderItemDetailsProps) => {
  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={
            orderItem.item.pictures
              ? orderItem.item.pictures[0]
              : "/no-image-available.jpeg"
          }
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{orderItem.item.name}</h3>
            <p className="ml-4">${orderItem.item.price}</p>
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-gray-500">Quantity: {orderItem.quantity}</p>
          {orderItem.itemSize ? (
            <div className="flex">Size: {orderItem.itemSize}</div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </li>
  );
};

export default OrderItemDetails;
