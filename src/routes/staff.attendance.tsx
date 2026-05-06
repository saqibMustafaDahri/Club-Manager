import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockParticipants } from "@/data/mockParticipants";
import { getCoach } from "@/data/coachContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/attendance")({
  component: AttendancePage,
});

type AttStatus = "Present" | "Absent" | "Late";

interface Row {
  id: string;
  fullName: string;
  lastMarked: string;
  streak: number;
  status: AttStatus;
}

function AttendancePage() {
  const coach = getCoach();
  const sessions = coach.assignedSessions;
  const squad = useMemo(
    () => mockParticipants.filter((p) => coach.squad.includes(p.fullName)),
    [coach],
  );

  const [selectedSession, setSelectedSession] = useState(sessions[0] ?? "");
  const [openMark, setOpenMark] = useState(false);
  const [markDate, setMarkDate] = useState<Date>(new Date());
  const [markSession, setMarkSession] = useState(selectedSession);
  const [marks, setMarks] = useState<Record<string, AttStatus>>({});

  const filtered = squad.filter((p) =>
    !selectedSession || p.session === selectedSession || coach.squad.includes(p.fullName)
  );

  const rows: Row[] = filtered.map((p, i) => ({
    id: p.id,
    fullName: p.fullName,
    lastMarked: ["2026-05-04", "2026-05-03", "2026-05-02", "2026-05-04", "2026-05-01"][i % 5],
    streak: [12, 8, 5, 14, 3, 9, 6, 11][i % 8],
    status: (["Present", "Present", "Late", "Absent", "Present"] as AttStatus[])[i % 5],
  }));

  const columns: Column<Row>[] = [
    {
      key: "fullName", header: "Participant", sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar text-xs font-semibold text-white">
            {r.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
          <span className="font-medium">{r.fullName}</span>
        </div>
      ),
    },
    { key: "lastMarked", header: "Last Marked" },
    { key: "streak", header: "Streak", render: (r) => `${r.streak} sessions` },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  const openModal = () => {
    setMarkSession(selectedSession || sessions[0] || "");
    const init: Record<string, AttStatus> = {};
    squad.forEach((p) => { init[p.id] = "Present"; });
    setMarks(init);
    setOpenMark(true);
  };

  const save = () => {
    setOpenMark(false);
    toast.success(`Attendance recorded for ${format(markDate, "PPP")}`);
  };

  return (
    <>
      <PageHeader
        title="Attendance"
        actions={
          <Button onClick={openModal} className="bg-brand text-brand-foreground hover:bg-brand/90">
            <ClipboardCheck className="mr-2 h-4 w-4" /> Mark Attendance
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Label className="text-sm">Session</Label>
          <Select value={selectedSession} onValueChange={setSelectedSession}>
            <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {sessions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          data={rows}
          columns={columns}
          searchKeys={["fullName"]}
          searchPlaceholder="Search squad…"
        />
      </div>

      <Dialog open={openMark} onOpenChange={setOpenMark}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Session</Label>
                <Select value={markSession} onValueChange={setMarkSession}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {sessions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !markDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {markDate ? format(markDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={markDate}
                      onSelect={(d) => d && setMarkDate(d)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto rounded-md border p-3">
              {squad.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 rounded-md border bg-card p-2.5">
                  <span className="text-sm font-medium">{p.fullName}</span>
                  <div className="flex gap-1">
                    {(["Present", "Late", "Absent"] as AttStatus[]).map((opt) => {
                      const active = marks[p.id] === opt;
                      const tone =
                        opt === "Present" ? (active ? "bg-success text-success-foreground" : "hover:bg-success/10")
                        : opt === "Late" ? (active ? "bg-warning text-warning-foreground" : "hover:bg-warning/10")
                        : (active ? "bg-destructive text-destructive-foreground" : "hover:bg-destructive/10");
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setMarks((m) => ({ ...m, [p.id]: opt }))}
                          className={cn("rounded-md border px-2.5 py-1 text-xs font-medium transition-colors", tone)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenMark(false)}>Cancel</Button>
            <Button onClick={save}>Save Attendance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
