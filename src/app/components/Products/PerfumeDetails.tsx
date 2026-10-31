"use client";

import Image from "next/image";
import {
  Minus,
  Plus,
  ChevronDown,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import Container from "../Container";
import { addToCart } from "@/app/types/cart";

type ProductImage = {
  id: number;
  productId: number;
  variantId: number | null;
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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "";

export default function PerfumeDetails({
  product,
}: Props) {
  // ==========================================
  // STATE
  // ==========================================

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(
      product.variants[0] ?? null
    );

  const [quantity, setQuantity] =
    useState(1);

  const [openReturn, setOpenReturn] =
    useState(true);

  // ==========================================
  // SCROLL REFS
  // ==========================================

  const imageContainerRef =
    useRef<HTMLDivElement>(null);

  const contentContainerRef =
    useRef<HTMLDivElement>(null);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (
    url: string
  ) => {
    if (url.startsWith("http")) {
      return url;
    }

    return `${API_URL}${url}`;
  };

  // ==========================================
  // DESKTOP SCROLL
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

    const handleWheel = (
      event: WheelEvent
    ) => {
      // Mobile/tablet normal scroll
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

      // ======================================
      // SCROLL DOWN
      // ======================================

      if (delta > 0) {
        // First scroll images
        if (!imageAtBottom) {
          event.preventDefault();

          imageContainer.scrollTop += delta;

          return;
        }

        // Then scroll product information
        if (!contentAtBottom) {
          event.preventDefault();

          contentContainer.scrollTop += delta;

          return;
        }

        return;
      }

      // ======================================
      // SCROLL UP
      // ======================================

      if (delta < 0) {
        // First scroll product information
        if (!contentAtTop) {
          event.preventDefault();

          contentContainer.scrollTop += delta;

          return;
        }

        // Then scroll images
        if (!imageAtTop) {
          event.preventDefault();

          imageContainer.scrollTop += delta;

          return;
        }
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
  // VOLUMES
  // ==========================================

  const volumes = Array.from(
    new Map(
      product.variants
        .filter(
          (variant) => variant.volume
        )
        .map((variant) => [
          variant.volume!.id,
          variant.volume!,
        ])
    ).values()
  );

  // ==========================================
  // PRICE
  // ==========================================

  /*
   * "FROM" price should be the
   * lowest available variant price.
   */

  const lowestPrice = Math.min(
    ...product.variants.map((variant) =>
      Number(
        variant.salePrice ??
          variant.price ??
          0
      )
    )
  );

  const selectedOriginalPrice =
    Number(
      selectedVariant?.price ?? 0
    );

  const selectedSalePrice =
    Number(
      selectedVariant?.salePrice ??
        selectedVariant?.price ??
        0
    );

  const selectedDiscount =
    Number(
      selectedVariant?.discountPercent ??
        0
    );

  // ==========================================
  // STOCK
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
  // VOLUME CHANGE
  // ==========================================

  const handleVolumeChange = (
    volumeId: number
  ) => {
    const variant =
      product.variants.find(
        (item) =>
          item.volume?.id === volumeId
      );

    if (!variant) return;

    setSelectedVariant(variant);
    setQuantity(1);
  };

  // ==========================================
  // DETAILS
  // ==========================================

  const fragranceDetails =
    product.productDetails ?? [];

  const fragranceNotes =
    product.careInstructions ?? [];

  // ==========================================
  // ADD TO CART
  // ==========================================

  // ==========================================
// ADD TO CART
// ==========================================

const handleAddToCart = () => {
  // Check variant
  if (!selectedVariant) {
    alert("Please select a volume.");
    return;
  }

  // Check stock
  if (selectedVariant.stockQty <= 0) {
    alert("This item is out of stock.");
    return;
  }

  // Check quantity
  if (
    quantity >
    selectedVariant.stockQty
  ) {
    alert(
      `Only ${selectedVariant.stockQty} items available.`
    );

    return;
  }

  // Get main product image
  const mainImage =
    product.images.find(
      (image) => !image.isHover
    ) ??
    product.images[0];

  // Get price
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

  // Create cart item
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

  // Save to localStorage
  addToCart(cartItem);

  alert("Added to cart!");
};

  return (
    <main className="mx-auto mt-20 py-10 lg:py-14">

     <Container>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">

        {/* ================================================= */}
        {/* LEFT - IMAGES */}
        {/* ================================================= */}

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
                  aspect-square
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
                  className="object-cover"
                  sizes="
                    (max-width: 1024px) 100vw,
                    40vw
                  "
                />
              </div>
            ))}
        </div>

        {/* ================================================= */}
        {/* RIGHT - PRODUCT INFORMATION */}
        {/* ================================================= */}

        <div
          ref={contentContainerRef}
          className="
            lg:h-screen
            lg:overflow-y-auto
            lg:pl-8
            lg:pr-4

            scrollbar-none
          "
        >

          {/* ================================================= */}
          {/* TITLE */}
          {/* ================================================= */}

          <h1
            className="font-heading text-[24px] font-medium uppercase tracking-[0.04em] text-black md:text-[34px]"
          >
            {product.name}
          </h1>

          {/* ================================================= */}
          {/* PRICE */}
          {/* ================================================= */}

          <div className="mt-2 md:mt-3 flex items-center gap-4">

            <span className="text-[16px] md:text-[24px] font-semibold text-[#c90000]">
              LKR{" "}
              {lowestPrice.toLocaleString(
                "en-LK"
              )}
              .00
            </span>

            {selectedDiscount > 0 && (
              <>
                <span className="text-[14px] md:text-[16px] text-gray-400 line-through">
                  LKR{" "}
                  {selectedOriginalPrice.toLocaleString(
                    "en-LK"
                  )}
                  .00
                </span>

                <span className="rounded-full bg-[#c90000] px-3 py-1 text-[14px] md:text-[16px] font-medium text-white">
                  -{selectedDiscount}%
                </span>
              </>
            )}

          </div>

          {/* ================================================= */}
          {/* INTRO */}
          {/* ================================================= */}

          <div className="mt-6 md:mt-8">

            <h3 className="text-[14px] md:text-[16px] font-semibold uppercase tracking-[0.1em]">
              Bold, fresh and unmistakably confident.
            </h3>

            <p className="mt-2 md:mt-4 text-[14px] md:text-[16px] font-regular leading-6 text-gray-600">
              {product.description}
            </p>

          </div>

          {/* ================================================= */}
          {/* TYPE */}
          {/* ================================================= */}

          <div className="mt-6 md:mt-8">

            <p className="text-[14px] md:text-[16px] font-medium uppercase tracking-[0.1em]">
              Type : {product.category?.name}
            </p>

          </div>

          {/* ================================================= */}
          {/* VOLUME */}
          {/* ================================================= */}

          {volumes.length > 0 && (
            <div className="mt-6 md:mt-8">

              <h3 className="text-[14px] md:text-[16px] font-medium uppercase tracking-[0.1em]">
                Select Volume
                {selectedVariant?.volume
                  ? ` : ${selectedVariant.volume.name}`
                  : ""}
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">

                {volumes.map((volume) => {

                  const variant =
                    product.variants.find(
                      (item) =>
                        item.volume?.id ===
                        volume.id
                    );

                  const selected =
                    selectedVariant?.volume?.id ===
                    volume.id;

                  const outOfStock =
                    !variant ||
                    variant.stockQty <= 0;

                  return (
                    <button
                      key={volume.id}
                      type="button"
                      disabled={outOfStock}
                      onClick={() =>
                        handleVolumeChange(
                          volume.id
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
                      {volume.name}

                      {outOfStock && (
                        <span
                          className="
                            absolute
                            left-0
                            top-1/2
                            h-px
                            w-full
                            rotate-[-20deg]
                            bg-gray-400
                          "
                        />
                      )}
                    </button>
                  );
                })}

              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* QUANTITY */}
          {/* ================================================= */}

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
                  className="
                    flex
                    h-full
                    w-8 md:w-10
                    items-center
                    justify-center
                  "
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
                  className="
                    flex
                    h-full
                    w-8 md:w-10
                    items-center
                    justify-center
                  "
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

          {/* ================================================= */}
          {/* BUTTONS */}
          {/* ================================================= */}

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

          {/* ================================================= */}
          {/* FRAGRANCE DETAILS */}
          {/* ================================================= */}

          <InfoSection
            title="Fragrance Details"
            items={fragranceDetails}
          />

          {/* ================================================= */}
          {/* FRAGRANCE NOTES */}
          {/* ================================================= */}

          <InfoSection
            title="Fragrance Notes"
            items={fragranceNotes}
          />

          {/* ================================================= */}
          {/* ABOUT THE DECANT */}
          {/* ================================================= */}

          {/* <div className="mt-10">

            <h3 className="text-[16px] font-medium uppercase tracking-[0.1em]">
              About the Decant
            </h3>

            <p className="mt-2 text-[16px] font-regular leading-6 text-gray-600">
              This is an authentic fragrance
              carefully transferred into a
              high-quality travel-size
              atomizer. It allows you to
              experience the original scent
              without purchasing a full-size
              bottle.
            </p>

            <ul className="mt-3 list-disc space-y-1 pl-5 text-[12px] leading-5 text-gray-700">

              <li>
                100% authentic fragrance
              </li>

              <li>
                Secure, leak-resistant atomizer
              </li>

              <li>
                Easy to carry and travel-friendly
              </li>

              <li>
                Available in multiple volumes
              </li>

            </ul>

          </div> */}

          {/* ================================================= */}
          {/* DELIVERY */}
          {/* ================================================= */}

                      <InfoSection
            title="Delivery Information"
            items={[
              "Islandwide delivery available",
              "Estimated delivery within 2–5 working days",
              "Delivery charges calculated at checkout",
            ]}
          />


          {/* <div className="mt-10">

            <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em]">
              Delivery Information
            </h3>

            <ul className="mt-4 list-disc space-y-1 pl-5 text-[12px] leading-5 text-gray-700">

              <li>
                Islandwide delivery available
              </li>

              <li>
                Estimated delivery within
                2–5 working days
              </li>

              <li>
                Delivery charges calculated
                at checkout
              </li>

              <li>
                Securely packed to prevent
                leakage
              </li>

            </ul>

          </div> */}

          {/* ================================================= */}
          {/* RETURN & EXCHANGE */}
          {/* ================================================= */}

          <div className="mt-6 md:mt-10 border-t border-gray-200 pt-6">

            <button
              type="button"
              onClick={() =>
                setOpenReturn(
                  (current) => !current
                )
              }
              className="
                flex
                w-full
                items-center
                justify-between
              "
            >
              <span className="text-[14px] md:text-[16px] font-medium uppercase tracking-[0.1em]">
                Return & Exchange Policy
              </span>

              <ChevronDown
                size={17}
                className={`
                  transition-transform
                  ${
                    openReturn
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {openReturn && (
              <div className="mt-4 md:mt-6 text-[14px] md:text-[16px] leading-6 text-gray-600">

                {/* General */}

                <p>
                  Due to hygiene and product
                  integrity reasons, perfume
                  decants cannot be returned or
                  exchanged once they have been
                  opened, sprayed or used.
                </p>

                {/* Damaged */}

                <div className="mt-4 md:mt-6">

                  <h4 className="font-medium text-[14px] md:text-[16px] text-black">
                    Damaged or Leaking Items
                  </h4>

                  <p className="mt-2">
                    If your perfume decant
                    arrives damaged or leaking,
                    please contact us within
                    48 hours of delivery.
                    Include your order number
                    and clear photographs or
                    videos showing the condition
                    of the item and its packaging.
                  </p>

                  <p className="mt-2">
                    Once the issue has been
                    verified, we will arrange a
                    replacement or provide an
                    appropriate solution at no
                    additional delivery cost.
                  </p>

                </div>

                {/* Incorrect */}

                <div className="mt-4 md:mt-6">

                  <h4 className="font-medium text-[14px] md:text-[16px] text-black">
                    Incorrect Items
                  </h4>

                  <p className="mt-2">
                    If you receive a fragrance
                    or volume that is different
                    from what you ordered, please
                    contact us within 48 hours of
                    delivery.
                  </p>

                  <p className="mt-2">
                    Once verified, we will arrange
                    the correct replacement and
                    cover the related delivery
                    charges.
                  </p>

                </div>

                {/* Non Returnable */}

                <div className="mt-4 md:mt-6">

                  <h4 className="font-medium text-[14px] md:text-[16px] text-black">
                    Non-Returnable Items
                  </h4>

                  <p className="mt-2">
                    Returns or exchanges will
                    not be accepted for:
                  </p>

                  <ul className="mt-2 list-disc space-y-1 pl-5">

                    <li>
                      Opened, sprayed or used
                      perfume decants
                    </li>

                    <li>
                      Items returned without
                      original packaging
                    </li>

                    <li>
                      Change-of-mind requests
                    </li>

                    <li>
                      Personal scent preference
                    </li>

                    <li>
                      Incorrect volumes selected
                      by the customer
                    </li>

                    <li>
                      Sale or promotional items
                    </li>

                    <li>
                      Items damaged through
                      improper handling or storage
                    </li>

                  </ul>

                </div>

                {/* Refunds */}

                <div className="mt-4 md:mt-6">

                  <h4 className="font-medium text-[14px] md:text-[16px] text-black">
                    Refunds
                  </h4>

                  <p className="mt-2">
                    Refunds will only be
                    considered when an item
                    arrives damaged, leaking or
                    incorrect and a suitable
                    replacement is unavailable.
                  </p>

                  <p className="mt-2">
                    Approved refunds will be
                    processed after the issue
                    has been reviewed and
                    verified.
                  </p>

                  <p className="mt-2">
                    Original delivery charges
                    are non-refundable unless
                    the issue was caused by
                    PIZZTOL.
                  </p>

                </div>

                {/* How to request */}

                <div className="mt-4 md:mt-6">

                  <h4 className="font-medium text-[14px] md:text-[16px] text-black">
                    How to Request an Exchange or Return
                  </h4>

                  <p className="mt-2">
                    Please contact us through
                    WhatsApp or email and provide:
                  </p>

                  <ul className="mt-2 list-disc space-y-1 pl-5">

                    <li>
                      Your full name
                    </li>

                    <li>
                      Order number
                    </li>

                    <li>
                      Reason for the request
                    </li>

                    <li>
                      Clear photographs or videos
                      of the item
                    </li>

                    <li>
                      Photographs of the
                      original packaging
                    </li>

                  </ul>

                  <p className="mt-2">
                    Please do not return any item
                    before receiving confirmation
                    and return instructions from
                    our team.
                  </p>

                </div>

                {/* Note */}

                <p className="mt-4 md:mt-6">
                  <span className="font-medium text-[14px] md:text-[16px] text-[#c90000]">
                    Note:
                  </span>{" "}
                  PIZZTOL reserves the right
                  to reject any return, exchange
                  or refund request that does not
                  meet the conditions stated above.
                </p>

              </div>
            )}

          </div>

        </div>
      </div>
      </Container>
    </main>
  );
}

// =====================================================
// INFO SECTION
// =====================================================

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

        {items.map(
          (item, index) => (
            <li key={index}>
              {item}
            </li>
          )
        )}

      </ul>

    </div>
  );
}