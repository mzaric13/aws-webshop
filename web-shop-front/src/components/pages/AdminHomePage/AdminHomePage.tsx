import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { toast } from "react-toastify";
import Item from "../../../models/Item";
import { getAllItems } from "../../../services/item-service";
import { getNavbarLinks } from "../../../utils/Util";
import AdminPagesHeader from "../../organisms/AdminPagesHeader/AdminPagesHeader";
import LoadingSpinner from "../../organisms/LoadingSpinner/LoadingSpinner";
import Navbar from "../../organisms/Navbar/Navbar";
import ProductsTable from "../../organisms/ProductsTable/ProductsTable";

const AdminHomePage = () => {
  const pageSize: number = 10;

  const [page, setPage] = useState<number>(1);
  const [numberOfItems, setNumberOfItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Item[]>([]);

  useEffect(() => {
    getAllItems(page, pageSize, undefined, [], [], "")
      .then((res) => {
        setIsLoading(false);
        setNumberOfItems(res.data.body.numberOfItems);
        setProducts([...res.data.body.items]);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Products not read");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageClick = (newPage: number) => {
    setPage(newPage);
    getAllItems(newPage, pageSize, undefined, [], [], "")
      .then((res) => {
        setIsLoading(false);
        /*if (res.data.body.items.length === 0)
          setNoItemsText("No items for given criteria");
        else setNoItemsText("");*/
        setProducts([...res.data.body.items]);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Items not read");
      });
  };

  const handleAddButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {};

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <React.Fragment>
          <Navbar navbarLinks={getNavbarLinks("Admin")} />
          <AdminPagesHeader
            text="Products"
            handleClick={handleAddButtonClick}
            buttonText="Add item"
          />
          <div className="grid grid-cols-6 overflow-auto rounded-lg">
            <ProductsTable items={products} />
            <div className="col-start-2 col-span-4">
              <ResponsivePagination
                current={page}
                total={Math.ceil(numberOfItems / pageSize)}
                onPageChange={handlePageClick}
                className="grid grid-cols-10 mt-11"
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </>
  );
};

export default AdminHomePage;
