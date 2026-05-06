import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { attendance } from "@/data/sessions";

export const Route = createFileRoute("/staff/attendance")({
  component: AttendancePage,
});

type Status = "Present" | "Absent" | "Late";

function AttendancePage() {
  const [rows, setRows] = useState(attendance);
  const set = (id: string, status: Status) =>
    setRows(rows.map((r) => (r.participantId === id ? { ...r, status } : r)));

  return (
    <>
      <PageHeader
        title="Attendance"
        breadcrumbs={[{ label: "Coach", to: "/staff" }, { label: "Attendance" }]}
        description="Football U10 — Sat 4 May, 10:00"
        actions={<><Button variant="outline">Cancel</Button><Button>Save attendance</Button></>}
      />
      <div className="p-6">
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          {rows.map((r) => (
            <div key={r.participantId} className="flex items-center justify-between border-b px-5 py-3 last:border-0">
              <div>
                <p className="text-sm font-medium">{r.participantName}</p>
                <p className="text-xs text-muted-foreground">{r.participantId}</p>
              </div>
              <div className="flex gap-1">
                {(["Present", "Late", "Absent"] as Status[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => set(r.participantId, s)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors",
                      r.status === s
                        ? s === "Present" ? "bg-success text-white ring-success"
                          : s === "Late" ? "bg-warning text-white ring-warning"
                          : "bg-destructive text-white ring-destructive"
                        : "bg-card text-muted-foreground ring-border hover:bg-muted"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
