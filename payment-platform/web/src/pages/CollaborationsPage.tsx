import { FormEvent, useEffect, useState } from "react";
import { api } from "../lib/api";

type Collaboration = {
  id: string;
  name: string;
  description?: string;
  quotas: {
    id: string;
    currency: "USD" | "EUR" | "GBP" | "INR" | "AED";
    dailyLimitMinor: number;
    monthlyLimitMinor: number;
  }[];
};

export function CollaborationsPage() {
  const [items, setItems] = useState<Collaboration[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    providerAccountId: "",
    merchantAccountId: "",
    name: "",
    description: "",
  });

  async function load() {
    try {
      const res = await api.get("/collaborations");
      setItems(res.data);
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
      await api.post("/collaborations", form);
      setCreating(false);
      setForm({
        providerAccountId: "",
        merchantAccountId: "",
        name: "",
        description: "",
      });
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || "Failed to create");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <h1 className="text-lg sm:text-xl font-semibold">Collaborations</h1>
        <button className="btn text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 w-full sm:w-auto" onClick={() => setCreating((v) => !v)}>
          {creating ? "Close" : "New Collaboration"}
        </button>
      </div>
      {creating && (
        <div className="card p-3 sm:p-4">
          <form onSubmit={onCreate} className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <input
              className="input"
              placeholder="Provider Account ID"
              value={form.providerAccountId}
              onChange={(e) =>
                setForm({ ...form, providerAccountId: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Merchant Account ID"
              value={form.merchantAccountId}
              onChange={(e) =>
                setForm({ ...form, merchantAccountId: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <button className="btn sm:col-span-2 w-full sm:w-auto">Create</button>
          </form>
        </div>
      )}
      {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {items.map((c) => (
          <div className="card p-3 sm:p-4" key={c.id}>
            <h2 className="font-semibold text-base sm:text-lg">{c.name}</h2>
            <p className="text-xs sm:text-sm text-gray-500 break-all">{c.id}</p>
            {c.description && <p className="mt-1 text-sm">{c.description}</p>}
            <h3 className="mt-3 font-medium text-sm sm:text-base">Quotas</h3>
            <ul className="text-xs sm:text-sm space-y-1">
              {c.quotas.map((q) => (
                <li key={q.id}>
                  {q.currency}: daily {(q.dailyLimitMinor / 100).toFixed(2)},
                  monthly {(q.monthlyLimitMinor / 100).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
