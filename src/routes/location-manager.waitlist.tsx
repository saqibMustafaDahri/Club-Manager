// import { createFileRoute } from "@tanstack/react-router";
// import { toast } from "sonner";
// import { ArrowUp, X } from "lucide-react";
// import { PageHeader } from "@/components/PageHeader";
// import { DataTable, type Column } from "@/components/DataTable";
// import { Button } from "@/components/ui/button";
// import { mockParticipants } from "@/data/mockParticipants";

// export const Route = createFileRoute("/location-manager/waitlist")({
//   component: WaitlistPage,
// });

// interface WaitlistEntry {
//   id: string;
//   position: number;
//   fullName: string;
//   guardianPhone: string;
//   session: string;
//   dateAdded: string;
//   hoursLeft: number;
//   minutesLeft: number;
// }

// const RIYADH_NAME = "Riyadh Academy";

// // Build mock waitlist from inquiries at Riyadh
// const inquiries = mockParticipants.filter(
//   (p) => p.location === RIYADH_NAME && (p.status === "Inquiry" || p.status === "Documents Pending"),
// );

// // Pad to ensure we always have several rows
// const seed = [
//   { name: "Reema Al-Nasser", phone: "+966 50 145 9988", session: "Fall 2025", added: "2025-12-01", hLeft: 47, mLeft: 12 },
//   { name: "Bader Al-Salem", phone: "+966 55 220 7766", session: "Annual Enrolment 2026", added: "2025-12-02", hLeft: 34, mLeft: 5 },
//   { name: "Tameem Al-Faris", phone: "+966 56 901 4422", session: "Fall 2025", added: "2025-12-02", hLeft: 21, mLeft: 48 },
// ];

// const generated: WaitlistEntry[] = inquiries.map((p, i) => ({
//   id: `wl-${p.id}`,
//   position: i + 1,
//   fullName: p.fullName,
//   guardianPhone: p.guardianPhone,
//   session: p.session,
//   dateAdded: p.joinedDate,
//   hoursLeft: 47 - i * 6,
//   minutesLeft: 12 + i * 7,
// }));

// const seedEntries: WaitlistEntry[] = seed.map((s, i) => ({
//   id: `wl-seed-${i}`,
//   position: generated.length + i + 1,
//   fullName: s.name,
//   guardianPhone: s.phone,
//   session: s.session,
//   dateAdded: s.added,
//   hoursLeft: s.hLeft,
//   minutesLeft: s.mLeft,
// }));

// const waitlist = [...generated, ...seedEntries];

// function WaitlistPage() {
//   const columns: Column<WaitlistEntry>[] = [
//     { key: "position", header: "#", render: (r) => <span className="font-mono text-sm">#{r.position}</span> },
//     { key: "fullName", header: "Participant", sortable: true },
//     { key: "guardianPhone", header: "Guardian Phone" },
//     { key: "session", header: "Session Applied For" },
//     { key: "dateAdded", header: "Date Added", sortable: true },
//     {
//       key: "window", header: "Acceptance Window",
//       render: (r) => {
//         const ok = r.hoursLeft > 12;
//         return (
//           <span className={ok ? "text-success" : "text-warning"}>
//             {Math.max(r.hoursLeft, 0)}h {Math.max(r.minutesLeft, 0)}m remaining
//           </span>
//         );
//       },
//     },
//     {
//       key: "actions", header: "Actions",
//       render: (r) => (
//         <div className="flex gap-1">
//           <Button
//             variant="ghost" size="sm"
//             onClick={() => toast.success(`${r.fullName} has been promoted from the waitlist and notified.`)}
//           >
//             <ArrowUp className="mr-1 h-4 w-4" /> Promote
//           </Button>
//           <Button variant="ghost" size="sm">
//             <X className="mr-1 h-4 w-4" /> Remove
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <PageHeader title="Waitlist" description="Riyadh Academy" />
//       <div className="p-6">
//         <DataTable
//           data={waitlist}
//           columns={columns}
//           searchKeys={["fullName", "session"]}
//           searchPlaceholder="Search waitlist…"
//         />
//       </div>
//     </>
//   );
// }


// import { createFileRoute } from "@tanstack/react-router";
// import { useState, useEffect } from "react";
// import { ArrowUp, X } from "lucide-react";
// import { PageHeader } from "@/components/PageHeader";
// import { DataTable, type Column } from "@/components/DataTable";
// import { StatusBadge } from "@/components/StatusBadge";
// import { Button } from "@/components/ui/button";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// import { waitlistApi, type WaitlistEntry } from "@/api/waitlist";
// import { sessionsApi, type Session } from "@/api/sessions";
// import { locationsApi, type Location } from "@/api/locations";

// export const Route = createFileRoute("/location-manager/waitlist")({
//   component: WaitlistPage,
// });

// function mapWaitlistStatus(s: string): string {
//   if (s === "WAITING") return "Pending";
//   if (s === "OFFERED") return "Active";
//   if (s === "ACCEPTED") return "Completed";
//   if (s === "EXPIRED") return "Withdrawn";
//   if (s === "REMOVED") return "Withdrawn";
//   return s;
// }

// function formatDate(raw: string | null | undefined): string {
//   if (!raw) return "—";
//   return new Date(raw).toLocaleDateString("en-GB", {
//     day: "2-digit", month: "short", year: "numeric",
//   });
// }

// function formatExpiry(raw: string | null | undefined): React.ReactNode {
//   if (!raw) return "—";
//   const diff = new Date(raw).getTime() - Date.now();
//   if (diff <= 0) return <span className="text-destructive text-xs">Expired</span>;
//   const h = Math.floor(diff / 1000 / 60 / 60);
//   const m = Math.floor((diff / 1000 / 60) % 60);
//   const ok = h > 12;
//   return (
//     <span className={ok ? "text-green-600 text-xs" : "text-amber-500 text-xs"}>
//       {h}h {m}m remaining
//     </span>
//   );
// }

// function WaitlistPage() {
//   const [entries, setEntries] = useState<WaitlistEntry[]>([]);
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [apiError, setApiError] = useState<string | null>(null);

//   // Filter state
//   const [sessionFilter, setSessionFilter] = useState("all");
//   const [locationFilter, setLocationFilter] = useState("all");

//   // Per-row action state
//   const [offeringId, setOfferingId] = useState<string | null>(null);
//   const [removingId, setRemovingId] = useState<string | null>(null);

//   // Load sessions + locations for filters, then load waitlist
//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [sData, lData] = await Promise.all([
//           sessionsApi.getAll(),
//           locationsApi.getAll(),
//         ]);
//         setSessions(sData);
//         setLocations(lData);

//         // Initial load with no filter
//         const wData = await waitlistApi.getAll();
//         setEntries(wData);
//       } catch (err) {
//         setApiError(err instanceof Error ? err.message : "Failed to load waitlist.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   // Re-fetch when filters change
//   useEffect(() => {
//     const refetch = async () => {
//       setLoading(true);
//       try {
//         const wData = await waitlistApi.getAll({
//           sessionId: sessionFilter !== "all" ? sessionFilter : undefined,
//           locationId: locationFilter !== "all" ? locationFilter : undefined,
//         });
//         setEntries(wData);
//       } catch (err) {
//         setApiError(err instanceof Error ? err.message : "Failed to load waitlist.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     refetch();
//   }, [sessionFilter, locationFilter]);

//   const handleOffer = async (entry: WaitlistEntry) => {
//     setOfferingId(entry.id);
//     try {
//       await waitlistApi.offer(entry.id);
//       setEntries((prev) =>
//         prev.map((e) => e.id === entry.id ? { ...e, status: "OFFERED" } : e)
//       );
//     } catch (err) {
//       console.error("Offer failed:", err);
//     } finally {
//       setOfferingId(null);
//     }
//   };

//   const handleRemove = (entry: WaitlistEntry) => {
//     setRemovingId(entry.id);
//     // Optimistic remove from list
//     setEntries((prev) => prev.filter((e) => e.id !== entry.id));
//     setRemovingId(null);
//   };

//   const columns: Column<WaitlistEntry>[] = [
//     {
//       key: "position",
//       header: "#",
//       render: (r) => (
//         <span className="font-mono text-sm">#{r.position ?? "—"}</span>
//       ),
//     },
//     {
//       key: "participantName",
//       header: "Participant",
//       sortable: true,
//       render: (r) => (
//         <span className="font-medium">{r.participantName ?? "—"}</span>
//       ),
//     },
//     {
//       key: "guardianPhone",
//       header: "Guardian Phone",
//       render: (r) => r.guardianPhone ?? "—",
//     },
//     {
//       key: "sessionName",
//       header: "Session",
//       render: (r) => r.sessionName ?? "—",
//     },
//     {
//       key: "dateAdded",
//       header: "Date Added",
//       sortable: true,
//       render: (r) => formatDate(r.dateAdded as string),
//     },
//     {
//       key: "expiresAt",
//       header: "Acceptance Window",
//       render: (r) => formatExpiry(r.expiresAt as string),
//     },
//     {
//       key: "status",
//       header: "Status",
//       render: (r) => <StatusBadge status={mapWaitlistStatus(r.status as string)} />,
//     },
//     {
//       key: "actions",
//       header: "Actions",
//       render: (r) => {
//         const isOffering = offeringId === r.id;
//         const isRemoving = removingId === r.id;
//         const alreadyOffered = (r.status as string) === "OFFERED";
//         return (
//           <div className="flex gap-1">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handleOffer(r)}
//               disabled={isOffering || alreadyOffered}
//             >
//               <ArrowUp className="mr-1 h-4 w-4" />
//               {isOffering ? "Offering…" : alreadyOffered ? "Offered" : "Promote"}
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handleRemove(r)}
//               disabled={isRemoving}
//             >
//               <X className="mr-1 h-4 w-4" />
//               Remove
//             </Button>
//           </div>
//         );
//       },
//     },
//   ];

//   const filters = (
//     <>
//       <Select value={sessionFilter} onValueChange={setSessionFilter}>
//         <SelectTrigger className="w-[180px]">
//           <SelectValue placeholder="All Sessions" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Sessions</SelectItem>
//           {sessions.map((s) => (
//             <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Select value={locationFilter} onValueChange={setLocationFilter}>
//         <SelectTrigger className="w-[180px]">
//           <SelectValue placeholder="All Locations" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Locations</SelectItem>
//           {locations.map((l) => (
//             <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </>
//   );

//   return (
//     <>
//       <PageHeader
//         title="Waitlist"
//         description={loading ? "Loading…" : `${entries.length} entries`}
//       />
//       <div className="p-6">
//         {loading ? (
//           <p className="text-sm text-muted-foreground">Loading waitlist…</p>
//         ) : apiError ? (
//           <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//             {apiError}
//           </div>
//         ) : entries.length === 0 ? (
//           <p className="text-sm text-muted-foreground">No waitlist entries found.</p>
//         ) : (
//           <DataTable
//             data={entries}
//             columns={columns}
//             searchKeys={["participantName", "sessionName"]}
//             searchPlaceholder="Search waitlist…"
//             filters={filters}
//           />
//         )}
//       </div>
//     </>
//   );
// }



import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowUp, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { waitlistApi, type WaitlistEntry } from "@/api/waitlist";
import { sessionsApi, type Session } from "@/api/sessions";
import { locationsApi, type Location } from "@/api/locations";

export const Route = createFileRoute("/location-manager/waitlist")({
  component: WaitlistPage,
});

function mapWaitlistStatus(s: string): string {
  if (s === "WAITING") return "Pending";
  if (s === "OFFERED") return "Active";
  if (s === "ACCEPTED") return "Completed";
  if (s === "EXPIRED") return "Withdrawn";
  if (s === "REMOVED") return "Withdrawn";
  return s;
}

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  return new Date(raw).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatExpiry(raw: string | null | undefined): React.ReactNode {
  if (!raw) return "—";
  const diff = new Date(raw).getTime() - Date.now();
  if (diff <= 0) return <span className="text-destructive text-xs">Expired</span>;
  const h = Math.floor(diff / 1000 / 60 / 60);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const ok = h > 12;
  return (
    <span className={ok ? "text-green-600 text-xs" : "text-amber-500 text-xs"}>
      {h}h {m}m remaining
    </span>
  );
}

function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Both are required by the API
  const [sessionId, setSessionId] = useState("");
  const [locationId, setLocationId] = useState("");

  const [offeringId, setOfferingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Load sessions + locations for the filter dropdowns only
  useEffect(() => {
    Promise.all([sessionsApi.getAll(), locationsApi.getAll()])
      .then(([sData, lData]) => {
        setSessions(sData);
        setLocations(lData);
      })
      .catch((err) => setApiError(err instanceof Error ? err.message : "Failed to load filters."))
      .finally(() => setFiltersLoading(false));
  }, []);

  // Only fetch waitlist when BOTH filters are selected
  useEffect(() => {
    if (!sessionId || !locationId) {
      setEntries([]);
      return;
    }
    setLoading(true);
    setApiError(null);
    waitlistApi.getAll({ sessionId, locationId })
      .then(setEntries)
      .catch((err) => setApiError(err instanceof Error ? err.message : "Failed to load waitlist."))
      .finally(() => setLoading(false));
  }, [sessionId, locationId]);

  const handleOffer = async (entry: WaitlistEntry) => {
    setOfferingId(entry.id);
    try {
      await waitlistApi.offer(entry.id);
      setEntries((prev) =>
        prev.map((e) => e.id === entry.id ? { ...e, status: "OFFERED" } : e)
      );
    } catch (err) {
      console.error("Offer failed:", err);
    } finally {
      setOfferingId(null);
    }
  };

  const handleRemove = (entry: WaitlistEntry) => {
    setRemovingId(entry.id);
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    setRemovingId(null);
  };

  const columns: Column<WaitlistEntry>[] = [
    {
      key: "position", header: "#",
      render: (r) => <span className="font-mono text-sm">#{r.position ?? "—"}</span>,
    },
    {
      key: "participantName", header: "Participant", sortable: true,
      render: (r) => <span className="font-medium">{r.participantName ?? "—"}</span>,
    },
    {
      key: "guardianPhone", header: "Guardian Phone",
      render: (r) => r.guardianPhone ?? "—",
    },
    // {
    //   key: "sessionName", header: "Session",
    //   render: (r) => r.sessionName ?? "—",
    // },
    {
      key: "dateAdded", header: "Date Added", sortable: true,
      render: (r) => formatDate(r.createdAt as string),
    },
    {
      key: "expiresAt", header: "Acceptance Window",
      render: (r) => formatExpiry(r.expiresAt as string),
    },
    {
      key: "status", header: "Status",
      render: (r) => <StatusBadge status={mapWaitlistStatus(r.status as string)} />,
    },
    {
      key: "actions", header: "Actions",
      render: (r) => {
        const isOffering = offeringId === r.id;
        const alreadyOffered = (r.status as string) === "OFFERED";
        return (
          <div className="flex gap-1">
            <Button
              variant="ghost" size="sm"
              onClick={() => handleOffer(r)}
              disabled={isOffering || alreadyOffered}
            >
              <ArrowUp className="mr-1 h-4 w-4" />
              {isOffering ? "Offering…" : alreadyOffered ? "Offered" : "Promote"}
            </Button>
            <Button
              variant="ghost" size="sm"
              onClick={() => handleRemove(r)}
              disabled={removingId === r.id}
            >
              <X className="mr-1 h-4 w-4" /> Remove
            </Button>
          </div>
        );
      },
    },
  ];

  const bothSelected = !!sessionId && !!locationId;

  return (
    <>
      <PageHeader
        title="Waitlist"
        description={bothSelected && !loading ? `${entries.length} entries` : undefined}
      />
      <div className="p-6 space-y-4">

        {/* ── Required filters ── */}
        <div className="flex flex-wrap gap-3 rounded-lg border bg-muted/30 p-4">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Location <span className="text-destructive">*</span>
            </p>
            <Select value={locationId} onValueChange={(val) => { setLocationId(val); setSessionId(""); }} disabled={filtersLoading}>
              <SelectTrigger>
                <SelectValue placeholder={filtersLoading ? "Loading…" : "Select location"} />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px] space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Session <span className="text-destructive">*</span>
            </p>
            <Select value={sessionId} onValueChange={setSessionId} disabled={filtersLoading || !locationId}>
              <SelectTrigger>
                <SelectValue placeholder={filtersLoading ? "Loading…" : "Select session"} />
              </SelectTrigger>
              <SelectContent>
                {sessions
                  .filter((s) => s.locations.some((sl) => sl.locationId === locationId))
                  .map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── States ── */}
        {!bothSelected ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Please select both a <strong>session</strong> and a <strong>location</strong> to view the waitlist.
          </div>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</div>
        ) : loading ? (
          <p className="text-sm text-muted-foreground">Loading waitlist…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No waitlist entries for this session and location.</p>
        ) : (
          <DataTable
            data={entries}
            columns={columns}
            searchKeys={["participantName", "sessionName"]}
            searchPlaceholder="Search waitlist…"
          />
        )}
      </div>
    </>
  );
}