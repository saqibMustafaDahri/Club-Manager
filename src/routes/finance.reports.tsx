// import { createFileRoute } from "@tanstack/react-router";
// import { useMemo } from "react";
// import { Download } from "lucide-react";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell,
//   PieChart, Pie,
// } from "recharts";
// import { PageHeader } from "@/components/PageHeader";
// import { Button } from "@/components/ui/button";
// import { monthlyRevenue, funnelData, capacityData } from "@/data/mockReports";
// import { mockPayments } from "@/data/mockPayments";

// export const Route = createFileRoute("/finance/reports")({
//   component: FinanceReports,
// });

// const SAR = (n: number) => `SAR ${n.toLocaleString()}`;
// const PIE_COLORS = ["var(--brand)", "var(--primary)", "var(--success)"];

// function FinanceReports() {
//   const funnelWithDrop = funnelData.map((f, i) => {
//     const prev = i > 0 ? funnelData[i - 1].count : f.count;
//     const drop = prev === 0 ? 0 : Math.round(((prev - f.count) / prev) * 100);
//     return { ...f, drop: i === 0 ? 0 : drop };
//   });

//   const methodData = useMemo(() => {
//     const totals: Record<string, number> = { Card: 0, Cash: 0, "Bank Transfer": 0 };
//     for (const p of mockPayments) {
//       for (const inv of p.invoices) totals[inv.method] = (totals[inv.method] ?? 0) + inv.amount;
//     }
//     return Object.entries(totals).map(([name, value]) => ({ name, value }));
//   }, []);

//   return (
//     <>
//       <PageHeader title="Reports" />
//       <div className="space-y-6 p-6">
//         <Panel title="Monthly Revenue (2025)" subtitle="Revenue vs target, SAR">
//           <div className="h-72 w-full">
//             <ResponsiveContainer>
//               <BarChart data={monthlyRevenue}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                 <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
//                 <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
//                 <Tooltip formatter={(v: number) => SAR(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
//                 <Legend />
//                 <Bar dataKey="target" fill="var(--muted-foreground)" name="Target" radius={[4, 4, 0, 0]} opacity={0.4} />
//                 <Bar dataKey="revenue" fill="var(--brand)" name="Revenue" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </Panel>

//         <Panel title="Enrolment Funnel" subtitle="From inquiry to completion">
//           <div className="h-72 w-full">
//             <ResponsiveContainer>
//               <BarChart data={funnelWithDrop} layout="vertical" margin={{ left: 20 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                 <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
//                 <YAxis type="category" dataKey="stage" stroke="var(--muted-foreground)" fontSize={12} width={100} />
//                 <Tooltip
//                   contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
//                   formatter={(v: number, _n, p) => [`${v} • drop-off ${p.payload.drop}%`, "Count"]}
//                 />
//                 <Bar dataKey="count" fill="var(--brand)" radius={[0, 4, 4, 0]}>
//                   {funnelWithDrop.map((_, i) => (
//                     <Cell key={i} fill={`color-mix(in oklab, var(--brand) ${100 - i * 12}%, white)`} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </Panel>

//         <Panel title="Capacity Utilisation" subtitle="Enrolled vs total capacity per location">
//           <div className="h-64 w-full">
//             <ResponsiveContainer>
//               <BarChart data={capacityData} layout="vertical" margin={{ left: 30 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                 <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
//                 <YAxis type="category" dataKey="location" stroke="var(--muted-foreground)" fontSize={12} width={130} />
//                 <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
//                 <Legend />
//                 <Bar dataKey="capacity" fill="var(--muted-foreground)" name="Capacity" opacity={0.3} radius={[0, 4, 4, 0]} />
//                 <Bar dataKey="enrolled" fill="var(--brand)" name="Enrolled" radius={[0, 4, 4, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </Panel>

//         {/* <Panel title="Payment Method Breakdown" subtitle="Share of total collected by method">
//           <div className="h-72 w-full">
//             <ResponsiveContainer>
//               <PieChart>
//                 <Tooltip formatter={(v: number) => SAR(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
//                 <Legend />
//                 <Pie
//                   data={methodData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   label={(e) => `${e.name} ${Math.round((e.percent ?? 0) * 100)}%`}
//                 >
//                   {methodData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </Panel> */}
//       </div>
//     </>
//   );
// }

// function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
//   return (
//     <div className="rounded-xl border bg-card p-5 shadow-sm">
//       <div className="mb-4 flex items-start justify-between">
//         <div>
//           <h3 className="text-base font-semibold">{title}</h3>
//           {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
//         </div>
//         <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
//       </div>
//       {children}
//     </div>
//   );
// }



import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  reportsApi,
  type ReportingDashboard,
  type FunnelItem,
  type RevenueItem,
} from "@/api/reports";

export const Route = createFileRoute("/finance/reports")({
  component: FinanceReports,
});

const SAR = (n: number) => `SAR ${(n ?? 0).toLocaleString()}`;

const stageLabel: Record<string, string> = {
  INQUIRY: "Inquiry",
  DOCUMENTS_PENDING: "Docs Pending",
  FEE_PENDING: "Fee Pending",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  WITHDRAWN: "Withdrawn",
};

function FinanceReports() {
  const [dashboard, setDashboard] = useState<ReportingDashboard | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);

  const [dashLoading, setDashLoading] = useState(true);
  const [funnelLoading, setFunnelLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(true);

  const [dashError, setDashError] = useState<string | null>(null);
  const [funnelError, setFunnelError] = useState<string | null>(null);
  const [revenueError, setRevenueError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [revenueYear, setRevenueYear] = useState(String(currentYear));
  const yearOptions = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

  // Load dashboard (capacity utilisation)
  useEffect(() => {
    reportsApi.getDashboard()
      .then(setDashboard)
      .catch((err) => setDashError(err instanceof Error ? err.message : "Failed to load dashboard."))
      .finally(() => setDashLoading(false));
  }, []);

  // Load funnel when date range changes
  useEffect(() => {
    if (!startDate || !endDate) return;
    setFunnelLoading(true);
    setFunnelError(null);
    reportsApi.getFunnel(startDate, endDate)
      .then(setFunnelData)
      .catch((err) => setFunnelError(err instanceof Error ? err.message : "Failed to load funnel."))
      .finally(() => setFunnelLoading(false));
  }, [startDate, endDate]);

  // Load revenue when year changes
  useEffect(() => {
    setRevenueLoading(true);
    setRevenueError(null);
    reportsApi.getRevenue(Number(revenueYear))
      .then(setRevenueData)
      .catch((err) => setRevenueError(err instanceof Error ? err.message : "Failed to load revenue."))
      .finally(() => setRevenueLoading(false));
  }, [revenueYear]);

  const funnelChartData = funnelData.map((f) => ({
    stage: stageLabel[f.stage] ?? f.stage,
    count: f.count,
    drop: f.dropOffRate,
  }));

  const capacityChartData = (dashboard?.capacityUtilisation ?? []).map((c) => ({
    location: c.locationName,
    capacity: c.total,
    enrolled: c.used,
    utilization: c.utilizationPercent,
  }));

  return (
    <>
      <PageHeader title="Reports" />
      <div className="space-y-6 p-6">

        {/* ── Monthly Revenue ── */}
        <Panel
          title={`Monthly Revenue (${revenueYear})`}
          subtitle="Collected vs outstanding, SAR"
          headerExtra={
            <Select value={revenueYear} onValueChange={setRevenueYear}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        >
          {revenueLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading revenue…</p>
          ) : revenueError ? (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{revenueError}</div>
          ) : revenueData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No revenue data for {revenueYear}.</p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v: number, name: string) => [
                      SAR(v),
                      name === "collected" ? "Collected" :
                        name === "outstanding" ? "Outstanding" : "YoY Collected",
                    ]}
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                  />
                  <Legend />
                  <Bar dataKey="outstanding" fill="var(--muted-foreground)" name="Outstanding" radius={[4, 4, 0, 0]} opacity={0.4} />
                  <Bar dataKey="collected" fill="var(--brand)" name="Collected" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="collectedYoY" fill="var(--brand)" name="YoY Collected" radius={[4, 4, 0, 0]} opacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>

        {/* ── Enrolment Funnel ── */}
        <Panel
          title="Enrolment Funnel"
          subtitle="From inquiry to completion"
          headerExtra={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  type="date" value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-8 w-36 text-xs"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">To</Label>
                <Input
                  type="date" value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-8 w-36 text-xs"
                />
              </div>
            </div>
          }
        >
          {funnelLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading funnel…</p>
          ) : funnelError ? (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{funnelError}</div>
          ) : funnelChartData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No funnel data for this period.</p>
          ) : (
            <>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <BarChart data={funnelChartData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis
                      type="category" dataKey="stage"
                      stroke="var(--muted-foreground)" fontSize={12} width={110}
                    />
                    <Tooltip
                      contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                      formatter={(v: number, _n, p) => [`${v} • drop-off ${p.payload.drop}%`, "Count"]}
                    />
                    <Bar dataKey="count" fill="var(--brand)" radius={[0, 4, 4, 0]}>
                      {funnelChartData.map((_, i) => (
                        <Cell key={i} fill={`color-mix(in oklab, var(--brand) ${100 - i * 12}%, white)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground md:grid-cols-4">
                {funnelChartData.map((f) => (
                  <li key={f.stage} className="rounded-md border p-2">
                    <p className="font-semibold text-foreground">{f.stage}</p>
                    <p>{f.count} • drop {f.drop}%</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>

        {/* ── Capacity Utilisation ── */}
        <Panel title="Capacity Utilisation" subtitle="Enrolled vs total capacity per location">
          {dashLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
          ) : dashError ? (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{dashError}</div>
          ) : capacityChartData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No capacity data available.</p>
          ) : (
            <>
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <BarChart data={capacityChartData} layout="vertical" margin={{ left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis
                      type="category" dataKey="location"
                      stroke="var(--muted-foreground)" fontSize={12} width={130}
                    />
                    <Tooltip
                      contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                      formatter={(v: number, name: string) => [v, name === "enrolled" ? "Enrolled" : "Capacity"]}
                    />
                    <Legend />
                    <Bar dataKey="capacity" fill="var(--muted-foreground)" name="Capacity" opacity={0.3} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="enrolled" fill="var(--brand)" name="Enrolled" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-3 lg:grid-cols-4">
                {capacityChartData.map((c) => (
                  <li key={c.location} className="rounded-md border p-2">
                    <p className="font-semibold text-foreground truncate">{c.location}</p>
                    <p>{c.enrolled} / {c.capacity} • {c.utilization}%</p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-brand" style={{ width: `${Math.min(c.utilization, 100)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>

      </div>
    </>
  );
}

function Panel({
  title, subtitle, headerExtra, children,
}: {
  title: string;
  subtitle?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {headerExtra}
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
