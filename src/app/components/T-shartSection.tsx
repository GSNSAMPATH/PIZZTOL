"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ProductImage = {
  id: number;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isHover: boolean;
};

type ProductVariant = {
  id: number;
  price: string;
  discountPercent: string;
  salePrice: string;
  stockQty: number;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  variants: ProductVariant[];
  images: ProductImage[];
};

type ProductsResponse = {
  success: boolean;
  count: number;
  data: Product[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "";

export default function TShirtSection() {
  const productSliderRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/products?categoryId=1`, 
          {
          cache: "no-store",
          }
      );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result: ProductsResponse = await response.json();

        // Only T-Shirts
        const tshirts = result.data.filter(
          (product) => product.category.id === 1
        );

        setProducts(tshirts);
      } catch (error) {
        console.error("Product fetch error:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const hasMoreThanFour = products.length > 4;

  const scrollProducts = (direction: "left" | "right") => {
    if (!productSliderRef.current) return;

    const amount = productSliderRef.current.clientWidth;

    productSliderRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto w-full bg-white py-14 md:px-10 xl:px-16 lg:py-20 max-w-[1640px]">

      {/* Heading + Desktop Buttons */}
      <div className="flex items-center justify-between px-6 md:px-0">

        <h2 className="font-heading text-[24px] font-medium uppercase tracking-[0.04em] text-black md:text-[34px]">
          The Pizztol Collection
        </h2>

        {hasMoreThanFour && (
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollProducts("left")}
              aria-label="Previous products"
              className="flex h-10 w-10 items-center justify-center border border-black/20 bg-white transition-colors hover:bg-black hover:text-white"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => scrollProducts("right")}
              aria-label="Next products"
              className="flex h-10 w-10 items-center justify-center border border-black/20 bg-white transition-colors hover:bg-black hover:text-white"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-12 px-6 text-center text-sm text-gray-500">
          Loading products...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mt-12 px-6 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      {/* No Products */}
      {!loading && !error && products.length === 0 && (
        <div className="mt-12 px-6 text-center text-sm text-gray-500">
          No T-Shirts available.
        </div>
      )}

      {/* Products */}
      {!loading && products.length > 0 && (
        <div
          ref={productSliderRef}
          className={`
            mt-8 flex gap-4 overflow-x-auto pb-4
            snap-x snap-mandatory
            scrollbar-none
            md:mt-12
            md:gap-6

            ${
              hasMoreThanFour
                ? "md:flex md:overflow-x-auto md:overflow-y-hidden md:snap-none"
                : "md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible"
            }

            lg:gap-x-6
            lg:gap-y-10
            lg:pb-0
          `}
        >
          {products.map((product) => {
            /*
             * First image = main image
             * isHover === true = hover image
             */
            const mainImage =
              product.images.find((image) => !image.isHover) ??
              product.images[0];

            const hoverImage =
              product.images.find((image) => image.isHover) ??
              mainImage;

            /*
             * First variant price
             */
            const variant = product.variants[0];

            const price = Number(variant?.price ?? 0);
            const salePrice = Number(
              variant?.salePrice ?? variant?.price ?? 0
            );

            const discount = Number(
              variant?.discountPercent ?? 0
            );

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className={`
                  group block
                  w-[300px]
                  flex-none
                  md:snap-start

                  ${
                    hasMoreThanFour
                      ? "md:w-[calc((100%-50px)/3)] lg:w-[calc((100%-60px)/4)]"
                      : "md:w-auto"
                  }

                  ${product.id === products[0]?.id ? "ml-6 md:ml-0" : ""}
                  ${
                    product.id === products[products.length - 1]?.id
                      ? "mr-6 md:mr-0"
                      : ""
                  }
                `}
              >
                {/* Image */}
                <div className="relative h-[380px] overflow-hidden bg-[#f5f5f5] sm:h-[400px] lg:h-[360px] xl:h-[400px]">

                  {/* Main Image */}
                  {mainImage && (
                    <Image
                      src={mainImage.imageUrl}
                      alt={mainImage.altText || product.name}
                      fill
                      className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 25vw, 25vw"
                    />
                  )}

                  {/* Hover Image */}
                  {hoverImage && (
                    <Image
                      src={hoverImage.imageUrl}
                      alt={`${product.name} alternate view`}
                      fill
                      className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 25vw, 25vw"
                    />
                  )}

                  {/* Discount */}
                  {discount > 0 && (
                    <span className="absolute right-5 top-5 rounded-full bg-[#d00000] px-4 py-1.5 text-[12px] font-medium text-white lg:text-[14px]">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="mt-6">

                  <h3 className="line-clamp-1 text-[16px] font-normal tracking-[0.06em] text-black lg:text-[18px] xl:text-[20px]">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-[14px] font-semibold tracking-[0.1em] text-[#c90000] xl:text-[16px]">
                    LKR {salePrice.toLocaleString("en-LK")}.00
                  </p>

                  {/* Optional original price */}
                  {/* {discount > 0 && price > salePrice && (
                    <p className="mt-1 text-[13px] text-gray-400 line-through">
                      LKR {price.toLocaleString("en-LK")}.00
                    </p>
                  )} */}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}