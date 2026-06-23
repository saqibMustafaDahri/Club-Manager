// import { createFileRoute } from "@tanstack/react-router";
// import { useState } from "react";
// import { Calendar, MapPin, Users } from "lucide-react";
// import { PageHeader } from "@/components/PageHeader";
// import { StatusBadge } from "@/components/StatusBadge";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
// } from "@/components/ui/dialog";
// import { mockSessions, type MockSession } from "@/data/mockSessions";
// import { mockParticipants } from "@/data/mockParticipants";
// import { getCoach } from "@/data/coachContext";

// export const Route = createFileRoute("/staff/sessions")({
//   component: StaffSessions,
// });

// const sessionBadge = (s: string) =>
//   s === "Open" ? "Active" : s === "Closed" ? "Completed" : "Scheduled";

// function StaffSessions() {
//   const coach = getCoach();
//   const sessions = mockSessions.filter((s) => coach.assignedSessions.includes(s.name));
//   const [selected, setSelected] = useState<MockSession | null>(null);

//   const participantsIn = (name: string) =>
//     mockParticipants.filter((p) => p.session === name && coach.squad.includes(p.fullName));

//   return (
//     <>
//       <PageHeader title="My Sessions" description={`${sessions.length} sessions assigned`} />
//       <div className="space-y-6 p-6">
//         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//           {sessions.map((s) => {
//             const pct = Math.round((s.enrolledCount / s.capacity) * 100);
//             return (
//               <button
//                 key={s.id}
//                 onClick={() => setSelected(s)}
//                 className="group rounded-xl border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md"
//               >
//                 <div className="flex items-start justify-between">
//                   <h3 className="text-base font-semibold">{s.name}</h3>
//                   <StatusBadge status={sessionBadge(s.status)} />
//                 </div>
//                 <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
//                   <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{coach.location}</p>
//                   <p className="flex items-center gap-2"><Calendar className="h-4 w-4" />{s.startDate} → {s.endDate}</p>
//                   <p className="flex items-center gap-2"><Users className="h-4 w-4" />{s.enrolledCount} / {s.capacity} enrolled</p>
//                 </div>
//                 <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
//                   <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
//                 </div>
//               </button>
//             );
//           })}
//           {sessions.length === 0 && (
//             <p className="text-sm text-muted-foreground">No sessions assigned.</p>
//           )}
//         </div>
//       </div>

//       <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
//         <DialogContent className="max-w-lg">
//           {selected && (
//             <>
//               <DialogHeader>
//                 <DialogTitle>{selected.name}</DialogTitle>
//                 <DialogDescription>
//                   {coach.location} • {selected.startDate} → {selected.endDate}
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-3 gap-2 text-sm">
//                   <Stat label="Status" value={<StatusBadge status={sessionBadge(selected.status)} />} />
//                   <Stat label="Enrolled" value={`${selected.enrolledCount}`} />
//                   <Stat label="Capacity" value={`${selected.capacity}`} />
//                 </div>
//                 <div>
//                   <h4 className="mb-2 text-sm font-semibold">Participants in this session</h4>
//                   {participantsIn(selected.name).length === 0 ? (
//                     <p className="text-sm text-muted-foreground">No squad members in this session.</p>
//                   ) : (
//                     <ul className="max-h-72 divide-y overflow-y-auto rounded-md border">
//                       {participantsIn(selected.name).map((p) => (
//                         <li key={p.id} className="flex items-center justify-between px-3 py-2 text-sm">
//                           <span className="font-medium">{p.fullName}</span>
//                           <StatusBadge status={p.status === "On Hold" ? "On Hold" : "Active"} />
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// function Stat({ label, value }: { label: string; value: React.ReactNode }) {
//   return (
//     <div className="rounded-md bg-muted/30 p-2.5">
//       <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
//       <p className="mt-0.5 text-sm font-medium">{value}</p>
//     </div>
//   );
// }




import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { sessionsApi, type Session } from "@/api/sessions";
import { participantsApi, type Participant } from "@/api/participants";
import { enrolmentsApi, type Enrolment } from "@/api/enrolments";
import { locationsApi } from "@/api/locations";

export const Route = createFileRoute("/staff/sessions")({
  component: StaffSessions,
});

const sessionBadge = (s: string) =>
  s === "OPEN" ? "Active" :
    s === "CLOSED" ? "Completed" :
      s === "Open" ? "Active" :
        s === "Closed" ? "Completed" : "Scheduled";

function StaffSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Session | null>(null);

  // Get staff user from localStorage
  const stored = localStorage.getItem("user");
  const staffUser = stored ? JSON.parse(stored) : null;

  const staffLocationId: string | null =
    staffUser?.locationId ?? staffUser?.location?.id ?? null;
  const staffLocationName: string | null =
    staffUser?.location?.name ?? staffUser?.locationName ?? null;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [allSessions, allParticipants, allEnrolments, allLocations] = await Promise.all([
          sessionsApi.getAll(),
          participantsApi.getAll(),
          enrolmentsApi.getAll(),
          locationsApi.getAll(),
        ]);

        // Filter sessions that have the staff's location
        const filtered = allSessions.filter((s) => {
          if (!s.locations?.length) return false;
          return s.locations.some((sl) => {
            if (staffLocationId && sl.locationId === staffLocationId) return true;
            if (staffLocationName && sl.location?.name?.toLowerCase() === staffLocationName.toLowerCase()) return true;
            return false;
          });
        });

        // Inject enrolledCount per session from enrolments
        // Same logic as admin sessions page: count enrolments where sessionId matches
        const sessionsWithEnrolled = filtered.map((s) => {
          const sessionEnrolments = allEnrolments.filter((e) => e.sessionId === s.id);

          // Also get capacity from the matching location
          const matchingSessionLoc = s.locations?.find((sl) =>
            sl.locationId === staffLocationId ||
            sl.location?.name?.toLowerCase() === staffLocationName?.toLowerCase()
          );
          const matchingLocation = allLocations.find(
            (l) => l.id === (matchingSessionLoc?.locationId ?? staffLocationId)
          );

          return {
            ...s,
            enrolledCount: sessionEnrolments.length,
            _capacity: matchingLocation?.capacity ?? (s as any).capacity ?? 0,
          };
        });

        setSessions(sessionsWithEnrolled as Session[]);
        setParticipants(allParticipants);
        setEnrolments(allEnrolments);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [staffLocationId, staffLocationName]);

  // Get participants in a specific session by matching enrolments
  const participantsInSession = (sessionId: string): Participant[] => {
    // Get all enrolments for this session
    const sessionEnrolmentIds = enrolments
      .filter((e) => e.sessionId === sessionId)
      .map((e) => e.participantId);

    // Return participants whose id is in those enrolments
    // AND who are at the staff's location
    return participants.filter((p) => {
      const inSession = sessionEnrolmentIds.includes(p.id);
      if (!inSession) return false;

      const raw = p as any;
      const matchesLocation =
        (staffLocationId && (raw.locationId === staffLocationId || raw.location?.id === staffLocationId)) ||
        (staffLocationName && (
          raw.location?.name?.toLowerCase() === staffLocationName.toLowerCase() ||
          raw.locationSlug?.toLowerCase() === staffLocationName.toLowerCase()
        ));

      return matchesLocation;
    });
  };



  const formatDate = (raw: string | null | undefined): string => {
    if (!raw) return "—";
    return new Date(raw).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };



  const getCapacity = (s: Session): number =>
    (s as any)._capacity ?? (s as any).capacity ?? 0;

  const getLocationName = (s: Session): string =>
    s.locations?.find(
      (sl) =>
        sl.locationId === staffLocationId ||
        sl.location?.name?.toLowerCase() === staffLocationName?.toLowerCase()
    )?.location?.name ?? staffLocationName ?? "—";

  return (
    <>
      <PageHeader
        title="My Sessions"
        description={
          loading ? "Loading…" :
            staffLocationName ? `${sessions.length} sessions at ${staffLocationName}` :
              `${sessions.length} sessions assigned`
        }
      />

      <div className="space-y-6 p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading sessions…</p>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</div>
        ) : !staffLocationId && !staffLocationName ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No location assigned to your account. Please contact an administrator.
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sessions found at your assigned location.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((s) => {
              const capacity = getCapacity(s);
              const enrolled = s.enrolledCount ?? 0;
              const pct = capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0;
              const locName = getLocationName(s);

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
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />{locName}
                    </p>
                    {/* <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />{s.startDate} → {s.endDate}
                    </p> */}

                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />{formatDate(s.startDate)} → {formatDate(s.endDate)}
                    </p>


                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {enrolled} / {capacity > 0 ? capacity : "—"} enrolled
                    </p>
                  </div>
                  {capacity > 0 && (
                    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-brand" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Session detail dialog ── */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (() => {
            const capacity = getCapacity(selected);
            const enrolled = selected.enrolledCount ?? 0;
            const locName = getLocationName(selected);
            const sessionParticipants = participantsInSession(selected.id);

            return (
              <>
                <DialogHeader>
                  <DialogTitle>{selected.name}</DialogTitle>
                  <DialogDescription>
                    {locName} • {selected.startDate} → {selected.endDate}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <Stat label="Status" value={<StatusBadge status={sessionBadge(selected.status)} />} />
                    <Stat label="Enrolled" value={String(enrolled)} />
                    <Stat label="Capacity" value={capacity > 0 ? String(capacity) : "—"} />
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">
                      Participants in this session ({sessionParticipants.length})
                    </h4>
                    {sessionParticipants.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No participants found in this session at your location.
                      </p>
                    ) : (
                      <ul className="max-h-72 divide-y overflow-y-auto rounded-md border">
                        {sessionParticipants.map((p) => (
                          <li key={p.id} className="flex items-center justify-between px-3 py-2 text-sm">
                            <span className="font-medium">
                              {p.firstNameEn} {p.lastNameEn}
                            </span>
                            <StatusBadge status={
                              p.status === "ACTIVE" || p.status === "Active" ? "Active" :
                                p.status === "ON_HOLD" || p.status === "On Hold" ? "On Hold" :
                                  "Active"
                            } />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
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