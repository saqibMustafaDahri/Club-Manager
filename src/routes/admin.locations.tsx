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
            <Field label="Capacity"><Input type="number" placeholder="200" /></Field>
            <Field label="Assign Manager">
              <Select>
                <SelectTrigger><SelectValue placeholder="Select a manager" /></SelectTrigger>
                <SelectContent>
                  {mockStaff.map((s) => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <Label>Status: Active</Label>
              <Switch defaultChecked />
            </div>
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
