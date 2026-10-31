import { Plus } from "lucide-react";

interface ProductTextFieldsProps {
  values: string[];
  placeholder: string;
  buttonText: string;
  onChange: (values: string[]) => void;
}

export default function ProductTextFields({
  values,
  placeholder,
  buttonText,
  onChange,
}: ProductTextFieldsProps) {
  function update(
    index: number,
    value: string
  ) {
    onChange(
      values.map((item, i) =>
        i === index ? value : item
      )
    );
  }

  function add() {
    onChange([...values, ""]);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {values.map((value, index) => (
          <input
            key={index}
            value={value}
            onChange={(e) =>
              update(
                index,
                e.target.value
              )
            }
            placeholder={placeholder}
            className="form-input form-input w-full cursor-pointer  bg-white px-4 py-3 text-[14px] font-medium text-gray-700"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-5 flex items-center gap-2 text-[12px] font-medium hover:underline "
      >
        <Plus size={14} />
        {buttonText}
      </button>
    </>
  );
}