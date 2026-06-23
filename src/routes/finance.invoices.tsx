// import { createFileRoute } from "@tanstack/react-router";
// import { useMemo } from "react";
// import { toast } from "sonner";
// import { Download } from "lucide-react";
// import { PageHeader } from "@/components/PageHeader";
// import { DataTable, type Column } from "@/components/DataTable";
// import { StatusBadge } from "@/components/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { mockPayments } from "@/data/mockPayments";

// export const Route = createFileRoute("/finance/invoices")({
//   component: InvoicesPage,
// });

// const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

// interface Row {
//   id: string;
//   participant: string;
//   session: string;
//   amount: number;
//   date: string;
//   method: string;
//   status: "Paid" | "Pending";
// }

// function InvoicesPage() {
//   const rows: Row[] = useMemo(() => {
//     const r: Row[] = [];
//     for (const p of mockPayments) {
//       for (const inv of p.invoices) {
//         r.push({
//           id: inv.id,
//           participant: p.participantName,
//           session: p.session,
//           amount: inv.amount,
//           date: inv.date,
//           method: inv.method,
//           status: "Paid",
//         });
//       }
//       if (p.balance > 0 && p.nextDueDate !== "-") {
//         r.push({
//           id: `INV-PEND-${p.id.slice(-3)}`,
//           participant: p.participantName,
//           session: p.session,
//           amount: p.balance,
//           date: p.nextDueDate,
//           method: "-",
//           status: "Pending",
//         });
//       }
//     }
//     return r.sort((a, b) => b.date.localeCompare(a.date));
//   }, []);

//   const columns: Column<Row>[] = [
//     { key: "id", header: "Invoice ID", sortable: true },
//     { key: "participant", header: "Participant", sortable: true },
//     { key: "session", header: "Session" },
//     { key: "amount", header: "Amount", render: (r) => SAR(r.amount) },
//     { key: "date", header: "Issue Date", sortable: true },
//     { key: "method", header: "Method" },
//     { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
//     {
//       key: "download", header: "Download",
//       render: (r) => (
//         <Button variant="ghost" size="icon" title="Download invoice"
//           onClick={() => toast.success(`Invoice #${r.id} downloaded`)}>
//           <Download className="h-4 w-4" />
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <>
//       <PageHeader
//         title="Invoices"
//         actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>}
//       />
//       <div className="space-y-6 p-6">
//         <DataTable
//           data={rows}
//           columns={columns}
//           searchKeys={["participant", "id"]}
//           searchPlaceholder="Search invoices…"
//         />
//       </div>
//     </>
//   );
// }
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/axios";

export const Route = createFileRoute("/finance/invoices")({
  component: InvoicesPage,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

interface Invoice {
  id: string;
  amount: number;
  status: string;
  dueDate?: string;
  paidAt?: string;
  method?: string;
  enrolmentId: string;
  participantName?: string;
  sessionName?: string;
  [key: string]: unknown;
}

async function fetchAllInvoices(): Promise<Invoice[]> {
  // 1. Get all enrolments
  const { data: enrolData } = await apiClient.get<any>("/enrolments");
  const enrolments: any[] = enrolData.items ?? enrolData;

  // 2. Fetch invoices for each enrolment in parallel
  const results = await Promise.allSettled(
    enrolments.map(async (enrolment) => {
      const { data } = await apiClient.get<any>(
        `/enrolments/${enrolment.id}/invoices`
      );
      const invoices: any[] = data.items ?? data ?? [];

      // Attach enrolment context to each invoice
      return invoices.map((inv) => ({
        ...inv,
        enrolmentId: enrolment.id,
        participantName:
          enrolment.participant
            ? `${enrolment.participant.firstNameEn ?? ""} ${enrolment.participant.lastNameEn ?? ""}`.trim()
            : enrolment.participantId ?? "—",
        sessionName:
          enrolment.session?.name ?? enrolment.sessionId ?? "—",
      }));
    })
  );

  // 3. Flatten, skip failed requests
  return results.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );
}

function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllInvoices()
      .then(setInvoices)
      .catch((err) =>
        setApiError(err instanceof Error ? err.message : "Failed to load invoices.")
      )
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(
    () =>
      [...invoices].sort((a, b) => {
        const da = (a.paidAt ?? a.dueDate ?? "") as string;
        const db = (b.paidAt ?? b.dueDate ?? "") as string;
        return db.localeCompare(da);
      }),
    [invoices]
  );

  const columns: Column<Invoice>[] = [
    { key: "id", header: "Invoice ID", sortable: true },
    {
      key: "participantName",
      header: "Participant",
      sortable: true,
      render: (r) => r.participantName ?? "—",
    },
    {
      key: "sessionName",
      header: "Session",
      render: (r) => r.sessionName ?? "—",
    },
    {
      key: "amount",
      header: "Amount",
      render: (r) => (r.amount != null ? SAR(r.amount) : "—"),
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      render: (r) => {
        const raw = r.dueDate as string | undefined;
        if (!raw) return "—";
        return new Date(raw).toLocaleDateString("en-GB", {
          day: "2-digit", month: "short", year: "numeric",
        });
      },
    },
    {
      key: "paidAt",
      header: "Paid At",
      render: (r) => {
        const raw = r.paidAt as string | undefined;
        if (!raw) return "—";
        return new Date(raw).toLocaleDateString("en-GB", {
          day: "2-digit", month: "short", year: "numeric",
        });
      },
    },
    {
      key: "method",
      header: "Method",
      render: (r) => (r.method as string) ?? "—",
    },
    {
      key: "status",
      header: "Status",
      render: (r) => {
        const s = (r.status as string) ?? "Pending";
        // Normalize API casing → StatusBadge expects "Paid" / "Pending" etc.
        const display =
          s === "PAID" ? "Paid" :
            s === "PENDING" ? "Pending" :
              s === "OVERDUE" ? "On Hold" :
                s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        return <StatusBadge status={display} />;
      },
    },
    {
      key: "download",
      header: "Download",
      render: (r) => (
        <Button
          variant="ghost"
          size="icon"
          title="Download invoice"
          onClick={() => {
            const url = (r.receiptUrl ?? r.downloadUrl ?? r.url) as string | undefined;
            if (url) window.open(url, "_blank");
          }}
        >
          <Download className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Invoices"
        description={loading ? "Loading…" : `${invoices.length} invoices`}
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading invoices…</p>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {apiError}
          </div>
        ) : invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invoices found.</p>
        ) : (
          <DataTable
            data={sorted}
            columns={columns}
            searchKeys={["participantName", "id", "sessionName"]}
            searchPlaceholder="Search invoices…"
          />
        )}
      </div>
    </>
  );
}