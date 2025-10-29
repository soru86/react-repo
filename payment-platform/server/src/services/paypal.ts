import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID || "",
  client_secret: process.env.PAYPAL_CLIENT_SECRET || "",
});

export function createPaypalOrder(
  amountMinor: number,
  currency: string,
  description?: string
): Promise<{ id: string }> {
  const total = (amountMinor / 100).toFixed(2);
  const payment: paypal.Payment = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    transactions: [
      {
        amount: { total, currency },
        description,
      },
    ],
    redirect_urls: {
      return_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    },
  } as any;

  return new Promise((resolve, reject) => {
    paypal.payment.create(payment, (error, created) => {
      if (error) return reject(error);
      resolve({ id: created.id });
    });
  });
}
