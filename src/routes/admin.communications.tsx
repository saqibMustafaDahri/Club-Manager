import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { communications, type Communication } from "@/data/communications";

export const Route = createFileRoute("/admin/communications")({
  component: CommsPage,
});

const channelIcon = { Email: Mail, WhatsApp: MessageSquare, SMS: Phone };

const columns: Column<Communication>[] = [
  { key: "channel", header: "Channel", render: (r) => {
    const Icon = channelIcon[r.channel];
    return <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" />{r.channel}</span>;
  }},
  { key: "audience", header: "Audience", render: (r) => <span className="font-medium">{r.audience}</span> },
  { key: "subject", header: "Subject" },
  { key: "sentAt", header: "Sent", sortable: true },
  { key: "recipients", header: "Recipients" },
  { key: "delivered", header: "Delivered", render: (r) => `${r.delivered}/${r.recipients}` },
  { key: "opened", header: "Opened" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function CommsPage() {
  return (
    <>
      <PageHeader
        title="Communications"
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Communications" }]}
        description="Email, WhatsApp, and SMS campaigns across all audiences."
      />
      <div className="p-6">
        <DataTable
          columns={columns}
          data={communications}
          searchKeys={["audience", "subject", "channel"]}
          searchPlaceholder="Search messages…"
          onAdd={() => {}}
          addLabel="New message"
        />
      </div>
    </>
  );
}
