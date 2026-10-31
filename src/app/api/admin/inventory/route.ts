import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";


const LOW_STOCK_LIMIT = 5;

export async function GET(request: Request) {
  // =====================================================
  // ADMIN AUTHENTICATION
  // =====================================================

  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        message: auth.message,
      },
      {
        status: auth.status,
      }
    );
  }

  try {
    // =====================================================
    // QUERY PARAMETERS
    // =====================================================

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const stockStatus =
      searchParams.get("stockStatus") || "all";

    const categoryIdParam =
      searchParams.get("categoryId");

    const pageParam =
      searchParams.get("page");

    const limitParam =
      searchParams.get("limit");

    // =====================================================
    // PAGINATION
    // =====================================================

    const page = Math.max(
      1,
      Number(pageParam) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number(limitParam) || 10
      )
    );

    const skip =
      (page - 1) * limit;

    // =====================================================
    // CATEGORY FILTER
    // =====================================================

    let categoryId:
      | number
      | undefined;

    if (categoryIdParam) {
      const parsed =
        Number(categoryIdParam);

      if (
        !Number.isInteger(parsed) ||
        parsed <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid category ID",
          },
          {
            status: 400,
          }
        );
      }

      categoryId = parsed;
    }

    // =====================================================
    // VALIDATE STOCK STATUS
    // =====================================================

    const allowedStockStatuses = [
      "all",
      "in_stock",
      "low_stock",
      "out_of_stock",
    ];

    if (
      !allowedStockStatuses.includes(
        stockStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid stock status",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // BUILD WHERE
    // =====================================================

    const where: any = {
      product: {
        isActive: true,

        ...(categoryId ?
             {
              categoryId,
             }
             : {}),

        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },

                {
                  variants: {
                    some: {
                      sku: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },
    };

    // =====================================================
    // STOCK FILTER
    // =====================================================

    if (
      stockStatus ===
      "in_stock"
    ) {
      where.stockQty = {
        gt: LOW_STOCK_LIMIT,
      };
    }

    if (
      stockStatus ===
      "low_stock"
    ) {
      where.stockQty = {
        gt: 0,
        lte: LOW_STOCK_LIMIT,
      };
    }

    if (
      stockStatus ===
      "out_of_stock"
    ) {
      where.stockQty = 0;
    }

    // =====================================================
    // GET VARIANTS
    // =====================================================

    const [
      variants,
      total,
    ] = await Promise.all([
      prisma.productVariant.findMany({
        where,

        include: {
          product: {
            include: {
              category: true,

              images: {
                orderBy: {
                  sortOrder: "asc",
                },

                take: 1,
              },
            },
          },

          size: true,

          volume: true,
        },

        orderBy: {
          id: "desc",
        },

        skip,

        take: limit,
      }),

      prisma.productVariant.count({
        where,
      }),
    ]);

    // =====================================================
    // FORMAT INVENTORY DATA
    // =====================================================

    const data =
      variants.map(
        (variant) => {
          // ---------------------------------------------
          // VARIANT NAME
          // ---------------------------------------------

          let variantName = "";

          // T-shirt / clothing
          if (
            variant.size
          ) {
            const color =
              variant.colorName
                ?.trim();

            const size =
              variant.size.name;

            variantName = [
              color,
              size,
            ]
              .filter(Boolean)
              .join(" / ");
          }

          // Perfume
          else if (
            variant.volume
          ) {
            variantName =
              variant.volume.name;
          }

          // Fallback
          else if (
            variant.colorName
          ) {
            variantName =
              variant.colorName;
          }

          // ---------------------------------------------
          // STOCK STATUS
          // ---------------------------------------------

          let status:
            | "IN_STOCK"
            | "LOW_STOCK"
            | "OUT_OF_STOCK";

          if (
            variant.stockQty === 0
          ) {
            status =
              "OUT_OF_STOCK";
          } else if (
            variant.stockQty <=
            LOW_STOCK_LIMIT
          ) {
            status =
              "LOW_STOCK";
          } else {
            status =
              "IN_STOCK";
          }

          // ---------------------------------------------
          // PRICE
          // ---------------------------------------------

          const regularPrice =
            Number(
              variant.price
            );

          const salePrice =
            variant.salePrice !==
            null
              ? Number(
                  variant.salePrice
                )
              : null;

          const unitPrice =
            salePrice !== null
              ? salePrice
              : regularPrice;

          // ---------------------------------------------
          // IMAGE
          // ---------------------------------------------

          const image =
            variant.product
              .images?.[0];

          return {
            id: variant.id,

            productId:
              variant.productId,

            productName:
              variant.product.name,

            productSlug:
              variant.product.slug,

            categoryId:
              variant.product
                .categoryId,

            category:
              variant.product
                .category?.name ??
              null,

            categorySlug:
              variant.product
                .category?.slug ??
              null,

            variant:
              variantName,

            sku: variant.sku,

            unitPrice,

            regularPrice,

            salePrice,

            discountPercent:
              Number(
                variant.discountPercent
              ),

            stockQty:
              variant.stockQty,

            stockStatus:
              status,

            colorName:
              variant.colorName,

            colorCode:
              variant.colorCode,

            size:
              variant.size
                ? {
                    id:
                      variant.size.id,

                    name:
                      variant.size.name,
                  }
                : null,

            volume:
              variant.volume
                ? {
                    id:
                      variant.volume.id,

                    name:
                      variant.volume.name,
                  }
                : null,

            imageUrl:
              image?.imageUrl ??
              null,

            imageAlt:
              image?.altText ??
              null,
          };
        }
      );

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
      Math.ceil(
        total / limit
      );

    // =====================================================
    // SUMMARY
    // =====================================================

    /*
     * These are calculated from ALL active
     * product variants, not just the current page.
     */

    const summaryVariants =
      await prisma.productVariant.findMany({
        where: {
          product: {
            isActive: true,

            ...(categoryId
              ? {
                  categoryId,
                }
              : {}),
          },
        },

        select: {
          stockQty: true,
        },
      });

    const totalStock =
      summaryVariants.reduce(
        (total, variant) =>
          total +
          variant.stockQty,
        0
      );

    const inStockVariants =
      summaryVariants.filter(
        (variant) =>
          variant.stockQty >
          LOW_STOCK_LIMIT
      ).length;

    const lowStockVariants =
      summaryVariants.filter(
        (variant) =>
          variant.stockQty > 0 &&
          variant.stockQty <=
            LOW_STOCK_LIMIT
      ).length;

    const outOfStockVariants =
      summaryVariants.filter(
        (variant) =>
          variant.stockQty === 0
      ).length;

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      data,

      summary: {
        totalStock,

        inStockVariants,

        lowStockVariants,

        outOfStockVariants,
      },

      pagination: {
        page,

        limit,

        total,

        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },

      filters: {
        search,

        stockStatus,

        categoryId:
          categoryId ?? null,
      },

      lowStockLimit:
        LOW_STOCK_LIMIT,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/inventory error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch inventory",
      },
      {
        status: 500,
      }
    );
  }
}