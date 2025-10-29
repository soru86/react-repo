import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";
import { createStripePaymentIntent } from "../services/stripe.js";
import { createPaypalOrder } from "../services/paypal.js";

const prisma = new PrismaClient();
export const paymentsRouter = Router();

const paymentSchema = z.object({
  collaborationId: z.string().uuid(),
  amountMinor: z.number().int().positive(),
  currency: z.enum(["USD", "EUR", "GBP", "INR", "AED"]),
  provider: z.enum(["stripe", "paypal"]).default("stripe"),
  description: z.string().optional(),
});

paymentsRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const input = paymentSchema.parse(req.body);
    const collab = await prisma.collaboration.findUnique({
      where: { id: input.collaborationId },
    });
    if (!collab)
      return res
        .status(404)
        .json({
          success: false,
          error: { message: "Collaboration not found" },
        });

    let providerRef = "";
    if (input.provider === "stripe") {
      const pi = await createStripePaymentIntent(
        input.amountMinor,
        input.currency,
        input.description
      );
      providerRef = pi.id;
    } else {
      const order = await createPaypalOrder(
        input.amountMinor,
        input.currency,
        input.description
      );
      providerRef = order.id;
    }

    const payment = await prisma.payment.create({
      data: {
        collaborationId: input.collaborationId,
        amountMinor: input.amountMinor,
        currency: input.currency,
        provider: input.provider,
        providerRef,
        status: "PENDING",
        description: input.description,
      },
    });
    res.status(201).json(payment);
  } catch (e) {
    next(e);
  }
});

paymentsRouter.get("/", requireAuth, async (_req, res, next) => {
  try {
    const items = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});
