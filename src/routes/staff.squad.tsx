import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { participants, type Participant } from "@/data/participants";

export const Route = createFileRoute("/staff/squad")({
  component: () => {
    const data = participants.filter((p) => p.location === "Dublin North");
    const columns: Column<Participant>[] = [
      { key: "id", header: "ID" },
      { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
      { key: "age", header: "Age" },
      { key: "programme", header: "Programme" },
      { key: "guardianName", header: "Guardian" },
      { key: "guardianPhone", header: "Phone" },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <>
        <PageHeader title="Squad" breadcrumbs={[{ label: "Coach", to: "/staff" }, { label: "Squad" }]} description="Players you coach at Dublin North." />
        <div className="p-6"><DataTable columns={columns} data={data} searchKeys={["name", "guardianName"]} /></div>
      </>
    );
  },
});
