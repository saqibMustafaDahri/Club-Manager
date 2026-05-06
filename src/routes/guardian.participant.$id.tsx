import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { mockParticipants, type MockParticipant } from "@/data/mockParticipants";
import { mockPayments } from "@/data/mockPayments";
import { GUARDIAN_CHILD_IDS } from "@/data/guardianContext";

export const Route = createFileRoute("/guardian/participant/$id")({
  component: ParticipantDetail,
  loader: ({ params }): MockParticipant => {
    if (!GUARDIAN_CHILD_IDS.includes(params.id)) throw notFound();
    const participant = mockParticipants.find((p) => p.id === params.id);
    if (!participant) throw notFound();
    return participant;
  },
  notFoundComponent: () => (
    <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold">Participant not found</h2>
      <Link to="/guardian" className="mt-3 inline-block text-sm text-brand hover:underline">← Back to overview</Link>
    </div>
  ),
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

const statusToBadge = (s: string) =>
  s === "Active" ? "Active" :
  s === "Fee Pending" || s === "Documents Pending" ? "Pending" :
  s === "On Hold" ? "On Hold" :
  s === "Completed" ? "Completed" :
  s === "Withdrawn" ? "Withdrawn" : "Pending";

function ParticipantDetail() {
  const { id } = Route.useParams();
  const child = mockParticipants.find((p) => p.id === id) as MockParticipant;
  const payments = mockPayments.filter((p) => p.participantId === child.id);

  const totalFee = payments.reduce((a, p) => a + p.totalFee, 0);
  const totalPaid = payments.reduce((a, p) => a + p.paidAmount, 0);
  const remaining = totalFee - totalPaid;

  const allInvoices = payments.flatMap((p) =>
    p.invoices.map((inv) => ({ ...inv, session: p.session }))
  ).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <Link to="/guardian" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to overview
      </Link>

      <div className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sidebar text-lg font-semibold text-white">
            {child.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{child.fullName}</h1>
            <p className="text-sm text-muted-foreground">{child.uniqueId}</p>
          </div>
        </div>
        <StatusBadge status={statusToBadge(child.status)} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <Info2 label="Name" value={child.fullName} />
              <Info2 label="Age" value={String(child.age)} />
              <Info2 label="Nationality" value={child.nationality} />
              <Info2 label="Location" value={child.location} />
              <Info2 label="Session" value={child.session} />
              <Info2 label="Enrolment Date" value={child.joinedDate} />
              <Info2 label="Status" value={<StatusBadge status={statusToBadge(child.status)} />} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-5">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            {child.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents on file.</p>
            ) : (
              <ul className="divide-y">
                {child.documents.map((d) => (
                  <li key={d.name} className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium">{d.name}</span>
                    <StatusBadge status={d.status === "Uploaded" ? "Approved" : d.status === "Missing" ? "Overdue" : "Pending"} />
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 flex items-start gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Please contact your academy to submit documents.</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Summary label="Total Fee" value={SAR(totalFee)} />
            <Summary label="Paid" value={SAR(totalPaid)} accent="success" />
            <Summary label="Remaining" value={SAR(remaining)} accent="warning" />
          </div>
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Invoice</th>
                  <th className="px-4 py-3 text-left">Session</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Method</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allInvoices.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No invoices yet.</td></tr>
                ) : allInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-4 py-3 font-medium">{inv.id}</td>
                    <td className="px-4 py-3">{inv.session}</td>
                    <td className="px-4 py-3">{inv.date}</td>
                    <td className="px-4 py-3">{inv.method}</td>
                    <td className="px-4 py-3 text-right font-medium">{SAR(inv.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status="Paid" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Info2({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function Summary({ label, value, accent }: { label: string; value: string; accent?: "success" | "warning" }) {
  const tone =
    accent === "success" ? "text-success" :
    accent === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
