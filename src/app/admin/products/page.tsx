"use client";

import HeaderActions from "@/app/components/HeaderActions";
import ProductActions from "@/app/components/ProductActions";
import {
  Bell,
  ChevronDown,
  Ellipsis,
  Mail,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";



type ApiVariant = {
  id: number;
  stockQty: number;
  price: string;
  size: {
    id: number;
    name: string;
  } | null;
  color: {
    id: number;
    name: string;
    hexCode: string;
  } | null;
  volume: {
    id: number;
    name: string;
  } | null;
};

type ApiImage = {
  id: number;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isHover: boolean;
};

type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  brand: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  category: {
    id: number;
    name: string;
    slug: string;
  };

  variants: ApiVariant[];
  images: ApiImage[];
};

type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  sold: number;
  status: "Active" | "Low Stock" | "Out of Stock";
  postedDate: string;
  image: string | null;
};


function StatusBadge({ status }: { status: Product["status"] }) {
  const styles = {
    Active: {
      dot: "bg-green-500",
    },
    "Low Stock": {
      dot: "bg-orange-500",
    },
    "Out of Stock": {
      dot: "bg-red-500",
    },
  };

  return (
    <span className="inline-flex h-[25px] min-w-[105px] items-center gap-2 rounded-[5px] border border-[#cfcfcf] px-3 text-[12px] font-medium text-[#252525]">
      <span
        className={`h-2 w-2 rounded-full ${styles[status].dot}`}
      />

      {status}
    </span>
  );
}

export default function ProductsPage() {

    const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products");

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch products"
        );
      }

      const mappedProducts = result.data.map(
        (product: ApiProduct): Product => {
          const stock = product.variants.reduce(
            (total, variant) =>
              total + Number(variant.stockQty || 0),
            0
          );

          const prices = product.variants
            .map((variant) => Number(variant.price))
            .filter((price) => !Number.isNaN(price));

          const minPrice =
            prices.length > 0 ? Math.min(...prices) : 0;

          const maxPrice =
            prices.length > 0 ? Math.max(...prices) : 0;

          let price = "LKR 0";

          if (minPrice === maxPrice) {
            price = `LKR ${minPrice.toLocaleString()}`;
          } else {
            price = `LKR ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}`;
          }

          let status: Product["status"];

          if (!product.isActive || stock === 0) {
            status = "Out of Stock";
          } else if (stock <= 10) {
            status = "Low Stock";
          } else {
            status = "Active";
          }

          const mainImage =
            product.images
              ?.filter((image) => !image.isHover)
              ?.sort(
                (a, b) => a.sortOrder - b.sortOrder
              )?.[0]?.imageUrl ?? null;

          return {
            id: product.id,
            name: product.name,
            category: product.category?.name ?? "Uncategorized",
            price,
            stock,

            // Your current API doesn't return sold quantity
            sold: 0,

            status,

            postedDate: new Date(
              product.createdAt
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),

            image: mainImage,
          };
        }
      );

      setProducts(mappedProducts);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword)
    );
  }, [products, search]);

  return (
    <main className="min-h-screen bg-[#f1f1f1] px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[21px] font-semibold leading-none text-[#09213f]">
            Products
          </h1>

          <p className="mt-2 text-[15px] font-medium text-[#09213f]">
            Manage your store products, variants, pricing and stock.
          </p>
        </div>

        {/* Right Header */}
        <HeaderActions />
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="flex h-[40px] w-[290px] items-center gap-3 bg-white px-4">
            <Search
              size={16}
              strokeWidth={1.7}
              className="text-[#536174]"
            />

            <input
              type="text"
              placeholder="Search products.."
              className="w-full bg-transparent text-[12px] text-[#172b46] outline-none placeholder:text-[#687386]"
            />
          </div>

          {/* Sort */}
          <button className="flex h-[40px] items-center gap-3 bg-white px-4 text-[12px] text-[#142944]">
            <span>Sort by</span>

            <SlidersHorizontal
              size={14}
              strokeWidth={1.6}
            />
          </button>
        </div>

        {/* Add Product */}
        <a
          className="
            flex h-[40px]
            items-center gap-2
            bg-[#050505]
            px-6
            text-[14px]
            font-medium
            text-white
            transition
            hover:bg-[#1c1c1c]
          "
            href="/admin/products/new"
        >
          <Plus size={18} strokeWidth={2} />
          Add Product
        </a>
      </div>

      {/* Product Table */}
      <section className="mt-6 overflow-hidden bg-white px-9 py-8">
        {/* Desktop table */}
        <div className="hidden min-w-[900px] lg:block">
          {/* Table Header */}
          <div
            className="
              grid
              grid-cols-[270px_123px_147px_88px_88px_132px_1fr_20px]
              items-center
              border-b
              border-[#cfcfcf]
              pb-2
            "
          >
            <TableHeader>Product</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Stock</TableHeader>
            <TableHeader>Sold</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Posted Date</TableHeader>
            <span />
          </div>

          {/* Rows */}
          <div>
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>

        {/* Mobile / Tablet */}
        <div className="space-y-3 lg:hidden">
          {products.map((product) => (
            <MobileProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="text-[13px] font-semibold text-[#353535]">
      {children}
    </span>
  );
}

function ProductRow({ product }: { product: Product }) {
  return (
    <div
      className="
        grid
        grid-cols-[270px_123px_147px_88px_88px_132px_1fr_20px]
        min-h-[61px]
        items-center
      "
    >
      {/* Product */}
      <div className="flex items-center gap-4">
        <div className="relative h-[46px] w-[45px] shrink-0 overflow-hidden bg-[#f1f1f1]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="45px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[9px] text-gray-400">
              No Image
            </div>
          )}
        </div>

        <span className="truncate pr-3 text-[12px] font-medium text-[#161616]">
          {product.name}
        </span>
      </div>

      {/* Category */}
      <span className="text-[12px] text-[#252525]">
        {product.category}
      </span>

      {/* Price */}
      <span className="text-[12px] text-[#252525]">
        {product.price}
      </span>

      {/* Stock */}
      <span className="text-[12px] text-[#252525]">
        {String(product.stock).padStart(2, "0")}
      </span>

      {/* Sold */}
      <span className="text-[12px] text-[#252525]">
        {String(product.sold).padStart(2, "0")}
      </span>

      {/* Status */}
      <div>
        <StatusBadge status={product.status} />
      </div>

      {/* Posted Date */}
      <span className="text-[12px] text-[#252525]">
        {product.postedDate}
      </span>

      {/* Actions */}
      {/* <button className="flex items-center justify-center text-[#222]">
        <Ellipsis size={17} strokeWidth={2} />
      </button> */}
      <ProductActions productId={product.id} />
    </div>
  );
}

function MobileProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <div className="rounded-md border border-[#e3e3e3] p-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="relative h-[55px] w-[55px] shrink-0 overflow-hidden bg-[#f1f1f1]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="45px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[9px] text-gray-400">
              No Image
            </div>
          )}
          </div>

          <div>
            <h3 className="text-[13px] font-medium text-[#111]">
              {product.name}
            </h3>

            <p className="mt-1 text-[11px] text-gray-500">
              {product.category}
            </p>

            <p className="mt-1 text-[12px] font-medium">
              {product.price}
            </p>
          </div>
        </div>

        <button>
          <Ellipsis size={18} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#eee] pt-3">
        <div>
          <p className="text-[10px] text-gray-500">Stock</p>
          <p className="mt-1 text-[12px] font-medium">
            {product.stock}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-gray-500">Sold</p>
          <p className="mt-1 text-[12px] font-medium">
            {product.sold}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-gray-500">Status</p>
          <div className="mt-1">
            <StatusBadge status={product.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

