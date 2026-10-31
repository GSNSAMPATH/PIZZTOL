// "use client";

// import type { ProductVariant } from "@/app/types/product";

// interface VariantStockTableProps {
//   variants: ProductVariant[];

//   type: "volume" | "size";

//   onChange: (
//     variants: ProductVariant[]
//   ) => void;
// }

// export default function VariantStockTable({
//   variants,
//   type,
//   onChange,
// }: VariantStockTableProps) {
//   function updateVariant(
//     index: number,
//     field: keyof ProductVariant,
//     value: string
//   ) {
//     onChange(
//       variants.map((variant, i) =>
//         i === index
//           ? {
//               ...variant,
//               [field]: value,
//             }
//           : variant
//       )
//     );
//   }

//   if (variants.length === 0) {
//     return (
//       <div className="py-8 text-center text-[12px] text-gray-500">
//         {type === "volume"
//           ? "Add volumes and generate variants."
//           : "Select colors and sizes, then generate variants."}
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full min-w-[850px] border-collapse">
//         <thead>
//           <tr className="text-left text-[12px] w-full font-semibold text-[#09213f]">
//             {/* First column */}
//             <th className="pb-4">
//               {type === "volume"
//                 ? "Volume"
//                 : "Color"}
//             </th>

//             {/* T-shirt size */}
//             {type === "size" && (
//               <th className="pb-4">
//                 Size
//               </th>
//             )}

//             {/* SKU */}
//             <th className="pb-4">
//               SKU
//             </th>

//             {/* Regular price */}
//             <th className="pb-4">
//               Regular Price
//             </th>

//             {/* Sale price */}
//             <th className="pb-4">
//               Sale Price (Optional)
//             </th>

//             {/* Stock */}
//             <th className="pb-4">
//               Stock Quantity
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {variants.map(
//             (variant, index) => (
//               <tr
//                 key={`${variant.volume ?? variant.color}-${variant.size ?? ""}-${index}`}
//                 className="text-[11px] text-[#09213f]"
//               >
//                 {/* Volume / Color */}
//                 <td className="py-2">
//                   {type === "volume"
//                     ? variant.volume
//                     : variant.color}
//                 </td>

//                 {/* Size */}
//                 {type === "size" && (
//                   <td className="py-2">
//                     {variant.size}
//                   </td>
//                 )}

//                 {/* SKU */}
//                 <td className="py-2">
//                   <input
//                     type="text"
//                     value={variant.sku}
//                     onChange={(e) =>
//                       updateVariant(
//                         index,
//                         "sku",
//                         e.target.value
//                       )
//                     }
//                     className="
//                       h-[40px]
                    
//                       bg-white
//                       px-3
//                       text-[11px]
//                       outline-none
//                     "
//                   />
//                 </td>

//                 {/* Regular Price */}
//                 <td className="py-2">
//                   <input
//                     type="number"
//                     min="0"
//                     value={
//                       variant.regularPrice
//                     }
//                     onChange={(e) =>
//                       updateVariant(
//                         index,
//                         "regularPrice",
//                         e.target.value
//                       )
//                     }
//                     placeholder="Enter price"
//                     className="
//                       h-[40px]
                    
//                       bg-white
//                       px-3
//                       text-[11px]
//                       outline-none
//                     "
//                   />
//                 </td>

//                 {/* Sale Price */}
//                 <td className="py-2">
//                   <input
//                     type="number"
//                     min="0"
//                     value={
//                       variant.salePrice
//                     }
//                     onChange={(e) =>
//                       updateVariant(
//                         index,
//                         "salePrice",
//                         e.target.value
//                       )
//                     }
//                     placeholder="Enter price"
//                     className="
//                       h-[40px]
           
//                       bg-white
//                       px-3
//                       text-[11px]
//                       outline-none
//                     "
//                   />
//                 </td>

//                 {/* Stock */}
//                 <td className="py-2">
//                   <input
//                     type="number"
//                     min="0"
//                     value={
//                       variant.stockQty
//                     }
//                     onChange={(e) =>
//                       updateVariant(
//                         index,
//                         "stockQty",
//                         e.target.value
//                       )
//                     }
//                     placeholder="Enter available quantity"
//                     className="
//                       h-[40px]
//                       w-full
//                       bg-white
//                       px-4
//                       text-[11px]
//                       outline-none
//                     "
//                   />
//                 </td>
//               </tr>
//             )
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


"use client";

import type { ProductVariant } from "@/app/types/product";

interface VariantStockTableProps {
  variants: ProductVariant[];

  type: "volume" | "size";

  onChange: (
    variants: ProductVariant[]
  ) => void;
}

export default function VariantStockTable({
  variants,
  type,
  onChange,
}: VariantStockTableProps) {
  // =====================================================
  // UPDATE VARIANT
  // =====================================================

  function updateVariant(
    index: number,
    field: keyof ProductVariant,
    value: string
  ) {
    onChange(
      variants.map((variant, i) =>
        i === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  }

  // =====================================================
  // CALCULATE SALE PRICE
  // =====================================================

  function calculateSalePrice(
    regularPrice: string,
    discountPercent: string
  ) {
    const price =
      Number(regularPrice);

    const discount =
      Number(discountPercent || 0);

    // Invalid price
    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return "";
    }

    // Invalid discount
    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount > 100
    ) {
      return "";
    }

    const salePrice =
      price -
      price * (discount / 100);

    return salePrice.toFixed(2);
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (variants.length === 0) {
    return (
      <div className="py-8 text-center text-[12px]">
        {type === "volume"
          ? "Add volumes and generate variants."
          : "Select colors and sizes, then generate variants."}
      </div>
    );
  }

  // =====================================================
  // TABLE
  // =====================================================

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] border-collapse">
        {/* =================================================
            HEADER
        ================================================= */}

        <thead>
          <tr className="w-full text-left text-[12px] font-semibold text-[#09213f]">
            {/* Volume / Color */}

            <th className="pb-4">
              {type === "volume"
                ? "Volume"
                : "Color"}
            </th>

            {/* Size */}

            {type === "size" && (
              <th className="pb-4">
                Size
              </th>
            )}

            {/* SKU */}

            <th className="pb-4">
              SKU
            </th>

            {/* Regular Price */}

            <th className="pb-4">
              Regular Price
            </th>

            {/* Discount */}

            <th className="pb-4">
              Discount
            </th>

            {/* Sale Price */}

            <th className="pb-4">
              Sale Price
            </th>

            {/* Stock */}

            <th className="pb-4">
              Stock Quantity
            </th>
          </tr>
        </thead>

        {/* =================================================
            BODY
        ================================================= */}

        <tbody className="text-[11px] text-[#09213f]">
          {variants.map(
            (variant, index) => {
              const salePrice =
                calculateSalePrice(
                  variant.regularPrice,
                  variant.discountPercent
                );

              return (
                <tr
                  key={`
                    ${
                      type === "volume"
                        ? variant.volumeId ??
                          variant.volume ??
                          ""
                        : variant.colorName ??
                          variant.color ??
                          ""
                    }-
                    ${
                      variant.sizeId ??
                      ""
                    }-
                    ${index}
                  `}
                  className="text-[11px] text-[#09213f]"
                >
                  {/* =====================================
                      VOLUME / COLOR
                  ===================================== */}

                  <td className="py-2">
                    {type === "volume"
                      ? variant.volume
                      : variant.colorName ??
                        variant.color}
                  </td>

                  {/* =====================================
                      SIZE
                  ===================================== */}

                  {type === "size" && (
                    <td className="py-2">
                      {variant.size}
                    </td>
                  )}

                  {/* =====================================
                      SKU
                  ===================================== */}

                  <td className="py-2">
                    <input
                      type="text"
                      value={
                        variant.sku ??
                        ""
                      }
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "sku",
                          e.target.value
                        )
                      }
                      placeholder="Enter SKU"
                      className="
                        h-[40px]
                        bg-white
                        px-3
                        text-[11px]
                        outline-none
                      "
                    />
                  </td>

                  {/* =====================================
                      REGULAR PRICE
                  ===================================== */}

                  <td className="py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        variant.regularPrice ??
                        ""
                      }
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "regularPrice",
                          e.target.value
                        )
                      }
                      placeholder="Enter price"
                      className="
                        h-[40px]
                        bg-white
                        px-3
                        text-[11px]
                        outline-none
                      "
                    />
                  </td>

                  {/* =====================================
                      DISCOUNT
                  ===================================== */}

                  <td className="py-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={
                          variant.discountPercent ??
                          ""
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value;

                          // Empty is allowed
                          if (
                            value === ""
                          ) {
                            updateVariant(
                              index,
                              "discountPercent",
                              ""
                            );

                            return;
                          }

                          // Prevent above 100
                          if (
                            Number(
                              value
                            ) > 100
                          ) {
                            updateVariant(
                              index,
                              "discountPercent",
                              "100"
                            );

                            return;
                          }

                          // Prevent negative
                          if (
                            Number(
                              value
                            ) < 0
                          ) {
                            updateVariant(
                              index,
                              "discountPercent",
                              "0"
                            );

                            return;
                          }

                          updateVariant(
                            index,
                            "discountPercent",
                            value
                          );
                        }}
                        placeholder="0"
                        className="
                          h-[40px]
                          bg-white
                          px-3
                          pr-8
                          text-[11px]
                          outline-none
                        "
                      />

                      <span
                        className="
                          pointer-events-none
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          text-[11px]
                          text-gray-500
                        "
                      >
                        %
                      </span>
                    </div>
                  </td>

                  {/* =====================================
                      SALE PRICE
                  ===================================== */}

                  <td className="py-2">
                    <input
                      type="text"
                      readOnly
                      value={
                        salePrice
                          ? `LKR ${salePrice}`
                          : ""
                      }
                      placeholder="No discount"
                      className="
                        h-[40px]
                        cursor-not-allowed
                        bg-gray-50
                        px-3
                        text-[11px]
                        text-gray-600
                        outline-none
                      "
                    />
                  </td>

                  {/* =====================================
                      STOCK
                  ===================================== */}

                  <td className="py-2">
                    <input
                      type="number"
                      min="0"
                      value={
                        variant.stockQty ??
                        ""
                      }
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "stockQty",
                          e.target.value
                        )
                      }
                      placeholder="Enter quantity"
                      className="
                        h-[40px]
                        w-full
                        bg-white
                        px-4
                        text-[11px]
                        outline-none
                      "
                    />
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}