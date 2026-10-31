"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { CartItem, getCart, removeFromCart, updateCartQuantity } from "../types/cart";



interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "";

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {
  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (
    imageUrl: string
  ) => {
    if (!imageUrl) {
      return "/placeholder.png";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${API_URL}${imageUrl}`;
  };

  // ==========================================
  // LOAD CART
  // ==========================================

  const loadCart = () => {
    const cart = getCart();

    setCartItems(cart);
  };

  // ==========================================
  // LOAD WHEN DRAWER OPENS
  // ==========================================

  useEffect(() => {
    if (open) {
      loadCart();
    }
  }, [open]);

  // ==========================================
  // LISTEN FOR CART UPDATES
  // ==========================================

  useEffect(() => {
    const handleCartUpdate = () => {
      loadCart();
    };

    // Same browser tab
    window.addEventListener(
      "cart-updated",
      handleCartUpdate
    );

    // Other browser tabs
    window.addEventListener(
      "storage",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        handleCartUpdate
      );

      window.removeEventListener(
        "storage",
        handleCartUpdate
      );
    };
  }, []);

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const handleIncrease = (
    item: CartItem
  ) => {
    if (
      item.quantity >= item.stockQty
    ) {
      return;
    }

    const updatedCart =
      updateCartQuantity(
        item.cartItemId,
        item.quantity + 1
      );

    setCartItems(updatedCart);

    window.dispatchEvent(
      new Event("cart-updated")
    );
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const handleDecrease = (
    item: CartItem
  ) => {
    if (item.quantity <= 1) {
      return;
    }

    const updatedCart =
      updateCartQuantity(
        item.cartItemId,
        item.quantity - 1
      );

    setCartItems(updatedCart);

    window.dispatchEvent(
      new Event("cart-updated")
    );
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const handleRemove = (
    cartItemId: string
  ) => {
    const updatedCart =
      removeFromCart(cartItemId);

    setCartItems(updatedCart);

    window.dispatchEvent(
      new Event("cart-updated")
    );
  };

  // ==========================================
  // TOTAL
  // ==========================================

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        item.quantity,
    0
  );

  return (
    <>
      {/* ====================================== */}
      {/* OVERLAY */}
      {/* ====================================== */}

      <div
        onClick={onClose}
        className={`
          fixed
          inset-0
          z-[90]
          bg-black/30
          transition-opacity
          duration-300

          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* ====================================== */}
      {/* DRAWER */}
      {/* ====================================== */}

      <aside
        className={`
          fixed
          right-0
          top-0
          z-[100]
          flex
          h-screen
          w-full
          max-w-[595px]
          flex-col
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out

          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >

        {/* ==================================== */}
        {/* HEADER */}
        {/* ==================================== */}

        <div
          className="
            flex
            h-[90px]
            shrink-0
            items-center
            justify-between
            border-b
            border-black/10
            px-8
          "
        >
          <h2
            className="
              font-heading
              text-[17px]
              font-semibold
              uppercase
              tracking-[0.08em]
            "
          >
            Your Cart
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="
              transition-transform
              duration-200
              hover:rotate-90
            "
          >
            <X
              size={27}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* ==================================== */}
        {/* CART ITEMS */}
        {/* ==================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-8
            py-5
          "
        >

          {/* EMPTY CART */}

          {cartItems.length === 0 && (
            <div
              className="
                flex
                h-full
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <p
                className="
                  font-heading
                  text-[18px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                "
              >
                Your Cart Is Empty
              </p>

              <p
                className="
                  mt-3
                  text-[13px]
                  text-gray-500
                "
              >
                Add something you love
                to your cart.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="
                  mt-6
                  bg-black
                  px-8
                  py-3
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-white
                  transition
                  hover:bg-[#c90000]
                "
              >
                Continue Shopping
              </button>
            </div>
          )}

          {/* ITEMS */}

          {cartItems.length > 0 && (
            <div className="space-y-8">

              {cartItems.map((item) => (

                <div
                  key={item.cartItemId}
                  className="flex gap-6"
                >

                  {/* ================================= */}
                  {/* PRODUCT IMAGE */}
                  {/* ================================= */}

                  <Link
                    href={`/products/${item.productId}`}
                    onClick={onClose}
                    className="
                      relative
                      h-[120px]
                      w-[97px]
                      shrink-0
                      overflow-hidden
                      bg-[#f5f5f5]
                    "
                  >
                    <Image
                      src={getImageUrl(
                        item.image
                      )}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="97px"
                    />
                  </Link>

                  {/* ================================= */}
                  {/* PRODUCT INFO */}
                  {/* ================================= */}

                  <div
                    className="
                      flex
                      min-w-0
                      flex-1
                      flex-col
                    "
                  >

                    {/* Product Name */}

                    <Link
                      href={`/products/${item.productId}`}
                      onClick={onClose}
                    >
                      <h3
                        className="
                          font-heading
                          text-[16px]
                          font-semibold
                          tracking-[0.02em]
                          transition
                          hover:text-[#c90000]
                        "
                      >
                        {item.name}
                      </h3>
                    </Link>

                    {/* Variant */}

                    <div
                      className="
                        mt-2
                        space-y-1
                        font-sans
                        text-[13px]
                        tracking-[0.04em]
                        text-gray-600
                      "
                    >

                      {/* Size */}

                      {item.sizeName && (
                        <p>
                          Size:{" "}
                          {item.sizeName}
                        </p>
                      )}

                      {/* Volume */}

                      {item.volumeName && (
                        <p>
                          Volume:{" "}
                          {item.volumeName}
                        </p>
                      )}

                      {/* Color */}

                      {item.colorName && (
                        <p>
                          Color:{" "}
                          {item.colorName}
                        </p>
                      )}

                    </div>

                    {/* ================================= */}
                    {/* BOTTOM ROW */}
                    {/* ================================= */}

                    <div
                      className="
                        mt-auto
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >

                      {/* ================================= */}
                      {/* QUANTITY */}
                      {/* ================================= */}

                      <div
                        className="
                          flex
                          h-[40px]
                          items-center
                          border
                          border-black/30
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            handleDecrease(
                              item
                            )
                          }
                          disabled={
                            item.quantity <=
                            1
                          }
                          className="
                            flex
                            h-full
                            w-[38px]
                            items-center
                            justify-center
                            transition
                            hover:bg-black
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-30
                          "
                        >
                          <Minus size={16} />
                        </button>

                        <span
                          className="
                            flex
                            w-[30px]
                            justify-center
                            font-sans
                            text-[14px]
                          "
                        >
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleIncrease(
                              item
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.stockQty
                          }
                          className="
                            flex
                            h-full
                            w-[38px]
                            items-center
                            justify-center
                            transition
                            hover:bg-black
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-30
                          "
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                      {/* ================================= */}
                      {/* DELETE */}
                      {/* ================================= */}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(
                            item.cartItemId
                          )
                        }
                        aria-label="Remove item"
                        className="
                          ml-2
                          transition-colors
                          hover:text-[#c90000]
                        "
                      >
                        <Trash2
                          size={21}
                          strokeWidth={1.8}
                        />
                      </button>

                      {/* ================================= */}
                      {/* PRICE */}
                      {/* ================================= */}

                      <p
                        className="
                          ml-auto
                          whitespace-nowrap
                          font-sans
                          text-[16px]
                          font-semibold
                          tracking-[0.02em]
                        "
                      >
                        LKR{" "}
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toLocaleString(
                          "en-LK"
                        )}
                        .00
                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}
        </div>

        {/* ====================================== */}
        {/* BOTTOM SUMMARY */}
        {/* ====================================== */}

        {cartItems.length > 0 && (
          <div
            className="
              shrink-0
              bg-[#f7f7f5]
              px-8
              pb-8
              pt-7
            "
          >

            {/* Total */}

            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  font-heading
                  text-[18px]
                  font-semibold
                "
              >
                Total
              </span>

              <span
                className="
                  font-sans
                  text-[18px]
                  font-semibold
                "
              >
                LKR{" "}
                {total.toLocaleString(
                  "en-LK"
                )}
                .00
              </span>
            </div>

            {/* Note */}

            <p
              className="
                mt-8
                font-sans
                text-[15px]
                tracking-[0.02em]
              "
            >
              Taxes and shipping calculated
              at checkout
            </p>

            {/* Checkout */}

            <Link
              href="/checkout"
              onClick={onClose}
              className="
                mt-4
                inline-flex
                h-[58px]
                w-full
                items-center
                justify-center
                bg-black
                px-8
                text-[14px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-white
                transition-all
                duration-300
                hover:bg-[#c90000]
                xl:text-[16px]
              "
            >
              Checkout
            </Link>

          </div>
        )}

      </aside>
    </>
  );
}