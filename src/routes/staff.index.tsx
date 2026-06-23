// import { createFileRoute } from "@tanstack/react-router";
// import { Users, Calendar, Percent, MapPin, Clock } from "lucide-react";
// import { PageHeader } from "@/components/PageHeader";
// import { StatCard } from "@/components/StatCard";
// import { AlertItem } from "@/components/AlertItem";
// import { mockParticipants } from "@/data/mockParticipants";
// import { mockSessions } from "@/data/mockSessions";
// import { getCoach, COACH_DISPLAY_NAME } from "@/data/coachContext";

// export const Route = createFileRoute("/staff/")({
//   component: StaffDashboard,
// });

// const today = new Date();
// const todayStr = today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

// function StaffDashboard() {
//   const coach = getCoach();
//   const squad = mockParticipants.filter((p) => coach.squad.includes(p.fullName));

//   const upcomingSessions = mockSessions.filter(
//     (s) => coach.assignedSessions.includes(s.name) && new Date(s.startDate) >= today
//   );

//   // Mock today's sessions
//   const todaySessions = [
//     { id: "t1", name: coach.assignedSessions[0] ?? "Spring 2025", time: "09:00 – 10:30", location: coach.location, count: 12 },
//     { id: "t2", name: coach.assignedSessions[1] ?? coach.assignedSessions[0] ?? "Fall 2025", time: "16:00 – 17:30", location: coach.location, count: 9 },
//   ];

//   // Squad alerts: missing docs or on-hold
//   const alerts = squad
//     .filter((p) => p.status === "On Hold" || p.documents.some((d) => d.status === "Missing"))
//     .map((p) => {
//       const missing = p.documents.filter((d) => d.status === "Missing").map((d) => d.name);
//       const isHold = p.status === "On Hold";
//       return {
//         id: `al-${p.id}`,
//         title: p.fullName,
//         message: isHold ? "Status: On Hold. Please follow up." : `Missing documents: ${missing.join(", ")}`,
//         severity: isHold ? "warning" as const : "danger" as const,
//         time: p.session,
//       };
//     });

//   const firstName = COACH_DISPLAY_NAME.split(" ")[0];

//   return (
//     <>
//       <PageHeader title={`Good morning, ${firstName}`} description={todayStr} />
//       <div className="space-y-6 p-6">
//         <div className="grid gap-4 md:grid-cols-3">
//           <StatCard label="My Squad" value={squad.length} icon={Users} accent="primary" />
//           <StatCard label="Sessions This Week" value={upcomingSessions.length || todaySessions.length} icon={Calendar} accent="brand" />
//           <StatCard label="Attendance Rate" value="87%" icon={Percent} accent="success" />
//         </div>

//         <div className="grid gap-6 lg:grid-cols-2">
//           <div className="rounded-xl border bg-card p-5 shadow-sm">
//             <h3 className="mb-4 text-base font-semibold">Today's Sessions</h3>
//             <ul className="space-y-3">
//               {todaySessions.map((s) => (
//                 <li key={s.id} className="flex items-center justify-between rounded-lg border p-3">
//                   <div>
//                     <p className="text-sm font-semibold">{s.name}</p>
//                     <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
//                       <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.time}</span>
//                       <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.location}</span>
//                     </p>
//                   </div>
//                   <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">{s.count} participants</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="rounded-xl border bg-card p-5 shadow-sm">
//             <h3 className="mb-4 text-base font-semibold">Squad Alerts</h3>
//             {alerts.length === 0 ? (
//               <p className="text-sm text-muted-foreground">No squad alerts.</p>
//             ) : (
//               <div className="space-y-2">
//                 {alerts.map((a) => <AlertItem key={a.id} alert={a} />)}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }















import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Users, Calendar, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { AlertItem } from "@/components/AlertItem";
import { participantsApi, type Participant } from "@/api/participants";
import { sessionsApi, type Session } from "@/api/sessions";
import { enrolmentsApi } from "@/api/enrolments";

export const Route = createFileRoute("/staff/")({
  component: StaffDashboard,
});

const today = new Date();
const todayStr = today.toLocaleDateString("en-GB", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

const formatDate = (raw: string | null | undefined): string => {
  if (!raw) return "—";
  return new Date(raw).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

function StaffDashboard() {
  const [squad, setSquad] = useState<Participant[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [enrolCount, setEnrolCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Get staff user from localStorage
  const stored = localStorage.getItem("user");
  const staffUser = stored ? JSON.parse(stored) : null;

  const staffLocationId: string | null = staffUser?.locationId ?? staffUser?.location?.id ?? null;
  const staffLocationName: string | null = staffUser?.location?.name ?? staffUser?.locationName ?? null;
  const staffName: string = staffUser?.name ?? staffUser?.fullName ?? "Staff";
  const firstName = staffName.split(" ")[0];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [allParticipants, allSessions, allEnrolments] = await Promise.all([
          participantsApi.getAll(),
          sessionsApi.getAll(),
          enrolmentsApi.getAll(),
        ]);

        // ── Filter participants by staff location (same as squad page) ──
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

        // ── Filter sessions by staff location ──
        const filteredSessions = allSessions.filter((s) => {
          if (!s.locations?.length) return false;
          return s.locations.some((sl) => {
            if (staffLocationId && sl.locationId === staffLocationId) return true;
            if (staffLocationName && sl.location?.name?.toLowerCase() === staffLocationName.toLowerCase()) return true;
            return false;
          });
        });

        // ── Count enrolments per session ──
        const countMap: Record<string, number> = {};
        for (const s of filteredSessions) {
          countMap[s.id] = allEnrolments.filter((e) => e.sessionId === s.id).length;
        }

        setSquad(filteredParticipants);
        setSessions(filteredSessions);
        setEnrolCount(countMap);
      } catch (err) {
        console.error("StaffDashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [staffLocationId, staffLocationName]);

  // ── Upcoming sessions (start date >= today) ──
  const upcomingSessions = sessions.filter(
    (s) => new Date(s.startDate) >= today
  );

  // ── Today's sessions (open/active ones at staff location) ──
  const todaySessions = sessions
    .filter((s) => s.status === "OPEN" || s.status === "UPCOMING")
    .slice(0, 3);

  // ── Squad alerts: On Hold participants ──
  const alerts = squad
    .filter((p) =>
      p.status === "ON_HOLD" ||
      p.status === "On Hold" ||
      p.status === "DOCUMENTS_PENDING" ||
      p.status === "FEE_PENDING"
    )
    .slice(0, 5)
    .map((p) => {
      const fullName = `${p.firstNameEn} ${p.lastNameEn}`;
      const isHold = p.status === "ON_HOLD" || p.status === "On Hold";
      const isDoc = p.status === "DOCUMENTS_PENDING";
      const isFee = p.status === "FEE_PENDING";
      return {
        id: `al-${p.id}`,
        title: fullName,
        message:
          isHold ? "Status: On Hold. Please follow up." :
            isDoc ? "Documents pending — please chase guardian." :
              isFee ? "Fee payment pending." : "Needs attention.",
        severity: (isHold ? "warning" : "danger") as "warning" | "danger",
        time: p.joinedDate ? formatDate(p.joinedDate) : "",
      };
    });

  return (
    <>
      <PageHeader
        title={loading ? "Good morning" : `Good morning, ${firstName}`}
        description={todayStr}
      />

      <div className="space-y-6 p-6">
        {/* ── Stat cards ── */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="My Squad"
            value={loading ? "…" : squad.length}
            icon={Users}
            accent="primary"
          />
          <StatCard
            label="My Sessions"
            value={loading ? "…" : sessions.length}
            icon={Calendar}
            accent="brand"
          />
          <StatCard
            label="Upcoming Sessions"
            value={loading ? "…" : upcomingSessions.length}
            icon={Calendar}
            accent="success"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ── Sessions panel ── */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold">My Sessions</h3>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions at your location.</p>
            ) : (
              <ul className="space-y-3">
                {(todaySessions.length > 0 ? todaySessions : sessions.slice(0, 3)).map((s) => {
                  const locName = s.locations?.find(
                    (sl) =>
                      sl.locationId === staffLocationId ||
                      sl.location?.name?.toLowerCase() === staffLocationName?.toLowerCase()
                  )?.location?.name ?? staffLocationName ?? "—";

                  return (
                    <li key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-semibold">{s.name}</p>
                        <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(s.startDate)} → {formatDate(s.endDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{locName}
                          </span>
                        </p>
                      </div>
                      <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                        {enrolCount[s.id] ?? 0} enrolled
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* ── Squad alerts panel ── */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold">Squad Alerts</h3>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No squad alerts. All participants are in good standing.</p>
            ) : (
              <div className="space-y-2">
                {alerts.map((a) => <AlertItem key={a.id} alert={a} />)}
              </div>
            )}
          </div>
        </div>

        {/* ── Squad summary ── */}
        {!loading && squad.length > 0 && (
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold">Squad Overview</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard
                label="Active"
                value={squad.filter((p) => p.status === "ACTIVE" || p.status === "Active").length}
              // color="text-green-600"
              />
              <SummaryCard
                label="On Hold"
                value={squad.filter((p) => p.status === "ON_HOLD" || p.status === "On Hold").length}
              // color="text-amber-500"
              />
              <SummaryCard
                label="Docs Pending"
                value={squad.filter((p) => p.status === "DOCUMENTS_PENDING").length}
              // color="text-blue-500"
              />
              <SummaryCard
                label="Fee Pending"
                value={squad.filter((p) => p.status === "FEE_PENDING").length}
              // color="text-red-500"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{color} {label}</p>
    </div>
  );
}