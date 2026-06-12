import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockParticipants, type MockParticipant, type ParticipantStatus } from "@/data/mockParticipants";
import { mockSessions } from "@/data/mockSessions";
import { mockPayments } from "@/data/mockPayments";

export const Route = createFileRoute("/location-manager/participants")({
  component: ParticipantsPage,
});

const RIYADH_NAME = "Riyadh Academy";
const RIYADH_ID = "loc-riy";
const STATUSES: ParticipantStatus[] = ["Inquiry","Documents Pending","Fee Pending","Active","On Hold","Completed","Withdrawn"];
const initials = (n: string) => n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
const SAR = (n: number) => `SAR ${n.toLocaleString()}`;
const mapStatus = (s: string) => (["Inquiry","Documents Pending","Fee Pending"].includes(s) ? "Pending" : s);

function ParticipantsPage() {
  const base = useMemo(() => mockParticipants.filter((p) => p.location === RIYADH_NAME), []);
  const [sesFilter, setSesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MockParticipant | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return base.filter((p) => {
      if (sesFilter !== "all" && p.session !== sesFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (q) {
        const hay = `${p.fullName} ${p.guardianPhone} ${p.uniqueId}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [base, sesFilter, statusFilter, search]);

  const sessionsHere = mockSessions.filter((s) => s.locationId === RIYADH_ID);

  const columns: Column<MockParticipant>[] = [
    {
      key: "fullName", header: "Participant",
      render: (r) => (
        <button type="button" onClick={() => setSelected(r)} className="flex items-center gap-3 text-left">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
            {initials(r.fullName)}
          </div>
          <div>
            <p className="text-sm font-medium hover:text-primary">{r.fullName}</p>
            <p className="text-xs text-muted-foreground">{r.uniqueId}</p>
          </div>
        </button>
      ),
    },
    { key: "guardianName", header: "Guardian" },
    { key: "session", header: "Session" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={mapStatus(r.status)} /> },
    { key: "joinedDate", header: "Joined" },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSelected(r)}><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  const filters = (
    <>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="w-[200px]" />
      <Select value={sesFilter} onValueChange={setSesFilter}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Session" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sessions</SelectItem>
          {sessionsHere.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <>
      <PageHeader
        title="Participants"
        description={`${base.length} at Riyadh Academy`}
        actions={<Button onClick={() => setAddOpen(true)}>Add Participant</Button>}
      />
      <div className="p-6">
        <DataTable data={filtered} columns={columns} searchPlaceholder="Quick search…" filters={filters} />
      </div>

      {/* <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-2xl">
          {selected && <Detail p={selected} />}
        </SheetContent>
      </Sheet>

      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add Participant</SheetTitle>
            <SheetDescription>Register a new participant at Riyadh Academy.</SheetDescription>
          </SheetHeader>
          <form className="space-y-3 px-4 pb-6" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); toast.success("Participant created"); }}>
            <Field label="Full Name"><Input /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Age"><Input type="number" /></Field>
              <Field label="Nationality"><Input /></Field>
            </div>
            <Field label="Guardian Name"><Input /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Guardian Phone"><Input /></Field>
              <Field label="Guardian Email"><Input type="email" /></Field>
            </div>
            <Field label="Session">
              <Select>
                <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
                <SelectContent>
                  {sessionsHere.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Payment Plan">
              <Select>
                <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full">Full</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet> */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader className="my-4">
            <SheetTitle>Add Participant</SheetTitle>
            <SheetDescription>Register a new participant.</SheetDescription>
          </SheetHeader>
          
          <form className="space-y-3 pb-6" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); }}>
            
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name (En)"><Input name="firstNameEn" placeholder="Ahmed" /></Field>
              <Field label="Last Name (En)"><Input name="lastNameEn" placeholder="Ali" /></Field>
            </div>
      
            {/* DOB & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date of Birth"><Input name="dateOfBirth" type="date" /></Field>
              <Field label="Gender">
                <Select name="gender">
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
      
            {/* Phone & Location */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone"><Input name="phone" placeholder="+923110098721" /></Field>
              <Field label="Location">
                <Select name="locationSlug">
                  <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>
                    {/* {mockLocations.map((l) => (
                      <SelectItem key={l.id} value={l.slug}>{l.name}</SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </Field>
            </div>
      
            <hr className="my-4 border-muted" />
            <p className="text-sm ">Guardian Information</p>
      
            {/* Guardian Main Details */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Guardian Name"><Input name="guardian.fullName" placeholder="Mohammad Ali" /></Field>
              <Field label="Relationship"><Input name="guardian.relationship" placeholder="Brother" /></Field>
            </div>
      
            {/* Guardian Contact Details */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Guardian Phone"><Input name="guardian.phone" placeholder="+923220098712" /></Field>
              <Field label="Guardian Email"><Input name="guardian.email" type="email" placeholder="muhammad.ali@gmail.com" /></Field>
            </div>
      
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create Participant</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Detail({ p }: { p: MockParticipant }) {
  const [status, setStatus] = useState<ParticipantStatus>(p.status);
  const payments = mockPayments.filter((pp) => pp.participantId === p.id);

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
            {initials(p.fullName)}
          </div>
          <div className="flex-1">
            <SheetTitle>{p.fullName}</SheetTitle>
            <SheetDescription>{p.uniqueId}</SheetDescription>
          </div>
          <StatusBadge status={mapStatus(status)} />
        </div>
      </SheetHeader>
      <div className="px-4 pb-6">
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
            <TabsTrigger value="payments" className="flex-1">Payments</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Age" value={p.age} />
              <Info label="Nationality" value={p.nationality} />
              <Info label="Joined" value={p.joinedDate} />
              <Info label="Session" value={p.session} />
              <Info label="Guardian" value={p.guardianName} />
              <Info label="Phone" value={p.guardianPhone} />
              <Info label="Email" value={p.guardianEmail} />
            </div>
            <div className="rounded-md border p-3">
              <Label className="text-xs uppercase text-muted-foreground">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v as ParticipantStatus);
                  toast.success(`Status updated to ${v}`);
                }}
              >
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4 space-y-2">
            {p.documents.map((d, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <StatusBadge status={d.status === "Uploaded" ? "Active" : d.status === "Missing" ? "On Hold" : "Pending"} />
                </div>
                <Button size="sm" variant="outline">Upload</Button>
              </div>
            ))}
            {p.documents.length === 0 && <p className="text-sm text-muted-foreground">No documents.</p>}
          </TabsContent>

          <TabsContent value="payments" className="mt-4 space-y-3">
            {payments.length === 0 && <p className="text-sm text-muted-foreground">No payments yet.</p>}
            {payments.map((pay) => (
              <div key={pay.id} className="rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Plan" value={pay.plan} />
                  <Info label="Status" value={<StatusBadge status={pay.status === "Partial" ? "Pending" : pay.status} />} />
                  <Info label="Total" value={SAR(pay.totalFee)} />
                  <Info label="Paid" value={SAR(pay.paidAmount)} />
                  <Info label="Balance" value={SAR(pay.balance)} />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="notes" className="mt-4 space-y-3">
            {p.notes.map((n, i) => (
              <div key={i} className="rounded-md border p-3">
                <p className="text-sm">{n.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.author} • {new Date(n.timestamp).toLocaleString()}</p>
              </div>
            ))}
            {p.notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
            <div className="space-y-2 pt-2">
              <Textarea placeholder="Add a note…" />
              <Button size="sm">Add Note</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-muted/30 p-2.5">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
