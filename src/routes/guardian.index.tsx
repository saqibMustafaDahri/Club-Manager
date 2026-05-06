import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Calendar, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { mockParticipants } from "@/data/mockParticipants";
import { mockPayments } from "@/data/mockPayments";
import { mockActivity } from "@/data/mockActivity";
import { GUARDIAN_CHILD_IDS, GUARDIAN_NAME } from "@/data/guardianContext";

export const Route = createFileRoute("/guardian/")({
  component: GuardianDashboard,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

const statusToBadge = (s: string) =>
  s === "Active" ? "Active" :
  s === "Fee Pending" || s === "Documents Pending" ? "Pending" :
  s === "On Hold" ? "On Hold" :
  s === "Completed" ? "Completed" :
  s === "Withdrawn" ? "Withdrawn" : "Pending";

function GuardianDashboard() {
  const children = mockParticipants.filter((p) => GUARDIAN_CHILD_IDS.includes(p.id));
  const childNames = children.map((c) => c.fullName);

  const childPayments = mockPayments.filter((p) => GUARDIAN_CHILD_IDS.includes(p.participantId));

  const upcomingFees = childPayments
    .filter((p) => p.balance > 0 && p.nextDueDate !== "—")
    .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate))
    .slice(0, 3);

  const recentActivity = mockActivity
    .filter((a) => childNames.includes(a.subject))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 5);

  const firstName = GUARDIAN_NAME.split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}</h1>
        <p className="mt-1 text-muted-foreground">Here's a summary of your children's enrolment.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {children.map((child) => {
          const upcoming = childPayments.find((p) => p.participantId === child.id && p.balance > 0 && p.nextDueDate !== "—");
          return (
            <Link
              key={child.id}
              to="/guardian/participant/$id"
              params={{ id: child.id }}
              className="group rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sidebar text-lg font-semibold text-white">
                    {child.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{child.fullName}</h3>
                    <p className="text-sm text-muted-foreground">Age {child.age} • {child.nationality}</p>
                  </div>
                </div>
                <StatusBadge status={statusToBadge(child.status)} />
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{child.location} • {child.session}</span>
                </div>
                {upcoming ? (
                  <div className="flex items-center justify-between rounded-md bg-amber-50 px-3 py-2 text-amber-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Next fee due {upcoming.nextDueDate}</span>
                    </div>
                    <span className="font-semibold">{SAR(upcoming.balance)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-emerald-800">
                    <Calendar className="h-4 w-4" />
                    <span>No upcoming fees</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-end text-sm font-medium text-brand">
                View profile <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Upcoming Fees">
          {upcomingFees.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming fees.</p>
          ) : (
            <ul className="divide-y">
              {upcomingFees.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{p.session}</p>
                    <p className="text-xs text-muted-foreground">{p.participantName} • Due {p.nextDueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{SAR(p.balance)}</span>
                    <StatusBadge status={p.status === "Overdue" ? "Overdue" : "Pending"} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Activity">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <ul className="divide-y">
              {recentActivity.map((a) => (
                <li key={a.id} className="py-3">
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.subject} • {new Date(a.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}
