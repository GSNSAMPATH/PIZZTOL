"use client";

import HeaderActions from "@/app/components/HeaderActions";
import {
  AlertTriangle,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Package,
  Search,
  X,
} from "lucide-react";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

interface InventoryItem {
  id: number;
  productId: number;

  productName: string;
  productSlug: string;

  categoryId: number;
  category: string | null;
  categorySlug: string | null;

  variant: string;
  sku: string;

  unitPrice: number;
  regularPrice: number;
  salePrice: number | null;
  discountPercent: number;

  stockQty: number;

  stockStatus:
    | "IN_STOCK"
    | "LOW_STOCK"
    | "OUT_OF_STOCK";

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

  imageUrl: string | null;
  imageAlt: string | null;
}

interface InventoryResponse {
  success: boolean;

  data: InventoryItem[];

  summary: {
    totalStock: number;
    inStockVariants: number;
    lowStockVariants: number;
    outOfStockVariants: number;
  };

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  lowStockLimit: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const PAGE_SIZE = 10;

export default function InventoryPage() {
  // =====================================================
  // STATE
  // =====================================================

  const [items, setItems] =
    useState<InventoryItem[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [summary, setSummary] =
    useState({
      totalStock: 0,
      inStockVariants: 0,
      lowStockVariants: 0,
      outOfStockVariants: 0,
    });

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [search, setSearch] =
    useState("");

  const [stockStatus, setStockStatus] =
    useState("all");

  const [categoryId, setCategoryId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // UPDATE STOCK MODAL
  // =====================================================

  const [selectedItem, setSelectedItem] =
    useState<InventoryItem | null>(null);

  const [showStockModal, setShowStockModal] =
    useState(false);

  const [newStockQty, setNewStockQty] =
    useState("");

  const [updatingStock, setUpdatingStock] =
    useState(false);

  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  useEffect(() => {
    async function loadCategories() {
      try {
        const response =
          await fetch(
            "/api/categories",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          return;
        }

        const result =
          await response.json();

        if (
          result.success &&
          Array.isArray(result.data)
        ) {
          setCategories(
            result.data
          );
        }
      } catch (error) {
        console.error(
          "Load categories error:",
          error
        );
      }
    }

    loadCategories();
  }, []);

  // =====================================================
  // LOAD INVENTORY
  // =====================================================

  const loadInventory =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const params =
            new URLSearchParams();

          params.set(
            "page",
            String(page)
          );

          params.set(
            "limit",
            String(PAGE_SIZE)
          );

          if (search.trim()) {
            params.set(
              "search",
              search.trim()
            );
          }

          if (
            stockStatus !== "all"
          ) {
            params.set(
              "stockStatus",
              stockStatus
            );
          }

          if (categoryId) {
            params.set(
              "categoryId",
              categoryId
            );
          }

          const response =
            await fetch(
              `/api/admin/inventory?${params.toString()}`,
              {
                cache: "no-store",
              }
            );

          const result: InventoryResponse =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              (result as any)
                .message ||
                "Failed to load inventory"
            );
          }

          setItems(
            result.data ?? []
          );

          setSummary(
            result.summary ?? {
              totalStock: 0,
              inStockVariants: 0,
              lowStockVariants: 0,
              outOfStockVariants: 0,
            }
          );

          setTotal(
            result.pagination?.total ??
              0
          );

          setTotalPages(
            result.pagination
              ?.totalPages ?? 1
          );
        } catch (error) {
          console.error(
            "Load inventory error:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load inventory"
          );
        } finally {
          setLoading(false);
        }
      },
      [
        page,
        search,
        stockStatus,
        categoryId,
      ]
    );

  // =====================================================
  // LOAD WHEN FILTERS CHANGE
  // =====================================================

  useEffect(() => {
    const timer =
      setTimeout(
        () => {
          loadInventory();
        },
        search ? 400 : 0
      );

    return () =>
      clearTimeout(timer);
  }, [loadInventory]);

  // =====================================================
  // RESET FILTER
  // =====================================================

  function resetFilters() {
    setSearch("");
    setStockStatus("all");
    setCategoryId("");
    setPage(1);
  }

  // =====================================================
  // PRICE FORMAT
  // =====================================================

  function formatPrice(
    price: number
  ) {
    return Number(
      price
    ).toLocaleString(
      "en-LK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  // =====================================================
  // STATUS
  // =====================================================

  function getStatusStyle(
    status: InventoryItem["stockStatus"]
  ) {
    switch (status) {
      case "IN_STOCK":
        return {
          label: "In Stock",
          className:
            "border border-[#9be5b5] bg-[#dff8e7] text-[#16a34a]",
        };

      case "LOW_STOCK":
        return {
          label: "Low Stock",
          className:
            "border border-[#ffc98f] bg-[#fff0dd] text-[#ff7a00]",
        };

      case "OUT_OF_STOCK":
        return {
          label: "Out of Stock",
          className:
            "border border-[#ff9a9a] bg-[#ffe3e3] text-[#ef1111]",
        };
    }
  }

  // =====================================================
  // OPEN UPDATE STOCK MODAL
  // =====================================================

  function handleUpdateStock(
    item: InventoryItem
  ) {
    setSelectedItem(item);

    setNewStockQty(
      String(item.stockQty)
    );

    setShowStockModal(true);
  }

  // =====================================================
  // CLOSE UPDATE STOCK MODAL
  // =====================================================

  function closeStockModal() {
    if (updatingStock) {
      return;
    }

    setShowStockModal(false);
    setSelectedItem(null);
    setNewStockQty("");
  }

  // =====================================================
  // UPDATE STOCK
  // =====================================================

  async function updateStock() {
    if (!selectedItem) {
      return;
    }

    const quantity =
      Number(newStockQty);

    if (
      newStockQty.trim() === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      alert(
        "Please enter a valid stock quantity."
      );

      return;
    }

    try {
      setUpdatingStock(true);

      const response =
        await fetch(
          `/api/admin/inventory/${selectedItem.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              stockQty: quantity,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to update stock"
        );
      }

      closeStockModal();

      await loadInventory();
    } catch (error) {
      console.error(
        "Update stock error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update stock."
      );
    } finally {
      setUpdatingStock(false);
    }
  }

  // =====================================================
  // CURRENT RANGE
  // =====================================================

  const firstItem =
    total === 0
      ? 0
      : (page - 1) *
          PAGE_SIZE +
        1;

  const lastItem = Math.min(
    page * PAGE_SIZE,
    total
  );

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  function getPageNumbers() {
    const pages: (
      | number
      | string
    )[] = [];

    if (totalPages <= 5) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start =
      Math.max(2, page - 1);

    const end =
      Math.min(
        totalPages - 1,
        page + 1
      );

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    if (
      page <
      totalPages - 2
    ) {
      pages.push("...");
    }

    pages.push(
      totalPages
    );

    return pages;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f3f3f3] px-7 py-7 text-[#09213f]">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-semibold">
            Inventory
          </h1>

          <p className="mt-1 text-[14px]">
            Monitor stock levels across
            all product variants.
          </p>
        </div>

        {/* HEADER RIGHT */}

        <HeaderActions />

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL STOCK */}

        <SummaryCard
          title="Total Stock units"
          value={summary.totalStock}
          icon={
            <Package
              size={22}
              strokeWidth={1.8}
            />
          }
        />

        {/* IN STOCK */}

        <SummaryCard
          title="In Stock Variants"
          value={
            summary.inStockVariants
          }
          icon={
            <Package
              size={22}
              strokeWidth={1.8}
            />
          }
        />

        {/* LOW STOCK */}

        <SummaryCard
          title="Low Stock Variants"
          value={
            summary.lowStockVariants
          }
          icon={
            <AlertTriangle
              size={22}
              strokeWidth={1.8}
            />
          }
        />

        {/* OUT OF STOCK */}

        <SummaryCard
          title="Out of Stock Variants"
          value={
            summary.outOfStockVariants
          }
          icon={
            <X
              size={25}
              strokeWidth={2.5}
            />
          }
        />
      </div>

      {/* =================================================
          FILTER BAR
      ================================================= */}

      <div className="mb-6 flex flex-wrap items-center gap-5">
        {/* SEARCH */}

        <div
          className="
            relative
            h-[40px]
            w-full
            bg-white
            sm:w-[330px]
          "
        >
          <Search
            size={16}
            strokeWidth={1.7}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(
                e.target.value
              );

              setPage(1);
            }}
            placeholder="Search by product name or SKU"
            className="
              h-full
              w-full
              bg-transparent
              px-10
              pr-9
              text-[12px]
              text-[#222]
              outline-none
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                hover:text-black
              "
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* STOCK FILTER */}

        <FilterSelect
          value={stockStatus}
          onChange={(value) => {
            setStockStatus(value);
            setPage(1);
          }}
          options={[
            {
              label: "All Stock",
              value: "all",
            },
            {
              label: "In Stock",
              value: "in_stock",
            },
            {
              label: "Low Stock",
              value: "low_stock",
            },
            {
              label: "Out of Stock",
              value: "out_of_stock",
            },
          ]}
        />

        {/* CATEGORY FILTER */}

        <FilterSelect
          value={categoryId}
          onChange={(value) => {
            setCategoryId(value);
            setPage(1);
          }}
          options={[
            {
              label: "All Inventory",
              value: "",
            },

            ...categories.map(
              (category) => ({
                label:
                  category.name,
                value:
                  String(
                    category.id
                  ),
              })
            ),
          ]}
        />

        {/* RESET */}

        {(search ||
          stockStatus !==
            "all" ||
          categoryId) && (
          <button
            type="button"
            onClick={
              resetFilters
            }
            className="
              text-[12px]
              font-semibold
              text-red-600
              hover:underline
            "
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-hidden border border-[#e2e2e2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse">
            {/* HEADER */}

            <thead>
              <tr className="border-b border-[#d0d0d0] text-left text-[12px] font-semibold text-[#333]">
                <th className="px-9 py-5">
                  Product
                </th>

                <th className="px-4 py-5">
                  Category
                </th>

                <th className="px-4 py-5">
                  Variant
                </th>

                <th className="px-4 py-5">
                  SKU
                </th>

                <th className="px-4 py-5">
                  Unit Price
                </th>

                <th className="px-4 py-5">
                  Stock Status
                </th>

                <th className="px-4 py-5">
                  Stock
                </th>

                <th className="px-4 py-5 text-right">
                  Action
                </th>
              </tr>
            </thead>

            {/* BODY */}

            <tbody>
              {loading ? (
                <InventoryLoading />
              ) : error ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-20 text-center"
                  >
                    <p className="text-[13px] text-red-500">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={
                        loadInventory
                      }
                      className="
                        mt-3
                        text-[12px]
                        font-medium
                        underline
                      "
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : items.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-20 text-center"
                  >
                    <Package
                      size={32}
                      strokeWidth={1.3}
                      className="mx-auto mb-3 text-gray-400"
                    />

                    <p className="text-[13px] font-medium">
                      No inventory found
                    </p>

                    <p className="mt-1 text-[11px] text-gray-500">
                      Try changing your
                      search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                items.map(
                  (item) => {
                    const status =
                      getStatusStyle(
                        item.stockStatus
                      );

                    return (
                      <tr
                        key={
                          item.id
                        }
                        className="
                          border-b
                          border-[#eeeeee]
                          text-[11px]
                          text-[#222]
                          transition
                          hover:bg-[#fafafa]
                        "
                      >
                        {/* PRODUCT */}

                        <td className="px-9 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-[44px] w-[44px] shrink-0 overflow-hidden bg-[#f3f3f3]">
                              {item.imageUrl ? (
                                <Image
                                  src={
                                    item.imageUrl
                                  }
                                  alt={
                                    item.imageAlt ||
                                    item.productName
                                  }
                                  fill
                                  sizes="44px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Package
                                    size={
                                      17
                                    }
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </div>

                            <span className="whitespace-nowrap font-medium">
                              {
                                item.productName
                              }
                            </span>
                          </div>
                        </td>

                        {/* CATEGORY */}

                        <td className="px-4 py-4">
                          {
                            item.category
                          }
                        </td>

                        {/* VARIANT */}

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {item.colorCode &&
                              item.size && (
                                <span
                                  className="h-3 w-3 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      item.colorCode,
                                  }}
                                />
                              )}

                            <span>
                              {
                                item.variant
                              }
                            </span>
                          </div>
                        </td>

                        {/* SKU */}

                        <td className="px-4 py-4 font-medium">
                          {item.sku}
                        </td>

                        {/* PRICE */}

                        <td className="whitespace-nowrap px-4 py-4">
                          LKR{" "}
                          {formatPrice(
                            item.unitPrice
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4">
                          <span
                            className={`
                              inline-flex
                              px-3
                              py-1.5
                              text-[10px]
                              font-medium
                              ${status.className}
                            `}
                          >
                            {
                              status.label
                            }
                          </span>
                        </td>

                        {/* STOCK */}

                        <td
                          className={`
                            px-4
                            py-4
                            font-medium
                            ${
                              item.stockQty ===
                              0
                                ? "text-red-600"
                                : ""
                            }
                          `}
                        >
                          {
                            item.stockQty
                          }
                        </td>

                        {/* UPDATE */}

                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateStock(
                                item
                              )
                            }
                            className="
                              bg-black
                              px-5
                              py-2
                              text-[11px]
                              font-medium
                              text-white
                              transition
                              hover:bg-[#222]
                            "
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            FOOTER / PAGINATION
        ================================================= */}

        {!loading &&
          !error &&
          total > 0 && (
            <div
              className="
                flex
                flex-col
                items-center
                justify-between
                gap-4
                border-t
                border-[#eeeeee]
                px-8
                py-5
                sm:flex-row
              "
            >
              {/* COUNT */}

              <p className="text-[11px] text-[#333]">
                Showing{" "}
                {firstItem}-
                {lastItem}{" "}
                of {total}{" "}
                Variants
              </p>

              {/* PAGINATION */}

              <div className="flex items-center gap-2">
                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={
                    page === 1
                  }
                  onClick={() =>
                    setPage(
                      (prev) =>
                        Math.max(
                          1,
                          prev -
                            1
                        )
                    )
                  }
                  className="
                    flex
                    h-[40px]
                    items-center
                    gap-2
                    border
                    border-[#dedede]
                    bg-white
                    px-4
                    text-[11px]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <ChevronLeft
                    size={14}
                  />

                  Previous
                </button>

                {/* PAGES */}

                {getPageNumbers().map(
                  (
                    pageNumber,
                    index
                  ) =>
                    pageNumber ===
                    "..." ? (
                      <span
                        key={`dots-${index}`}
                        className="
                          flex
                          h-[40px]
                          w-[34px]
                          items-center
                          justify-center
                          text-[11px]
                        "
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={
                          pageNumber
                        }
                        type="button"
                        onClick={() =>
                          setPage(
                            pageNumber as number
                          )
                        }
                        className={`
                          flex
                          h-[40px]
                          w-[40px]
                          items-center
                          justify-center
                          border
                          text-[11px]
                          ${
                            page ===
                            pageNumber
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-[#dedede] bg-white text-[#222] hover:bg-[#f5f5f5]"
                          }
                        `}
                      >
                        {
                          pageNumber
                        }
                      </button>
                    )
                )}

                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    page ===
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (prev) =>
                        Math.min(
                          totalPages,
                          prev +
                            1
                        )
                    )
                  }
                  className="
                    flex
                    h-[40px]
                    items-center
                    gap-2
                    border
                    border-[#dedede]
                    bg-white
                    px-4
                    text-[11px]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Next

                  <ChevronRight
                    size={14}
                  />
                </button>
              </div>
            </div>
          )}
      </div>

      {/* =================================================
          UPDATE STOCK MODAL
      ================================================= */}

      {showStockModal &&
        selectedItem && (
          <div
            className="
              fixed
              inset-0
              z-[2000]
              flex
              items-center
              justify-center
              bg-black/40
              px-4
            "
          >
            <div
              className="
                relative
                w-full
                max-w-[600px]
                bg-white
                px-8
                py-7
                shadow-[0_10px_40px_rgba(0,0,0,0.18)]
              "
            >
              {/* CLOSE */}

              <button
                type="button"
                onClick={closeStockModal}
                disabled={updatingStock}
                className="
                  absolute
                  right-7
                  top-7
                  text-[#111]
                  transition
                  hover:opacity-60
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                aria-label="Close"
              >
                <X
                  size={26}
                  strokeWidth={2}
                />
              </button>

              {/* HEADER */}

              <div className="pr-12">
                <h2 className="text-[20px] font-semibold text-[#111]">
                  Update Stock
                </h2>

                <p className="mt-1 text-[14px] text-[#111]">
                  Update the available stock
                  quantity for this product
                  variant.
                </p>
              </div>

              {/* PRODUCT INFORMATION */}

              <div className="mt-7 flex gap-5">
                {/* IMAGE */}

                <div className="relative h-[173px] w-[170px] shrink-0 overflow-hidden bg-[#f4f4f4]">
                  {selectedItem.imageUrl ? (
                    <Image
                      src={
                        selectedItem.imageUrl
                      }
                      alt={
                        selectedItem.imageAlt ||
                        selectedItem.productName
                      }
                      fill
                      sizes="170px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package
                        size={35}
                        strokeWidth={1.5}
                        className="text-gray-400"
                      />
                    </div>
                  )}
                </div>

                {/* DETAILS */}

                <div className="flex flex-1 flex-col justify-center gap-3 text-[12px]">
                  <div className="grid grid-cols-[105px_1fr] gap-2">
                    <span className="font-medium">
                      Product
                    </span>

                    <span>
                      {
                        selectedItem.productName
                      }
                    </span>
                  </div>

                  <div className="grid grid-cols-[105px_1fr] gap-2">
                    <span className="font-medium">
                      Variant
                    </span>

                    <span>
                      {
                        selectedItem.variant
                      }
                    </span>
                  </div>

                  <div className="grid grid-cols-[105px_1fr] gap-2">
                    <span className="font-medium">
                      SKU
                    </span>

                    <span>
                      {
                        selectedItem.sku
                      }
                    </span>
                  </div>

                  <div className="grid grid-cols-[105px_1fr] items-center gap-2">
                    <span className="font-medium">
                      Current Stock
                    </span>

                    <div className="flex items-center gap-3">
                      <span>
                        {
                          selectedItem.stockQty
                        }
                      </span>

                      <StockStatusBadge
                        status={
                          selectedItem.stockStatus
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* NEW STOCK QUANTITY */}

              <div className="mt-7">
                <label
                  htmlFor="new-stock-quantity"
                  className="
                    mb-3
                    block
                    text-[14px]
                    font-semibold
                    text-[#111]
                  "
                >
                  New Stock Quantity
                </label>

                <input
                  id="new-stock-quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={
                    newStockQty
                  }
                  onChange={(event) =>
                    setNewStockQty(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault();

                      if (
                        !updatingStock
                      ) {
                        updateStock();
                      }
                    }
                  }}
                  placeholder="Enter quantity"
                  disabled={
                    updatingStock
                  }
                  className="
                    h-[40px]
                    w-full
                    bg-[#f3f3f3]
                    px-4
                    text-[12px]
                    text-[#111]
                    outline-none
                    focus:bg-[#eeeeee]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />

                <p className="mt-3 text-[11px] text-[#333]">
                  Enter the new total quantity
                  available for variant
                </p>
              </div>

              {/* ACTIONS */}

              <div className="mt-7 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeStockModal}
                  disabled={
                    updatingStock
                  }
                  className="
                    h-[40px]
                    bg-black
                    px-7
                    text-[12px]
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#222]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    updateStock
                  }
                  disabled={
                    updatingStock
                  }
                  className="
                    h-[40px]
                    bg-red-600
                    px-7
                    text-[12px]
                    font-semibold
                    text-white
                    transition
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {updatingStock
                    ? "Updating..."
                    : "Update Stock"}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

// =======================================================
// STOCK STATUS BADGE
// =======================================================

function StockStatusBadge({
  status,
}: {
  status:
    | "IN_STOCK"
    | "LOW_STOCK"
    | "OUT_OF_STOCK";
}) {
  const config = {
    IN_STOCK: {
      label: "In Stock",
      className:
        "border border-[#9be5b5] bg-[#dff8e7] text-[#16a34a]",
    },

    LOW_STOCK: {
      label: "Low Stock",
      className:
        "border border-[#ffc98f] bg-[#fff0dd] text-[#ff7a00]",
    },

    OUT_OF_STOCK: {
      label: "Out of Stock",
      className:
        "border border-[#ff9a9a] bg-[#ffe3e3] text-[#ef1111]",
    },
  };

  const item =
    config[status];

  return (
    <span
      className={`
        inline-flex
        px-3
        py-1.5
        text-[10px]
        font-medium
        ${item.className}
      `}
    >
      {item.label}
    </span>
  );
}

// =======================================================
// SUMMARY CARD
// =======================================================

interface SummaryCardProps {
  title: string;
  value: number;

  icon: React.ReactNode;
}

function SummaryCard({
  title,
  value,
  icon,
}: SummaryCardProps) {
  return (
    <div
      className="
        relative
        min-h-[130px]
        border
        border-[#dedede]
        bg-white
        px-6
        py-5
      "
    >
      <p className="text-[12px] font-semibold text-[#222]">
        {title}
      </p>

      <p className="mt-8 text-[27px] font-semibold leading-none text-[#111]">
        {String(
          value
        ).padStart(
          title ===
            "Out of Stock Variants"
            ? 2
            : 1,
          "0"
        )}
      </p>

      <div
        className="
          absolute
          right-5
          top-5
          flex
          h-[40px]
          w-[40px]
          items-center
          justify-center
          rounded-full
          bg-[#ffd0d0]
          text-red-500
        "
      >
        {icon}
      </div>
      
    </div>
  );
}

// =======================================================
// FILTER SELECT
// =======================================================

interface FilterSelectProps {
  value: string;

  onChange: (
    value: string
  ) => void;

  options: {
    label: string;
    value: string;
  }[];
}

function FilterSelect({
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="
          h-[40px]
          min-w-[132px]
          cursor-pointer
          appearance-none
          border-0
          bg-white
          px-4
          pr-10
          text-[11px]
          text-[#222]
          outline-none
        "
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          )
        )}
      </select>

      <ChevronDown
        size={15}
        className="
          pointer-events-none
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-black
        "
      />
    </div>
  );
}

// =======================================================
// TABLE LOADING
// =======================================================

function InventoryLoading() {
  return (
    <>
      {Array.from({
        length: 10,
      }).map((_, index) => (
        <tr
          key={index}
          className="border-b border-[#eeeeee]"
        >
          {Array.from({
            length: 8,
          }).map(
            (_, column) => (
              <td
                key={column}
                className="px-4 py-5"
              >
                <div className="h-5 w-full animate-pulse bg-[#eeeeee]" />
              </td>
            )
          )}
        </tr>
      ))}
    </>
  );
}