import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Settings" }]}
        description="Organisation-wide configuration."
      />
      <div className="space-y-6 p-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold">Organisation</h2>
          <p className="text-xs text-muted-foreground">Public details shown to guardians.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Organisation name</Label><Input defaultValue="Neomora Academy" /></div>
            <div className="space-y-2"><Label>Support email</Label><Input defaultValue="hello@neomora.com" /></div>
            <div className="space-y-2"><Label>Default currency</Label><Input defaultValue="EUR" /></div>
            <div className="space-y-2"><Label>Default timezone</Label><Input defaultValue="Europe/Dublin" /></div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold">Notifications</h2>
          <div className="mt-4 space-y-4">
            {[
              { label: "Send payment reminders 3 days before due", on: true },
              { label: "Notify managers of new enrolments", on: true },
              { label: "Weekly performance digest", on: false },
              { label: "WhatsApp delivery reports", on: true },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-sm">{row.label}</span>
                <Switch defaultChecked={row.on} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </div>
      </div>
    </>
  );
}
