import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockPayments } from "@/data/mockPayments";

export const Route = createFileRoute("/finance/invoices")({
  component: InvoicesPage,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

interface Row {
  id: string;
  participant: string;
  session: string;
  amount: number;
  date: string;
  method: string;
  status: "Paid" | "Pending";
}

function InvoicesPage() {
  const rows: Row[] = useMemo(() => {
    const r: Row[] = [];
    for (const p of mockPayments) {
      for (const inv of p.invoices) {
        r.push({
          id: inv.id,
          participant: p.participantName,
          session: p.session,
          amount: inv.amount,
          date: inv.date,
          method: inv.method,
          status: "Paid",
        });
      }
      if (p.balance > 0 && p.nextDueDate !== "—") {
        r.push({
          id: `INV-PEND-${p.id.slice(-3)}`,
          participant: p.participantName,
          session: p.session,
          amount: p.balance,
          date: p.nextDueDate,
          method: "—",
          status: "Pending",
        });
      }
    }
    return r.sort((a, b) => b.date.localeCompare(a.date));
  }, []);

  const columns: Column<Row>[] = [
    { key: "id", header: "Invoice ID", sortable: true },
    { key: "participant", header: "Participant", sortable: true },
    { key: "session", header: "Session" },
    { key: "amount", header: "Amount", render: (r) => SAR(r.amount) },
    { key: "date", header: "Issue Date", sortable: true },
    { key: "method", header: "Method" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "download", header: "Download",
      render: (r) => (
        <Button variant="ghost" size="icon" title="Download invoice"
          onClick={() => toast.success(`Invoice #${r.id} downloaded`)}>
          <Download className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Invoices"
        actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>}
      />
      <div className="space-y-6 p-6">
        <DataTable
          data={rows}
          columns={columns}
          searchKeys={["participant", "id"]}
          searchPlaceholder="Search invoices…"
        />
      </div>
    </>
  );
}
