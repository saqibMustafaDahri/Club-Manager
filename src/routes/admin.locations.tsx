import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Power } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { mockLocations, type MockLocation } from "@/data/mockLocations";
import { mockSessions } from "@/data/mockSessions";
import { mockStaff } from "@/data/mockStaff";

export const Route = createFileRoute("/admin/locations")({
  component: LocationsPage,
});

function LocationsPage() {
  const [selected, setSelected] = useState<MockLocation | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const columns: Column<MockLocation>[] = [
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
    { key: "city", header: "City", sortable: true },
    { key: "capacity", header: "Capacity", sortable: true },
    { key: "enrolled", header: "Enrolled", sortable: true },
    {
      key: "utilisation", header: "Utilisation",
      render: (r) => {
        const pct = Math.round((r.enrolled / r.capacity) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{pct}%</span>
          </div>
        );
      },
    },
    { key: "manager", header: "Manager" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSelected(r)} title="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Deactivate">
            <Power className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const sessionsForSelected = selected
    ? mockSessions.filter((s) => s.locationId === selected.id)
    : [];

  return (
    <>
      <PageHeader
        title="Locations"
        description={`${mockLocations.length} locations`}
        actions={<Button onClick={() => setAddOpen(true)}>Add Location</Button>}
      />

      <div className="p-6">
        <DataTable
          data={mockLocations}
          columns={columns}
          searchKeys={["name", "city", "manager"]}
          searchPlaceholder="Search locations…"
        />
      </div>

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>{selected.city} • Manager: {selected.manager}</SheetDescription>
              </SheetHeader>

              <div className="space-y-6 px-4 pb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Stat label="Capacity" value={selected.capacity} />
                  <Stat label="Enrolled" value={selected.enrolled} />
                  <Stat label="Utilisation" value={`${Math.round((selected.enrolled / selected.capacity) * 100)}%`} />
                  <Stat label="Status" value={<StatusBadge status={selected.status} />} />
                  <Stat label="Created" value={selected.createdAt} />
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Sessions at this location</h4>
                  {sessionsForSelected.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No sessions yet.</p>
                  ) : (
                    <ul className="divide-y rounded-md border">
                      {sessionsForSelected.map((s) => (
                        <li key={s.id} className="flex items-center justify-between px-3 py-2 text-sm">
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.startDate} → {s.endDate}</p>
                          </div>
                          <StatusBadge status={s.status === "Open" ? "Active" : s.status === "Closed" ? "Completed" : "Scheduled"} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add drawer */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add Location</SheetTitle>
            <SheetDescription>Create a new academy site.</SheetDescription>
          </SheetHeader>
          <form
            className="space-y-4 px-4 pb-6"
            onSubmit={(e) => { e.preventDefault(); setAddOpen(false); }}
          >
            <Field label="Name"><Input placeholder="e.g. Riyadh Academy" /></Field>
            <Field label="City"><Input placeholder="City" /></Field>
            <Field label="Address"><Input placeholder="Address" /></Field>
            <Field label="Phone no"><Input type="number" placeholder="Phone no" /></Field>
            <Field label="Capacity"><Input type="number" placeholder="200" /></Field>
            {/* <Field label="Assign Manager">
              <Select>
                <SelectTrigger><SelectValue placeholder="Select a manager" /></SelectTrigger>
                <SelectContent>
                  {mockStaff.map((s) => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field> */}
            {/* <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <Label>Status: Active</Label>
              <Switch defaultChecked />
            </div> */}
            <Select defaultValue="Active">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="InActive">InActive</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create Location</Button>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}









// import { createFileRoute } from "@tanstack/react-router";
// import { useState, useEffect } from "react";
// import { Pencil, Power } from "lucide-react";
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
// import { mockSessions } from "@/data/mockSessions";
// import { locationsApi, type Location } from "@/api/locations";

// export const Route = createFileRoute("/admin/locations")({
//   component: LocationsPage,
// });

// function LocationsPage() {
//   const [selected, setSelected] = useState<Location | null>(null);
//   const [addOpen, setAddOpen] = useState(false);

//   // ── Real data state ──────────────────────────────────────────────────────
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [apiError, setApiError] = useState<string | null>(null);

//   // ── Add form state ───────────────────────────────────────────────────────
//   const [form, setForm] = useState({
//     name: "", city: "", address: "", phone: "", capacity: "",
//   });
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   // ── Fetch locations on mount ─────────────────────────────────────────────
//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const data = await locationsApi.getAll();
//         setLocations(data);
//       } catch (err) {
//         setApiError(err instanceof Error ? err.message : "Failed to load locations.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLocations();
//   }, []);

//   // ── Table columns ────────────────────────────────────────────────────────
//   const columns: Column<Location>[] = [
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
//     { key: "city", header: "City", sortable: true },
//     { key: "capacity", header: "Capacity", sortable: true },
//     { key: "enrolled", header: "Enrolled", sortable: true },
//     {
//       key: "utilisation", header: "Utilisation",
//       render: (r) => {
//         const pct = r.enrolled ? Math.round((r.enrolled / r.capacity) * 100) : 0;
//         return (
//           <div className="flex items-center gap-2">
//             <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
//               <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
//             </div>
//             <span className="text-xs text-muted-foreground">{pct}%</span>
//           </div>
//         );
//       },
//     },
//     { key: "manager", header: "Manager" },
//     { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
//     {
//       key: "actions", header: "Actions",
//       render: (r) => (
//         <div className="flex gap-1">
//           <Button variant="ghost" size="icon" onClick={() => setSelected(r)} title="Edit">
//             <Pencil className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" title="Deactivate">
//             <Power className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   const sessionsForSelected = selected
//     ? mockSessions.filter((s) => s.locationId === selected.id)
//     : [];

//   // ── Create location handler ──────────────────────────────────────────────
//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormError(null);
//     setFormLoading(true);
//     try {
//       const created = await locationsApi.create({
//         name: form.name,
//         city: form.city,
//         address: form.address,
//         phone: form.phone,
//         capacity: Number(form.capacity),
//       });
//       setLocations((prev) => [...prev, created]);
//       setForm({ name: "", city: "", address: "", phone: "", capacity: "" });
//       setAddOpen(false);
//     } catch (err) {
//       setFormError(err instanceof Error ? err.message : "Failed to create location.");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   return (
//     <>
//       <PageHeader
//         title="Locations"
//         description={`${locations.length} locations`}
//         actions={<Button onClick={() => setAddOpen(true)}>Add Location</Button>}
//       />

//       <div className="p-6">
//         {loading ? (
//           <p className="text-sm text-muted-foreground">Loading locations…</p>
//         ) : apiError ? (
//           <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//             {apiError}
//           </div>
//         ) : (
//           <DataTable
//             data={locations}
//             columns={columns}
//             searchKeys={["name", "city", "manager"]}
//             searchPlaceholder="Search locations…"
//           />
//         )}
//       </div>

//       {/* ── Detail drawer ── */}
//       <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
//         <SheetContent className="w-full sm:max-w-lg">
//           {selected && (
//             <>
//               <SheetHeader>
//                 <SheetTitle>{selected.name}</SheetTitle>
//                 <SheetDescription>{selected.city} • Manager: {selected.manager}</SheetDescription>
//               </SheetHeader>

//               <div className="space-y-6 px-4 pb-6">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <Stat label="Capacity" value={selected.capacity} />
//                   <Stat label="Enrolled" value={selected.enrolled ?? "—"} />
//                   <Stat
//                     label="Utilisation"
//                     value={selected.enrolled
//                       ? `${Math.round((selected.enrolled / selected.capacity) * 100)}%`
//                       : "—"}
//                   />
//                   <Stat label="Status" value={<StatusBadge status={selected.status} />} />
//                   <Stat label="Created" value={selected.createdAt ?? "—"} />
//                 </div>

//                 <div>
//                   <h4 className="mb-2 text-sm font-semibold">Sessions at this location</h4>
//                   {sessionsForSelected.length === 0 ? (
//                     <p className="text-sm text-muted-foreground">No sessions yet.</p>
//                   ) : (
//                     <ul className="divide-y rounded-md border">
//                       {sessionsForSelected.map((s) => (
//                         <li key={s.id} className="flex items-center justify-between px-3 py-2 text-sm">
//                           <div>
//                             <p className="font-medium">{s.name}</p>
//                             <p className="text-xs text-muted-foreground">{s.startDate} → {s.endDate}</p>
//                           </div>
//                           <StatusBadge status={s.status === "Open" ? "Active" : s.status === "Closed" ? "Completed" : "Scheduled"} />
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </SheetContent>
//       </Sheet>

//       {/* ── Add drawer ── */}
//       <Sheet open={addOpen} onOpenChange={setAddOpen}>
//         <SheetContent className="w-full sm:max-w-lg">
//           <SheetHeader>
//             <SheetTitle>Add Location</SheetTitle>
//             <SheetDescription>Create a new academy site.</SheetDescription>
//           </SheetHeader>
//           <form className="space-y-4 px-4 pb-6" onSubmit={handleCreate}>

//             {formError && (
//               <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//                 {formError}
//               </div>
//             )}

//             <Field label="Name">
//               <Input
//                 placeholder="e.g. Riyadh Academy"
//                 value={form.name}
//                 onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//                 required
//               />
//             </Field>
//             <Field label="City">
//               <Input
//                 placeholder="City"
//                 value={form.city}
//                 onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
//                 required
//               />
//             </Field>
//             <Field label="Address">
//               <Input
//                 placeholder="Address"
//                 value={form.address}
//                 onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
//                 required
//               />
//             </Field>
//             <Field label="Phone">
//               <Input
//                 placeholder="+621..."
//                 value={form.phone}
//                 onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
//                 required
//               />
//             </Field>
//             <Field label="Capacity">
//               <Input
//                 type="number"
//                 placeholder="200"
//                 value={form.capacity}
//                 onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
//                 required
//               />
//             </Field>

//             <Select
//               defaultValue="Active"
//               onValueChange={(val) =>
//                 setForm((f) => ({ ...f, status: val as Location["status"] }))
//               }
//             >
//               <SelectTrigger><SelectValue /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Active">Active</SelectItem>
//                 <SelectItem value="InActive">InActive</SelectItem>
//                 <SelectItem value="Maintenance">Maintenance</SelectItem>
//               </SelectContent>
//             </Select>

//             <SheetFooter>
//               <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={formLoading}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={formLoading}>
//                 {formLoading ? "Creating…" : "Create Location"}
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

// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div className="space-y-1.5">
//       <Label>{label}</Label>
//       {children}
//     </div>
//   );
// }