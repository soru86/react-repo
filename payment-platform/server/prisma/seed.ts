import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper functions
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): Date {
  const now = new Date();
  const days = randomInt(0, daysAgo);
  const hours = randomInt(0, 23);
  const minutes = randomInt(0, 59);
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hours, minutes, randomInt(0, 59), 0);
  return date;
}

async function main() {
  // Users
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const [admin, provider, merchant] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        name: "Admin",
        role: "ADMIN",
        passwordHash,
      },
    }),
    prisma.user.upsert({
      where: { email: "provider@example.com" },
      update: {},
      create: {
        email: "provider@example.com",
        name: "Provider Inc",
        role: "PROVIDER",
        passwordHash,
      },
    }),
    prisma.user.upsert({
      where: { email: "merchant@example.com" },
      update: {},
      create: {
        email: "merchant@example.com",
        name: "Merchant LLC",
        role: "MERCHANT",
        passwordHash,
      },
    }),
  ]);

  // Accounts
  const [providerAccount, merchantAccount] = await Promise.all([
    prisma.account.create({
      data: { name: "Provider Main", ownerId: provider.id },
    }),
    prisma.account.create({
      data: { name: "Merchant Main", ownerId: merchant.id },
    }),
  ]);

  // Multiple collaborations for variety
  const collabs = await Promise.all([
    prisma.collaboration.create({
      data: {
        name: "Default Partnership",
        description: "Seeded partnership for testing",
        providerAccountId: providerAccount.id,
        merchantAccountId: merchantAccount.id,
      },
    }),
    prisma.collaboration.create({
      data: {
        name: "Premium Collaboration",
        description: "High volume partnership",
        providerAccountId: providerAccount.id,
        merchantAccountId: merchantAccount.id,
      },
    }),
    prisma.collaboration.create({
      data: {
        name: "Standard Collaboration",
        description: "Regular business partnership",
        providerAccountId: providerAccount.id,
        merchantAccountId: merchantAccount.id,
      },
    }),
  ]);

  const currencies = ["USD", "EUR", "GBP", "INR", "AED"];
  const paymentStatuses = ["PENDING", "SUCCEEDED", "FAILED", "REFUNDED"];
  const payoutStatuses = ["REQUESTED", "PROCESSING", "PAID", "FAILED"];
  const providers = ["stripe", "paypal"];

  // Quotas for all currencies for each collaboration
  for (const collab of collabs) {
    await Promise.all(
      currencies.map((c) =>
        prisma.quota.create({
          data: {
            collaborationId: collab.id,
            currency: c,
            dailyLimitMinor: 500000,
            monthlyLimitMinor: 5000000,
          },
        })
      )
    );
  }

  // Generate 1000 payments spread over last 15 days
  const payments = [];
  for (let i = 0; i < 1000; i++) {
    const createdAt = randomDate(15);
    // Weight statuses: 70% succeeded, 15% pending, 10% failed, 5% refunded
    const rand = Math.random();
    const status =
      rand < 0.7
        ? "SUCCEEDED"
        : rand < 0.85
        ? "PENDING"
        : rand < 0.95
        ? "FAILED"
        : "REFUNDED";

    payments.push({
      collaborationId: randomItem(collabs).id,
      amountMinor: randomInt(500, 50000), // $5 to $500
      currency: randomItem(currencies),
      provider: randomItem(providers),
      providerRef: `pi_${status.toLowerCase()}_${i}_${Date.now()}`,
      status,
      description: `Payment #${i + 1} - ${status}`,
      createdAt,
    });
  }

  // Generate in batches of 100
  for (let i = 0; i < payments.length; i += 100) {
    await prisma.payment.createMany({
      data: payments.slice(i, i + 100),
    });
    console.log(
      `Created payments ${i + 1}-${Math.min(i + 100, payments.length)}`
    );
  }

  // Generate 100 payouts spread over last 15 days
  const payouts = [];
  for (let i = 0; i < 100; i++) {
    const createdAt = randomDate(15);
    // Weight statuses: 60% paid, 20% processing, 15% requested, 5% failed
    const rand = Math.random();
    const status =
      rand < 0.6
        ? "PAID"
        : rand < 0.8
        ? "PROCESSING"
        : rand < 0.95
        ? "REQUESTED"
        : "FAILED";

    payouts.push({
      accountId: randomItem([providerAccount.id, merchantAccount.id]),
      amountMinor: randomInt(1000, 100000), // $10 to $1000
      currency: randomItem(currencies),
      status,
      createdAt,
    });
  }

  await prisma.payout.createMany({ data: payouts });
  console.log(`Created ${payouts.length} payouts`);

  // Generate some disputes
  const paymentsForDisputes = await prisma.payment.findMany({
    where: { status: { in: ["SUCCEEDED", "FAILED"] } },
    take: 20,
  });

  const disputes = [];
  const disputeStatuses = ["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"];
  const disputeReasons = [
    "Product not received",
    "Item not as described",
    "Unauthorized transaction",
    "Payment processing error",
    "Duplicate charge",
  ];

  for (const payment of paymentsForDisputes.slice(0, 15)) {
    disputes.push({
      paymentId: payment.id,
      reason: randomItem(disputeReasons),
      status: randomItem(disputeStatuses),
      createdAt: randomDate(10),
    });
  }

  await prisma.dispute.createMany({ data: disputes });
  console.log(`Created ${disputes.length} disputes`);

  console.log("Seed completed:", {
    users: {
      admin: admin.email,
      provider: provider.email,
      merchant: merchant.email,
    },
    collaborations: collabs.length,
    payments: payments.length,
    payouts: payouts.length,
    disputes: disputes.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
