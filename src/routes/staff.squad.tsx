import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Info } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockParticipants, type MockParticipant } from "@/data/mockParticipants";
import { getCoach } from "@/data/coachContext";

export const Route = createFileRoute("/staff/squad")({
  component: SquadPage,
});

const safeStatus = (s: string) =>
  s === "Active" ? "Active" : s === "On Hold" ? "On Hold" : "Active";

function SquadPage() {
  const coach = getCoach();
  const squad = mockParticipants.filter((p) => coach.squad.includes(p.fullName));
  const [selected, setSelected] = useState<MockParticipant | null>(null);

  const columns: Column<MockParticipant>[] = [
    {
      key: "fullName", header: "Participant", sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar text-xs font-semibold text-white">
            {r.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
          <span className="font-medium">{r.fullName}</span>
        </div>
      ),
    },
    { key: "age", header: "Age" },
    { key: "location", header: "Location" },
    { key: "session", header: "Session" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={safeStatus(r.status)} /> },
    { key: "joinedDate", header: "Joined" },
    {
      key: "actions", header: "",
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
          <Eye className="mr-2 h-3.5 w-3.5" /> View
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="My Squad" description={`${squad.length} participants assigned`} />
      <div className="space-y-6 p-6">
        <DataTable
          data={squad}
          columns={columns}
          searchKeys={["fullName"]}
          searchPlaceholder="Search squad…"
        />
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.fullName}</SheetTitle>
                <SheetDescription>{selected.uniqueId}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <Info2 label="Age" value={String(selected.age)} />
                      <Info2 label="Nationality" value={selected.nationality} />
                      <Info2 label="Location" value={selected.location} />
                      <Info2 label="Session" value={selected.session} />
                      <Info2 label="Status" value={<StatusBadge status={safeStatus(selected.status)} />} />
                      <Info2 label="Joined" value={selected.joinedDate} />
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-4">
                    {selected.documents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No documents on file.</p>
                    ) : (
                      <ul className="divide-y rounded-md border">
                        {selected.documents.map((d) => (
                          <li key={d.name} className="flex items-center justify-between px-3 py-2.5 text-sm">
                            <span className="font-medium">{d.name}</span>
                            <StatusBadge status={d.status === "Uploaded" ? "Approved" : d.status === "Missing" ? "Overdue" : "Pending"} />
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 flex items-start gap-2 rounded-md bg-blue-50 p-3 text-xs text-blue-900">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>Read-only view. Contact the academy office for document changes.</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Info2({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-muted/30 p-2.5">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
