import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { communications, type Communication } from "@/data/communications";

export const Route = createFileRoute("/location-manager/messages")({
  component: () => {
    const data = communications.filter((c) => c.audience.includes("Dublin North") || c.audience.includes("All staff") || c.audience.includes("Football U10"));
    const columns: Column<Communication>[] = [
      { key: "channel", header: "Channel" },
      { key: "audience", header: "Audience", render: (r) => <span className="font-medium">{r.audience}</span> },
      { key: "subject", header: "Subject" },
      { key: "sentAt", header: "Sent" },
      { key: "delivered", header: "Delivered", render: (r) => `${r.delivered}/${r.recipients}` },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <>
        <PageHeader title="Messages" breadcrumbs={[{ label: "Location Manager", to: "/location-manager" }, { label: "Messages" }]} description="Communications targeted to Dublin North." />
        <div className="p-6"><DataTable columns={columns} data={data} searchKeys={["audience", "subject"]} onAdd={() => {}} addLabel="New message" /></div>
      </>
    );
  },
});
