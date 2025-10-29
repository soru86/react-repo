import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireRole } from "../middleware/auth.js";

const prisma = new PrismaClient();
export const payoutsRouter = Router();

const createSchema = z.object({
  accountId: z.string().uuid(),
  amountMinor: z.number().int().positive(),
  currency: z.enum(["USD", "EUR", "GBP", "INR", "AED"]),
});

payoutsRouter.post(
  "/",
  requireAuth,
  requireRole("PROVIDER", "ADMIN"),
  async (req, res, next) => {
    try {
      const input = createSchema.parse(req.body);
      const payout = await prisma.payout.create({
        data: { ...input, status: "REQUESTED" },
      });
      res.status(201).json(payout);
    } catch (e) {
      next(e);
    }
  }
);

payoutsRouter.get("/", requireAuth, async (_req, res, next) => {
  try {
    const items = await prisma.payout.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});
