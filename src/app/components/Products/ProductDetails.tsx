"use client";

import Image from "next/image";
import { Minus, Plus, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Container from "../Container";
import { addToCart } from "@/app/types/cart";

type ProductImage = {
  id: number;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isHover: boolean;
};

type ProductVariant = {
  id: number;
  productId: number;
  sizeId: number | null;
  volumeId: number | null;
  sku: string;
  stockQty: number;
  price: string;
  discountPercent: string;
  salePrice: string;
  colorName: string | null;
  colorCode: string | null;

  size: {
    id: number;
    name: string;
  } | null;

  volume: {
    id: number;
    name: string;
  } | null;
};

type Product = {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  brand: string;
  description: string;

  productDetails: string[];
  careInstructions: string[];

  isActive: boolean;

  category: {
    id: number;
    name: string;
    slug: string;
  };

  variants: ProductVariant[];

  images: ProductImage[];
};

type Props = {
  product: Product;
};

export default function ProductDetails({
  product,
}: Props) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(
      product.variants[0] ?? null
    );

  const [quantity, setQuantity] = useState(1);

  const [openReturn, setOpenReturn] = useState(true);

  // ==========================================
  // SCROLL CONTAINERS
  // ==========================================

  const imageContainerRef =
    useRef<HTMLDivElement>(null);

  const contentContainerRef =
    useRef<HTMLDivElement>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "";

  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) {
      return url;
    }

    return `${API_URL}${url}`;
  };

  // ==========================================
  // CUSTOM DESKTOP SCROLL
  // ==========================================

  useEffect(() => {
    const imageContainer =
      imageContainerRef.current;

    const contentContainer =
      contentContainerRef.current;

    if (
      !imageContainer ||
      !contentContainer
    ) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      // Only enable this behavior on desktop
      if (window.innerWidth < 1024) {
        return;
      }

      const delta = event.deltaY;

      const imageAtTop =
        imageContainer.scrollTop <= 0;

      const imageAtBottom =
        imageContainer.scrollTop +
          imageContainer.clientHeight >=
        imageContainer.scrollHeight - 1;

      const contentAtTop =
        contentContainer.scrollTop <= 0;

      const contentAtBottom =
        contentContainer.scrollTop +
          contentContainer.clientHeight >=
        contentContainer.scrollHeight - 1;

      // ==========================================
      // SCROLL DOWN
      // ==========================================

      if (delta > 0) {
        // First: scroll LEFT images
        if (!imageAtBottom) {
          event.preventDefault();

          imageContainer.scrollTop += delta;

          return;
        }

        // Then: scroll RIGHT content
        if (!contentAtBottom) {
          event.preventDefault();

          contentContainer.scrollTop += delta;

          return;
        }

        // Both finished
        // Allow normal page scrolling
        return;
      }

      // ==========================================
      // SCROLL UP
      // ==========================================

      if (delta < 0) {
        // First: scroll RIGHT content back
        if (!contentAtTop) {
          event.preventDefault();

          contentContainer.scrollTop += delta;

          return;
        }

        // Then: scroll LEFT images back
        if (!imageAtTop) {
          event.preventDefault();

          imageContainer.scrollTop += delta;

          return;
        }

        // Both at top
        // Allow normal page scrolling
      }
    };

    window.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      }
    );

    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel
      );
    };
  }, []);

  // ==========================================
  // PRICE
  // ==========================================

  const originalPrice = Number(
    selectedVariant?.price ?? 0
  );

  const salePrice = Number(
    selectedVariant?.salePrice ??
      selectedVariant?.price ??
      0
  );

  const discount = Number(
    selectedVariant?.discountPercent ?? 0
  );

  // ==========================================
  // SIZES
  // ==========================================

  const sizes = Array.from(
    new Map(
      product.variants
        .filter((variant) => variant.size)
        .map((variant) => [
          variant.size!.id,
          variant.size!,
        ])
    ).values()
  );

  // ==========================================
  // COLORS
  // ==========================================

  const colors = Array.from(
    new Map(
      product.variants
        .filter(
          (variant) => variant.colorName
        )
        .map((variant) => [
          variant.colorCode ??
            variant.colorName,
          {
            name: variant.colorName!,
            code: variant.colorCode,
          },
        ])
    ).values()
  );

  // ==========================================
  // SIZE CHANGE
  // ==========================================

  const handleSizeChange = (
    sizeId: number
  ) => {
    const variant =
      product.variants.find(
        (item) =>
          item.size?.id === sizeId
      );

    if (!variant) return;

    setSelectedVariant(variant);
    setQuantity(1);
  };

  // ==========================================
  // QUANTITY
  // ==========================================

  const increaseQuantity = () => {
    if (!selectedVariant) return;

    if (
      quantity <
      selectedVariant.stockQty
    ) {
      setQuantity(
        (current) => current + 1
      );
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
  // ==========================================
  // CHECK VARIANT
  // ==========================================

  if (!selectedVariant) {
    alert("Please select a volume.");
    return;
  }

  // ==========================================
  // CHECK STOCK
  // ==========================================

  if (selectedVariant.stockQty <= 0) {
    alert("This item is out of stock.");
    return;
  }

  if (
    quantity >
    selectedVariant.stockQty
  ) {
    alert(
      `Only ${selectedVariant.stockQty} items available.`
    );

    return;
  }

  // ==========================================
  // GET MAIN IMAGE
  // ==========================================

  const mainImage =
    product.images.find(
      (image) => !image.isHover
    ) ??
    product.images[0];

  // ==========================================
  // GET PRICE
  // ==========================================

  const salePrice = Number(
    selectedVariant.salePrice
  );

  const regularPrice = Number(
    selectedVariant.price
  );

  const price =
    salePrice > 0
      ? salePrice
      : regularPrice;

  // ==========================================
  // CREATE CART ITEM
  // ==========================================

  const cartItem = {
    cartItemId: `${product.id}-${selectedVariant.id}`,

    productId: product.id,

    name: product.name,

    slug: product.slug,

    variantId: selectedVariant.id,

    sku: selectedVariant.sku,

    price,

    quantity,

    image:
      mainImage?.imageUrl ?? "",

    sizeId:
      selectedVariant.sizeId,

    sizeName:
      selectedVariant.size?.name ??
      null,

    volumeId:
      selectedVariant.volumeId,

    volumeName:
      selectedVariant.volume?.name ??
      null,

    colorName:
      selectedVariant.colorName ??
      null,

    colorCode:
      selectedVariant.colorCode ??
      null,

    stockQty:
      selectedVariant.stockQty,
  };

  // ==========================================
  // SAVE TO LOCAL STORAGE
  // ==========================================

  addToCart(cartItem);

  alert("Added to cart!");
};

  return (
    <main className="mx-auto mt-20 py-10  lg:py-14">

    <Container>

   <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">

        {/* ================================= */}
        {/* LEFT - IMAGES */}
        {/* ================================= */}

        <div
          ref={imageContainerRef}
          className="
            space-y-4
            
            lg:h-screen
            lg:overflow-y-auto
            lg:pr-2

            scrollbar-none
          "
        >
          {[...product.images]
            .sort(
              (a, b) =>
                a.sortOrder -
                b.sortOrder
            )
            .map((image, index) => (
              <div
                key={image.id}
                className="
                  relative
                  h-[450px] sm:h-[600px] md:h-[750px] lg:h-[680px]
                  overflow-hidden
                  bg-[#f5f5f5]
                "
              >
                <Image
                  src={getImageUrl(
                    image.imageUrl
                  )}
                  alt={
                    image.altText ??
                    product.name
                  }
                  fill
                  priority={index === 0}
                  className="object-cover "
                  sizes="
                    (max-width: 1024px) 100vw,
                    50vw
                  "
                />
              </div>
            ))}
        </div>

        {/* ================================= */}
        {/* RIGHT - INFORMATION */}
        {/* ================================= */}

        <div
          ref={contentContainerRef}
          className="
            lg:h-screen
            lg:overflow-y-auto
            lg:pl-10
            lg:pr-4
            scrollbar-none
          "
        >

          {/* Product Name */}

          <h1 className="font-heading text-[24px] font-medium uppercase tracking-[0.04em] text-black md:text-[34px]">
            {product.name}
          </h1>

          {/* ================================= */}
          {/* PRICE */}
          {/* ================================= */}

          <div className="mt-2 md:mt-3 flex items-center gap-4">

            <span className="text-[16px] md:text-[24px] font-semibold text-[#c90000]">
              LKR{" "}
              {salePrice.toLocaleString(
                "en-LK"
              )}
              .00
            </span>

            {discount > 0 && (
              <>
                <span className="text-[14px] md:text-[16px] text-gray-400 line-through">
                  LKR{" "}
                  {originalPrice.toLocaleString(
                    "en-LK"
                  )}
                  .00
                </span>

                <span className="rounded-full bg-[#c90000] px-3 py-1 text-[14px] md:text-[16px] font-medium text-white">
                  -{discount}%
                </span>
              </>
            )}

          </div>

          {/* ================================= */}
          {/* DESCRIPTION */}
          {/* ================================= */}

          <div className="mt-6 md:mt-8">

            <p className="text-[16px] font-semibold uppercase tracking-[0.1em]">
              Not for lovers. For lone wolves.
            </p>

            <p className="mt-2 md:mt-4 text-[14px] lg:text-[16px] font-regular leading-6 text-gray-600">
              {product.description}
            </p>

          </div>

          {/* ================================= */}
          {/* COLORS */}
          {/* ================================= */}

          {colors.length > 0 && (
            <div className="mt-6 md:mt-8">

              <h3 className="text-[14px] md:text-[16px] font-medium uppercase tracking-[0.1em]">
                Select Color
                {selectedVariant?.colorName
                  ? ` : ${selectedVariant.colorName}`
                  : ""}
              </h3>

              <div className="mt-4 flex gap-3">

                {colors.map((color) => {

                  const selected =
                    selectedVariant?.colorCode ===
                    color.code;

                  return (
                    <button
                      key={`${color.name}-${color.code}`}
                      type="button"
                      onClick={() => {

                        const variant =
                          product.variants.find(
                            (item) =>
                              item.colorCode ===
                              color.code
                          );

                        if (variant) {
                          setSelectedVariant(
                            variant
                          );

                          setQuantity(1);
                        }
                      }}
                      className={`
                       h-6 w-6 md:h-8 md:w-8 border ml-[5px]

                        ${
                          selected
                            ? "border-black ring-1 ring-black ring-offset-2"
                            : "border-gray-300"
                        }
                      `}
                      style={{
                        backgroundColor:
                          color.code ??
                          "#ffffff",
                      }}
                      aria-label={
                        color.name
                      }
                    />
                  );
                })}

              </div>
            </div>
          )}

          {/* ================================= */}
          {/* SIZE */}
          {/* ================================= */}

          {sizes.length > 0 && (
            <div className="mt-6 md:mt-8">

              <h3 className="text-[14px] md:text-[16px] font-medium uppercase tracking-[0.1em]">
                Select Size
                {selectedVariant?.size
                  ? ` : ${selectedVariant.size.name}`
                  : ""}
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">

                {sizes.map((size) => {

                  const variant =
                    product.variants.find(
                      (item) =>
                        item.size?.id ===
                        size.id
                    );

                  const selected =
                    selectedVariant?.size?.id ===
                    size.id;

                  const outOfStock =
                    !variant ||
                    variant.stockQty <= 0;

                  return (
                    <button
                      key={size.id}
                      type="button"
                      disabled={outOfStock}
                      onClick={() =>
                        handleSizeChange(
                          size.id
                        )
                      }
                      className={`
                        relative
                        h-8 md:h-10
                        min-w-[30px] md:min-w-[50px]
                        border
                        px-4
                        text-[14px] md:text-[16px]

                        ${
                          selected
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-black"
                        }

                        ${
                          outOfStock
                            ? "cursor-not-allowed opacity-40"
                            : "hover:border-black"
                        }
                      `}
                    >
                      {size.name}

                      {outOfStock && (
                        <span className="absolute left-0 top-1/2 h-px w-full rotate-[-20deg] bg-gray-400" />
                      )}
                    </button>
                  );
                })}

              </div>
            </div>
          )}

          {/* ================================= */}
          {/* QUANTITY */}
          {/* ================================= */}

          <div className="mt-6 md:mt-8">

            <p className="text-[14px] md:text-[16px] font-medium uppercase tracking-[0.1em]">
              Quantity
            </p>

            <div className="mt-4 flex items-center gap-4">

              <div className="flex h-8 md:h-10 items-center border border-gray-300">

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  className="flex h-full w-8 md:w-10 items-center justify-center"
                >
                  <Minus size={13} />
                </button>

                <span className="w-8 text-center text-[14px] md:text-[16px]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  className="flex h-full w-8 md:w-10 items-center justify-center"
                >
                  <Plus size={13} />
                </button>

              </div>

              {selectedVariant && (
                <span className="text-[14px] md:text-[16px] font-semibold text-gray-500">
                  Only{" "}
                  {
                    selectedVariant.stockQty
                  }{" "}
                  items left in stock
                </span>
              )}

            </div>
          </div>

          {/* ================================= */}
          {/* BUTTONS */}
          {/* ================================= */}

          <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={handleAddToCart}
              className="
                md:h-[56px]
                bg-black
                text-[12px] md:text-[16px]
                font-medium
                uppercase
                md:tracking-[0.1em]
                text-white
                transition
                hover:bg-[#222]
                py-4
              "
            >
              Add to Cart
            </button>

            <button
              type="button"
              className="
                md:h-[56px]
                bg-black
                text-[12px] md:text-[16px]
                font-medium
                uppercase
                tracking-[0.1em]
                text-white
                transition
                hover:bg-[#222]
                py-4
              "
            >
              Buy It Now
            </button>

          </div>

          {/* ================================= */}
          {/* PRODUCT DETAILS */}
          {/* ================================= */}

          <InfoSection
            title="Product Details"
            items={
              product.productDetails
            }
          />

          {/* ================================= */}
          {/* DELIVERY */}
          {/* ================================= */}

          <InfoSection
            title="Delivery Information"
            items={[
              "Islandwide delivery available",
              "Estimated delivery within 2–5 working days",
              "Delivery charges calculated at checkout",
            ]}
          />

          {/* ================================= */}
          {/* CARE */}
          {/* ================================= */}

          <InfoSection
            title="Care Instructions"
            items={
              product.careInstructions
            }
          />

          {/* ================================= */}
          {/* RETURN */}
          {/* ================================= */}

          <div className="mt-6 md:mt-10 border-t border-gray-200 pt-6">

            <button
              type="button"
              onClick={() =>
                setOpenReturn(
                  (current) => !current
                )
              }
              className="flex w-full items-center justify-between"
            >
              <h3 className="text-[14px] md:text-[16px] font-medium uppercase tracking-[0.1em]">
                Return & Exchange Policy
              </h3>

              <ChevronDown
                size={17}
                className={
                  openReturn
                    ? "rotate-180"
                    : ""
                }
              />
            </button>

            {openReturn && (
              <div className="mt-4 md:mt-6 text-[14px] md:text-[16px] font-regular leading-6 text-gray-600">

                <p>
                  We want you to be
                  satisfied with your
                  PIZZTOL purchase. If you
                  experience an issue with
                  your order, please review
                  the conditions below.
                </p>

                {/* Exchanges */}

                <div className="mt-4 md:mt-6">

                  <h4 className="font-medium text-[14px] md:text-[16px] text-black">
                    Exchanges
                  </h4>

                  <p className="mt-2">
                    Clothing items may be
                    exchanged within 7 days
                    of delivery, subject to
                    stock availability. Items
                    must be unworn, unwashed
                    and unused, with original
                    tags and packaging intact.
                  </p>

                </div>

                {/* Damaged */}

                <div className="mt-4 md:mt-6">

                  <h4 className="font-semibold text-[14px] md:text-[16px] text-black">
                    Damaged or Incorrect Items
                  </h4>

                  <p className="mt-2">
                    If you receive a damaged,
                    defective or incorrect
                    item, please contact us
                    within 48 hours of
                    delivery with your order
                    number and clear
                    photographs.
                  </p>

                </div>

                {/* Non Returnable */}

                <div className="mt-4 md:mt-6">

                  <h4 className="font-semibold text-black text-[14px] md:text-[16px]">
                    Non-Returnable Items
                  </h4>

                  <ul className="mt-2 list-disc space-y-1 pl-5">

                    <li>
                      Items that have been worn,
                      washed, used or altered
                    </li>

                    <li>
                      Items without original tags
                      or packaging
                    </li>

                    <li>
                      Opened or used perfume
                      decants
                    </li>

                    <li>
                      Sale or promotional items
                    </li>

                    <li>
                      Items damaged due to
                      improper handling
                    </li>

                    <li>
                      Change-of-mind requests
                    </li>

                  </ul>

                </div>

                {/* Refunds */}

                <div className="mt-4 md:mt-6">

                  <h4 className="font-semibold text-[14px] md:text-[16px] text-black">
                    Refunds
                  </h4>

                  <p className="mt-2">
                    Refunds are only
                    considered when an item
                    is damaged, defective or
                    incorrect and a replacement
                    is unavailable.
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>
      </Container>
    </main>
  );
}

function InfoSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="mt-6 md:mt-10">

      <h3 className="text-[14px] md:text-[16px] font-medium uppercase tracking-[0.1em]">
        {title}
      </h3>

      <ul className="mt-2 md:mt-4 list-disc space-y-1 pl-5 text-[14px] md:text-[16px] leading-[24px] md:leading-[28px] text-gray-700">

        {items.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}

      </ul>

    </div>
  );
}