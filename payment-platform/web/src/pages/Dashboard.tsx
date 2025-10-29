import { useEffect, useMemo, useState } from "react";
import { api, getStoredUser } from "../lib/api.ts";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  TooltipProps,
} from "recharts";

type Payment = {
  id: string;
  collaborationId: string;
  amountMinor: number;
  currency: string;
  provider: string;
  status: string; // PENDING | SUCCEEDED | FAILED | REFUNDED
  createdAt: string;
};

type Payout = { id: string; status: string; createdAt: string };
type Dispute = { id: string; status: string; createdAt: string };
type Collaboration = { id: string; name: string };

const COLORS = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  blue: "#3b82f6",
  slate: "#64748b",
  orange: "#f97316",
};

// Custom tooltip components
function CustomTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-lg">
      {label && (
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {entry.name || entry.dataKey}:{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {entry.value}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieCustomTooltip({ active, payload }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-lg">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {data.name}:{" "}
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {data.value}
          </span>
        </span>
      </div>
    </div>
  );
}

export function Dashboard() {
  const user = getStoredUser();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setError(null);
      setLoading(true);
      try {
        const [pRes, poRes, dRes, cRes] = await Promise.all([
          api.get("/payments"),
          api.get("/payouts"),
          api.get("/disputes"),
          api.get("/collaborations"),
        ]);
        if (!mounted) return;
        setPayments(pRes.data);
        setPayouts(poRes.data);
        setDisputes(dRes.data);
        setCollabs(cRes.data.map((c: any) => ({ id: c.id, name: c.name })));
      } catch (e: any) {
        setError(
          e?.response?.data?.error?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = payments.length;
    const pending = payments.filter((p) => p.status === "PENDING").length;
    const succeeded = payments.filter((p) => p.status === "SUCCEEDED").length;
    const failed = payments.filter((p) => p.status === "FAILED").length;
    const refunded = payments.filter((p) => p.status === "REFUNDED").length;

    const disputesCount = disputes.length;
    const payoutsCount = payouts.length;

    // Top collaboration by number of payments
    const collabCount = new Map<string, number>();
    payments.forEach((p) =>
      collabCount.set(
        p.collaborationId,
        (collabCount.get(p.collaborationId) || 0) + 1
      )
    );
    let topCollabId: string | null = null;
    let topCount = 0;
    for (const [id, count] of collabCount) {
      if (count > topCount) {
        topCount = count;
        topCollabId = id;
      }
    }
    const topCollabName = topCollabId
      ? collabs.find((c) => c.id === topCollabId)?.name || topCollabId
      : "—";

    // Time series: payments per day (last 14 days)
    const byDay = new Map<string, number>();
    payments.forEach((p) => {
      const d = new Date(p.createdAt);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
      byDay.set(key, (byDay.get(key) || 0) + 1);
    });
    const sortedDays = Array.from(byDay.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .slice(-14);
    const lineData = sortedDays.map(([date, count]) => ({ date, count }));

    return {
      total,
      pending,
      succeeded,
      failed,
      refunded,
      disputesCount,
      payoutsCount,
      topCollabName,
      lineData,
    };
  }, [payments, disputes, payouts, collabs]);

  const paymentPieData = [
    { name: "Succeeded", value: stats.succeeded, color: COLORS.green },
    { name: "Pending", value: stats.pending, color: COLORS.yellow },
    { name: "Failed", value: stats.failed, color: COLORS.red },
    { name: "Refunded", value: stats.refunded, color: COLORS.slate },
  ];

  const payoutsBarData = useMemo(() => {
    const counts: Record<string, number> = {};
    payouts.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, value]) => ({ status, value }));
  }, [payouts]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div className="sm:col-span-2 xl:col-span-3 card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h2 className="font-semibold text-lg sm:text-xl">Welcome</h2>
          <div className="text-xs sm:text-sm text-gray-500">
            {user?.name} · {user?.role}
          </div>
        </div>
        {error && (
          <div className="mt-2 text-red-600 dark:text-red-400 text-sm">{error}</div>
        )}
      </div>

      <div className="card">
        <h3 className="font-medium mb-3 text-sm sm:text-base">Payments status</h3>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentPieData}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
              >
                {paymentPieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip content={<PieCustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-xs sm:text-sm text-gray-500">Total: {stats.total}</div>
      </div>

      <div className="card">
        <h3 className="font-medium mb-3 text-sm sm:text-base">Payouts by status</h3>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payoutsBarData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.3}
              />
              <XAxis dataKey="status" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="value" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-xs sm:text-sm text-gray-500">
          Total payouts: {stats.payoutsCount}
        </div>
      </div>

      <div className="card sm:col-span-2 xl:col-span-1">
        <h3 className="font-medium mb-3 text-sm sm:text-base">Payments last 14 days</h3>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.lineData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="date"
                hide={stats.lineData.length > 10 ? true : false}
                stroke="#9ca3af"
                tick={{ fontSize: 10 }}
              />
              <YAxis allowDecimals={false} stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke={COLORS.orange}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: COLORS.orange }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card sm:col-span-2 xl:col-span-3">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <Stat
            label="Disputes"
            value={stats.disputesCount}
            color={COLORS.red}
          />
          <Stat
            label="Payments completed"
            value={stats.succeeded}
            color={COLORS.green}
          />
          <Stat
            label="Payments pending"
            value={stats.pending}
            color={COLORS.yellow}
          />
        </div>
        <div className="mt-4 text-xs sm:text-sm">
          Top collaboration:{" "}
          <span className="font-medium">{stats.topCollabName}</span>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
      <div className="text-xs sm:text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-xl sm:text-2xl font-semibold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
