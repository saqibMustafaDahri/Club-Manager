import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { mockSessions, type MockSession } from "@/data/mockSessions";
import { mockParticipants } from "@/data/mockParticipants";
import { getCoach } from "@/data/coachContext";

export const Route = createFileRoute("/staff/sessions")({
  component: StaffSessions,
});

const sessionBadge = (s: string) =>
  s === "Open" ? "Active" : s === "Closed" ? "Completed" : "Scheduled";

function StaffSessions() {
  const coach = getCoach();
  const sessions = mockSessions.filter((s) => coach.assignedSessions.includes(s.name));
  const [selected, setSelected] = useState<MockSession | null>(null);

  const participantsIn = (name: string) =>
    mockParticipants.filter((p) => p.session === name && coach.squad.includes(p.fullName));

  return (
    <>
      <PageHeader title="My Sessions" description={`${sessions.length} sessions assigned`} />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((s) => {
            const pct = Math.round((s.enrolledCount / s.capacity) * 100);
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="group rounded-xl border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold">{s.name}</h3>
                  <StatusBadge status={sessionBadge(s.status)} />
                </div>
                <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{coach.location}</p>
                  <p className="flex items-center gap-2"><Calendar className="h-4 w-4" />{s.startDate} → {s.endDate}</p>
                  <p className="flex items-center gap-2"><Users className="h-4 w-4" />{s.enrolledCount} / {s.capacity} enrolled</p>
                </div>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                </div>
              </button>
            );
          })}
          {sessions.length === 0 && (
            <p className="text-sm text-muted-foreground">No sessions assigned.</p>
          )}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>
                  {coach.location} • {selected.startDate} → {selected.endDate}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <Stat label="Status" value={<StatusBadge status={sessionBadge(selected.status)} />} />
                  <Stat label="Enrolled" value={`${selected.enrolledCount}`} />
                  <Stat label="Capacity" value={`${selected.capacity}`} />
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Participants in this session</h4>
                  {participantsIn(selected.name).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No squad members in this session.</p>
                  ) : (
                    <ul className="max-h-72 divide-y overflow-y-auto rounded-md border">
                      {participantsIn(selected.name).map((p) => (
                        <li key={p.id} className="flex items-center justify-between px-3 py-2 text-sm">
                          <span className="font-medium">{p.fullName}</span>
                          <StatusBadge status={p.status === "On Hold" ? "On Hold" : "Active"} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-muted/30 p-2.5">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
