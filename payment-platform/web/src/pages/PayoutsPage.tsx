import { FormEvent, useEffect, useMemo, useState } from "react";
import { FixedSizeList } from "react-window";
import { api } from "../lib/api";
import { StatusChip } from "../components/StatusChip";

type Payout = {
  id: string;
  accountId: string;
  amountMinor: number;
  currency: string;
  status: string;
  createdAt: string;
};

const ITEMS_PER_PAGE = 20;

export function PayoutsPage() {
  const [items, setItems] = useState<Payout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    accountId: "",
    amountMinor: 5000,
    currency: "USD",
  });

  async function load() {
    try {
      const res = await api.get("/payouts");
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
      await api.post("/payouts", form);
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
    const payout = paginatedItems[index];
    if (!payout) return null;

    return (
      <div style={style} className="px-1">
        <div className="card flex items-start sm:items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4">
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-medium text-sm sm:text-base truncate">
              {(payout.amountMinor / 100).toFixed(2)} {payout.currency}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              {payout.accountId} · {new Date(payout.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="flex-shrink-0">
            <StatusChip status={payout.status} type="payout" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg sm:text-xl font-semibold">Payouts</h1>
      <div className="card p-3 sm:p-4">
        <form
          onSubmit={onCreate}
          className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          <input
            className="input sm:col-span-2 md:col-span-2"
            placeholder="Account ID"
            value={form.accountId}
            onChange={(e) => setForm({ ...form, accountId: e.target.value })}
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
          <button className="btn sm:col-span-2 md:col-span-3 w-full sm:w-auto">
            Request Payout
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
            {items.length} payouts
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
          <div className="text-center py-8 text-gray-500">No payouts found</div>
        )}
      </div>
    </div>
  );
}
