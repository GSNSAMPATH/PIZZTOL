import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  return await verifyAccessToken(token);
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false as const,
      status: 401 as const,
      message: "Authentication required",
    };
  }

  if (user.role !== "ADMIN") {
    return {
      authorized: false as const,
      status: 403 as const,
      message: "Admin access required",
    };
  }

  return {
    authorized: true as const,
    user,
  };
}