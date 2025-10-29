import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireRole } from "../middleware/auth.js";

const prisma = new PrismaClient();
export const collaborationsRouter = Router();

// Create a collaboration between provider and merchant
const createSchema = z.object({
  providerAccountId: z.string().uuid(),
  merchantAccountId: z.string().uuid(),
  name: z.string().min(3),
  description: z.string().optional(),
});

collaborationsRouter.post(
  "/",
  requireAuth,
  requireRole("PROVIDER", "ADMIN"),
  async (req, res, next) => {
    try {
      const input = createSchema.parse(req.body);
      const collab = await prisma.collaboration.create({ data: input });
      res.status(201).json(collab);
    } catch (e) {
      next(e);
    }
  }
);

// List collaborations for current user
collaborationsRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).user.userId as string;
    const accounts = await prisma.account.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });
    const accountIds = accounts.map((a) => a.id);
    const list = await prisma.collaboration.findMany({
      where: {
        OR: [
          { providerAccountId: { in: accountIds } },
          { merchantAccountId: { in: accountIds } },
        ],
      },
      include: { quotas: true },
    });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// Allocate quota limits per currency
const quotaSchema = z.object({
  currency: z.enum(["USD", "EUR", "GBP", "INR", "AED"]),
  dailyLimitMinor: z.number().int().nonnegative(),
  monthlyLimitMinor: z.number().int().nonnegative(),
});

collaborationsRouter.post(
  "/:id/quotas",
  requireAuth,
  requireRole("PROVIDER", "ADMIN"),
  async (req, res, next) => {
    try {
      const collabId = req.params.id;
      const input = quotaSchema.parse(req.body);
      const created = await prisma.quota.upsert({
        where: {
          collaborationId_currency: {
            collaborationId: collabId,
            currency: input.currency,
          },
        },
        create: { collaborationId: collabId, ...input },
        update: {
          dailyLimitMinor: input.dailyLimitMinor,
          monthlyLimitMinor: input.monthlyLimitMinor,
        },
      });
      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  }
);
