import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { invoices, type Invoice } from "@/data/finance";

export const Route = createFileRoute("/finance/invoices")({
  component: () => {
    const columns: Column<Invoice>[] = [
      { key: "id", header: "Invoice", sortable: true, render: (r) => <span className="font-medium">{r.id}</span> },
      { key: "participant", header: "Participant" },
      { key: "guardian", header: "Guardian" },
      { key: "location", header: "Location" },
      { key: "issuedAt", header: "Issued", sortable: true },
      { key: "dueAt", header: "Due" },
      { key: "amount", header: "Amount", render: (r) => <span className="font-semibold">€{r.amount}</span> },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <>
        <PageHeader title="Invoices" breadcrumbs={[{ label: "Finance", to: "/finance" }, { label: "Invoices" }]} description="All issued invoices across the network." />
        <div className="p-6"><DataTable columns={columns} data={invoices} searchKeys={["id", "guardian", "participant", "location"]} searchPlaceholder="Search invoices…" onAdd={() => {}} addLabel="New invoice" /></div>
      </>
    );
  },
});
