import PaginationElement from "../../atoms/PaginationElement/PaginationElement";

interface PaginationProps {
  page: number;
  numberOfPages: number;
  onPageClick: (page: string) => void;
}

const Pagination = ({ page, numberOfPages, onPageClick }: PaginationProps) => {
  const calculatePaginationElements = () => {
    let paginationNumbers: any = [];
    paginationNumbers.push({ number: "Previous", current: false });
    if (page !== 1) {
      for (let i: number = page - 1; i <= page + 1; i++) {
        if (i <= numberOfPages)
          paginationNumbers.push({
            number: i.toString(),
            current: i === page ? true : false,
          });
      }
    } else {
      paginationNumbers.push({ number: "1", current: true });
      for (let i = 2; i < 4; i++)
        if (i <= numberOfPages) {
          paginationNumbers.push({ number: i.toString(), current: false });
        }
    }
    paginationNumbers.push({ number: "Next", current: false });
    return paginationNumbers;
  };

  return (
    <div className="flex items-center justify-center border-t-2 border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div>
        <div
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          {calculatePaginationElements().map((element: any, index: number) => (
            <PaginationElement
              current={element.current}
              number={element.number}
              onClick={onPageClick}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
