import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET = new TextEncoder().encode(secret);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      userId: Number(payload.userId),
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin pages
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow the login page
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  // No token
  if (!token) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyToken(token);

  // Invalid token
  if (!user) {
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    response.cookies.delete("access_token");

    return response;
  }

  // Logged in but not ADMIN
  if (user.role !== "ADMIN") {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // ADMIN → allow request
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};