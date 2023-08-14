import console from "console";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  PriceList,
  PriceListCreation,
  PriceListItem,
  PriceListUpdate,
} from "../../../models/PriceList";
import {
  addPriceList,
  getPriceLists,
  updatePriceList,
} from "../../../services/price-list-service";
import { getNavbarLinks } from "../../../utils/Util";
import Pagination from "../../molecules/Pagination/Pagination";
import AdminPagesHeader from "../../organisms/AdminPagesHeader/AdminPagesHeader";
import LoadingSpinner from "../../organisms/LoadingSpinner/LoadingSpinner";
import Modal from "../../organisms/Modal/Modal";
import Navbar from "../../organisms/Navbar/Navbar";
import PriceListDetails from "../../organisms/PriceListDetails/PriceListDetails";
import PriceListsTable from "../../organisms/PriceListsTable/PriceListsTable";

const AdminPriceListsPage = () => {
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [page, setPage] = useState<number>(1);
  const [numberOfPriceLists, setNumberOfPriceLists] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceList>({
    id: -1,
    priceListItems: [],
    valid: false,
    validFrom: new Date(),
    validTo: new Date(),
  });
  const [newPriceList, setNewPriceList] = useState<PriceListCreation>({
    validTo: new Date(),
    priceListItems: [],
  });
  const [pricesToUpdate, setPricesToUpdate] = useState<PriceListUpdate>({
    priceListId: -1,
    priceListItems: [],
  });

  useEffect(() => {
    getPriceLists()
      .then((res) => {
        if (res.data.statusCode === 200) {
          const validPriceList = res.data.body.priceLists.filter(
            (priceList) => priceList.valid === true
          )[0];
          setSelectedPriceList(validPriceList);
          setPriceLists(res.data.body.priceLists);
          setNumberOfPriceLists(res.data.body.numberOfPriceLists);
          setNewPriceList({
            ...newPriceList,
            priceListItems: validPriceList.priceListItems,
          });
          setIsLoading(false);
        } else {
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isAdd) {
      handleInputAdd(event.target.name, event.target.value);
    } else {
      handleInputEdit(event.target.name, event.target.value);
    }
  };

  const handleInputAdd = (name: string, value: string) => {
    if (name === "validTo") {
      const changed = {
        ...newPriceList,
        [name]: new Date(value),
      };
      setNewPriceList(changed);
    } else {
      const modifiedPriceLists: PriceListItem[] =
        newPriceList.priceListItems.map((priceListItem) => {
          if (priceListItem.itemName === name) {
            return { ...priceListItem, price: Number(value) };
          }
          return priceListItem;
        });
      setNewPriceList({
        ...newPriceList,
        priceListItems: modifiedPriceLists,
      });
    }
  };

  const handleInputEdit = (name: string, value: string) => {
    if (name === "validTo") {
      const changed = {
        ...pricesToUpdate,
        validTo: new Date(value),
      };
      setPricesToUpdate(changed);
    } else {
      const exists = pricesToUpdate.priceListItems.filter(
        (priceListItem) => priceListItem.itemName === name
      );
      if (exists.length === 1) {
        let priceListItem = exists[0];
        priceListItem.price = Number(value);
        setPricesToUpdate({
          ...pricesToUpdate,
          priceListItems: [...pricesToUpdate.priceListItems, priceListItem],
        });
      } else {
        let priceListItem = selectedPriceList.priceListItems.filter(
          (priceListItem) => priceListItem.itemName === name
        )[0];
        priceListItem.price = Number(value);
        setPricesToUpdate({
          ...pricesToUpdate,
          priceListItems: [...pricesToUpdate.priceListItems, priceListItem],
        });
      }
    }
  };

  const handleEditClick = (priceListId: number) => {
    const priceList = priceLists.filter(
      (priceList) => priceList.id === priceListId
    )[0];
    setPricesToUpdate({ ...pricesToUpdate, priceListId: priceList.id });
    setSelectedPriceList(priceList);
    setShowModal(true);
    setIsAdd(false);
  };

  const handlePageClick = (newPage: number) => {
    setPage(newPage);
  };

  const handleClick = (number: string) => {
    if (
      (number === "Previous" && page === 1) ||
      (number === "Next" && page === Math.ceil(numberOfPriceLists / pageSize))
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

  const handleCloseModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowModal(false);
  };

  const handleAddButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowModal(true);
    setIsAdd(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (isAdd) {
      addPriceList(newPriceList)
        .then((res) => {
          if (res.data.statusCode === 200) {
            setIsAdd(false);
            setShowModal(false);
            toast.success(res.data.body);
          } else {
            toast.error(res.data.body);
          }
        })
        .catch((err) => console.log(err));
    } else {
      updatePriceList(pricesToUpdate)
        .then((res) => {
          if (res.data.statusCode === 200) {
            setIsAdd(false);
            setShowModal(false);
            toast.success(res.data.body);
          } else {
            toast.error(res.data.body);
          }
        })
        .catch((err) => console.log(err));
    }
    event.preventDefault();
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <React.Fragment>
          <Navbar navbarLinks={getNavbarLinks("Admin")} />
          <AdminPagesHeader
            buttonText="Add new price list"
            handleClick={handleAddButtonClick}
            text="Price lists"
          />
          <div className="grid grid-cols-6 overflow-auto rounded-lg">
            <PriceListsTable
              priceLists={priceLists}
              handleEditClick={handleEditClick}
            />
            <div className="col-start-2 col-span-4">
              <Pagination
                page={page}
                numberOfPages={Math.ceil(numberOfPriceLists / pageSize)}
                onPageClick={handleClick}
              />
            </div>
          </div>
          {showModal ? (
            <Modal
              show={showModal}
              modalHeaderText={isAdd ? "Create price list" : "Edit price list"}
              handleCloseModal={handleCloseModal}
            >
              <PriceListDetails
                priceList={isAdd ? newPriceList : selectedPriceList}
                isAdd={isAdd}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
            </Modal>
          ) : (
            <></>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default AdminPriceListsPage;
