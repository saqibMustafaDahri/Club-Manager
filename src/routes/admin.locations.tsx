import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Pencil, Power } from "lucide-react";
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
import { sessionsApi } from "@/api/sessions";
import { locationsApi, type Location } from "@/api/locations";
import { usersApi } from "@/api/users";
import { enrolmentsApi } from "@/api/enrolments";

export const Route = createFileRoute("/admin/locations")({
  component: LocationsPage,
});

function LocationsPage() {
  const [selected, setSelected] = useState<Location | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", city: "", address: "", phone: "", capacity: "", status: "active" as Location["status"],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Edit form state ──────────────────────────────────────────────────────
  const [editForm, setEditForm] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    capacity: "",
    status: "active" as Location["status"],
    amenities: "",   // comma-separated string in the UI
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Sessions for selected location detail
  const [locationSessions, setLocationSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersData, locData, enrolmentsData, sessionsData] = await Promise.all([
          usersApi.getAll(),
          locationsApi.getAll(),
          enrolmentsApi.getAll(),
          sessionsApi.getAll(),
        ]);

        // Build map: locationId → manager name
        const managerByLocationId = new Map<string, string>();
        for (const u of usersData) {
          if (u.role === "LOCATION_MANAGER" && u.locationId) {
            managerByLocationId.set(u.locationId, u.name);
          }
        }

        // Build map: locationId → enrolled count
        // Enrolments have a locationId field directly
        const enrolledByLocationId = new Map<string, number>();
        for (const e of enrolmentsData) {
          const locId = e.locationId as string | undefined;
          if (locId) {
            enrolledByLocationId.set(locId, (enrolledByLocationId.get(locId) ?? 0) + 1);
          }
        }

        // Enrich locations
        const enriched = locData.map((loc) => ({
          ...loc,
          manager: managerByLocationId.get(loc.id) ?? "—",
          enrolled: enrolledByLocationId.get(loc.id) ?? 0,
        }));

        setLocations(enriched);

        // Store sessions for detail drawer use
        setLocationSessions(sessionsData);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Failed to load locations.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Pre-fill edit form whenever selected location changes
  useEffect(() => {
    if (selected) {
      setEditForm({
        name: selected.name ?? "",
        city: selected.city ?? "",
        address: selected.address ?? "",
        phone: selected.phone ?? "",
        email: (selected as any).email ?? "",
        capacity: String(selected.capacity ?? ""),
        status: selected.status ?? "active",
        amenities: Array.isArray((selected as any).amenities)
          ? (selected as any).amenities.join(", ")
          : "",
      });
      setEditError(null);
      setEditSuccess(false);
    }
  }, [selected]);

  const columns: Column<Location>[] = [
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
    {
      key: "enrolled", header: "Enrolled", sortable: true,
      render: (r) => r.enrolled ?? 0,
    },
    {
      key: "utilisation", header: "Utilisation",
      render: (r) => {
        const enrolled = r.enrolled ?? 0;
        const pct = r.capacity ? Math.round((enrolled / r.capacity) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-brand" style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{pct}%</span>
          </div>
        );
      },
    },
    {
      key: "manager", header: "Manager",
      render: (r) => {
        const name = r.manager && r.manager !== "—" ? r.manager : null;
        if (!name) return <span className="text-muted-foreground text-xs">Unassigned</span>;
        return (
          <span className="inline-flex items-center gap-1.5 text-sm">{name}</span>
        );
      },
    },
    {
      key: "status", header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSelected(r)} title="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          {/* <Button variant="ghost" size="icon" title="Deactivate">
            <Power className="h-4 w-4" />
          </Button> */}
        </div>
      ),
    },
  ];

  // Sessions that belong to the selected location
  const sessionsForSelected = selected
    ? locationSessions.filter((s) =>
      (s.locations ?? []).some((l: any) => l.locationId === selected.id)
    )
    : [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);
    try {
      const created = await locationsApi.create({
        name: form.name,
        city: form.city,
        address: form.address,
        phone: form.phone,
        capacity: Number(form.capacity),
        // status: form.status,
      });
      setLocations((prev) => [...prev, { ...created, enrolled: 0 }]);
      setForm({ name: "", city: "", address: "", phone: "", capacity: "", status: "active" });
      setAddOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create location.");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Update location handler ──────────────────────────────────────────────
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setEditError(null);
    setEditSuccess(false);
    setEditLoading(true);
    try {
      const payload: import("@/api/locations").UpdateLocationPayload = {
        name: editForm.name || undefined,
        city: editForm.city || undefined,
        address: editForm.address || undefined,
        phone: editForm.phone || undefined,
        email: editForm.email || undefined,
        capacity: editForm.capacity ? Number(editForm.capacity) : undefined,
        status: editForm.status,
        amenities: editForm.amenities
          ? editForm.amenities.split(",").map((a) => a.trim()).filter(Boolean)
          : undefined,
      };
      const updated = await locationsApi.update(selected.id, payload);
      // Merge updated fields back into the list
      setLocations((prev) =>
        prev.map((l) =>
          l.id === selected.id
            ? { ...l, ...updated, enrolled: l.enrolled, manager: l.manager }
            : l
        )
      );
      setSelected((prev) => prev ? { ...prev, ...updated } : prev);
      setEditSuccess(true);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update location.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Locations"
        description={`${locations.length} locations`}
        actions={<Button onClick={() => setAddOpen(true)}>Add Location</Button>}
      />

      <div className="p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading locations…</p>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {apiError}
          </div>
        ) : (
          <DataTable
            data={locations}
            columns={columns}
            searchKeys={["name", "city", "manager"]}
            searchPlaceholder="Search locations…"
          />
        )}
      </div>

      {/* ── Detail / Edit drawer ── */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Edit Location</SheetTitle>
                <SheetDescription>
                  {selected.city} · {selected.manager && selected.manager !== "—" ? selected.manager : "Unassigned"}
                </SheetDescription>
              </SheetHeader>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 px-4 py-4 text-sm">
                <Stat label="Enrolled" value={selected.enrolled ?? 0} />
                <Stat
                  label="Utilisation"
                  value={selected.capacity
                    ? `${Math.round(((selected.enrolled ?? 0) / selected.capacity) * 100)}%`
                    : "—"}
                />
              </div>

              {/* Edit form */}
              <form className="space-y-4 px-4 pb-6" onSubmit={handleUpdate}>
                {editError && (
                  <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {editError}
                  </div>
                )}
                {editSuccess && (
                  <div className="rounded-md bg-success/10 px-3 py-2 text-sm text-success">
                    Location updated successfully.
                  </div>
                )}

                <Field label="Name">
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City">
                    <Input
                      value={editForm.city}
                      onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))}
                    />
                  </Field>
                  <Field label="Capacity">
                    <Input
                      type="number"
                      value={editForm.capacity}
                      onChange={(e) => setEditForm((f) => ({ ...f, capacity: e.target.value }))}
                    />
                  </Field>
                </div>
                <Field label="Address">
                  <Input
                    value={editForm.address}
                    onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone">
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      type="email"
                      placeholder="location@example.com"
                      value={editForm.email}
                      onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </Field>
                </div>
                <Field label="Status">
                  <Select
                    value={editForm.status}
                    onValueChange={(val) =>
                      setEditForm((f) => ({ ...f, status: val as Location["status"] }))
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Amenities (comma-separated)">
                  <Input
                    placeholder="pool, gym, parking"
                    value={editForm.amenities}
                    onChange={(e) => setEditForm((f) => ({ ...f, amenities: e.target.value }))}
                  />
                </Field>

                {/* Sessions at this location */}
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
                          <StatusBadge status={
                            s.status === "OPEN" ? "Active" :
                              s.status === "CLOSED" ? "Completed" : "Scheduled"
                          } />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <SheetFooter>
                  <Button type="button" variant="outline" onClick={() => setSelected(null)} disabled={editLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={editLoading}>
                    {editLoading ? "Saving…" : "Save Changes"}
                  </Button>
                </SheetFooter>
              </form>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Add drawer ── */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add Location</SheetTitle>
            <SheetDescription>Create a new academy site.</SheetDescription>
          </SheetHeader>
          <form className="space-y-4 px-4 pb-6" onSubmit={handleCreate}>
            {formError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}
            <Field label="Name">
              <Input placeholder="e.g. Riyadh Academy" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </Field>
            <Field label="City">
              <Input placeholder="City" value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required />
            </Field>
            <Field label="Address">
              <Input placeholder="Address" value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} required />
            </Field>
            <Field label="Phone">
              <Input placeholder="+621..." value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
            </Field>
            <Field label="Capacity">
              <Input type="number" placeholder="200" value={form.capacity}
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} required />
            </Field>
           {/* <Field label="Status">
              <Select value={form.status}
                onValueChange={(val) => setForm((f) => ({ ...f, status: val as Location["status"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </Field>*/}
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={formLoading}>Cancel</Button>
              <Button type="submit" disabled={formLoading}>{formLoading ? "Creating…" : "Create Location"}</Button>
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