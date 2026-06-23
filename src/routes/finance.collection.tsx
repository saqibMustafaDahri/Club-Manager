// import { createFileRoute } from "@tanstack/react-router";
// import { useMemo, useState } from "react";
// import { toast } from "sonner";
// import { Download, Eye, Send, Plus } from "lucide-react";
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
// import {
//   Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
// } from "@/components/ui/dialog";
// import { mockPayments, type MockPayment } from "@/data/mockPayments";
// import { mockLocations } from "@/data/mockLocations";
// import { mockSessions } from "@/data/mockSessions";

// export const Route = createFileRoute("/finance/collection")({
//   component: CollectionPage,
// });

// const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

// function CollectionPage() {
//   const [locFilter, setLocFilter] = useState("all");
//   const [sesFilter, setSesFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [planFilter, setPlanFilter] = useState("all");
//   const [selected, setSelected] = useState<MockPayment | null>(null);
//   const [recordOpen, setRecordOpen] = useState(false);
//   const [globalRecord, setGlobalRecord] = useState(false);
//   const [participantQuery, setParticipantQuery] = useState("");

//   const filtered = useMemo(() => mockPayments.filter((p) => {
//     if (locFilter !== "all" && p.location !== locFilter) return false;
//     if (sesFilter !== "all" && p.session !== sesFilter) return false;
//     if (planFilter !== "all" && p.plan !== planFilter) return false;
//     if (statusFilter !== "all" && p.status !== statusFilter) return false;
//     return true;
//   }), [locFilter, sesFilter, planFilter, statusFilter]);

//   const columns: Column<MockPayment>[] = [
//     {
//       key: "participantName", header: "Participant", sortable: true,
//       render: (r) => (
//         <button className="text-left font-medium hover:underline" onClick={() => setSelected(r)}>{r.participantName}</button>
//       )
//     },
//     { key: "location", header: "Location" },
//     { key: "session", header: "Session" },
//     { key: "plan", header: "Plan" },
//     { key: "totalFee", header: "Total Fee", render: (r) => SAR(r.totalFee) },
//     { key: "paidAmount", header: "Paid", render: (r) => SAR(r.paidAmount) },
//     { key: "balance", header: "Balance", render: (r) => SAR(r.balance) },
//     { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status === "Partial" ? "Pending" : r.status} /> },
//     {
//       key: "actions", header: "Actions",
//       render: (r) => (
//         <div className="flex gap-1">
//           <Button variant="ghost" size="icon" onClick={() => setSelected(r)} title="View"><Eye className="h-4 w-4" /></Button>
//           <Button variant="ghost" size="icon" title="Send Reminder"
//             onClick={() => toast.success(`Reminder sent to ${r.participantName} via WhatsApp and Email`)}>
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   const participantMatches = mockPayments.filter((p) =>
//     p.participantName.toLowerCase().includes(participantQuery.toLowerCase())
//   ).slice(0, 6);

//   const filters = (
//     <>
//       <Select value={locFilter} onValueChange={setLocFilter}>
//         <SelectTrigger className="w-[140px]"><SelectValue placeholder="Location" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Locations</SelectItem>
//           {mockLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
//         </SelectContent>
//       </Select>
//       <Select value={sesFilter} onValueChange={setSesFilter}>
//         <SelectTrigger className="w-[150px]"><SelectValue placeholder="Session" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Sessions</SelectItem>
//           {mockSessions.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
//         </SelectContent>
//       </Select>
//       <Select value={statusFilter} onValueChange={setStatusFilter}>
//         <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Status</SelectItem>
//           <SelectItem value="Paid">Paid</SelectItem>
//           <SelectItem value="Partial">Partial</SelectItem>
//           <SelectItem value="Overdue">Overdue</SelectItem>
//           <SelectItem value="Pending">Pending</SelectItem>
//         </SelectContent>
//       </Select>
//       <Select value={planFilter} onValueChange={setPlanFilter}>
//         <SelectTrigger className="w-[110px]"><SelectValue placeholder="Plan" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Plans</SelectItem>
//           <SelectItem value="Full">Full</SelectItem>
//           <SelectItem value="Monthly">Monthly</SelectItem>
//           <SelectItem value="Seasonal">Seasonal</SelectItem>
//         </SelectContent>
//       </Select>
//     </>
//   );

//   return (
//     <>
//       <PageHeader
//         title="Fee Collection"
//         actions={
//           <div className="flex gap-2">
//             <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
//             <Button onClick={() => setGlobalRecord(true)} className="bg-brand text-brand-foreground hover:bg-brand/90">
//               <Plus className="mr-2 h-4 w-4" /> Record Payment
//             </Button>
//           </div>
//         }
//       />
//       <div className="space-y-6 p-6">
//         <DataTable
//           data={filtered}
//           columns={columns}
//           searchKeys={["participantName"]}
//           searchPlaceholder="Search payments…"
//           filters={filters}
//         />
//       </div>

//       {/* Participant detail drawer */}
//       <Sheet open={!!selected} onOpenChange={(o) => !o && (setSelected(null), setRecordOpen(false))}>
//         <SheetContent className="w-full sm:max-w-xl">
//           {selected && (
//             <>
//               <SheetHeader>
//                 <SheetTitle>{selected.participantName}</SheetTitle>
//                 <SheetDescription>{selected.session} • {selected.location}</SheetDescription>
//               </SheetHeader>
//               <div className="space-y-5 px-4 pb-6">
//                 <div className="grid grid-cols-3 gap-3 text-sm">
//                   <Info label="Total" value={SAR(selected.totalFee)} />
//                   <Info label="Paid" value={SAR(selected.paidAmount)} />
//                   <Info label="Balance" value={SAR(selected.balance)} />
//                   <Info label="Plan" value={selected.plan} />
//                   <Info label="Status" value={<StatusBadge status={selected.status === "Partial" ? "Pending" : selected.status} />} />
//                   <Info label="Next Due" value={selected.nextDueDate} />
//                 </div>

//                 <div>
//                   <h4 className="mb-2 text-sm font-semibold">Invoice history</h4>
//                   {selected.invoices.length === 0 ? (
//                     <p className="text-sm text-muted-foreground">No invoices yet.</p>
//                   ) : (
//                     <ul className="divide-y rounded-md border">
//                       {selected.invoices.map((inv) => (
//                         <li key={inv.id} className="flex items-center justify-between px-3 py-2 text-sm">
//                           <div>
//                             <p className="font-medium">{inv.id}</p>
//                             <p className="text-xs text-muted-foreground">{inv.date} • {inv.method}</p>
//                           </div>
//                           <span>{SAR(inv.amount)}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>

//                 {!recordOpen ? (
//                   <Button onClick={() => setRecordOpen(true)} className="w-full">Record Payment</Button>
//                 ) : (
//                   <form
//                     className="space-y-3 rounded-lg border p-4"
//                     onSubmit={(e) => { e.preventDefault(); setRecordOpen(false); toast.success("Payment recorded"); }}
//                   >
//                     <h4 className="text-sm font-semibold">Record Payment</h4>
//                     <div className="grid grid-cols-2 gap-3">
//                       <Field label="Amount (SAR)"><Input type="number" placeholder="0" /></Field>
//                       <Field label="Date"><Input type="date" /></Field>
//                     </div>
//                     <Field label="Method">
//                       <Select defaultValue="Card">
//                         <SelectTrigger><SelectValue /></SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Card">Card</SelectItem>
//                           <SelectItem value="Cash">Cash</SelectItem>
//                           <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </Field>
//                     <Field label="Upload Proof"><Input type="file" /></Field>
//                     <SheetFooter>
//                       <Button type="button" variant="outline" onClick={() => setRecordOpen(false)}>Cancel</Button>
//                       <Button type="submit">Save Payment</Button>
//                     </SheetFooter>
//                   </form>
//                 )}
//               </div>
//             </>
//           )}
//         </SheetContent>
//       </Sheet>

//       {/* Global record dialog */}
//       <Dialog open={globalRecord} onOpenChange={setGlobalRecord}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Record New Payment</DialogTitle>
//           </DialogHeader>
//           <form
//             className="space-y-3"
//             onSubmit={(e) => { e.preventDefault(); setGlobalRecord(false); setParticipantQuery(""); toast.success("Payment recorded"); }}
//           >
//             <Field label="EnrolmentID">
//               <Input placeholder="EnrolmentID" />
//               {/* {participantQuery && (
//                 <ul className="mt-1 max-h-40 overflow-y-auto rounded-md border bg-popover text-sm">
//                   {participantMatches.map((p) => (
//                     <li key={p.id}>
//                       <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-muted"
//                         onClick={() => setParticipantQuery(p.participantName)}>
//                         {p.participantName} <span className="text-xs text-muted-foreground">• {p.session}</span>
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )} */}
//             </Field>
//             <Field label="InvoiceID"><Input placeholder="InvoiceID"></Input></Field>
//             {/* <div className="grid grid-cols-2 gap-3"> */}
//             <Field label="Amount (SAR)"><Input type="number" placeholder="0" /></Field>
//             {/* <Field label="Date"><Input type="date" /></Field> */}
//             {/* </div> */}
//             <Field label="Method">
//               <Select defaultValue="Card">
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Card">Card</SelectItem>
//                   <SelectItem value="Cash">Cash</SelectItem>
//                   <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field>
//             <Field label="Upload Proof"><Input type="file" /></Field>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setGlobalRecord(false)}>Cancel</Button>
//               <Button type="submit">Save Payment</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//   return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
// }
// function Info({ label, value }: { label: string; value: React.ReactNode }) {
//   return (
//     <div className="rounded-md bg-muted/30 p-2.5">
//       <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
//       <p className="mt-0.5 text-sm font-medium">{value}</p>
//     </div>
//   );
// }



import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
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
import { paymentsApi, type Payment } from "@/api/payments";
import { enrolmentsApi, type Enrolment } from "@/api/enrolments";
import { participantsApi, type Participant } from "@/api/participants";
import { sessionsApi, type Session } from "@/api/sessions";
import { apiClient } from "@/lib/axios";

export const Route = createFileRoute("/finance/collection")({
  component: CollectionPage,
});

const SAR = (n: number) => `SAR ${(n ?? 0).toLocaleString()}`;

async function uploadProof(file: File, enrolmentId: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("enrolmentId", enrolmentId);
  const { data } = await apiClient.post<any>("/payments/proof-upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.proofKey ?? data.key ?? data.url ?? "";
}

async function recordOfflinePayment(payload: {
  enrolmentId: string;
  invoiceId?: string;
  method: string;
  amount: number;
  proofKey?: string;
  note?: string;
}) {
  const { data } = await apiClient.post("/payments/offline", {
    enrolmentId: payload.enrolmentId,
    invoiceId: payload.invoiceId || undefined,
    method: payload.method,
    amount: payload.amount,
    proofKey: payload.proofKey || undefined,
    idempotencyKey: `${payload.enrolmentId}-${Date.now()}`,
    note: payload.note || undefined,
  });
  return data;
}

function CollectionPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Payment | null>(null);
  const [recordOpen, setRecordOpen] = useState(false);
  const [globalRecord, setGlobalRecord] = useState(false);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Search state for enrolment picker
  const [enrolSearch, setEnrolSearch] = useState("");

  const [detailForm, setDetailForm] = useState({
    amount: "", method: "CASH", note: "", invoiceId: "",
  });
  const [detailFile, setDetailFile] = useState<File | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailSuccess, setDetailSuccess] = useState(false);

  const [globalForm, setGlobalForm] = useState({
    enrolmentId: "", invoiceId: "", amount: "", method: "CASH", note: "",
  });
  const [globalFile, setGlobalFile] = useState<File | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pData, eData, partData, sData] = await Promise.all([
          paymentsApi.getAll(),
          enrolmentsApi.getAll(),
          participantsApi.getAll(),
          sessionsApi.getAll(),
        ]);
        setPayments(pData);
        setEnrolments(eData);
        setParticipants(partData);
        setSessions(sData);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Build a label for each enrolment: "Participant Name — Session Name"
  const enrolmentOptions = useMemo(() => {
    return enrolments.map((e) => {
      const p = participants.find((pt) => pt.id === e.participantId);
      const s = sessions.find((se) => se.id === e.sessionId);
      const participantName = p
        ? `${p.firstNameEn} ${p.lastNameEn}`
        : e.participantId ?? "Unknown";
      const sessionName = s?.name ?? e.sessionId ?? "Unknown";
      return {
        id: e.id,
        label: `${participantName} — ${sessionName}`,
        participantName,
        sessionName,
      };
    });
  }, [enrolments, participants, sessions]);

  // Filtered enrolment options based on search
  const filteredEnrolOptions = useMemo(() => {
    const q = enrolSearch.toLowerCase().trim();
    if (!q) return enrolmentOptions;
    return enrolmentOptions.filter((o) =>
      o.label.toLowerCase().includes(q)
    );
  }, [enrolmentOptions, enrolSearch]);

  const filtered = useMemo(() =>
    payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    }),
    [payments, statusFilter]
  );

  const handleDetailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!detailForm.amount) { setDetailError("Please enter an amount."); return; }
    setDetailError(null);
    setDetailLoading(true);
    try {
      let proofKey: string | undefined;
      if (detailFile) proofKey = await uploadProof(detailFile, selected.id);
      await recordOfflinePayment({
        enrolmentId: selected.id,
        invoiceId: detailForm.invoiceId || undefined,
        method: detailForm.method,
        amount: Number(detailForm.amount),
        proofKey,
        note: detailForm.note || undefined,
      });
      setDetailSuccess(true);
      setDetailForm({ amount: "", method: "CASH", note: "", invoiceId: "" });
      setDetailFile(null);
      setRecordOpen(false);
      const updated = await paymentsApi.getAll();
      setPayments(updated);
      setTimeout(() => setDetailSuccess(false), 3000);
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Failed to record payment.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleGlobalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalForm.enrolmentId) { setGlobalError("Please select an enrolment."); return; }
    if (!globalForm.amount) { setGlobalError("Please enter an amount."); return; }
    setGlobalError(null);
    setGlobalLoading(true);
    try {
      let proofKey: string | undefined;
      if (globalFile) proofKey = await uploadProof(globalFile, globalForm.enrolmentId);
      await recordOfflinePayment({
        enrolmentId: globalForm.enrolmentId,
        invoiceId: globalForm.invoiceId || undefined,
        method: globalForm.method,
        amount: Number(globalForm.amount),
        proofKey,
        note: globalForm.note || undefined,
      });
      setGlobalSuccess(true);
      setGlobalForm({ enrolmentId: "", invoiceId: "", amount: "", method: "CASH", note: "" });
      setEnrolSearch("");
      setGlobalFile(null);
      const updated = await paymentsApi.getAll();
      setPayments(updated);
      setTimeout(() => { setGlobalSuccess(false); setGlobalRecord(false); }, 1500);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Failed to record payment.");
    } finally {
      setGlobalLoading(false);
    }
  };

  const columns: Column<Payment>[] = [
    {
      key: "participantName", header: "Participant", sortable: true,
      render: (r) => (
        <button className="text-left font-medium hover:underline" onClick={() => setSelected(r)}>
          {r.participantName}
        </button>
      ),
    },
    { key: "location", header: "Location" },
    { key: "session", header: "Session" },
    { key: "plan", header: "Plan" },
    { key: "totalFee", header: "Total Fee", render: (r) => SAR(r.totalFee) },
    { key: "paidAmount", header: "Paid", render: (r) => SAR(r.paidAmount) },
    { key: "balance", header: "Balance", render: (r) => SAR(r.balance) },
    {
      key: "status", header: "Status",
      render: (r) => <StatusBadge status={r.status === "Partial" ? "Pending" : r.status} />,
    },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSelected(r)} title="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Send Reminder">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Fee Collection"
        description={loading ? "Loading…" : `${payments.length} records`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button onClick={() => { setGlobalError(null); setGlobalSuccess(false); setGlobalRecord(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          </div>
        }
      />

      <div className="space-y-6 p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading payments…</p>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</div>
        ) : (
          <DataTable
            data={filtered}
            columns={columns}
            searchKeys={["participantName"]}
            searchPlaceholder="Search payments…"
            filters={
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        )}
      </div>

      {/* ── Participant detail drawer ── */}
      <Sheet open={!!selected} onOpenChange={(o) => { if (!o) { setSelected(null); setRecordOpen(false); setDetailSuccess(false); } }}>
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
                  {!selected.invoices?.length ? (
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
                  <Button onClick={() => { setDetailError(null); setRecordOpen(true); }} className="w-full">
                    Record Payment
                  </Button>
                ) : (
                  <form className="space-y-3 rounded-lg border p-4" onSubmit={handleDetailSubmit}>
                    <h4 className="text-sm font-semibold">Record Payment</h4>
                    {detailError && (
                      <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{detailError}</div>
                    )}
                    {detailSuccess && (
                      <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600">Payment recorded successfully.</div>
                    )}
                    <Field label="Invoice ID (optional)">
                      <Input placeholder="uuid-optional" value={detailForm.invoiceId}
                        onChange={(e) => setDetailForm((f) => ({ ...f, invoiceId: e.target.value }))} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Amount (SAR)">
                        <Input type="number" min={0} placeholder="500" value={detailForm.amount}
                          onChange={(e) => setDetailForm((f) => ({ ...f, amount: e.target.value }))} required />
                      </Field>
                      <Field label="Method">
                        <Select value={detailForm.method} onValueChange={(v) => setDetailForm((f) => ({ ...f, method: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="CARD">Card</SelectItem>
                            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Field label="Note (optional)">
                      <Input placeholder="Optional note" value={detailForm.note}
                        onChange={(e) => setDetailForm((f) => ({ ...f, note: e.target.value }))} />
                    </Field>
                    <Field label="Upload Proof (optional)">
                      <Input type="file" onChange={(e) => setDetailFile(e.target.files?.[0] ?? null)} />
                    </Field>
                    <SheetFooter>
                      <Button type="button" variant="outline" onClick={() => setRecordOpen(false)} disabled={detailLoading}>Cancel</Button>
                      <Button type="submit" disabled={detailLoading}>{detailLoading ? "Saving…" : "Save Payment"}</Button>
                    </SheetFooter>
                  </form>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Global record payment dialog ── */}
      <Dialog open={globalRecord} onOpenChange={(o) => { setGlobalRecord(o); if (!o) { setGlobalSuccess(false); setEnrolSearch(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
          </DialogHeader>

          <form className="space-y-3" onSubmit={handleGlobalSubmit}>
            {globalError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{globalError}</div>
            )}
            {globalSuccess && (
              <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600">Payment recorded successfully.</div>
            )}

            {/* ── Searchable enrolment picker ── */}
            <Field label="Enrolment">
              <div className="space-y-1.5">
                {/* Search box */}
                <Input
                  placeholder="Search by participant or session…"
                  value={enrolSearch}
                  onChange={(e) => {
                    setEnrolSearch(e.target.value);
                    // Clear selection when user starts typing again
                    if (globalForm.enrolmentId) {
                      setGlobalForm((f) => ({ ...f, enrolmentId: "" }));
                    }
                  }}
                />

                {/* Show selected enrolment label */}
                {globalForm.enrolmentId && (
                  <div className="flex items-center justify-between rounded-md border border-brand/40 bg-brand/5 px-3 py-2 text-sm">
                    <span className="font-medium text-brand">
                      {enrolmentOptions.find((o) => o.id === globalForm.enrolmentId)?.label ?? globalForm.enrolmentId}
                    </span>
                    <button
                      type="button"
                      className="ml-2 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => { setGlobalForm((f) => ({ ...f, enrolmentId: "" })); setEnrolSearch(""); }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Dropdown list — only show when searching and nothing selected */}
                {enrolSearch && !globalForm.enrolmentId && (
                  <ul className="max-h-44 overflow-y-auto rounded-md border bg-popover text-sm shadow-md">
                    {filteredEnrolOptions.length === 0 ? (
                      <li className="px-3 py-2 text-muted-foreground">No enrolments found.</li>
                    ) : (
                      filteredEnrolOptions.map((o) => (
                        <li key={o.id}>
                          <button
                            type="button"
                            className="block w-full px-3 py-2 text-left hover:bg-muted"
                            onClick={() => {
                              setGlobalForm((f) => ({ ...f, enrolmentId: o.id }));
                              setEnrolSearch("");
                            }}
                          >
                            <span className="font-medium">{o.participantName}</span>
                            <span className="ml-2 text-xs text-muted-foreground">• {o.sessionName}</span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </Field>

            <Field label="Invoice ID (optional)">
              <Input placeholder="uuid-optional" value={globalForm.invoiceId}
                onChange={(e) => setGlobalForm((f) => ({ ...f, invoiceId: e.target.value }))} />
            </Field>

            <Field label="Amount (SAR)">
              <Input type="number" min={0} placeholder="500" value={globalForm.amount}
                onChange={(e) => setGlobalForm((f) => ({ ...f, amount: e.target.value }))} required />
            </Field>

            <Field label="Method">
              <Select value={globalForm.method} onValueChange={(v) => setGlobalForm((f) => ({ ...f, method: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Note (optional)">
              <Input placeholder="Optional note" value={globalForm.note}
                onChange={(e) => setGlobalForm((f) => ({ ...f, note: e.target.value }))} />
            </Field>

            <Field label="Upload Proof (optional)">
              <Input type="file" onChange={(e) => setGlobalFile(e.target.files?.[0] ?? null)} />
            </Field>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGlobalRecord(false)} disabled={globalLoading}>Cancel</Button>
              <Button type="submit" disabled={globalLoading}>{globalLoading ? "Saving…" : "Save Payment"}</Button>
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