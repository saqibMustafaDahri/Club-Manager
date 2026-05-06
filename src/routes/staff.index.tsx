import { createFileRoute } from "@tanstack/react-router";
import { Users, Calendar, Percent, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { AlertItem } from "@/components/AlertItem";
import { mockParticipants } from "@/data/mockParticipants";
import { mockSessions } from "@/data/mockSessions";
import { getCoach, COACH_DISPLAY_NAME } from "@/data/coachContext";

export const Route = createFileRoute("/staff/")({
  component: StaffDashboard,
});

const today = new Date();
const todayStr = today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function StaffDashboard() {
  const coach = getCoach();
  const squad = mockParticipants.filter((p) => coach.squad.includes(p.fullName));

  const upcomingSessions = mockSessions.filter(
    (s) => coach.assignedSessions.includes(s.name) && new Date(s.startDate) >= today
  );

  // Mock today's sessions
  const todaySessions = [
    { id: "t1", name: coach.assignedSessions[0] ?? "Spring 2025", time: "09:00 – 10:30", location: coach.location, count: 12 },
    { id: "t2", name: coach.assignedSessions[1] ?? coach.assignedSessions[0] ?? "Fall 2025", time: "16:00 – 17:30", location: coach.location, count: 9 },
  ];

  // Squad alerts: missing docs or on-hold
  const alerts = squad
    .filter((p) => p.status === "On Hold" || p.documents.some((d) => d.status === "Missing"))
    .map((p) => {
      const missing = p.documents.filter((d) => d.status === "Missing").map((d) => d.name);
      const isHold = p.status === "On Hold";
      return {
        id: `al-${p.id}`,
        title: p.fullName,
        message: isHold ? "Status: On Hold — please follow up." : `Missing documents: ${missing.join(", ")}`,
        severity: isHold ? "warning" as const : "danger" as const,
        time: p.session,
      };
    });

  const firstName = COACH_DISPLAY_NAME.split(" ")[0];

  return (
    <>
      <PageHeader title={`Good morning, ${firstName}`} description={todayStr} />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="My Squad" value={squad.length} icon={Users} accent="primary" />
          <StatCard label="Sessions This Week" value={upcomingSessions.length || todaySessions.length} icon={Calendar} accent="brand" />
          <StatCard label="Attendance Rate" value="87%" icon={Percent} accent="success" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold">Today's Sessions</h3>
            <ul className="space-y-3">
              {todaySessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.location}</span>
                    </p>
                  </div>
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">{s.count} participants</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold">Squad Alerts</h3>
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No squad alerts.</p>
            ) : (
              <div className="space-y-2">
                {alerts.map((a) => <AlertItem key={a.id} alert={a} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
