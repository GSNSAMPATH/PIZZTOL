"use client";

import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import Container from "./Container";
import Image from "next/image";
import CartDrawer from "./CartDrawer";
import ProductSearch from "./Search/ProductSearch";
import { getCart } from "../types/cart";


export default function Navbar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [cartOpen, setCartOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [cartCount, setCartCount] =
    useState(0);

  // ==========================================
  // UPDATE CART COUNT
  // ==========================================

  const updateCartCount = () => {
    const cart = getCart();

    const count = cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

    setCartCount(count);
  };

  // ==========================================
  // LOAD CART COUNT
  // ==========================================

  useEffect(() => {
    // Initial cart count
    updateCartCount();

    // Same browser tab
    window.addEventListener(
      "cart-updated",
      updateCartCount
    );

    // Other browser tabs
    window.addEventListener(
      "storage",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        updateCartCount
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );
    };
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/10 bg-white">
      <Container>

        <div className="relative mx-auto flex h-[64px] w-full items-center md:h-[82px]">

          {/* ================= MOBILE MENU ================= */}

          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
            onClick={() =>
              setMobileOpen(
                !mobileOpen
              )
            }
            className="flex items-center justify-center md:hidden"
          >
            {mobileOpen ? (
              <X
                size={24}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={24}
                strokeWidth={1.8}
              />
            )}
          </button>

          {/* ================= LOGO ================= */}

          <Link
            href="/"
            className="
              absolute
              left-1/2
              top-1/2
              h-[58px]
              w-[100px]
              -translate-x-1/2
              -translate-y-1/2

              md:static
              md:h-[70px]
              md:w-[120px]
              md:translate-x-0
              md:translate-y-0
            "
          >
            <Image
              src="/PIZZTOL.png"
              alt="Pizztol"
              fill
              priority
              className="object-contain"
            />
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}

          <nav className="ml-auto hidden items-center gap-9 md:flex">

            <Link
              href="/"
              className="text-[13px] font-semibold tracking-[0.15em] text-black transition-opacity hover:opacity-50"
            >
              HOME
            </Link>

            <Link
              href="/our-story"
              className="text-[13px] font-semibold tracking-[0.15em] text-black transition-opacity hover:opacity-50"
            >
              OUR STORY
            </Link>

            <Link
              href="/contact"
              className="text-[13px] font-semibold tracking-[0.15em] text-black transition-opacity hover:opacity-50"
            >
              CONTACT
            </Link>

            {/* Desktop Actions */}

            <div className="ml-3 flex items-center gap-5">

              {/* Search */}

              <button
                type="button"
                aria-label="Search"
                onClick={() =>
                  setSearchOpen(true)
                }
                className="transition-transform hover:scale-105"
              >
                <Search
                  size={24}
                  strokeWidth={1.8}
                  className="text-black"
                />
              </button>

              {/* Cart */}

              <button
                type="button"
                onClick={() =>
                  setCartOpen(true)
                }
                aria-label="Shopping cart"
                className="relative"
              >
                <ShoppingCart
                  size={25}
                  strokeWidth={1.8}
                  className="text-black"
                />

                {/* Cart Count */}

                {cartCount > 0 && (
                  <span className="absolute -right-[8px] -top-[9px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#c90000] px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>
          </nav>

          {/* ================= MOBILE ACTIONS ================= */}

          <div className="ml-auto flex items-center gap-5 md:hidden">

            {/* Search */}

            <button
              type="button"
              aria-label="Search"
              onClick={() =>
                setSearchOpen(true)
              }
              className="transition-transform hover:scale-105"
            >
              <Search
                size={24}
                strokeWidth={1.8}
                className="text-black"
              />
            </button>

            {/* Cart */}

            <button
              type="button"
              onClick={() =>
                setCartOpen(true)
              }
              aria-label="Shopping cart"
              className="relative"
            >
              <ShoppingCart
                size={24}
                strokeWidth={1.8}
                className="text-black"
              />

              {/* Cart Count */}

              {cartCount > 0 && (
                <span className="absolute -right-[8px] -top-[9px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#c90000] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* ================= MOBILE NAVIGATION ================= */}

        <div
          className={`
            overflow-hidden
            border-t
            border-black/10
            bg-white
            transition-all
            duration-300
            md:hidden

            ${
              mobileOpen
                ? "max-h-[300px] opacity-100"
                : "max-h-0 border-t-0 opacity-0"
            }
          `}
        >
          <nav className="flex flex-col px-1 py-2">

            <Link
              href="/"
              onClick={() =>
                setMobileOpen(false)
              }
              className="border-b border-black/10 py-4 text-sm font-semibold tracking-[0.15em]"
            >
              HOME
            </Link>

            <Link
              href="/our-story"
              onClick={() =>
                setMobileOpen(false)
              }
              className="border-b border-black/10 py-4 text-sm font-semibold tracking-[0.15em]"
            >
              OUR STORY
            </Link>

            <Link
              href="/contact"
              onClick={() =>
                setMobileOpen(false)
              }
              className="py-4 text-sm font-semibold tracking-[0.15em]"
            >
              CONTACT
            </Link>

          </nav>
        </div>

        {/* ================= SEARCH ================= */}

        <ProductSearch
          isOpen={searchOpen}
          onClose={() =>
            setSearchOpen(false)
          }
        />

        {/* ================= CART DRAWER ================= */}

        <CartDrawer
          open={cartOpen}
          onClose={() =>
            setCartOpen(false)
          }
        />

      </Container>
    </header>
  );
}