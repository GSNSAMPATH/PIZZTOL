// "use client";

// import { Plus, Trash2 } from "lucide-react";
// import FormField from "./FormField";

// import type {
//   ProductColor,
//   ProductSize,
// } from "@/app/types/product";

// interface ProductVariantsProps {
//   colors: ProductColor[];
//   selectedSizes: number[];
//   sizes: ProductSize[];

//   onColorsChange: (
//     colors: ProductColor[]
//   ) => void;

//   onSizesChange: (
//     sizes: number[]
//   ) => void;

//   onGenerate: () => void;
// }

// export default function ProductVariants({
//   colors,
//   selectedSizes,
//   sizes,
//   onColorsChange,
//   onSizesChange,
//   onGenerate,
// }: ProductVariantsProps) {
//   function updateColor(
//     id: number,
//     field: "name" | "code",
//     value: string
//   ) {
//     onColorsChange(
//       colors.map((color) =>
//         color.id === id
//           ? {
//               ...color,
//               [field]: value,
//             }
//           : color
//       )
//     );
//   }

//   function addColor() {
//     onColorsChange([
//       ...colors,
//       {
//         id: Date.now(),
//         name: "",
//         code: "#ffffff",
//       },
//     ]);
//   }

//   function removeColor(id: number) {
//     onColorsChange(
//       colors.filter(
//         (color) => color.id !== id
//       )
//     );
//   }

//   function toggleSize(sizeId: number) {
//     if (selectedSizes.includes(sizeId)) {
//       onSizesChange(
//         selectedSizes.filter(
//           (id) => id !== sizeId
//         )
//       );
//     } else {
//       onSizesChange([
//         ...selectedSizes,
//         sizeId,
//       ]);
//     }
//   }

//   return (
//     <div>
//       {/* =====================================================
//           COLORS
//       ===================================================== */}

//       <h3 className="mb-6 text-[13px] font-semibold text-[#09213f]">
//         Available Colors
//       </h3>

//       {colors.map((color) => (
//         <div
//           key={color.id}
//           className="
//             mb-6
//             grid
//             grid-cols-1
//             gap-5
//             md:grid-cols-[1fr_1fr_70px_auto]
//           "
//         >
//           {/* Color Name */}
//           <FormField label="Color Name">
//             <input
//               type="text"
//               value={color.name}
//               onChange={(e) =>
//                 updateColor(
//                   color.id,
//                   "name",
//                   e.target.value
//                 )
//               }
//               placeholder="Enter color name"
//               className="form-input w-full  cursor-pointer  bg-white px-4 py-3 text-[14px] font-medium text-gray-700"
//             />
//           </FormField>

//           {/* Color Code */}
//           <FormField label="Color Code">
//             <input
//               type="text"
//               value={color.code}
//               onChange={(e) =>
//                 updateColor(
//                   color.id,
//                   "code",
//                   e.target.value
//                 )
//               }
//               placeholder="Enter Color Code"
//               className="form-input w-full  cursor-pointer  bg-white px-4 py-3 text-[14px] font-medium text-gray-700"
//             />
//           </FormField>

//           {/* Color View */}
//           <FormField label="Color View">
//             <div className="h-[40px] bg-white p-1">
//               <input
//                 type="color"
//                 value={
//                   color.code || "#ffffff"
//                 }
//                 onChange={(e) =>
//                   updateColor(
//                     color.id,
//                     "code",
//                     e.target.value
//                   )
//                 }
//                 className="
//                   h-full
//                   w-full
//                   cursor-pointer
//                   border-0
//                   bg-transparent p-1
//                 "
//               />
//             </div>
//           </FormField>

//           {/* Remove Color */}
//           {colors.length > 1 && (
//             <button
//               type="button"
//               onClick={() =>
//                 removeColor(color.id)
//               }
//               className="
//                 mt-7
//                 flex
//                 items-center
//                 justify-center
//                 text-red-500
//                 transition
//                 hover:text-red-700
//               "
//               title="Remove color"
//             >
//               <Trash2 size={16} />
//             </button>
//           )}
//         </div>
//       ))}

//       {/* =====================================================
//           SIZES
//       ===================================================== */}

//       <div className="mt-8">
//         <p className="mb-4 text-[12px] font-semibold text-[#09213f]">
//           Available Sizes
//         </p>

//         {sizes.length === 0 ? (
//           <p className="text-[12px] text-gray-500">
//             No sizes available.
//           </p>
//         ) : (
//           <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
//             {sizes.map((size) => {
//               const isSelected =
//                 selectedSizes.includes(
//                   size.id
//                 );

//               return (
//                 <label
//                   key={size.id}
//                   className="
//                     flex
//                     cursor-pointer
//                     items-center
//                     gap-3
//                     text-[13px]
//                     font-semibold
//                     text-[#09213f]
//                   "
//                 >
//                   {/* Size Name */}
//                   <span>
//                     {size.name}
//                   </span>

//                   {/* Checkbox */}
//                   <input
//                     type="checkbox"
//                     checked={
//                       isSelected
//                     }
//                     onChange={() =>
//                       toggleSize(
//                         size.id
//                       )
//                     }
//                     className="
//                       h-6
//                       w-6
//                       cursor-pointer
//                       appearance-none
//                       rounded-none
//                       border
//                       border-white
//                       bg-white
//                       outline-none
//                       transition
//                       checked:border-black
//                       checked:bg-gray-900
//                       checked:bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222.5%22%3E%3Cpath d=%22m4 10 4 4 8-8%22/%3E%3C/svg%3E')]
//                       checked:bg-center
//                       checked:bg-no-repeat
//                       checked:bg-[length:16px_16px]
//                       focus:outline-none
//                       focus:ring-0
//                     "
//                   />
//                 </label>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* =====================================================
//           ACTIONS
//       ===================================================== */}

//       <div className="mt-7 flex flex-wrap gap-7">
//         {/* Remove Color */}
//         {colors.length > 1 && (
//           <button
//             type="button"
//             onClick={() =>
//               removeColor(
//                 colors[
//                   colors.length - 1
//                 ].id
//               )
//             }
//             className="
//               flex
//               items-center
//               gap-2
//               text-[12px]
//               font-medium
//               text-[#09213f]
//               hover:underline
//             "
//           >
//             <span className="text-[17px]">
//               −
//             </span>

//             Remove Color
//           </button>
//         )}

//         {/* Add Color */}
//         <button
//           type="button"
//           onClick={addColor}
//           className="
//             flex
//             items-center
//             gap-2
//             text-[12px]
//             font-medium
//             text-[#09213f]
//             hover:underline
//           "
//         >
//           <Plus size={14} />

//           Add Color
//         </button>

//         {/* Generate Variants */}
//         <button
//           type="button"
//           onClick={onGenerate}
//           disabled={
//             colors.length === 0 ||
//             selectedSizes.length === 0
//           }
//           className="
//             flex
//             items-center
//             gap-2
//             text-[12px]
//             font-medium
//             text-[#09213f]
//             hover:underline
//             disabled:cursor-not-allowed
//             disabled:opacity-40
//             disabled:no-underline
//           "
//         >
//           <Plus size={14} />

//           Generate Variants
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { Plus, Trash2 } from "lucide-react";
import FormField from "./FormField";

import type {
  ProductColor,
  ProductSize,
} from "@/app/types/product";

interface ProductVariantsProps {
  colors: ProductColor[];
  selectedSizes: number[];
  sizes: ProductSize[];

  onColorsChange: (
    colors: ProductColor[]
  ) => void;

  onSizesChange: (
    sizes: number[]
  ) => void;

  onGenerate: () => void;
}

export default function ProductVariants({
  colors,
  selectedSizes,
  sizes,
  onColorsChange,
  onSizesChange,
  onGenerate,
}: ProductVariantsProps) {
  function updateColor(
    id: number,
    field: "name" | "code",
    value: string
  ) {
    onColorsChange(
      colors.map((color) =>
        color.id === id
          ? {
              ...color,
              [field]: value,
            }
          : color
      )
    );
  }

  function addColor() {
    onColorsChange([
      ...colors,
      {
        id: Date.now(),
        name: "",
        code: "#ffffff",
      },
    ]);
  }

  function removeColor(id: number) {
    onColorsChange(
      colors.filter(
        (color) => color.id !== id
      )
    );
  }

  function toggleSize(sizeId: number) {
    if (selectedSizes.includes(sizeId)) {
      onSizesChange(
        selectedSizes.filter(
          (id) => id !== sizeId
        )
      );
    } else {
      onSizesChange([
        ...selectedSizes,
        sizeId,
      ]);
    }
  }

  return (
    <div>
      {/* =====================================================
          COLORS
      ===================================================== */}

      <h3 className="mb-6 text-[13px] font-semibold text-[#09213f]">
        Available Colors
      </h3>

      {colors.map((color) => (
        <div
          key={color.id}
          className="
            mb-6
            grid
            grid-cols-1
            gap-5
            md:grid-cols-[1fr_1fr_70px_auto]
          "
        >
          {/* Color Name */}
          <FormField label="Color Name">
            <input
              type="text"
              value={color.name}
              onChange={(e) =>
                updateColor(
                  color.id,
                  "name",
                  e.target.value
                )
              }
              placeholder="Enter color name"
              className="form-input w-full  cursor-pointer  bg-white px-4 py-3 text-[14px] font-medium text-gray-700"
            />
          </FormField>

          {/* Color Code */}
          <FormField label="Color Code">
            <input
              type="text"
              value={color.code}
              onChange={(e) =>
                updateColor(
                  color.id,
                  "code",
                  e.target.value
                )
              }
              placeholder="Enter Color Code"
              className="form-input w-full  cursor-pointer  bg-white px-4 py-3 text-[14px] font-medium text-gray-700"
            />
          </FormField>

          {/* Color View */}
          <FormField label="Color View">
            <div className="h-[40px] bg-white p-1">
              <input
                type="color"
                value={
                  color.code || "#ffffff"
                }
                onChange={(e) =>
                  updateColor(
                    color.id,
                    "code",
                    e.target.value
                  )
                }
                className="
                  h-full
                  w-full
                  cursor-pointer
                  border-0
                  bg-transparent p-1
                "
              />
            </div>
          </FormField>

          {/* Remove Color */}
          {colors.length > 1 && (
            <button
              type="button"
              onClick={() =>
                removeColor(color.id)
              }
              className="
                mt-7
                flex
                items-center
                justify-center
                text-red-500
                transition
                hover:text-red-700
              "
              title="Remove color"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}

      {/* =====================================================
          SIZES
      ===================================================== */}

      <div className="mt-8">
        <p className="mb-4 text-[12px] font-semibold text-[#09213f]">
          Available Sizes
        </p>

        {sizes.length === 0 ? (
          <p className="text-[12px] text-gray-500">
            No sizes available.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {sizes.map((size) => {
              const isSelected =
                selectedSizes.includes(
                  size.id
                );

              return (
                <label
                  key={size.id}
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    text-[13px]
                    font-semibold
                    text-[#09213f]
                  "
                >
                  {/* Size Name */}
                  <span>
                    {size.name}
                  </span>

                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={
                      isSelected
                    }
                    onChange={() =>
                      toggleSize(
                        size.id
                      )
                    }
                    className="
                      h-6
                      w-6
                      cursor-pointer
                      appearance-none
                      rounded-none
                      border
                      border-white
                      bg-white
                      outline-none
                      transition
                      checked:border-black
                      checked:bg-gray-900
                      checked:bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222.5%22%3E%3Cpath d=%22m4 10 4 4 8-8%22/%3E%3C/svg%3E')]
                      checked:bg-center
                      checked:bg-no-repeat
                      checked:bg-[length:16px_16px]
                      focus:outline-none
                      focus:ring-0
                    "
                  />
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="mt-7 flex flex-wrap gap-7">
        {/* Remove Color */}
        {colors.length > 1 && (
          <button
            type="button"
            onClick={() =>
              removeColor(
                colors[
                  colors.length - 1
                ].id
              )
            }
            className="
              flex
              items-center
              gap-2
              text-[12px]
              font-medium
              text-[#09213f]
              hover:underline
            "
          >
            <span className="text-[17px]">
              −
            </span>

            Remove Color
          </button>
        )}

        {/* Add Color */}
        <button
          type="button"
          onClick={addColor}
          className="
            flex
            items-center
            gap-2
            text-[12px]
            font-medium
            text-[#09213f]
            hover:underline
          "
        >
          <Plus size={14} />

          Add Color
        </button>

        {/* Generate Variants */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={
            colors.length === 0 ||
            selectedSizes.length === 0
          }
          className="
            flex
            items-center
            gap-2
            text-[12px]
            font-medium
            text-[#09213f]
            hover:underline
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:no-underline
          "
        >
          <Plus size={14} />

          Generate Variants
        </button>
      </div>
    </div>
  );
}