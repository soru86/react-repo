import { FormEvent, useEffect, useMemo, useState } from "react";
import { FixedSizeList } from "react-window";
import { api } from "../lib/api";
import { StatusChip } from "../components/StatusChip";

type Payment = {
  id: string;
  collaborationId: string;
  amountMinor: number;
  currency: "USD" | "EUR" | "GBP" | "INR" | "AED";
  provider: "stripe" | "paypal";
  status: string;
  createdAt: string;
};

const ITEMS_PER_PAGE = 20;

export function PaymentsPage() {
  const [items, setItems] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    collaborationId: "",
    amountMinor: 1999,
    currency: "USD",
    provider: "stripe",
    description: "",
  });

  async function load() {
    try {
      const res = await api.get("/payments");
      setItems(res.data);
      setCurrentPage(1);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || "Failed to load");
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/payments", form);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || "Failed to create");
    }
  }

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return items.slice(start, end);
  }, [items, currentPage]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const payment = paginatedItems[index];
    if (!payment) return null;

    return (
      <div style={style} className="px-1">
        <div className="card flex items-start sm:items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4">
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-medium text-sm sm:text-base truncate">
              {payment.provider.toUpperCase()}{" "}
              {(payment.amountMinor / 100).toFixed(2)} {payment.currency}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              {payment.id} · {new Date(payment.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="flex-shrink-0">
            <StatusChip status={payment.status} type="payment" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg sm:text-xl font-semibold">Payments</h1>
      <div className="card p-3 sm:p-4">
        <form
          onSubmit={onCreate}
          className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          <input
            className="input sm:col-span-2 md:col-span-2"
            placeholder="Collaboration ID"
            value={form.collaborationId}
            onChange={(e) =>
              setForm({ ...form, collaborationId: e.target.value })
            }
          />
          <input
            className="input"
            type="number"
            placeholder="Amount (cents)"
            value={form.amountMinor}
            onChange={(e) =>
              setForm({ ...form, amountMinor: Number(e.target.value) })
            }
          />
          <select
            className="input"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            {["USD", "EUR", "GBP", "INR", "AED"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
          >
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
          </select>
          <input
            className="input sm:col-span-2 md:col-span-3"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="btn sm:col-span-2 md:col-span-3 w-full sm:w-auto">
            Create Payment
          </button>
        </form>
      </div>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}
      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <div className="text-xs sm:text-sm text-gray-500">
            Showing{" "}
            {paginatedItems.length > 0
              ? (currentPage - 1) * ITEMS_PER_PAGE + 1
              : 0}
            -{Math.min(currentPage * ITEMS_PER_PAGE, items.length)} of{" "}
            {items.length} payments
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <button
                className="btn text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-[80px] sm:min-w-[100px] text-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
        {paginatedItems.length > 0 ? (
          <FixedSizeList
            height={Math.min(paginatedItems.length * 88 + 8, 600)}
            itemCount={paginatedItems.length}
            itemSize={88}
            width="100%"
          >
            {Row}
          </FixedSizeList>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No payments found
          </div>
        )}
      </div>
    </div>
  );
}
