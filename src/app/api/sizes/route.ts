import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sizes = await prisma.size.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      count: sizes.length,
      data: sizes,
    });
  } catch (error) {
    console.error("GET /api/sizes error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sizes",
      },
      {
        status: 500,
      }
    );
  }
}