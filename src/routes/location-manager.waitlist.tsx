import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowUp, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { mockParticipants } from "@/data/mockParticipants";

export const Route = createFileRoute("/location-manager/waitlist")({
  component: WaitlistPage,
});

interface WaitlistEntry {
  id: string;
  position: number;
  fullName: string;
  guardianPhone: string;
  session: string;
  dateAdded: string;
  hoursLeft: number;
  minutesLeft: number;
}

const RIYADH_NAME = "Riyadh Academy";

// Build mock waitlist from inquiries at Riyadh
const inquiries = mockParticipants.filter(
  (p) => p.location === RIYADH_NAME && (p.status === "Inquiry" || p.status === "Documents Pending"),
);

// Pad to ensure we always have several rows
const seed = [
  { name: "Reema Al-Nasser", phone: "+966 50 145 9988", session: "Fall 2025", added: "2025-12-01", hLeft: 47, mLeft: 12 },
  { name: "Bader Al-Salem", phone: "+966 55 220 7766", session: "Annual Enrolment 2026", added: "2025-12-02", hLeft: 34, mLeft: 5 },
  { name: "Tameem Al-Faris", phone: "+966 56 901 4422", session: "Fall 2025", added: "2025-12-02", hLeft: 21, mLeft: 48 },
];

const generated: WaitlistEntry[] = inquiries.map((p, i) => ({
  id: `wl-${p.id}`,
  position: i + 1,
  fullName: p.fullName,
  guardianPhone: p.guardianPhone,
  session: p.session,
  dateAdded: p.joinedDate,
  hoursLeft: 47 - i * 6,
  minutesLeft: 12 + i * 7,
}));

const seedEntries: WaitlistEntry[] = seed.map((s, i) => ({
  id: `wl-seed-${i}`,
  position: generated.length + i + 1,
  fullName: s.name,
  guardianPhone: s.phone,
  session: s.session,
  dateAdded: s.added,
  hoursLeft: s.hLeft,
  minutesLeft: s.mLeft,
}));

const waitlist = [...generated, ...seedEntries];

function WaitlistPage() {
  const columns: Column<WaitlistEntry>[] = [
    { key: "position", header: "#", render: (r) => <span className="font-mono text-sm">#{r.position}</span> },
    { key: "fullName", header: "Participant", sortable: true },
    { key: "guardianPhone", header: "Guardian Phone" },
    { key: "session", header: "Session Applied For" },
    { key: "dateAdded", header: "Date Added", sortable: true },
    {
      key: "window", header: "Acceptance Window",
      render: (r) => {
        const ok = r.hoursLeft > 12;
        return (
          <span className={ok ? "text-success" : "text-warning"}>
            {Math.max(r.hoursLeft, 0)}h {Math.max(r.minutesLeft, 0)}m remaining
          </span>
        );
      },
    },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button
            variant="ghost" size="sm"
            onClick={() => toast.success(`${r.fullName} has been promoted from the waitlist and notified.`)}
          >
            <ArrowUp className="mr-1 h-4 w-4" /> Promote
          </Button>
          <Button variant="ghost" size="sm">
            <X className="mr-1 h-4 w-4" /> Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Waitlist" description="Riyadh Academy" />
      <div className="p-6">
        <DataTable
          data={waitlist}
          columns={columns}
          searchKeys={["fullName", "session"]}
          searchPlaceholder="Search waitlist…"
        />
      </div>
    </>
  );
}
