import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Eye, Send } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
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
import { Receipt, Wallet, AlertCircle } from "lucide-react";
import { mockPayments, type MockPayment } from "@/data/mockPayments";
import { mockLocations } from "@/data/mockLocations";
import { mockSessions } from "@/data/mockSessions";

export const Route = createFileRoute("/admin/fees")({
  component: FeesPage,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function FeesPage() {
  const [locFilter, setLocFilter] = useState("all");
  const [sesFilter, setSesFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<MockPayment | null>(null);
  const [recordOpen, setRecordOpen] = useState(false);

  const filtered = useMemo(() => mockPayments.filter((p) => {
    if (locFilter !== "all" && p.location !== locFilter) return false;
    if (sesFilter !== "all" && p.session !== sesFilter) return false;
    if (planFilter !== "all" && p.plan !== planFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (from && p.lastPaymentDate !== "—" && p.lastPaymentDate < from) return false;
    if (to && p.lastPaymentDate !== "—" && p.lastPaymentDate > to) return false;
    return true;
  }), [locFilter, sesFilter, planFilter, statusFilter, from, to]);

  const totalInvoiced = mockPayments.reduce((a, p) => a + p.totalFee, 0);
  const totalCollected = mockPayments.reduce((a, p) => a + p.paidAmount, 0);
  const totalOutstanding = mockPayments.reduce((a, p) => a + p.balance, 0);

  const columns: Column<MockPayment>[] = [
    { key: "participantName", header: "Participant", sortable: true },
    { key: "location", header: "Location" },
    { key: "session", header: "Session" },
    { key: "plan", header: "Plan" },
    { key: "totalFee", header: "Total", render: (r) => SAR(r.totalFee) },
    { key: "paidAmount", header: "Paid", render: (r) => SAR(r.paidAmount) },
    { key: "balance", header: "Balance", render: (r) => SAR(r.balance) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status === "Partial" ? "Pending" : r.status} /> },
    { key: "lastPaymentDate", header: "Last Payment" },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSelected(r)} title="View"><Eye className="h-4 w-4" /></Button>
          <Button
            variant="ghost" size="icon" title="Send Reminder"
            onClick={() => toast.success(`Reminder sent via WhatsApp and Email to ${r.participantName}`)}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

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
      <Select value={planFilter} onValueChange={setPlanFilter}>
        <SelectTrigger className="w-[110px]"><SelectValue placeholder="Plan" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Plans</SelectItem>
          <SelectItem value="Full">Full</SelectItem>
          <SelectItem value="Monthly">Monthly</SelectItem>
          <SelectItem value="Seasonal">Seasonal</SelectItem>
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
      <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-[140px]" />
      <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-[140px]" />
    </>
  );

  return (
    <>
      <PageHeader
        title="Fees & Payments"
        actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>}
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Invoiced" value={SAR(totalInvoiced)} icon={Receipt} accent="primary" />
          <StatCard label="Total Collected" value={SAR(totalCollected)} icon={Wallet} accent="success" />
          <StatCard label="Total Outstanding" value={SAR(totalOutstanding)} icon={AlertCircle} accent="danger" />
        </div>

        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["participantName"]}
          searchPlaceholder="Search payments…"
          filters={filters}
        />
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
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
                          <div className="flex items-center gap-3">
                            <span>{SAR(inv.amount)}</span>
                            <Button size="icon" variant="ghost" asChild>
                              <a href={inv.receiptUrl}><Download className="h-4 w-4" /></a>
                            </Button>
                          </div>
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
                      <Field label="Amount"><Input type="number" placeholder="500" /></Field>
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
