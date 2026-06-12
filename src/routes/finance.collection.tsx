import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Eye, Send, Plus } from "lucide-react";
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
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { mockPayments, type MockPayment } from "@/data/mockPayments";
import { mockLocations } from "@/data/mockLocations";
import { mockSessions } from "@/data/mockSessions";

export const Route = createFileRoute("/finance/collection")({
  component: CollectionPage,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function CollectionPage() {
  const [locFilter, setLocFilter] = useState("all");
  const [sesFilter, setSesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [selected, setSelected] = useState<MockPayment | null>(null);
  const [recordOpen, setRecordOpen] = useState(false);
  const [globalRecord, setGlobalRecord] = useState(false);
  const [participantQuery, setParticipantQuery] = useState("");

  const filtered = useMemo(() => mockPayments.filter((p) => {
    if (locFilter !== "all" && p.location !== locFilter) return false;
    if (sesFilter !== "all" && p.session !== sesFilter) return false;
    if (planFilter !== "all" && p.plan !== planFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  }), [locFilter, sesFilter, planFilter, statusFilter]);

  const columns: Column<MockPayment>[] = [
    {
      key: "participantName", header: "Participant", sortable: true,
      render: (r) => (
        <button className="text-left font-medium hover:underline" onClick={() => setSelected(r)}>{r.participantName}</button>
      )
    },
    { key: "location", header: "Location" },
    { key: "session", header: "Session" },
    { key: "plan", header: "Plan" },
    { key: "totalFee", header: "Total Fee", render: (r) => SAR(r.totalFee) },
    { key: "paidAmount", header: "Paid", render: (r) => SAR(r.paidAmount) },
    { key: "balance", header: "Balance", render: (r) => SAR(r.balance) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status === "Partial" ? "Pending" : r.status} /> },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSelected(r)} title="View"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" title="Send Reminder"
            onClick={() => toast.success(`Reminder sent to ${r.participantName} via WhatsApp and Email`)}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const participantMatches = mockPayments.filter((p) =>
    p.participantName.toLowerCase().includes(participantQuery.toLowerCase())
  ).slice(0, 6);

  const filters = (
    <>
      <Select value={locFilter} onValueChange={setLocFilter}>
        <SelectTrigger className="w-[140px]"><SelectValue placeholder="Location" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {mockLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={sesFilter} onValueChange={setSesFilter}>
        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Session" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sessions</SelectItem>
          {mockSessions.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Paid">Paid</SelectItem>
          <SelectItem value="Partial">Partial</SelectItem>
          <SelectItem value="Overdue">Overdue</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
        </SelectContent>
      </Select>
      <Select value={planFilter} onValueChange={setPlanFilter}>
        <SelectTrigger className="w-[110px]"><SelectValue placeholder="Plan" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Plans</SelectItem>
          <SelectItem value="Full">Full</SelectItem>
          <SelectItem value="Monthly">Monthly</SelectItem>
          <SelectItem value="Seasonal">Seasonal</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <>
      <PageHeader
        title="Fee Collection"
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button onClick={() => setGlobalRecord(true)} className="bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          </div>
        }
      />
      <div className="space-y-6 p-6">
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["participantName"]}
          searchPlaceholder="Search payments…"
          filters={filters}
        />
      </div>

      {/* Participant detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && (setSelected(null), setRecordOpen(false))}>
        <SheetContent className="w-full sm:max-w-xl">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.participantName}</SheetTitle>
                <SheetDescription>{selected.session} • {selected.location}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <Info label="Total" value={SAR(selected.totalFee)} />
                  <Info label="Paid" value={SAR(selected.paidAmount)} />
                  <Info label="Balance" value={SAR(selected.balance)} />
                  <Info label="Plan" value={selected.plan} />
                  <Info label="Status" value={<StatusBadge status={selected.status === "Partial" ? "Pending" : selected.status} />} />
                  <Info label="Next Due" value={selected.nextDueDate} />
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Invoice history</h4>
                  {selected.invoices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No invoices yet.</p>
                  ) : (
                    <ul className="divide-y rounded-md border">
                      {selected.invoices.map((inv) => (
                        <li key={inv.id} className="flex items-center justify-between px-3 py-2 text-sm">
                          <div>
                            <p className="font-medium">{inv.id}</p>
                            <p className="text-xs text-muted-foreground">{inv.date} • {inv.method}</p>
                          </div>
                          <span>{SAR(inv.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {!recordOpen ? (
                  <Button onClick={() => setRecordOpen(true)} className="w-full">Record Payment</Button>
                ) : (
                  <form
                    className="space-y-3 rounded-lg border p-4"
                    onSubmit={(e) => { e.preventDefault(); setRecordOpen(false); toast.success("Payment recorded"); }}
                  >
                    <h4 className="text-sm font-semibold">Record Payment</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Amount (SAR)"><Input type="number" placeholder="0" /></Field>
                      <Field label="Date"><Input type="date" /></Field>
                    </div>
                    <Field label="Method">
                      <Select defaultValue="Card">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Upload Proof"><Input type="file" /></Field>
                    <SheetFooter>
                      <Button type="button" variant="outline" onClick={() => setRecordOpen(false)}>Cancel</Button>
                      <Button type="submit">Save Payment</Button>
                    </SheetFooter>
                  </form>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Global record dialog */}
      <Dialog open={globalRecord} onOpenChange={setGlobalRecord}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => { e.preventDefault(); setGlobalRecord(false); setParticipantQuery(""); toast.success("Payment recorded"); }}
          >
            <Field label="EnrolmentID">
              <Input placeholder="EnrolmentID" />
              {/* {participantQuery && (
                <ul className="mt-1 max-h-40 overflow-y-auto rounded-md border bg-popover text-sm">
                  {participantMatches.map((p) => (
                    <li key={p.id}>
                      <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-muted"
                        onClick={() => setParticipantQuery(p.participantName)}>
                        {p.participantName} <span className="text-xs text-muted-foreground">• {p.session}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )} */}
            </Field>
            <Field label="InvoiceID"><Input placeholder="InvoiceID"></Input></Field>
            {/* <div className="grid grid-cols-2 gap-3"> */}
            <Field label="Amount (SAR)"><Input type="number" placeholder="0" /></Field>
            {/* <Field label="Date"><Input type="date" /></Field> */}
            {/* </div> */}
            <Field label="Method">
              <Select defaultValue="Card">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Upload Proof"><Input type="file" /></Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGlobalRecord(false)}>Cancel</Button>
              <Button type="submit">Save Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
