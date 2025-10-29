import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const prisma = new PrismaClient();
export const disputesRouter = Router();

const createSchema = z.object({
  paymentId: z.string().uuid(),
  reason: z.string().min(3),
});

disputesRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);
    const dispute = await prisma.dispute.create({
      data: { ...input, status: "OPEN" },
    });
    res.status(201).json(dispute);
  } catch (e) {
    next(e);
  }
});

disputesRouter.get("/", requireAuth, async (_req, res, next) => {
  try {
    const items = await prisma.dispute.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});
