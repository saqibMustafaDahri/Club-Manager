import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

const messages = [
  { id: 1, from: "Mark Doyle (Coach)", subject: "Saturday session moved to 11:00", preview: "Hi Niamh — quick note that Aria's Saturday session is now at 11:00…", time: "Yesterday", unread: true },
  { id: 2, from: "Dublin North · Admin", subject: "May fixtures schedule", preview: "Please find attached the May fixtures for both U10 and U12 squads.", time: "2 days ago", unread: true },
  { id: 3, from: "Finance · Neomora", subject: "Receipt for INV-2026-0480", preview: "Thanks for your payment of €180. Your receipt is attached.", time: "Apr 10", unread: false },
  { id: 4, from: "Mark Doyle (Coach)", subject: "Aria — great progress this week", preview: "Just wanted to flag that Aria's been brilliant in defence training this week.", time: "Apr 8", unread: false },
];

export const Route = createFileRoute("/guardian/messages")({
  component: () => (
    <>
      <PageHeader title="Messages" breadcrumbs={[{ label: "Guardian", to: "/guardian" }, { label: "Messages" }]} description="Inbox from coaches and the academy." actions={<Button>New message</Button>} />
      <div className="p-6">
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          {messages.map((m) => (
            <div key={m.id} className="flex cursor-pointer items-start gap-4 border-b px-5 py-4 last:border-0 hover:bg-muted/40">
              <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.unread ? "bg-brand" : "bg-transparent"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className={`truncate text-sm ${m.unread ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>{m.from}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{m.time}</span>
                </div>
                <p className="mt-0.5 truncate text-sm font-medium">{m.subject}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{m.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  ),
});
