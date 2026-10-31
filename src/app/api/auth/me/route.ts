import { getCurrentUser } from "@/lib/auth-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
          data: null,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "GET /api/auth/me error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get current user",
      },
      { status: 500 }
    );
  }
}