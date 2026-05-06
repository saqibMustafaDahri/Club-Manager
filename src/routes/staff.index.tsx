import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ClipboardCheck } from "lucide-react";
import { sessions } from "@/data/sessions";

export const Route = createFileRoute("/staff/")({
  component: StaffHome,
});

function StaffHome() {
  const mine = sessions.filter((s) => s.coach === "Mark Doyle");
  const upcoming = mine.filter((s) => s.status === "Scheduled");
  return (
    <>
      <PageHeader title="Today" breadcrumbs={[{ label: "Coach", to: "/staff" }, { label: "Today" }]} description="Your schedule, attendance, and squad." />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Sessions this week" value={mine.length} subLabel="3 upcoming" trend="neutral" icon={Calendar} accent="brand" />
          <StatCard label="Squad size" value={37} subLabel="Across U10 & U12" trend="up" icon={Users} accent="primary" />
          <StatCard label="Attendance rate" value="94%" subLabel="Past 30 days" trend="up" icon={ClipboardCheck} accent="success" />
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">My upcoming sessions</h2>
            <Button asChild variant="outline" size="sm"><Link to="/staff/schedule">Full schedule</Link></Button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3">When</th>
                  <th className="pb-3">Programme</th>
                  <th className="pb-3">Capacity</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="py-3 font-medium">{s.date} · {s.startTime}</td>
                    <td className="py-3">{s.programme}</td>
                    <td className="py-3">{s.enrolled}/{s.capacity}</td>
                    <td className="py-3"><StatusBadge status={s.status} /></td>
                    <td className="py-3 text-right"><Button asChild size="sm" variant="outline"><Link to="/staff/attendance">Take attendance</Link></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
