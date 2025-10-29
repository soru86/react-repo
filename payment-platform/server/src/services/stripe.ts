import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function createStripePaymentIntent(
  amountMinor: number,
  currency: string,
  description?: string
) {
  const pi = await stripe.paymentIntents.create({
    amount: amountMinor,
    currency: currency.toLowerCase(),
    description,
    automatic_payment_methods: { enabled: true },
  });
  return pi;
}
