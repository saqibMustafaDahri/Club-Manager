import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { sessions, type Session } from "@/data/sessions";

export const Route = createFileRoute("/location-manager/sessions")({
  component: () => {
    const data = sessions.filter((s) => s.location === "Dublin North");
    const columns: Column<Session>[] = [
      { key: "id", header: "ID" },
      { key: "date", header: "Date", sortable: true, render: (r) => <span className="font-medium">{r.date}</span> },
      { key: "startTime", header: "Time", render: (r) => `${r.startTime} – ${r.endTime}` },
      { key: "programme", header: "Programme" },
      { key: "coach", header: "Coach" },
      { key: "enrolled", header: "Enrolled", render: (r) => `${r.enrolled} / ${r.capacity}` },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <>
        <PageHeader title="Sessions" breadcrumbs={[{ label: "Location Manager", to: "/location-manager" }, { label: "Sessions" }]} description="Schedule for Dublin North." />
        <div className="p-6"><DataTable columns={columns} data={data} searchKeys={["programme", "coach"]} onAdd={() => {}} addLabel="New session" /></div>
      </>
    );
  },
});
