import React from "react";
import { Link } from "react-router-dom";
import Item from "../../../models/Item";

interface ProductMiniInfoProps {
  product: Item;
}

const ProductMiniInfo = ({ product }: ProductMiniInfoProps) => {
  return (
    <React.Fragment>
      <div>
        <h3 className="text-sm text-gray-700">
          <Link to={`/products/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500">{product.description}</p>
      </div>
      <p className="text-sm font-medium text-gray-900">${product.price}</p>
    </React.Fragment>
  );
};

export default ProductMiniInfo;
