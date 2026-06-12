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
            {/* <SheetDescription>Invite a teammate.</SheetDescription> */}
          </SheetHeader>
          <form className="space-y-3  pb-6" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); }}>
            <Field label="Name"><Input /></Field>
            <Field label="Email"><Input type="email" /></Field>
            <Field label="Password"><Input type="password" /></Field>

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
            {/* <Field label="Assign Location">
              <Select>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {mockLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field> */}
            {/* <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <Label>Active</Label>
              <Switch defaultChecked />
            </div> */}
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create User</Button>
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
//   Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle,
// } from "@/components/ui/sheet";
// import { usersApi, type User, type UserRole, ROLE_OPTIONS } from "@/api/users";

// export const Route = createFileRoute("/admin/access")({
//   component: AccessPage,
// });

// // Maps API role value → StatusBadge status for colour coding
// const roleStatusMap: Record<UserRole, string> = {
//   SUPER_ADMIN:      "Active",
//   LOCATION_MANAGER: "Pending",
//   FINANCE_OFFICER:  "Completed",
//   STAFF_COACH:      "Scheduled",
// };

// // Human-readable label for each role value
// const roleLabel: Record<UserRole, string> = {
//   SUPER_ADMIN:      "Super Admin",
//   LOCATION_MANAGER: "Location Manager",
//   FINANCE_OFFICER:  "Finance Officer",
//   STAFF_COACH:      "Staff/Coach",
// };

// function AccessPage() {
//   const [addOpen, setAddOpen] = useState(false);

//   // ── Real data state ──────────────────────────────────────────────────────
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [apiError, setApiError] = useState<string | null>(null);

//   // ── Add form state ───────────────────────────────────────────────────────
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "" as UserRole | "",
//   });
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   // ── Fetch users on mount ─────────────────────────────────────────────────
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const data = await usersApi.getAll();
//         setUsers(data);
//       } catch (err) {
//         setApiError(err instanceof Error ? err.message : "Failed to load users.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // ── Create user handler ──────────────────────────────────────────────────
//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.role) {
//       setFormError("Please select a role.");
//       return;
//     }
//     setFormError(null);
//     setFormLoading(true);
//     try {
//       const created = await usersApi.create({
//         name:     form.name,
//         email:    form.email,
//         password: form.password,
//         role:     form.role as UserRole,
//       });
//       setUsers((prev) => [...prev, created]);
//       setForm({ name: "", email: "", password: "", role: "" });
//       setAddOpen(false);
//     } catch (err) {
//       setFormError(err instanceof Error ? err.message : "Failed to create user.");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ── Table columns ────────────────────────────────────────────────────────
//   const columns: Column<User>[] = [
//     { key: "name",  header: "Name",  sortable: true },
//     { key: "email", header: "Email" },
//     {
//       key: "role", header: "Role",
//       render: (r) => (
//         <span className="text-sm font-medium">
//           {roleLabel[r.role] ?? r.role}
//         </span>
//       ),
//     },
//     { key: "locationAccess", header: "Location Access" },
//     { key: "lastLogin",      header: "Last Login" },
//     {
//       key: "actions", header: "Actions",
//       render: () => (
//         <div className="flex gap-1">
//           <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
//           <Button variant="ghost" size="icon"><Power   className="h-4 w-4" /></Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <PageHeader
//         title="Access Control"
//         description={`${users.length} users`}
//         actions={<Button onClick={() => setAddOpen(true)}>Add User</Button>}
//       />

//       <div className="p-6">
//         {loading ? (
//           <p className="text-sm text-muted-foreground">Loading users…</p>
//         ) : apiError ? (
//           <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//             {apiError}
//           </div>
//         ) : (
//           <DataTable
//             data={users}
//             columns={columns}
//             searchKeys={["name", "email", "role"]}
//             searchPlaceholder="Search users…"
//           />
//         )}
//       </div>

//       {/* ── Add User drawer ── */}
//       <Sheet open={addOpen} onOpenChange={setAddOpen}>
//         <SheetContent className="w-full sm:max-w-lg">
//           <SheetHeader>
//             <SheetTitle>Add User</SheetTitle>
//           </SheetHeader>

//           <form className="space-y-3 pb-6" onSubmit={handleCreate}>

//             {formError && (
//               <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//                 {formError}
//               </div>
//             )}

//             <Field label="Name">
//               <Input
//                 placeholder="Muhammad Ali"
//                 value={form.name}
//                 onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//                 required
//               />
//             </Field>

//             <Field label="Email">
//               <Input
//                 type="email"
//                 placeholder="user@academy.com"
//                 value={form.email}
//                 onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
//                 required
//               />
//             </Field>

//             <Field label="Password">
//               <Input
//                 type="password"
//                 placeholder="Pass@12345"
//                 value={form.password}
//                 onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
//                 required
//               />
//             </Field>

//             <Field label="Role">
//               <Select
//                 value={form.role}
//                 onValueChange={(val) => setForm((f) => ({ ...f, role: val as UserRole }))}
//               >
//                 <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
//                 <SelectContent>
//                   {ROLE_OPTIONS.map((r) => (
//                     <SelectItem key={r.value} value={r.value}>
//                       {r.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </Field>

//             <SheetFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setAddOpen(false)}
//                 disabled={formLoading}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={formLoading}>
//                 {formLoading ? "Creating…" : "Create User"}
//               </Button>
//             </SheetFooter>
//           </form>
//         </SheetContent>
//       </Sheet>
//     </>
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