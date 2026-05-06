import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { mockPayments, type MockPayment } from "@/data/mockPayments";

export const Route = createFileRoute("/finance/reminders")({
  component: RemindersPage,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function RemindersPage() {
  const [r7, setR7] = useState(true);
  const [r1, setR1] = useState(true);
  const [r0, setR0] = useState(true);
  const [whatsapp, setWhatsapp] = useState(true);
  const [email, setEmail] = useState(true);

  const due = mockPayments.filter((p) => p.balance > 0);

  const channelLabel = () => {
    const c: string[] = [];
    if (whatsapp) c.push("WhatsApp");
    if (email) c.push("Email");
    return c.length ? c.join(" and ") : "no channels";
  };

  const sendOne = (p: MockPayment) => {
    if (!whatsapp && !email) {
      toast.error("Enable at least one channel");
      return;
    }
    toast.success(`Reminder sent to ${p.participantName} via ${channelLabel()}`);
  };

  const sendAll = () => {
    if (!whatsapp && !email) {
      toast.error("Enable at least one channel");
      return;
    }
    toast.success(`Reminders sent to ${due.length} participants`);
  };

  const columns: Column<MockPayment>[] = [
    { key: "participantName", header: "Participant", sortable: true },
    { key: "balance", header: "Balance", render: (r) => SAR(r.balance) },
    { key: "nextDueDate", header: "Due Date", sortable: true },
    { key: "lastPaymentDate", header: "Last Reminded", render: (r) => r.lastPaymentDate === "—" ? "Never" : r.lastPaymentDate },
    { key: "channel", header: "Channel", render: () => channelLabel() },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => sendOne(r)}>
          <Send className="mr-2 h-3.5 w-3.5" /> Send Now
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Payment Reminders"
        actions={
          <Button onClick={sendAll} className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Send className="mr-2 h-4 w-4" /> Send All Reminders
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Default Reminder Schedule</h3>
          <p className="mb-4 text-xs text-muted-foreground">Automatic reminders sent based on the due date.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <ToggleRow label="7 days before due date" checked={r7} onChange={setR7} />
              <ToggleRow label="1 day before due date" checked={r1} onChange={setR1} />
              <ToggleRow label="On due date" checked={r0} onChange={setR0} />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Channels</p>
              <ToggleRow label="WhatsApp" checked={whatsapp} onChange={setWhatsapp} />
              <ToggleRow label="Email" checked={email} onChange={setEmail} />
            </div>
          </div>
        </div>

        <DataTable
          data={due}
          columns={columns}
          searchKeys={["participantName"]}
          searchPlaceholder="Search participants…"
        />
      </div>
    </>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <Label className="text-sm">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
