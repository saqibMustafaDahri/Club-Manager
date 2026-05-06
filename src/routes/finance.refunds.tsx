import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { refunds, type Refund } from "@/data/finance";

export const Route = createFileRoute("/finance/refunds")({
  component: () => {
    const columns: Column<Refund>[] = [
      { key: "id", header: "Ref", render: (r) => <span className="font-medium">{r.id}</span> },
      { key: "invoiceId", header: "Invoice" },
      { key: "guardian", header: "Guardian" },
      { key: "reason", header: "Reason" },
      { key: "amount", header: "Amount", render: (r) => <span className="font-semibold">€{r.amount}</span> },
      { key: "requestedAt", header: "Requested", sortable: true },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <>
        <PageHeader title="Refunds" breadcrumbs={[{ label: "Finance", to: "/finance" }, { label: "Refunds" }]} description="Refund requests and approvals." />
        <div className="p-6"><DataTable columns={columns} data={refunds} searchKeys={["guardian", "id", "invoiceId"]} onAdd={() => {}} addLabel="New refund" /></div>
      </>
    );
  },
});
