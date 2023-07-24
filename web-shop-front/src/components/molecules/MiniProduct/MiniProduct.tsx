import Item from "../../../models/Item";
import ProductMiniImage from "../../atoms/ProductMiniImage/ProductMiniImage";
import ProductMiniInfo from "../../atoms/ProductMiniInfo/ProductMiniInfo";

interface MiniProductProps {
  product: Item;
}

const MiniProduct = ({ product }: MiniProductProps) => {
  return (
    <div key={product.id} className="group relative">
      <ProductMiniImage product={product} />
      <div className="mt-4 flex justify-between">
        <ProductMiniInfo product={product} />
      </div>
    </div>
  );
};

export default MiniProduct;
