import { useState } from "react";
import Button from "../../atoms/Button/Button";

interface ProductImageSectionProps {
  pictures: string[];
}

const ProductImageSection = ({ pictures }: ProductImageSectionProps) => {
  const [current, setCurrent] = useState(0);

  const previous = () => {
    setCurrent((current) =>
      current === 0 ? pictures.length - 1 : current - 1
    );
  };

  const next = () => {
    setCurrent((current) =>
      current === pictures.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {pictures.map((img, index) => (
          <img key={index} src={img} alt="" />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button type="previous" leftRightHandler={previous} />
        <Button type="next" leftRightHandler={next} />
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {pictures.map((_, i) => (
            <div
              className={`
              transition-all w-3 h-3 bg-white rounded-full
              ${current === i ? "p-2" : "bg-opacity-50"}
            `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageSection;
