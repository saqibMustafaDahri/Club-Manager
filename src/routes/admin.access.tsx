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
import { mockUsers, type MockUser } from "@/data/mockUsers";
import { mockLocations } from "@/data/mockLocations";

export const Route = createFileRoute("/admin/access")({
  component: AccessPage,
});

const roleStyles: Record<string, string> = {
  "Super Admin": "Active",
  "Location Manager": "Pending",
  "Finance Officer": "Completed",
  "Staff/Coach": "Scheduled",
};

function AccessPage() {
  const [addOpen, setAddOpen] = useState(false);

  const columns: Column<MockUser>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (r) => <StatusBadge status={roleStyles[r.role] ?? "Active"} /> },
    { key: "locationAccess", header: "Location Access" },
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

  const columnsWithRoleText: Column<MockUser>[] = columns.map((c) =>
    c.key === "role"
      ? {
          key: "role", header: "Role",
          render: (r) => <span className="text-sm font-medium">{r.role}</span>,
        }
      : c,
  );

  return (
    <>
      <PageHeader
        title="Access Control"
        description={`${mockUsers.length} users`}
        actions={<Button onClick={() => setAddOpen(true)}>Add User</Button>}
      />
      <div className="p-6">
        <DataTable
          data={mockUsers}
          columns={columnsWithRoleText}
          searchKeys={["name", "email", "role"]}
          searchPlaceholder="Search users…"
        />
      </div>

      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add User</SheetTitle>
            <SheetDescription>Invite a teammate.</SheetDescription>
          </SheetHeader>
          <form className="space-y-3 px-4 pb-6" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); }}>
            <Field label="Name"><Input /></Field>
            <Field label="Email"><Input type="email" /></Field>
            <Field label="Role">
              <Select>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Location Manager">Location Manager</SelectItem>
                  <SelectItem value="Finance Officer">Finance Officer</SelectItem>
                  <SelectItem value="Staff/Coach">Staff/Coach</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Assign Location">
              <Select>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {mockLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <Label>Active</Label>
              <Switch defaultChecked />
            </div>
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Send Invite</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
