import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { mockSessions, type MockSession } from "@/data/mockSessions";
import { mockLocations } from "@/data/mockLocations";
import { mockParticipants } from "@/data/mockParticipants";

export const Route = createFileRoute("/admin/sessions")({
  component: SessionsPage,
});

const locName = (id: string) => mockLocations.find((l) => l.id === id)?.name ?? id;
const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function SessionsPage() {
  const [locFilter, setLocFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<MockSession | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return mockSessions.filter((s) => {
      if (locFilter !== "all" && s.locationId !== locFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      return true;
    });
  }, [locFilter, statusFilter]);

  const columns: Column<MockSession>[] = [
    {
      key: "name", header: "Name", sortable: true,
      render: (r) => (
        <button
          type="button"
          onClick={() => setSelected(r)}
          className="font-medium text-foreground hover:text-primary"
        >
          {r.name}
        </button>
      ),
    },
    { key: "locationId", header: "Location", render: (r) => locName(r.locationId) },
    { key: "startDate", header: "Start Date", sortable: true },
    { key: "endDate", header: "End Date", sortable: true },
    { key: "baseFee", header: "Base Fee", render: (r) => SAR(r.baseFee) },
    {
      key: "enrolled", header: "Enrolled / Capacity",
      render: (r) => `${r.enrolledCount} / ${r.capacity}`,
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status === "Open" ? "Active" : r.status === "Closed" ? "Completed" : "Scheduled"} /> },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>View</Button>
      ),
    },
  ];

  const filters = (
    <>
      <Select value={locFilter} onValueChange={setLocFilter}>
        <SelectTrigger className="w-[170px]"><SelectValue placeholder="Location" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {mockLocations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Open">Open</SelectItem>
          <SelectItem value="Closed">Closed</SelectItem>
          <SelectItem value="Upcoming">Upcoming</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  const enrolledForSelected = selected
    ? mockParticipants.filter((p) => p.session === selected.name).length
    : 0;

  return (
    <>
      <PageHeader
        title="Sessions"
        description={`${mockSessions.length} sessions`}
        actions={
          <div className="flex gap-2">

            <Button onClick={() => setAddOpen(true)}>Add Session</Button>
          </div>
        }
      />
      <div className="p-6">
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["name"]}
          searchPlaceholder="Search sessions…"
          filters={filters}
        />
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>{locName(selected.locationId)}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Stat label="Start" value={selected.startDate} />
                  <Stat label="End" value={selected.endDate} />
                  <Stat label="Status" value={<StatusBadge status={selected.status === "Open" ? "Active" : selected.status === "Closed" ? "Completed" : "Scheduled"} />} />
                  <Stat label="Capacity" value={`${selected.enrolledCount} / ${selected.capacity}`} />
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 text-sm font-semibold">Fee breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <Row label="Base fee" value={SAR(selected.baseFee)} />
                    <Row label="Currency" value={selected.currency} />
                    <Row label="Enrolled participants" value={enrolledForSelected} />
                    <Row label="Projected revenue" value={SAR(selected.baseFee * selected.enrolledCount)} bold />
                  </div>
                </div>
              </div>
              <div className="space-y-5 px-4 pb-6"> <Button variant="outline" onClick={() => window.open('/registration-form', '_blank')}>
                Registration Form
              </Button></div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add Session</SheetTitle>
            <SheetDescription>Schedule a new session.</SheetDescription>
          </SheetHeader>
          <form className="space-y-4 pb-6" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); }}>
            <Field label="Name"><Input placeholder="e.g. Spring 2026" /></Field>
            <Field label="Location">
              <Select>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  {mockLocations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Date"><Input type="date" /></Field>
              <Field label="End Date"><Input type="date" /></Field>
            </div>
            <Field label="Base Fee (SAR)"><Input type="number" placeholder="1500" /></Field>
            <Field label="Status">
              <Select defaultValue="Upcoming">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create Session</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
function Row({ label, value, bold }: { label: string; value: React.ReactNode; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
















// import { createFileRoute } from "@tanstack/react-router";
// import { useMemo, useState, useEffect } from "react";
// import { PageHeader } from "@/components/PageHeader";
// import { DataTable, type Column } from "@/components/DataTable";
// import { StatusBadge } from "@/components/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// import {
//   Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
// } from "@/components/ui/sheet";
// import { sessionsApi, type Session, type SessionStatus } from "@/api/sessions";
// import { locationsApi, type Location } from "@/api/locations";

// export const Route = createFileRoute("/admin/sessions")({
//   component: SessionsPage,
// });

// const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

// // Map API status → StatusBadge status
// const toBadgeStatus = (s: SessionStatus) => {
//   if (s === "OPEN") return "Active";
//   if (s === "CLOSED") return "Completed";
//   return "Scheduled"; // UPCOMING
// };

// function SessionsPage() {
//   const [locFilter, setLocFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [selected, setSelected] = useState<Session | null>(null);
//   const [addOpen, setAddOpen] = useState(false);

//   // ── Real data state ──────────────────────────────────────────────────────
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [apiError, setApiError] = useState<string | null>(null);

//   // ── Add form state ───────────────────────────────────────────────────────
//   const [form, setForm] = useState({
//     name: "",
//     startDate: "",
//     endDate: "",
//     baseFee: "",
//     locationId: "",
//     status: "UPCOMING" as SessionStatus,
//   });
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   // ── Status edit state (for detail drawer) ────────────────────────────────
//   const [statusUpdating, setStatusUpdating] = useState(false);
//   const [statusError, setStatusError] = useState<string | null>(null);

//   // ── Fetch sessions + locations on mount ──────────────────────────────────
//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [sessionData, locationData] = await Promise.all([
//           sessionsApi.getAll(),
//           locationsApi.getAll(),
//         ]);
//         setSessions(sessionData);
//         setLocations(locationData);
//       } catch (err) {
//         setApiError(err instanceof Error ? err.message : "Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   // ── Helpers ──────────────────────────────────────────────────────────────
//   const locName = (id: string) =>
//     locations.find((l) => l.id === id)?.name ?? id;

//   // ── Filtered sessions ────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     return sessions.filter((s) => {
//       if (locFilter !== "all") {
//         const hasLoc = s.locations.some((l) => l.locationId === locFilter);
//         if (!hasLoc) return false;
//       }
//       if (statusFilter !== "all" && s.status !== statusFilter) return false;
//       return true;
//     });
//   }, [sessions, locFilter, statusFilter]);

//   // ── Create session handler ───────────────────────────────────────────────
//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.locationId) { setFormError("Please select a location."); return; }
//     setFormError(null);
//     setFormLoading(true);
//     try {
//       const created = await sessionsApi.create({
//         name: form.name,
//         startDate: form.startDate,
//         endDate: form.endDate,
//         baseFee: Number(form.baseFee),
//         locations: [{ locationId: form.locationId }],
//       });
//       setSessions((prev) => [...prev, created]);
//       setForm({ name: "", startDate: "", endDate: "", baseFee: "", locationId: "", status: "UPCOMING" });
//       setAddOpen(false);
//     } catch (err) {
//       setFormError(err instanceof Error ? err.message : "Failed to create session.");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ── Update status handler (from detail drawer) ───────────────────────────
//   const handleStatusUpdate = async (newStatus: SessionStatus) => {
//     if (!selected) return;
//     setStatusError(null);
//     setStatusUpdating(true);
//     try {
//       const updated = await sessionsApi.updateStatus(selected.id, newStatus);
//       setSessions((prev) => prev.map((s) => s.id === updated.id ? updated : s));
//       setSelected(updated);
//     } catch (err) {
//       setStatusError(err instanceof Error ? err.message : "Failed to update status.");
//     } finally {
//       setStatusUpdating(false);
//     }
//   };

//   // ── Table columns ────────────────────────────────────────────────────────
//   const columns: Column<Session>[] = [
//     {
//       key: "name", header: "Name", sortable: true,
//       render: (r) => (
//         <button
//           type="button"
//           onClick={() => setSelected(r)}
//           className="font-medium text-foreground hover:text-primary"
//         >
//           {r.name}
//         </button>
//       ),
//     },
//     {
//       key: "locations", header: "Location",
//       render: (r) => r.locations.map((l) => locName(l.locationId)).join(", "),
//     },
//     { key: "startDate", header: "Start Date", sortable: true },
//     { key: "endDate", header: "End Date", sortable: true },
//     { key: "baseFee", header: "Base Fee", render: (r) => SAR(r.baseFee) },
//     {
//       key: "enrolledCount", header: "Enrolled / Capacity",
//       render: (r) => `${r.enrolledCount ?? 0} / ${r.capacity ?? "—"}`,
//     },
//     {
//       key: "status", header: "Status",
//       render: (r) => <StatusBadge status={toBadgeStatus(r.status)} />,
//     },
//     {
//       key: "actions", header: "Actions",
//       render: (r) => (
//         <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>View</Button>
//       ),
//     },
//   ];

//   const filters = (
//     <>
//       <Select value={locFilter} onValueChange={setLocFilter}>
//         <SelectTrigger className="w-[170px]"><SelectValue placeholder="Location" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Locations</SelectItem>
//           {locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
//         </SelectContent>
//       </Select>
//       <Select value={statusFilter} onValueChange={setStatusFilter}>
//         <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Status</SelectItem>
//           <SelectItem value="OPEN">Open</SelectItem>
//           <SelectItem value="CLOSED">Closed</SelectItem>
//           <SelectItem value="UPCOMING">Upcoming</SelectItem>
//         </SelectContent>
//       </Select>
//     </>
//   );

//   return (
//     <>
//       <PageHeader
//         title="Sessions"
//         description={`${sessions.length} sessions`}
//         actions={<Button onClick={() => setAddOpen(true)}>Add Session</Button>}
//       />

//       <div className="p-6">
//         {loading ? (
//           <p className="text-sm text-muted-foreground">Loading sessions…</p>
//         ) : apiError ? (
//           <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//             {apiError}
//           </div>
//         ) : (
//           <DataTable
//             data={filtered}
//             columns={columns}
//             searchKeys={["name"]}
//             searchPlaceholder="Search sessions…"
//             filters={filters}
//           />
//         )}
//       </div>

//       {/* ── Detail / Status edit drawer ── */}
//       <Sheet open={!!selected} onOpenChange={(o) => { if (!o) { setSelected(null); setStatusError(null); } }}>
//         <SheetContent className="w-full sm:max-w-lg">
//           {selected && (
//             <>
//               <SheetHeader>
//                 <SheetTitle>{selected.name}</SheetTitle>
//                 <SheetDescription>
//                   {selected.locations.map((l) => locName(l.locationId)).join(", ")}
//                 </SheetDescription>
//               </SheetHeader>
//               <div className="space-y-5 px-4 pb-6">
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <Stat label="Start" value={selected.startDate} />
//                   <Stat label="End" value={selected.endDate} />
//                   <Stat label="Status" value={<StatusBadge status={toBadgeStatus(selected.status)} />} />
//                   <Stat label="Capacity" value={`${selected.enrolledCount ?? 0} / ${selected.capacity ?? "—"}`} />
//                 </div>

//                 <div className="rounded-lg border p-4">
//                   <h4 className="mb-3 text-sm font-semibold">Fee breakdown</h4>
//                   <div className="space-y-2 text-sm">
//                     <Row label="Base fee" value={SAR(selected.baseFee)} />
//                     <Row label="Currency" value={selected.currency ?? "SAR"} />
//                     <Row label="Enrolled participants" value={selected.enrolledCount ?? 0} />
//                     <Row
//                       label="Projected revenue"
//                       value={SAR(selected.baseFee * (selected.enrolledCount ?? 0))}
//                       bold
//                     />
//                   </div>
//                 </div>

//                 {/* ── Status update section ── */}
//                 <div className="rounded-lg border p-4 space-y-3">
//                   <h4 className="text-sm font-semibold">Update Status</h4>
//                   {statusError && (
//                     <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//                       {statusError}
//                     </div>
//                   )}
//                   <div className="flex gap-2">
//                     {(["OPEN", "CLOSED", "UPCOMING"] as SessionStatus[]).map((s) => (
//                       <Button
//                         key={s}
//                         size="sm"
//                         variant={selected.status === s ? "default" : "outline"}
//                         disabled={statusUpdating || selected.status === s}
//                         onClick={() => handleStatusUpdate(s)}
//                       >
//                         {statusUpdating && selected.status !== s ? "Updating…" : s.charAt(0) + s.slice(1).toLowerCase()}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </SheetContent>
//       </Sheet>

//       {/* ── Add Session drawer ── */}
//       <Sheet open={addOpen} onOpenChange={setAddOpen}>
//         <SheetContent className="w-full sm:max-w-lg">
//           <SheetHeader>
//             <SheetTitle>Add Session</SheetTitle>
//             <SheetDescription>Schedule a new session.</SheetDescription>
//           </SheetHeader>
//           <form className="space-y-4 pb-6" onSubmit={handleCreate}>

//             {formError && (
//               <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//                 {formError}
//               </div>
//             )}

//             <Field label="Name">
//               <Input
//                 placeholder="e.g. Spring 2026"
//                 value={form.name}
//                 onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//                 required
//               />
//             </Field>

//             <Field label="Location">
//               <Select
//                 value={form.locationId}
//                 onValueChange={(val) => setForm((f) => ({ ...f, locationId: val }))}
//               >
//                 <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
//                 <SelectContent>
//                   {locations.map((l) => (
//                     <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </Field>

//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Start Date">
//                 <Input
//                   type="date"
//                   value={form.startDate}
//                   onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
//                   required
//                 />
//               </Field>
//               <Field label="End Date">
//                 <Input
//                   type="date"
//                   value={form.endDate}
//                   onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
//                   required
//                 />
//               </Field>
//             </div>

//             <Field label="Base Fee (SAR)">
//               <Input
//                 type="number"
//                 placeholder="1800"
//                 value={form.baseFee}
//                 onChange={(e) => setForm((f) => ({ ...f, baseFee: e.target.value }))}
//                 required
//               />
//             </Field>

//             <SheetFooter>
//               <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={formLoading}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={formLoading}>
//                 {formLoading ? "Creating…" : "Create Session"}
//               </Button>
//             </SheetFooter>
//           </form>
//         </SheetContent>
//       </Sheet>
//     </>
//   );
// }

// function Stat({ label, value }: { label: string; value: React.ReactNode }) {
//   return (
//     <div className="rounded-lg border bg-muted/30 p-3">
//       <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
//       <p className="mt-1 font-semibold">{value}</p>
//     </div>
//   );
// }
// function Row({ label, value, bold }: { label: string; value: React.ReactNode; bold?: boolean }) {
//   return (
//     <div className="flex items-center justify-between">
//       <span className="text-muted-foreground">{label}</span>
//       <span className={bold ? "font-semibold" : ""}>{value}</span>
//     </div>
//   );
// }
// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//   return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
// }