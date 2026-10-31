"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FormSection from "./FormSection";
import FormField from "./FormField";

import type {
  ProductColor,
  ProductFormData,
  ProductImage,
  ProductSize,
  ProductVariant,
  ProductVolume,
} from "@/app/types/product";

import ProductImages from "./ProductImages";
import ProductPricing from "./ProductPricing";
import ProductVariants from "./ProductVariants";
import ProductVolumes from "./ProductVolumes";
import VariantStockTable from "./VariantStockTable";
import ProductTextFields from "./ProductTextFields";

interface ProductFormProps {
  productId?: number;
}

const PRODUCT_TYPES = {tshirt: "1", perfume: "2",} as const;

export default function ProductForm({productId,}: ProductFormProps) 
{
  const router = useRouter();
  const isEdit = Boolean(productId);
  const PRODUCT_DRAFT_KEY = "pizztol-product-draft";
  const [loading, setLoading] = useState<boolean>(isEdit);
  const [saving, setSaving] = useState<boolean>(false);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [volumes, setVolumes] = useState<ProductVolume[]>([]);
  const [selectedVolumes, setSelectedVolumes] = useState<number[]>([]);
  const [form, setForm] = useState<ProductFormData>({name: "", slug: "", brand: "", description: "", categoryId: "",});
  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [productDetails, setProductDetails] = useState<string[]>(["", "", "", "",]);
  const [careInstructions, setCareInstructions] =useState<string[]>(["", "", "",]);
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");

    const [colors, setColors] = useState<ProductColor[]>([
      {
        id: 1,
        name: "",
        code: "#ffffff",
      },
    ]);

  const isPerfume = form.categoryId === PRODUCT_TYPES.perfume;
  const isTShirt = form.categoryId === PRODUCT_TYPES.tshirt;


  useEffect(() => {initialize();}, [productId]);

  useEffect(() => {
  if (isEdit) {
    return;
  }

  loadDraft();
  }, [isEdit]);

  function loadDraft() {
    try {
      const saved = localStorage.getItem(PRODUCT_DRAFT_KEY);
      if (!saved) {
        console.log("No saved product draft found.");
        return;
      }

      const draft = JSON.parse(saved);

      if (draft.form) {
        setForm({
          name: draft.form.name ?? "",
          slug: draft.form.slug ?? "",
          brand: draft.form.brand ?? "",
          description: draft.form.description ?? "",
          categoryId: draft.form.categoryId ?? "",
        });
      }

      setColors(Array.isArray( draft.colors)? draft.colors : []);
      setSelectedSizes(Array.isArray(draft.selectedSizes)? draft.selectedSizes : []);
      setSelectedVolumes(Array.isArray(draft.selectedVolumes)? draft.selectedVolumes : []);
      setVariants(Array.isArray(draft.variants)? draft.variants : []);
      setProductDetails(Array.isArray(draft.productDetails)? draft.productDetails : []);
      setCareInstructions(Array.isArray(draft.careInstructions)? draft.careInstructions  : []);

      setImages(Array.isArray(draft.images)? draft.images  : []);

    } catch (error) {
      console.error("Load draft error:",error);
    }
  }

  async function initialize() {
  try {
    setLoading(true);

    const [
      sizesResponse,
      volumesResponse,
    ] = await Promise.all([
      fetch("/api/sizes", {
        cache: "no-store",
      }),

      fetch("/api/volumes", {
        cache: "no-store",
      }),
    ]);

    const sizesResult =
      await sizesResponse.json();

    const volumesResult =
      await volumesResponse.json();

    if (
      !sizesResponse.ok ||
      !sizesResult.success
    ) {
      throw new Error(
        sizesResult.message ||
          "Failed to load sizes"
      );
    }

    if (
      !volumesResponse.ok ||
      !volumesResult.success
    ) {
      throw new Error(
        volumesResult.message ||
          "Failed to load volumes"
      );
    }

    // =====================================================
    // MASTER SIZES
    // =====================================================

    const loadedSizes: ProductSize[] =
      Array.isArray(
        sizesResult.data
      )
        ? sizesResult.data
            .filter(
              (size: any) =>
                Number.isInteger(
                  Number(size.id)
                ) &&
                typeof size.name ===
                  "string" &&
                size.name.trim()
                  .length > 0
            )
            .map(
              (
                size: any
              ): ProductSize => ({
                id: Number(
                  size.id
                ),
                name: String(
                  size.name
                ).trim(),
              })
            )
        : [];

    setSizes(
      loadedSizes
    );

    // =====================================================
    // MASTER VOLUMES
    // =====================================================

    const loadedVolumes:
      ProductVolume[] =
      Array.isArray(
        volumesResult.data
      )
        ? volumesResult.data
            .filter(
              (volume: any) =>
                Number.isInteger(
                  Number(volume.id)
                ) &&
                typeof volume.name ===
                  "string" &&
                volume.name.trim()
                  .length > 0
            )
            .map(
              (
                volume: any
              ): ProductVolume => ({
                id: Number(
                  volume.id
                ),
                name: String(
                  volume.name
                ).trim(),
              })
            )
        : [];

    setVolumes(
      loadedVolumes
    );

    // =====================================================
    // CREATE MODE
    // =====================================================

    if (!productId) {
      setLoading(false);
      return;
    }

    // =====================================================
    // EDIT MODE
    // =====================================================

    await loadProduct(
      productId,
      loadedVolumes
    );

  } catch (error) {
    console.error(
      "Initialize product form error:",
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Failed to initialize product form."
    );
  } finally {
    setLoading(false);
  }
}


async function loadProduct(
  id: number,
  masterVolumes: ProductVolume[]
) {
  try {
    console.log(
      "Loading product ID:",
      id
    );

    const response = await fetch(
      `/api/products?id=${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const result =
      await response.json();

    console.log(
      "PRODUCT API RESPONSE:",
      result
    );

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to load product"
      );
    }

    const product =
      result.data;

    console.log(
      "PRODUCT DATA:",
      product
    );

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    // =====================================================
    // BASIC INFORMATION
    // =====================================================

    setForm({
      name:
        String(
          product.name ?? ""
        ),

      slug:
        String(
          product.slug ?? ""
        ),

      brand:
        String(
          product.brand ?? ""
        ),

      description:
        String(
          product.description ??
            ""
        ),

      categoryId:
        String(
          product.categoryId ??
            ""
        ),
    });

    // =====================================================
    // DETAILS
    // =====================================================

    setProductDetails(
      Array.isArray(
        product.productDetails
      )
        ? product.productDetails.map(
            (item: unknown) =>
              String(item)
          )
        : []
    );

    // =====================================================
    // CARE
    // =====================================================

    setCareInstructions(
      Array.isArray(
        product.careInstructions
      )
        ? product.careInstructions.map(
            (item: unknown) =>
              String(item)
          )
        : []
    );

    // =====================================================
    // IMAGES
    // =====================================================

    if (
      Array.isArray(
        product.images
      )
    ) {
      const loadedImages =
        product.images.map(
          (image: any) => ({
            id: Number(
              image.id
            ),

            url:
              image.imageUrl ??
              "",

            imageUrl:
              image.imageUrl ??
              "",

            altText:
              image.altText ??
              "",

            sortOrder:
              Number(
                image.sortOrder ??
                  0
              ),

            isHover:
              Boolean(
                image.isHover
              ),
          })
        );

      console.log(
        "LOADED IMAGES:",
        loadedImages
      );

      setImages(
        loadedImages
      );
    } else {
      setImages([]);
    }

    // =====================================================
    // VARIANTS
    // =====================================================

    const apiVariants =
      Array.isArray(
        product.variants
      )
        ? product.variants
        : [];

    console.log(
      "API VARIANTS:",
      apiVariants
    );

    const loadedVariants:
      ProductVariant[] =
      apiVariants.map(
        (variant: any) => ({
          color:
            variant.colorName ??
            undefined,

          colorName:
            variant.colorName ??
            undefined,

          colorCode:
            variant.colorCode ??
            undefined,

          size:
            variant.size?.name ??
            undefined,

          sizeId:
            variant.sizeId != null
              ? Number(
                  variant.sizeId
                )
              : null,

          volume:
            variant.volume?.name ??
            undefined,

          volumeId:
            variant.volumeId != null
              ? Number(
                  variant.volumeId
                )
              : null,

          sku:
            variant.sku ?? "",

          stockQty:
            String(
              variant.stockQty ??
                ""
            ),

          regularPrice:
            String(
              variant.price ??
                ""
            ),

          discountPercent:
            String(
              variant.discountPercent ??
                ""
            ),

          salePrice:
            variant.salePrice !=
            null
              ? String(
                  variant.salePrice
                )
              : "",
        })
      );

    console.log(
      "LOADED VARIANTS:",
      loadedVariants
    );

    setVariants(
      loadedVariants
    );

    // =====================================================
    // COLORS
    // =====================================================

    const colorMap =
      new Map<
        string,
        ProductColor
      >();

    loadedVariants.forEach(
      (variant) => {
        if (
          !variant.colorName
        ) {
          return;
        }

        const name =
          variant.colorName.trim();

        const code =
          variant.colorCode ??
          "#ffffff";

        const key =
          `${name.toLowerCase()}-${code.toLowerCase()}`;

        if (
          !colorMap.has(key)
        ) {
          colorMap.set(key, {
            id:
              Date.now() +
              Math.floor(
                Math.random() *
                  100000
              ),

            name,

            code,
          });
        }
      }
    );

    if (
      colorMap.size > 0
    ) {
      setColors(
        Array.from(
          colorMap.values()
        )
      );
    } else {
      setColors([]);
    }

    // =====================================================
    // SIZES
    // =====================================================

    const uniqueSizeIds =
      Array.from(
        new Set(
          loadedVariants
            .map(
              (variant) =>
                variant.sizeId
            )
            .filter(
              (
                id
              ): id is number =>
                typeof id ===
                  "number" &&
                id > 0
            )
        )
      );

    console.log(
      "SELECTED SIZE IDS:",
      uniqueSizeIds
    );

    setSelectedSizes(
      uniqueSizeIds
    );

    // =====================================================
    // VOLUMES
    // =====================================================

    const uniqueVolumeIds =
      Array.from(
        new Set(
          loadedVariants
            .map(
              (variant) =>
                variant.volumeId
            )
            .filter(
              (
                id
              ): id is number =>
                typeof id ===
                  "number" &&
                id > 0
            )
        )
      );

    console.log(
      "SELECTED VOLUME IDS:",
      uniqueVolumeIds
    );

    setSelectedVolumes(
      uniqueVolumeIds
    );

    setVolumes(
      masterVolumes
    );

  } catch (error) {
    console.error(
      "Load product error:",
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Failed to load product."
    );
  }
}



 // ======================

 function calculateSalePrice(
  regularPriceValue: string,
  discountPercentValue: string
): string {
  const price = Number(
    regularPriceValue
  );

  const discountValue = Number(
    discountPercentValue || 0
  );

  if (
    !Number.isFinite(price) ||
    price < 0
  ) {
    return "";
  }

  if (
    !Number.isFinite(discountValue) ||
    discountValue < 0 ||
    discountValue > 100
  ) {
    return "";
  }

  const result =
    price -
    price * (discountValue / 100);

  return result.toFixed(2);
}

  // =========================================================
  // GENERATE T-SHIRT VARIANTS
  // =========================================================

function generateVariants() {
  if (
    colors.length === 0 ||
    selectedSizes.length === 0
  ) {
    return;
  }

  const generated: ProductVariant[] = [];

  for (const color of colors) {
    for (const sizeId of selectedSizes) {
      const size = sizes.find(
        (item) => item.id === sizeId
      );

      if (!size) {
        continue;
      }

      // ==========================================
      // FIND EXISTING VARIANT
      // ==========================================

      const existing = variants.find(
        (variant) =>
          variant.colorName === color.name &&
          variant.colorCode === color.code &&
          variant.sizeId === size.id
      );

      const existingRegularPrice =
        existing?.regularPrice ||
        regularPrice;

      const existingDiscount =
        existing?.discountPercent ??
        discount;

      const calculatedSalePrice =
        calculateSalePrice(
          existingRegularPrice,
          existingDiscount
        );

      // ==========================================
      // CREATE VARIANT
      // ==========================================

      const variant: ProductVariant = {
        color: color.name,

        colorName: color.name,

        colorCode: color.code,

        size: size.name,

        sizeId: size.id,

        volumeId: null,

        sku:
          existing?.sku ||
          generateTShirtSku(
            color.name,
            size.name
          ),

        stockQty:
          existing?.stockQty || "",

        regularPrice:
          existingRegularPrice,

        discountPercent:
          existingDiscount || "",

        salePrice:
          existing?.salePrice ||
          calculatedSalePrice,
      };

      generated.push(variant);
    }
  }

  setVariants(generated);
}

  // =========================================================
  // T-SHIRT SKU
  // =========================================================

  function generateTShirtSku(
    color: string,
    size: string
  ) {
    const productCode =
      form.name
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          ""
        )
        .slice(0, 3) ||
      "PRD";

    const colorCode =
      color
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          ""
        )
        .slice(0, 3) ||
      "CLR";

    const sizeCode =
      size
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          ""
        );

    return `${productCode}-${colorCode}-${sizeCode}`;
  }

  // =========================================================
  // GENERATE PERFUME VARIANTS
  // =========================================================

function generatePerfumeVariants() {
  if (selectedVolumes.length === 0) {
    alert(
      "Please select at least one volume."
    );

    return;
  }

  const generated: ProductVariant[] = [];

  for (const volumeId of selectedVolumes) {
    const volume = volumes.find(
      (item) => item.id === volumeId
    );

    if (!volume) {
      continue;
    }

    const existing = variants.find(
      (variant) =>
        variant.volumeId === volume.id
    );

    const existingRegularPrice =
      existing?.regularPrice ||
      regularPrice;

    const existingDiscount =
      existing?.discountPercent ??
      discount;

    const calculatedSalePrice =
      calculateSalePrice(
        existingRegularPrice,
        existingDiscount
      );

    const variant: ProductVariant = {
      color: undefined,
      colorName: undefined,
      colorCode: undefined,

      size: undefined,

      sizeId: null,

      volumeId: volume.id,

      volume: volume.name,

      sku:
        existing?.sku ||
        generatePerfumeSku(volume),

      stockQty:
        existing?.stockQty || "",

      regularPrice:
        existingRegularPrice,

      discountPercent:
        existingDiscount || "",

      salePrice:
        existing?.salePrice ||
        calculatedSalePrice,
    };

    generated.push(variant);
  }

  setVariants(generated);
}

  // =========================================================
  // PERFUME SKU
  // =========================================================

function generatePerfumeSku(volume: ProductVolume) {
  const productCode =
    form.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3) || "PRD";

  const volumeCode =
    volume.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

  return `${productCode}-${volumeCode}`;
}

  // =========================================================
  // BUILD API VARIANTS
  // =========================================================

function buildVariantsPayload() {
  return variants.map((variant) => {
    const regularPriceValue =
      Number(
        variant.regularPrice || 0
      );

    const discountPercentValue =
      Number(
        variant.discountPercent || 0
      );

    const salePriceValue =
      calculateSalePrice(
        variant.regularPrice,
        variant.discountPercent
      );

    return {
      sku: variant.sku.trim(),

      stockQty: Number(
        variant.stockQty || 0
      ),

      // ==========================================
      // PRICE
      // ==========================================

      price: regularPriceValue,

      discountPercent:
        discountPercentValue,

      salePrice:
        salePriceValue
          ? Number(salePriceValue)
          : regularPriceValue,

      // ==========================================
      // COLOR
      // ==========================================

      colorName:
        isTShirt
          ? variant.colorName ||
            variant.color ||
            null
          : null,

      colorCode:
        isTShirt
          ? variant.colorCode ||
            null
          : null,

      // ==========================================
      // SIZE
      // ==========================================

      sizeId:
        isTShirt
          ? variant.sizeId ?? null
          : null,

      // ==========================================
      // VOLUME
      // ==========================================

      volumeId:
        isPerfume
          ? variant.volumeId ?? null
          : null,
    };
  });
}

  // =========================================================
  // SUBMIT
  // =========================================================

async function handleSubmit(
  event: React.FormEvent
) {
  event.preventDefault();

  // =====================================================
  // BASIC VALIDATION
  // =====================================================

  if (!form.name.trim()) {
    alert(
      "Product name is required."
    );
    return;
  }

  if (!form.categoryId) {
    alert(
      "Please select a product type."
    );
    return;
  }

  // =====================================================
  // T-SHIRT VALIDATION
  // =====================================================

  if (
    isTShirt &&
    selectedSizes.length === 0
  ) {
    alert(
      "Please select at least one size."
    );
    return;
  }

  if (
    isTShirt &&
    colors.length === 0
  ) {
    alert(
      "Please add at least one color."
    );
    return;
  }

  // =====================================================
  // PERFUME VALIDATION
  // =====================================================

  if (
    isPerfume &&
    volumes.length === 0
  ) {
    alert(
      "No perfume volumes are available."
    );
    return;
  }

  // =====================================================
  // VARIANT VALIDATION
  // =====================================================

  if (
    variants.length === 0
  ) {
    alert(
      "Please generate at least one product variant."
    );
    return;
  }

  if (
    variants.some(
      (variant) =>
        !variant.sku?.trim()
    )
  ) {
    alert(
      "Every variant must have a SKU."
    );
    return;
  }

  if (
    variants.some(
      (variant) =>
        Number(
          variant.stockQty || 0
        ) < 0
    )
  ) {
    alert(
      "Stock quantity cannot be negative."
    );
    return;
  }

  // =====================================================
  // EDIT VALIDATION
  // =====================================================

  if (
    isEdit &&
    (!productId ||
      Number(productId) <= 0)
  ) {
    alert(
      "Invalid product ID."
    );
    return;
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  try {
    setSaving(true);

    // ===================================================
    // BUILD PAYLOAD
    // ===================================================

    const payload = {
      name: form.name.trim(),

      brand:
        form.brand?.trim() ||
        null,

      description:
        form.description?.trim() ||
        null,

      categoryId:
        Number(
          form.categoryId
        ),

      // ==========================================
      // PRODUCT DETAILS
      // ==========================================

      productDetails:
        productDetails
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean),

      // ==========================================
      // CARE INSTRUCTIONS
      // ==========================================

      careInstructions:
        careInstructions
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean),

      // ==========================================
      // VARIANTS
      // ==========================================

      variants:
        buildVariantsPayload(),

      // ==========================================
      // IMAGES
      // ==========================================

      images:
        images
          .filter(
            (image) =>
              image.imageUrl ||
              image.url
          )
          .map(
            (
              image,
              index
            ) => ({
              imageUrl:
                image.imageUrl ??
                image.url ??
                "",

              altText:
                image.altText ??
                null,

              sortOrder:
                image.sortOrder ??
                index,

              isHover:
                image.isHover ??
                index === 1,
            })
          ),
    };

    // ===================================================
    // DEBUG
    // ===================================================

    console.log(
      isEdit
        ? "Updating product:"
        : "Creating product:",
      payload
    );

    // ===================================================
    // API URL
    // ===================================================

    const apiUrl = isEdit
      ? `/api/products?id=${productId}`
      : "/api/products";

    // ===================================================
    // API REQUEST
    // ===================================================

    const response =
      await fetch(apiUrl, {
        method: isEdit
          ? "PUT"
          : "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        credentials:
          "include",

        body:
          JSON.stringify(
            payload
          ),
      });

    // ===================================================
    // RESPONSE
    // ===================================================

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to save product"
      );
    }

    // ===================================================
    // SUCCESS
    // ===================================================

    localStorage.removeItem(
      PRODUCT_DRAFT_KEY
    );

    alert(
      isEdit
        ? "Product updated successfully."
        : "Product created successfully."
    );

    router.push(
      "/admin/products"
    );

    router.refresh();

  } catch (error) {
    console.error(
      "Save product error:",
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Failed to save product."
    );

  } finally {
    setSaving(false);
  }
}

  function saveDraft() {
  try {
    const draft = {
      form,

      colors,

      selectedSizes,

      selectedVolumes,

      variants,

      productDetails,

      careInstructions,

      images: images.map(
        (image) => ({
          id: image.id,
          url: image.url,
          imageUrl:
            image.imageUrl ??
            null,
          altText:
            image.altText ??
            null,
          sortOrder:
            image.sortOrder ??
            0,
          isHover:
            image.isHover ??
            false,
        })
      ),

      savedAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      PRODUCT_DRAFT_KEY,
      JSON.stringify(draft)
    );

    alert(
      "Product draft saved successfully."
    );
  } catch (error) {
    console.error(
      "Save draft error:",
      error
    );

    alert(
      "Failed to save product draft."
    );
  }
}


function clearDraft() {
  const confirmed =
    window.confirm(
      "Are you sure you want to delete the saved product draft?"
    );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(
    PRODUCT_DRAFT_KEY
  );

  alert(
    "Product draft deleted."
  );
}

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-[13px] text-[#09213f]">
        Loading product...
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <form
      onSubmit={
        handleSubmit

      }
      className="
        min-h-screen
        bg-[#f1f1f1]
        px-6
        py-8
      "
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[21px] font-semibold text-[#09213f]">
            {isEdit
              ? "Edit Product"
              : "Add New Product"}
          </h1>

          <p className="mt-1 text-[13px] text-[#09213f]">
            {isEdit
              ? "Update product details, images, pricing and variants."
              : "Add product details, images, pricing and available variants."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="
              h-[40px]
              bg-black
              px-6
              text-[12px]
              font-medium
              text-white
              transition
              hover:bg-[#1c1c1c]
            "
          >
            Save as Draft
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              h-[40px]
              bg-green-500
              px-6
              text-[12px]
              font-medium
              text-white
              transition
              hover:bg-green-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving
              ? "Saving..."
              : isEdit
              ? "Update Product"
              : "Publish Product"}
          </button>
        </div>
      </div>

      {/* ===================================================
          1. PRODUCT TYPE
      =================================================== */}

      <FormSection
        number="1."
        title="Product Type"
      >
        <select
          value={
            form.categoryId
          }
          onChange={(e) => {
            const categoryId =
              e.target.value;

            setForm(
              (previous) => ({
                ...previous,
                categoryId,
              })
            );

            /*
             * Changing product type means
             * previously generated variants
             * are no longer valid.
             */

            setVariants([]);

            if (
              categoryId ===
              PRODUCT_TYPES.perfume
            ) {
              setSelectedSizes(
                []
              );
            }

            if (
              categoryId ===
              PRODUCT_TYPES.tshirt
            ) {
              /*
               * Keep the master volumes.
               * They are database data.
               */

              setVariants([]);
            }
          }}
          className="
            form-input
            w-full
            cursor-pointer
            bg-white
            px-4
            py-3
            text-[14px]
            font-medium
            text-gray-700
          "
        >
          <option value="">
            Select Your Product Type
          </option>

          <option
            value={
              PRODUCT_TYPES.tshirt
            }
          >
            T-Shirts
          </option>

          <option
            value={
              PRODUCT_TYPES.perfume
            }
          >
            Perfume
          </option>
        </select>
      </FormSection>

      {/* ===================================================
          2. BASIC INFORMATION
      =================================================== */}

      <FormSection
        number="2."
        title="Basic Information"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Product Name">
            <input
              type="text"
              value={
                form.name
              }
              onChange={(e) =>
                setForm(
                  (previous) => ({
                    ...previous,
                    name:
                      e.target.value,
                  })
                )
              }
              placeholder="Enter product name"
              className="
                form-input
                w-full
                bg-white
                px-4
                py-3
                text-[14px]
                font-medium
                text-gray-700
              "
            />
          </FormField>

          <FormField label="Brand">
            <input
              type="text"
              value={
                form.brand
              }
              onChange={(e) =>
                setForm(
                  (previous) => ({
                    ...previous,
                    brand:
                      e.target.value,
                  })
                )
              }
              placeholder="Enter brand"
              className="
                form-input
                w-full
                bg-white
                px-4
                py-3
                text-[14px]
                font-medium
                text-gray-700
              "
            />
          </FormField>
        </div>

        <div className="mt-5">
          <FormField label="Product Description">
            <textarea
              value={
                form.description
              }
              onChange={(e) =>
                setForm(
                  (previous) => ({
                    ...previous,
                    description:
                      e.target.value,
                  })
                )
              }
              rows={4}
              placeholder="Write a detailed product description"
              className="
                form-input
                h-auto
                w-full
                resize-none
                bg-white
                px-4
                py-4
                text-[14px]
                font-medium
                text-gray-700
              "
            />
          </FormField>
        </div>
      </FormSection>

      {/* ===================================================
          3. PRODUCT IMAGES
      =================================================== */}

      <FormSection
        number="3."
        title="Product Images"
      >
        <ProductImages
          images={
            images
          }
          onChange={
            setImages
          }
        />
      </FormSection>

      {/* ===================================================
          4. PRICING
      =================================================== */}

      {/* <FormSection
        number="4."
        title="Pricing"
      >
        <ProductPricing
          regularPrice={
            regularPrice
          }
          salePrice={
            salePrice
          }
          discount={
            discount
          }
          setRegularPrice={
            setRegularPrice
          }
          setSalePrice={
            setSalePrice
          }
          setDiscount={
            setDiscount
          }
        />
      </FormSection> */}

      {/* ===================================================
          5. PRODUCT VARIANTS
      =================================================== */}

      <FormSection
        number="5."
        title="Product Variants"
      >
        {isPerfume ? (
        <ProductVolumes
        volumes={volumes}
        selectedVolumes={selectedVolumes}
        onChange={setSelectedVolumes}
        onGenerate={generatePerfumeVariants}
        />
        ) : (
          <ProductVariants
            colors={
              colors
            }
            selectedSizes={
              selectedSizes
            }
            sizes={
              sizes 
            }
            onColorsChange={
              setColors
            }
            onSizesChange={
              setSelectedSizes
            }
            onGenerate={
              generateVariants
            }
          />
        )}
      </FormSection>

      {/* ===================================================
          6. VARIANT STOCK
      =================================================== */}

      <FormSection
        number="6."
        title="Variant Pricing and Stock"
      >
        <VariantStockTable
          variants={
            variants
          }
          type={
            isPerfume
              ? "volume"
              : "size"
          }
          onChange={
            setVariants
          }
        />
      </FormSection>

      {/* ===================================================
          7. PRODUCT DETAILS
      =================================================== */}

      <FormSection
        number="7."
        title="Product Details"
      >
        <ProductTextFields
          values={
            productDetails
          }
          onChange={
            setProductDetails
          }
          placeholder="Enter product detail"
          buttonText="Add product detail"
        />
      </FormSection>

      {/* ===================================================
          8. CARE INSTRUCTIONS
      =================================================== */}

      <FormSection
        number="8."
        title="Care Instructions"
      >
        <ProductTextFields
          values={
            careInstructions
          }
          onChange={
            setCareInstructions
          }
          placeholder="Enter care instruction"
          buttonText="Add care instruction"
        />
      </FormSection>

      {/* ===================================================
          9. DELIVERY
      =================================================== */}

      <FormSection
        number="9."
        title="Delivery Information"
      >
        <p className="text-[12px] leading-6 text-[#222]">
          Delivery information is
          applied to all products.
          You can update it anytime
          from Store Settings.
        </p>
      </FormSection>

      {/* ===================================================
          10. RETURN POLICY
      =================================================== */}

      <FormSection
        number="10."
        title="Return & Exchange Policy"
      >
        <p className="text-[12px] leading-6 text-[#222]">
          The selected return policy
          will be applied to this
          product. You can manage
          policies anytime from Store
          Settings.
        </p>
      </FormSection>

      {/* ===================================================
          BOTTOM ACTIONS
      =================================================== */}

      <div className="mt-12 flex flex-wrap justify-end gap-4 pb-10">
        <button
          type="button"
          onClick={() => {
  localStorage.removeItem(
    PRODUCT_DRAFT_KEY
  );

  router.back();
}}
          className="
            h-[40px]
            bg-red-600
            px-7
            text-[12px]
            font-medium
            text-white
            transition
            hover:bg-red-700
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={saveDraft}
          className="
            h-[40px]
            bg-black
            px-7
            text-[12px]
            font-medium
            text-white
            transition
            hover:bg-[#1c1c1c]
          "
        >
          Save as Draft
        </button>

        <button
          type="submit"
          disabled={saving}
          className="
            h-[40px]
            bg-green-500
            px-7
            text-[12px]
            font-medium
            text-white
            transition
            hover:bg-green-600
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {saving
            ? "Saving..."
            : isEdit
            ? "Update Product"
            : "Publish Product"}
        </button>
      </div>
    </form>
    );
  };
