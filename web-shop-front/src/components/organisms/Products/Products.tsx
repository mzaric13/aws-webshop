import Item from "../../../models/Item";
import MiniProduct from "../../molecules/MiniProduct/MiniProduct";

interface ProductsProps {
  products: Item[];
}

const Products = ({ products }: ProductsProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <MiniProduct key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;
