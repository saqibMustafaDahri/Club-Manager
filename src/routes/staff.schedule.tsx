import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { sessions, type Session } from "@/data/sessions";

export const Route = createFileRoute("/staff/schedule")({
  component: () => {
    const data = sessions.filter((s) => s.coach === "Mark Doyle");
    const columns: Column<Session>[] = [
      { key: "date", header: "Date", sortable: true, render: (r) => <span className="font-medium">{r.date}</span> },
      { key: "startTime", header: "Time", render: (r) => `${r.startTime} – ${r.endTime}` },
      { key: "programme", header: "Programme" },
      { key: "location", header: "Location" },
      { key: "enrolled", header: "Capacity", render: (r) => `${r.enrolled}/${r.capacity}` },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <>
        <PageHeader title="Schedule" breadcrumbs={[{ label: "Coach", to: "/staff" }, { label: "Schedule" }]} description="All your assigned sessions." />
        <div className="p-6"><DataTable columns={columns} data={data} searchKeys={["programme", "date"]} /></div>
      </>
    );
  },
});
