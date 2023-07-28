import Button from "../../atoms/Button/Button";

interface AdminPagesHeaderProps {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  buttonText: string;
}

const AdminPagesHeader = ({
  handleClick,
  text,
  buttonText,
}: AdminPagesHeaderProps) => {
  return (
    <div className="bg-white shadow items-center grid grid-cols-10">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 col-start-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 self-start">
          {text}
        </h1>
      </div>
      <div className="col-start-7 col-span-2">
        <Button text={buttonText} handleClick={handleClick} type="add" />
      </div>
    </div>
  );
};

export default AdminPagesHeader;
