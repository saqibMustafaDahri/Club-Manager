import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const notes = [
  { id: "N-1", date: "2026-05-04", session: "Football U10 · Dublin North", body: "Worked on positional play. Liam stand-out in defence; Jakub absent. Plan finishing drills next week." },
  { id: "N-2", date: "2026-04-27", session: "Football U10 · Dublin North", body: "First touch under pressure session. Great energy from the new joiners. Need cones for next week." },
  { id: "N-3", date: "2026-04-20", session: "Football U10 · Dublin North", body: "Match-prep. Confirmed travel arrangements with parents via WhatsApp group." },
];

export const Route = createFileRoute("/staff/notes")({
  component: () => (
    <>
      <PageHeader title="Session notes" breadcrumbs={[{ label: "Coach", to: "/staff" }, { label: "Notes" }]} description="Log observations, plans, and follow-ups." />
      <div className="space-y-6 p-6">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold">New note</h2>
          <div className="mt-4 space-y-3">
            <div className="space-y-2"><Label>Session</Label><input className="w-full rounded-md border bg-background px-3 py-2 text-sm" defaultValue="Football U10 · Wed 6 May" /></div>
            <div className="space-y-2"><Label>Notes</Label><Textarea rows={5} placeholder="What did you work on? Anything to follow up?" /></div>
            <div className="flex justify-end gap-2"><Button variant="outline">Discard</Button><Button>Save note</Button></div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent notes</h2>
          {notes.map((n) => (
            <div key={n.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{n.session}</p>
                <span className="text-xs text-muted-foreground">{n.date}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{n.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  ),
});
