import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { guardianInvoices, type GuardianInvoice } from "@/data/guardian";

export const Route = createFileRoute("/guardian/payments")({
  component: () => {
    const columns: Column<GuardianInvoice>[] = [
      { key: "id", header: "Invoice", render: (r) => <span className="font-medium">{r.id}</span> },
      { key: "child", header: "Child" },
      { key: "description", header: "Description" },
      { key: "dueAt", header: "Due", sortable: true },
      { key: "amount", header: "Amount", render: (r) => <span className="font-semibold">€{r.amount}</span> },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
      { key: "actions", header: "", render: (r) => r.status !== "Paid" ? <Button size="sm">Pay now</Button> : <Button size="sm" variant="outline">Receipt</Button> },
    ];
    return (
      <>
        <PageHeader title="Payments" breadcrumbs={[{ label: "Guardian", to: "/guardian" }, { label: "Payments" }]} description="Your invoices and payment history." />
        <div className="p-6"><DataTable columns={columns} data={guardianInvoices} searchKeys={["id", "child", "description"]} /></div>
      </>
    );
  },
});
