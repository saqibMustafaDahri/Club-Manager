import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockMessages, type RecipientGroup } from "@/data/mockMessages";
import { mockParticipants } from "@/data/mockParticipants";

export const Route = createFileRoute("/location-manager/communications")({
  component: CommunicationsPage,
});

const RIYADH_NAME = "Riyadh Academy";

const groupCount: Record<RecipientGroup, number> = {
  "All Participants": mockParticipants.filter((p) => p.location === RIYADH_NAME).length,
  "Active Only": mockParticipants.filter((p) => p.location === RIYADH_NAME && p.status === "Active").length,
  "Pending Fees": mockParticipants.filter((p) => p.location === RIYADH_NAME && p.status === "Fee Pending").length,
  "By Session": mockParticipants.filter((p) => p.location === RIYADH_NAME && p.session === "Fall 2025").length,
};

function CommunicationsPage() {
  const [group, setGroup] = useState<RecipientGroup>("All Participants");
  const [whatsapp, setWhatsapp] = useState(true);
  const [email, setEmail] = useState(true);
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const count = groupCount[group];
    toast.success(`Announcement sent to ${count} participants`);
    setMessage("");
  };

  return (
    <>
      <PageHeader
        title="Communications"
        description="Riyadh Academy"
        actions={<Button>Send Announcement</Button>}
      />
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        {/* Sent history */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="text-base font-semibold">Sent Messages</h2>
            <p className="text-xs text-muted-foreground">{mockMessages.length} announcements</p>
          </div>
          <ul className="divide-y">
            {mockMessages.map((m) => (
              <li key={m.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{m.recipientGroup}</p>
                      <span className="text-xs text-muted-foreground">• {m.recipientCount} recipients</span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{m.preview}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{m.channel} • {m.sentDate}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* New announcement */}
        <form
          onSubmit={handleSend}
          className="rounded-xl border bg-card p-5 shadow-sm"
        >
          <h2 className="text-base font-semibold">Send New Announcement</h2>
          <p className="text-xs text-muted-foreground">Reach participants by WhatsApp or Email.</p>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label>To</Label>
              <Select value={group} onValueChange={(v) => setGroup(v as RecipientGroup)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Participants">All Participants ({groupCount["All Participants"]})</SelectItem>
                  <SelectItem value="Active Only">Active Only ({groupCount["Active Only"]})</SelectItem>
                  <SelectItem value="Pending Fees">Pending Fees ({groupCount["Pending Fees"]})</SelectItem>
                  <SelectItem value="By Session">By Session ({groupCount["By Session"]})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Channel</Label>
              <div className="flex gap-4 rounded-md border p-3">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={whatsapp} onCheckedChange={(v) => setWhatsapp(!!v)} /> WhatsApp
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={email} onCheckedChange={(v) => setEmail(!!v)} /> Email
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your announcement…"
                rows={6}
              />
            </div>

            <Button type="submit" disabled={!message.trim() || (!whatsapp && !email)}>
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
