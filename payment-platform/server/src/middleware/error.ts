import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(
    message: string,
    statusCode = 400,
    code = "BAD_REQUEST",
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  next(new AppError("Route not found", 404, "NOT_FOUND"));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isAppError = err instanceof AppError;
  const status = isAppError ? err.statusCode : 500;
  const payload = {
    success: false,
    error: {
      message: isAppError ? err.message : "Unexpected error",
      code: isAppError ? err.code : "INTERNAL_ERROR",
      details: isAppError ? err.details : undefined,
    },
  };
  res.status(status).json(payload);
}
