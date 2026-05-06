import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { monthlyRevenue, funnelData, capacityData } from "@/data/mockReports";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function ReportsPage() {
  const funnelWithDrop = funnelData.map((f, i) => {
    const prev = i > 0 ? funnelData[i - 1].count : f.count;
    const drop = prev === 0 ? 0 : Math.round(((prev - f.count) / prev) * 100);
    return { ...f, drop: i === 0 ? 0 : drop };
  });

  return (
    <>
      <PageHeader title="Reports" />
      <div className="space-y-6 p-6">
        <Panel title="Monthly Revenue (2025)" subtitle="Revenue vs target, SAR">
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => SAR(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="target" fill="var(--muted-foreground)" name="Target" radius={[4, 4, 0, 0]} opacity={0.4} />
                <Bar dataKey="revenue" fill="var(--brand)" name="Revenue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Enrolment Funnel" subtitle="From inquiry to completion">
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={funnelWithDrop} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="stage" stroke="var(--muted-foreground)" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                  formatter={(v: number, _n, p) => [`${v} • drop-off ${p.payload.drop}%`, "Count"]}
                />
                <Bar dataKey="count" fill="var(--brand)" radius={[0, 4, 4, 0]}>
                  {funnelWithDrop.map((_, i) => (
                    <Cell key={i} fill={`color-mix(in oklab, var(--brand) ${100 - i * 12}%, white)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground md:grid-cols-5">
            {funnelWithDrop.map((f) => (
              <li key={f.stage} className="rounded-md border p-2">
                <p className="font-semibold text-foreground">{f.stage}</p>
                <p>{f.count} • drop {f.drop}%</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Capacity Utilisation" subtitle="Enrolled vs total capacity per location">
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={capacityData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="location" stroke="var(--muted-foreground)" fontSize={12} width={130} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="capacity" fill="var(--muted-foreground)" name="Capacity" opacity={0.3} radius={[0, 4, 4, 0]} />
                <Bar dataKey="enrolled" fill="var(--brand)" name="Enrolled" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
      </div>
      {children}
    </div>
  );
}
