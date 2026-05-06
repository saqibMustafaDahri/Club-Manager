import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { sessions, type Session } from "@/data/sessions";

export const Route = createFileRoute("/guardian/sessions")({
  component: () => {
    // pretend the guardian's children attend Football U10/U12 in Dublin North
    const data = sessions.filter((s) => s.location === "Dublin North");
    const columns: Column<Session>[] = [
      { key: "date", header: "Date", sortable: true, render: (r) => <span className="font-medium">{r.date}</span> },
      { key: "startTime", header: "Time", render: (r) => `${r.startTime} – ${r.endTime}` },
      { key: "programme", header: "Programme" },
      { key: "coach", header: "Coach" },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <>
        <PageHeader title="Upcoming sessions" breadcrumbs={[{ label: "Guardian", to: "/guardian" }, { label: "Sessions" }]} description="Sessions for Aria & Cian." />
        <div className="p-6"><DataTable columns={columns} data={data} searchKeys={["programme", "coach"]} /></div>
      </>
    );
  },
});
