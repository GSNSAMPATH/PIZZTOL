import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw<
      { result: number }[]
    >`SELECT 1 AS result`;

    return NextResponse.json({
      success: true,
      database: result[0]?.result === 1,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
      },
      { status: 500 }
    );
  }
}