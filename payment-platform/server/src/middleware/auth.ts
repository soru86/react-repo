import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./error.js";

export type JwtPayload = {
  userId: string;
  role: "PROVIDER" | "MERCHANT" | "ADMIN";
};

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    return next(
      new AppError("Missing Authorization header", 401, "UNAUTHORIZED")
    );
  }
  const token = header.replace(/^Bearer\s+/i, "");
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (_e) {
    next(new AppError("Invalid or expired token", 401, "UNAUTHORIZED"));
  }
}

export function requireRole(...roles: JwtPayload["role"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload | undefined;
    if (!user) return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
    if (!roles.includes(user.role))
      return next(new AppError("Forbidden", 403, "FORBIDDEN"));
    next();
  };
}
