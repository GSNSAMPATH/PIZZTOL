import { jwtVerify, SignJWT } from "jose";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return new TextEncoder().encode(secret);
}

export type AuthPayload = {
  userId: number;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

export async function createAccessToken(
  payload: AuthPayload
) {
  const JWT_SECRET = getJwtSecret();

  return await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(
  token: string
) {
  try {
    const JWT_SECRET = getJwtSecret();

    const { payload } = await jwtVerify(
      token,
      JWT_SECRET
    );

    return {
      userId: Number(payload.userId),
      email: String(payload.email),
      role: payload.role as "CUSTOMER" | "ADMIN",
    };
  } catch {
    return null;
  }
}