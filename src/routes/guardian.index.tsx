import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, CreditCard } from "lucide-react";
import { children, guardianInvoices } from "@/data/guardian";

export const Route = createFileRoute("/guardian/")({
  component: GuardianHome,
});

function GuardianHome() {
  const due = guardianInvoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  return (
    <>
      <PageHeader title="Welcome back, Niamh" breadcrumbs={[{ label: "Guardian", to: "/guardian" }, { label: "Overview" }]} description="Everything for your family in one place." />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Children" value={children.length} subLabel="All Active" trend="neutral" icon={Users} accent="brand" />
          <StatCard label="Next session" value="Thu 16:30" subLabel="Aria · Football U10" trend="neutral" icon={Calendar} accent="primary" />
          <StatCard label="Amount due" value={`€${due}`} subLabel={due ? "Pay before May 15" : "All paid up"} trend={due ? "down" : "up"} icon={CreditCard} accent={due ? "warning" : "success"} />
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">My children</h2>
            <Button asChild variant="outline" size="sm"><Link to="/guardian/children">Manage</Link></Button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {children.map((c) => (
              <div key={c.id} className="rounded-lg border bg-background p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">Age {c.age} · {c.programme}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div><p className="text-muted-foreground">Coach</p><p className="font-medium">{c.coach}</p></div>
                  <div><p className="text-muted-foreground">Next session</p><p className="font-medium">{c.nextSession}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
