import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockLocations } from "@/data/mockLocations";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

const events = ["Registration", "Document Request", "Fee Invoice", "Payment Reminder", "Session Start"];
const gateways = [
  { name: "Moyasar", connected: true },
  { name: "PayTabs", connected: false },
  { name: "HyperPay", connected: false },
];

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" />
      <div className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
            <TabsTrigger value="localisation">Localisation</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <Card title="Academy Profile">
              <Field label="Academy Name"><Input defaultValue="Neomora Sports Academy" /></Field>
              <Field label="Default Currency">
                <Select defaultValue="SAR">
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">SAR — Saudi Riyal</SelectItem>
                    <SelectItem value="AED">AED — UAE Dirham</SelectItem>
                    <SelectItem value="USD">USD — US Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Timezone">
                <Select defaultValue="Asia/Riyadh">
                  <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="pt-2"><Button>Save Changes</Button></div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card title="Notification Channels">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="py-2">Event</th>
                    <th className="w-32 py-2 text-center">WhatsApp</th>
                    <th className="w-32 py-2 text-center">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev, i) => (
                    <tr key={ev} className="border-b last:border-0">
                      <td className="py-3 font-medium">{ev}</td>
                      <td className="py-3 text-center"><Switch defaultChecked={i % 2 === 0} /></td>
                      <td className="py-3 text-center"><Switch defaultChecked /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="gateways" className="mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {gateways.map((g) => (
                <div key={g.name} className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                    {g.name[0]}
                  </div>
                  <h3 className="mt-4 font-semibold">{g.name}</h3>
                  <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    g.connected ? "bg-success/10 text-success ring-success/20" : "bg-muted text-muted-foreground ring-border"
                  }`}>
                    {g.connected ? "Connected" : "Not Connected"}
                  </span>
                  <Button variant="outline" size="sm" className="mt-4 w-full">Configure</Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="localisation" className="mt-6">
            <Card title="Language">
              <Field label="Interface Language">
                <Select defaultValue="en">
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="space-y-3 pt-3">
                <Label>Default language per location</Label>
                <div className="space-y-2">
                  {mockLocations.map((l) => (
                    <div key={l.id} className="flex items-center justify-between rounded-md border p-3">
                      <span className="text-sm font-medium">{l.name}</span>
                      <Select defaultValue="en">
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
