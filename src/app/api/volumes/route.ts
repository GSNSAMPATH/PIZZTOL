import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const volumes =
      await prisma.volume.findMany({
        orderBy: {
          id: "asc",
        },
      });

    return NextResponse.json({
      success: true,
      count: volumes.length,
      data: volumes,
    });
  } catch (error) {
    console.error(
      "GET /api/volumes error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch volumes",
      },
      {
        status: 500,
      }
    );
  }
}