import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { payments, type Payment } from "@/data/finance";

export const Route = createFileRoute("/finance/payments")({
  component: () => {
    const columns: Column<Payment>[] = [
      { key: "id", header: "Payment", sortable: true, render: (r) => <span className="font-medium">{r.id}</span> },
      { key: "invoiceId", header: "Invoice" },
      { key: "guardian", header: "Guardian" },
      { key: "method", header: "Method" },
      { key: "paidAt", header: "Date", sortable: true },
      { key: "amount", header: "Amount", render: (r) => <span className="font-semibold text-success">€{r.amount}</span> },
    ];
    return (
      <>
        <PageHeader title="Payments" breadcrumbs={[{ label: "Finance", to: "/finance" }, { label: "Payments" }]} description="Reconciled payments across all channels." />
        <div className="p-6"><DataTable columns={columns} data={payments} searchKeys={["id", "guardian", "invoiceId"]} searchPlaceholder="Search payments…" onAdd={() => {}} addLabel="Record payment" /></div>
      </>
    );
  },
});
