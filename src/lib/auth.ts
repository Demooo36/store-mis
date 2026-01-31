// src/lib/auth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export type Role = "Admin" | "Cashier" | "Customer";

export type AuthUser = {
  userId: string;
  role: Role;
};

export function requireAuth(req: NextRequest): AuthUser {
  const auth = req.headers.get("authorization") || "";
  const [scheme, token] = auth.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new Error("UNAUTHORIZED");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("SERVER_MISCONFIGURED");

  const payload = jwt.verify(token, secret) as any;

  const userId = payload?.userId;
  const role = payload?.role;

  if (!userId || !role) throw new Error("UNAUTHORIZED");

  return { userId, role };
}

export function requireRole(user: AuthUser, allowed: Role[]) {
  if (!allowed.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
}
