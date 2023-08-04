interface SizeFieldProps {
  value: string;
  label: string;
  active: boolean;
  checked: boolean;
  handleSizeClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const SizeField = ({
  value,
  label,
  active,
  checked,
  handleSizeClick,
}: SizeFieldProps) => {
  const getClassNames = () => {
    if (active)
      return "border-2 group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm";
    else
      return "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-not-allowed bg-gray-50 text-gray-200";
  };

  const getClassNamesChecked = () => {
    if (checked) return "border-[#f90] ";
    else return "";
  };

  return (
    <label
      className={`${getClassNames()} ${getClassNamesChecked()}`}
      id={value}
      onClick={handleSizeClick}
    >
      <input
        type="radio"
        name="size-choice"
        value={value}
        className="sr-only"
        aria-labelledby={label}
      />
      <span id={label}>{value}</span>
      {active ? (
        <span
          className="pointer-events-none absolute -inset-px rounded-md"
          aria-hidden="true"
        ></span>
      ) : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
        >
          <svg
            className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            stroke="currentColor"
          >
            <line
              x1="0"
              y1="100"
              x2="100"
              y2="0"
              vector-effect="non-scaling-stroke"
            />
          </svg>
        </span>
      )}
    </label>
  );
};

export default SizeField;
