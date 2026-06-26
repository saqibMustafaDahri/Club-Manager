import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Pencil, Power } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { usersApi, type User, type UserRole, ROLE_OPTIONS } from "@/api/users";
import { locationsApi, type Location } from "@/api/locations";

export const Route = createFileRoute("/admin/access")({
  component: AccessPage,
});

const roleLabel: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  LOCATION_MANAGER: "Location Manager",
  FINANCE_OFFICER: "Finance Officer",
  STAFF: "Staff/Coach",
};

const needsLocation = (role: UserRole | "") =>
  role === "LOCATION_MANAGER" || role === "STAFF";

function AccessPage() {
  const [addOpen, setAddOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", email: "", password: "",
    role: "" as UserRole | "",
    locationId: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersData, locationsData] = await Promise.all([
          usersApi.getAll(),
          locationsApi.getAll(),
        ]);
        setUsers(usersData);
        setLocations(locationsData);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role) {
      setFormError("Please select a role.");
      return;
    }
    if (needsLocation(form.role) && !form.locationId) {
      setFormError("Please select a location.");
      return;
    }
    setFormError(null);
    setFormLoading(true);
    try {
      const payload: import("@/api/users").CreateUserPayload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role as UserRole,
      };

      if (needsLocation(form.role) && form.locationId) {
        payload.locationId = form.locationId;
      }

      // Debug: confirm locationId is present for staff/manager roles
      console.log("[AccessPage] Creating user with payload:", payload);

      const created = await usersApi.create(payload);

      // Normalize the created user the same way getAll does,
      // so locationAccess displays correctly in the table immediately.
      const selectedLocation = locations.find((l) => l.id === form.locationId);
      const normalizedUser: User = {
        ...created,
        locationId: created.locationId ?? (created as any).location?.id ?? form.locationId ?? null,
        locationAccess:
          (created as any).location?.name ??
          created.locationAccess ??
          selectedLocation?.name ??
          null,
      };

      setUsers((prev) => [...prev, normalizedUser]);
      setForm({ name: "", email: "", password: "", role: "", locationId: "" });
      setAddOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create user.");
    } finally {
      setFormLoading(false);
    }
  };

  const columns: Column<User>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email" },
    {
      key: "role", header: "Role",
      render: (r) => (
        <span className="text-sm font-medium">{roleLabel[r.role] ?? r.role}</span>
      ),
    },
    {
      key: "locationAccess", header: "Location Access",
      render: (r) => {
        if (!needsLocation(r.role)) return <span className="text-muted-foreground">—</span>;
        const loc = (r as any).location;
        const name = loc?.name ?? loc?.slug ?? r.locationAccess ?? "—";
        return <span className="text-md font-medium">{name}</span>;
      },
    },
    { key: "lastLogin", header: "Last Login" },
    {
      key: "actions", header: "Actions",
      render: () => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Power className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Access Control"
        description={`${users.length} users`}
        actions={<Button onClick={() => setAddOpen(true)}>Add User</Button>}
      />

      <div className="p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading users…</p>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</div>
        ) : (
          <DataTable
            data={users}
            columns={columns}
            searchKeys={["name", "email", "role"]}
            searchPlaceholder="Search users…"
          />
        )}
      </div>

      {/* ── Add User drawer ── */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add User</SheetTitle>
          </SheetHeader>

          <form className="space-y-3 pb-6" onSubmit={handleCreate}>
            {formError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</div>
            )}

            <Field label="Name">
              <Input placeholder="Muhammad Ali" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </Field>

            <Field label="Email">
              <Input type="email" placeholder="user@academy.com" value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
            </Field>

            <Field label="Password">
              <Input type="password" placeholder="Pass@12345" value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
            </Field>

            <Field label="Role">
              <Select
                value={form.role}
                onValueChange={(val) => setForm((f) => ({
                  ...f,
                  role: val as UserRole,
                  // Clear locationId only when switching to a role that doesn't need it
                  locationId: needsLocation(val as UserRole) ? f.locationId : "",
                }))}
              >
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {needsLocation(form.role) && (
              <Field label="Assign Location">
                <Select
                  value={form.locationId}
                  onValueChange={(val) => setForm((f) => ({ ...f, locationId: val }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>
                    {locations.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}

            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Creating…" : "Create User"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
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