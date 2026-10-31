"use client";

import Image from "next/image";
import {
  Search,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

interface ProductVariant {
  id: number;
  sku: string;

  price: number | string;

  discountPercent:
    | number
    | string;

  salePrice:
    | number
    | string
    | null;

  stockQty: number;

  colorName?: string | null;
  colorCode?: string | null;

  size?: {
    id: number;
    name: string;
  } | null;

  volume?: {
    id: number;
    name: string;
  } | null;
}

interface ProductImage {
  id: number;

  imageUrl: string;

  altText?: string | null;

  sortOrder: number;

  isHover: boolean;
}

interface Product {
  id: number;

  name: string;

  slug: string;

  brand?: string | null;

  description?: string | null;

  categoryId: number;

  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;

  variants: ProductVariant[];

  images: ProductImage[];
}

interface ProductSearchProps {
  isOpen: boolean;

  onClose: () => void;

  categoryId?: number | null;
}

export default function ProductSearch({
  isOpen,
  onClose,
  categoryId = null,
}: ProductSearchProps) {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    const timer =
      setTimeout(() => {
        loadProducts();
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [
    search,
    categoryId,
    isOpen,
  ]);

  // =====================================================
  // LOAD PRODUCTS FUNCTION
  // =====================================================

  async function loadProducts() {
    try {
      setLoading(true);

      const params =
        new URLSearchParams();

      // Search
      if (search.trim()) {
        params.set(
          "name",
          search.trim()
        );
      }

      // Category
      if (categoryId) {
        params.set(
          "categoryId",
          String(categoryId)
        );
      }

      const query =
        params.toString();

      const response =
        await fetch(
          query
            ? `/api/products?${query}`
            : "/api/products",
          {
            cache: "no-store",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load products"
        );
      }

      setProducts(
        Array.isArray(
          result.data
        )
          ? result.data
          : []
      );
    } catch (error) {
      console.error(
        "Search products error:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // CLOSE
  // =====================================================

  function handleClose() {
    setSearch("");
    setProducts([]);
    onClose();
  }

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen]);

  // =====================================================
  // PREVENT BODY SCROLL
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);

  // =====================================================
  // GET LOWEST VARIANT
  // =====================================================

  function getLowestVariant(
    product: Product
  ) {
    if (
      !product.variants ||
      product.variants.length === 0
    ) {
      return null;
    }

    return [...product.variants].sort(
      (a, b) => {
        const priceA =
          Number(
            a.salePrice ??
              a.price
          );

        const priceB =
          Number(
            b.salePrice ??
              b.price
          );

        return priceA - priceB;
      }
    )[0];
  }

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  function formatPrice(
    value: number | string
  ) {
    return Number(
      value
    ).toLocaleString(
      "en-LK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  // =====================================================
  // PRODUCT CLICK
  // =====================================================

  function handleProductClick(
    product: Product
  ) {
    handleClose();

    router.push(
      `/products/${product.slug}`
    );
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        overflow-y-auto
        bg-white
      "
    >
      {/* =================================================
          SEARCH HEADER
      ================================================= */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-6
          pb-0
          pt-7
          md:px-10
          lg:px-[58px]
        "
      >
        <div
          className="
            flex
            h-[60px]
            items-center
            border-b
            border-[#bcbcbc]
          "
        >
          {/* Search icon */}

          <Search
            size={24}
            strokeWidth={1.5}
            className="
              mr-5
              shrink-0
              text-black
            "
          />

          {/* Search input */}

          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search"
            className="
              h-full
              flex-1
              bg-transparent
              text-[16px]
              font-normal
              text-[#222]
              outline-none
              placeholder:text-[#777]
            "
          />

          {/* Loading */}

          {loading && (
            <span
              className="
                mr-5
                text-[11px]
                text-gray-400
              "
            >
              Searching...
            </span>
          )}

          {/* Close */}

          <button
            type="button"
            onClick={handleClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              text-black
              transition
              hover:opacity-50
            "
            aria-label="Close search"
          >
            <X
              size={25}
              strokeWidth={1.7}
            />
          </button>
        </div>
      </div>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-6
          pb-16
          pt-[74px]
          md:px-10
          lg:px-[58px]
        "
      >
        {/* =================================================
            NO RESULTS
        ================================================= */}

        {!loading &&
          products.length === 0 && (
            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
                text-center
              "
            >
              <div>
                <p
                  className="
                    text-[14px]
                    font-medium
                    text-[#222]
                  "
                >
                  {search.trim()
                    ? "No products found"
                    : "No products available"}
                </p>

                {search.trim() && (
                  <p
                    className="
                      mt-2
                      text-[12px]
                      text-gray-500
                    "
                  >
                    Try another search
                    term.
                  </p>
                )}
              </div>
            </div>
          )}

        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        {products.length > 0 && (
          <div
            className="
              grid
              grid-cols-2
              gap-x-5
              gap-y-10
              md:grid-cols-3
              lg:grid-cols-4
              lg:gap-x-[22px]
              lg:gap-y-[42px]
            "
          >
            {products.map(
              (product) => {
                const variant =
                  getLowestVariant(
                    product
                  );

                if (!variant) {
                  return null;
                }

                const regularPrice =
                  Number(
                    variant.price
                  );

                const salePrice =
                  variant.salePrice !=
                  null
                    ? Number(
                        variant.salePrice
                      )
                    : regularPrice;

                const discount =
                  Number(
                    variant.discountPercent ??
                      0
                  );

                const hasDiscount =
                  discount > 0 &&
                  salePrice <
                    regularPrice;

                const image =
                  product.images?.[0];

                const isPerfume =
                  product.category
                    ?.slug ===
                  "perfumes";

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() =>
                      handleProductClick(
                        product
                      )
                    }
                    className="
                      group
                      text-left
                    "
                  >
                    {/* IMAGE */}

                    <div
                      className="
                        relative
                        aspect-square
                        w-full
                        overflow-hidden
                        bg-[#f5f5f3]
                      "
                    >
                      {image?.imageUrl ? (
                        <Image
                          src={
                            image.imageUrl
                          }
                          alt={
                            image.altText ||
                            product.name
                          }
                          fill
                          sizes="
                            (max-width: 768px) 50vw,
                            (max-width: 1024px) 33vw,
                            25vw
                          "
                          className="
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-[1.02]
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            text-[11px]
                            text-gray-400
                          "
                        >
                          No Image
                        </div>
                      )}

                      {/* DISCOUNT */}

                      {hasDiscount && (
                        <span
                          className="
                            absolute
                            right-4
                            top-4
                            flex
                            h-[30px]
                            min-w-[68px]
                            items-center
                            justify-center
                            rounded-full
                            bg-[#e60000]
                            px-3
                            text-[12px]
                            font-semibold
                            text-white
                          "
                        >
                          -
                          {Math.round(
                            discount
                          )}
                          %
                        </span>
                      )}
                    </div>

                    {/* PRODUCT NAME */}

                    <h3
                      className="
                        mt-5
                        text-[16px]
                        font-normal
                        tracking-[0.01em]
                        text-[#171717]
                      "
                    >
                      {product.name}
                    </h3>

                    {/* PRICE */}

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        gap-2
                        text-[14px]
                      "
                    >
                      {isPerfume && (
                        <span
                          className="
                            font-semibold
                            text-[#111]
                          "
                        >
                          FROM
                        </span>
                      )}

                      {hasDiscount && (
                        <span
                          className="
                            text-[#777]
                            line-through
                          "
                        >
                          LKR{" "}
                          {formatPrice(
                            regularPrice
                          )}
                        </span>
                      )}

                      <span
                        className="
                          font-semibold
                          text-[#e00000]
                        "
                      >
                        LKR{" "}
                        {formatPrice(
                          salePrice
                        )}
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}