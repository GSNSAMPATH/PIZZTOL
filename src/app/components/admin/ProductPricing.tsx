import FormField from "./FormField";

interface ProductPricingProps {
  regularPrice: string;
  salePrice: string;
  discount: string;
  setRegularPrice: (value: string) => void;
  setSalePrice: (value: string) => void;
  setDiscount: (value: string) => void;
}

export default function ProductPricing({
  regularPrice,
  salePrice,
  discount,
  setRegularPrice,
  setSalePrice,
  setDiscount,
}: ProductPricingProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr_100px]">

      <FormField label="Regular Price">
        <input
          type="number"
          min="0"
          value={regularPrice}
          onChange={(e) =>
            setRegularPrice(e.target.value)
          }
          placeholder="Enter regular price"
          className="form-input form-input w-full  cursor-pointer  bg-white px-4 py-3 text-[14px] font-medium text-gray-700"
        />
      </FormField>

      <FormField label="Sale Price">
        <input
          type="number"
          min="0"
          value={salePrice}
          onChange={(e) =>
            setSalePrice(e.target.value)
          }
          placeholder="Enter sale price (optional)"
          className="form-input form-input w-full  cursor-pointer  bg-white px-4 py-3 text-[14px] font-medium text-gray-700"
        />
      </FormField>

      <FormField label="Discount">
        <input
          type="number"
          min="0"
          max="100"
          value={discount}
          onChange={(e) =>
            setDiscount(e.target.value)
          }
          placeholder="00%"
          className="form-input form-input w-full  cursor-pointer  bg-white px-4 py-3 text-[14px] font-medium text-gray-700"
        />
      </FormField>

    </div>
  );
}