import {
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";


export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  // =====================================================
  // ADMIN AUTH
  // =====================================================

  const auth =
    await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        message:
          auth.message,
      },
      {
        status:
          auth.status,
      }
    );
  }

  try {
    // =====================================================
    // GET VARIANT ID
    // =====================================================

    const { id } =
      await context.params;

    const variantId =
      Number(id);

    if (
      !Number.isInteger(
        variantId
      ) ||
      variantId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid variant ID",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // READ BODY
    // =====================================================

    const body =
      await request.json();

    const stockQty =
      Number(
        body.stockQty
      );

    if (
      !Number.isInteger(
        stockQty
      ) ||
      stockQty < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Stock quantity must be a valid non-negative integer",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // FIND VARIANT
    // =====================================================

    const existingVariant =
      await prisma.productVariant.findUnique(
        {
          where: {
            id: variantId,
          },
        }
      );

    if (!existingVariant) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product variant not found",
        },
        {
          status: 404,
        }
      );
    }

    // =====================================================
    // UPDATE STOCK
    // =====================================================

    const updatedVariant =
      await prisma.productVariant.update(
        {
          where: {
            id: variantId,
          },

          data: {
            stockQty,
          },

          include: {
            product: true,
            size: true,
            volume: true,
          },
        }
      );

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message:
          "Stock updated successfully",

        data: updatedVariant,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PUT /api/admin/inventory/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update stock",
      },
      {
        status: 500,
      }
    );
  }
}