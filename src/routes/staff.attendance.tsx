import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
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
import { participantsApi, type Participant } from "@/api/participants";
import { sessionsApi, type Session } from "@/api/sessions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/attendance")({
  component: AttendancePage,
});

type AttStatus = "Present" | "Absent" | "Late";

function AttendancePage() {
  const [squad, setSquad] = useState<Participant[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [selectedSession, setSelectedSession] = useState("");
  const [openMark, setOpenMark] = useState(false);
  const [markDate, setMarkDate] = useState<Date>(new Date());
  const [markSession, setMarkSession] = useState("");
  const [marks, setMarks] = useState<Record<string, AttStatus>>({});

  // Get staff user from localStorage — same as squad page
  const stored = localStorage.getItem("user");
  const staffUser = stored ? JSON.parse(stored) : null;

  const staffLocationId: string | null =
    staffUser?.locationId ?? staffUser?.location?.id ?? null;
  const staffLocationName: string | null =
    staffUser?.location?.name ?? staffUser?.locationName ?? null;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [allParticipants, allSessions] = await Promise.all([
          participantsApi.getAll(),
          sessionsApi.getAll(),
        ]);

        // ── Filter participants by staff's location (same as squad page) ──
        const filteredParticipants = allParticipants.filter((p) => {
          const raw = p as any;
          if (staffLocationId) {
            const pLocId = raw.locationId ?? raw.location?.id ?? null;
            if (pLocId && pLocId === staffLocationId) return true;
          }
          if (staffLocationName) {
            const pLocName = raw.location?.name ?? raw.locationSlug ?? null;
            if (pLocName && pLocName.toLowerCase() === staffLocationName.toLowerCase()) return true;
          }
          return false;
        });

        // ── Filter sessions by staff's location ──
        const filteredSessions = allSessions.filter((s) => {
          if (!s.locations?.length) return false;
          return s.locations.some((sl) => {
            if (staffLocationId && sl.locationId === staffLocationId) return true;
            if (staffLocationName && sl.location?.name?.toLowerCase() === staffLocationName.toLowerCase()) return true;
            return false;
          });
        });

        setSquad(filteredParticipants);
        setSessions(filteredSessions);

        // Default to first session
        if (filteredSessions.length > 0) {
          setSelectedSession(filteredSessions[0].id);
          setMarkSession(filteredSessions[0].id);
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [staffLocationId, staffLocationName]);

  // Table rows — one per squad member
  const rows = useMemo(() =>
    squad.map((p) => ({
      id: p.id,
      fullName: `${p.firstNameEn} ${p.lastNameEn}`,
      joinedDate: p.joinedDate ?? p.createdAt ?? "—",
      status: p.status ?? "ACTIVE",
    })),
    [squad]
  );

  type Row = typeof rows[number];

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
    {
      key: "LastMarked", header: "Last Marked",
      // render: (r) => {
      //   if (!r.joinedDate || r.joinedDate === "—") return "—";
      //   return new Date(r.joinedDate).toLocaleDateString("en-GB", {
      //     day: "2-digit", month: "short", year: "numeric",
      //   });
      // },
    },
    {
      key: "streak", header: "Streak",
      // render: (r) => {
      //   const display =
      //     r.status === "ACTIVE" ? "Active" :
      //       r.status === "ON_HOLD" ? "On Hold" :
      //         r.status === "Active" ? "Active" :
      //           r.status === "On Hold" ? "On Hold" : "Active";
      //   return <StatusBadge status={display} />;
      // },
    },
    {
      key: "id", header: "Today's Mark",
      render: (r) => {
        const current = marks[r.id];
        if (!current) return <span className="text-xs text-muted-foreground">Not marked</span>;
        return <StatusBadge status={current} />;
      },
    },
  ];

  const openModal = () => {
    setMarkSession(selectedSession || sessions[0]?.id || "");
    const init: Record<string, AttStatus> = {};
    squad.forEach((p) => { init[p.id] = "Present"; });
    setMarks(init);
    setOpenMark(true);
  };

  const save = () => {
    setOpenMark(false);
    toast.success(`Attendance recorded for ${format(markDate, "PPP")}`);
  };

  const selectedSessionName =
    sessions.find((s) => s.id === selectedSession)?.name ?? selectedSession;

  return (
    <>
      <PageHeader
        title="Attendance"
        description={loading ? "Loading…" : `${squad.length} participants`}
        actions={
          <Button
            onClick={openModal}
            disabled={loading || squad.length === 0}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <ClipboardCheck className="mr-2 h-4 w-4" /> Mark Attendance
          </Button>
        }
      />

      <div className="space-y-6 p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</div>
        ) : (
          <>
            {/* Session filter */}
            {sessions.length > 0 && (
              <div className="flex items-center gap-3">
                <Label className="text-sm">Session</Label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {sessions.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {squad.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No participants found at your assigned location.
              </p>
            ) : (
              <DataTable
                data={rows}
                columns={columns}
                searchKeys={["fullName"]}
                searchPlaceholder="Search squad…"
              />
            )}
          </>
        )}
      </div>

      {/* ── Mark Attendance Dialog ── */}
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
                    {sessions.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !markDate && "text-muted-foreground")}
                    >
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

            {/* Participant list for marking */}
            <div className="max-h-80 space-y-2 overflow-y-auto rounded-md border p-3">
              {squad.map((p) => {
                const fullName = `${p.firstNameEn} ${p.lastNameEn}`;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-md border bg-card p-2.5"
                  >
                    <span className="text-sm font-medium">{fullName}</span>
                    <div className="flex gap-1">
                      {(["Present", "Late", "Absent"] as AttStatus[]).map((opt) => {
                        const active = marks[p.id] === opt;
                        const tone =
                          opt === "Present"
                            ? active ? "bg-green-500 text-white" : "hover:bg-green-500/10"
                            : opt === "Late"
                              ? active ? "bg-amber-500 text-white" : "hover:bg-amber-500/10"
                              : active ? "bg-destructive text-destructive-foreground" : "hover:bg-destructive/10";
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setMarks((m) => ({ ...m, [p.id]: opt }))}
                            className={cn(
                              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                              tone
                            )}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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