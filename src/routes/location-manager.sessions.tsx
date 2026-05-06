import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockSessions, type MockSession } from "@/data/mockSessions";
import { mockParticipants } from "@/data/mockParticipants";

export const Route = createFileRoute("/location-manager/sessions")({
  component: SessionsPage,
});

const RIYADH_ID = "loc-riy";
const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function SessionsPage() {
  const [selected, setSelected] = useState<MockSession | null>(null);
  const sessions = mockSessions.filter((s) => s.locationId === RIYADH_ID);

  const columns: Column<MockSession>[] = [
    {
      key: "name", header: "Name", sortable: true,
      render: (r) => (
        <button type="button" onClick={() => setSelected(r)} className="font-medium hover:text-primary">
          {r.name}
        </button>
      ),
    },
    { key: "startDate", header: "Start" },
    { key: "endDate", header: "End" },
    { key: "baseFee", header: "Base Fee", render: (r) => SAR(r.baseFee) },
    { key: "enrolledCount", header: "Enrolled / Capacity", render: (r) => `${r.enrolledCount} / ${r.capacity}` },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status === "Open" ? "Active" : r.status === "Closed" ? "Completed" : "Scheduled"} /> },
    { key: "actions", header: "Actions", render: (r) => <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>View</Button> },
  ];

  return (
    <>
      <PageHeader
        title="My Sessions"
        description="Riyadh Academy"
        actions={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button disabled>Add Session</Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Contact Super Admin to create sessions</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />

      <div className="p-6">
        <DataTable
          data={sessions}
          columns={columns}
          searchKeys={["name"]}
          searchPlaceholder="Search sessions…"
        />
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>Riyadh Academy</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Start" value={selected.startDate} />
                  <Info label="End" value={selected.endDate} />
                  <Info label="Status" value={<StatusBadge status={selected.status === "Open" ? "Active" : selected.status === "Closed" ? "Completed" : "Scheduled"} />} />
                  <Info label="Capacity" value={`${selected.enrolledCount} / ${selected.capacity}`} />
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 text-sm font-semibold">Fee breakdown</h4>
                  <Row label="Base fee" value={SAR(selected.baseFee)} />
                  <Row label="Enrolled" value={mockParticipants.filter((p) => p.session === selected.name).length} />
                  <Row label="Projected revenue" value={SAR(selected.baseFee * selected.enrolledCount)} bold />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-muted/30 p-2.5">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
function Row({ label, value, bold }: { label: string; value: React.ReactNode; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}
