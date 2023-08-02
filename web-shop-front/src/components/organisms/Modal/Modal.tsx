import { PropsWithChildren } from "react";
import Button from "../../atoms/Button/Button";

interface ModalProps {
  show: boolean;
  modalHeaderText: string;
  handleCloseModal: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Modal = ({
  children,
  show,
  modalHeaderText,
  handleCloseModal,
}: PropsWithChildren<ModalProps>) => {
  const getClasses = () => {
    if (show) return "justify-center items-center flex";
    else return "hidden";
  };

  return (
    <div className="w-full h-full bg-black bg-opacity-75 fixed top-0 bottom-0 left-0 right-0 z-[150] backdrop-blur-[2px]">
      <div
        id="modal"
        tabIndex={-1}
        className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full ${getClasses()}`}
      >
        <div className="relative w-full max-w-4xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {modalHeaderText}
              </h3>
              <Button type="close" handleClick={handleCloseModal} />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
