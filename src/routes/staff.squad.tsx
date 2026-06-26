import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, Info } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { participantsApi, type Participant } from "@/api/participants";

export const Route = createFileRoute("/staff/squad")({
  component: SquadPage,
});

function mapStatus(s: string): string {
  if (s === "INQUIRY") return "Inquiry";
  if (s === "DOCUMENTS_PENDING") return "DOCUMENTS PENDING";
  if (s === "FEE_PENDING") return "FEE PENDING";
  if (s === "ON_HOLD") return "On Hold";
  if (s === "ACTIVE") return "Active";
  if (s === "COMPLETED") return "Completed";
  if (s === "WITHDRAWN") return "Withdrawn";
  return s;
}
function SquadPage() {
  const [squad, setSquad] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Participant | null>(null);


  // Get logged-in staff user from localStorage
  const stored = localStorage.getItem("user");
  const staffUser = stored ? JSON.parse(stored) : null;
  const staffLocationId: string | null =
    staffUser?.locationId ?? staffUser?.location?.id ?? null;
  const staffLocationName: string | null =
    staffUser?.location?.name ?? staffUser?.locationName ?? null;

  useEffect(() => {
    participantsApi.getAll()
      .then((all) => {
        // Filter participants whose location matches the staff's assigned location
        const filtered = all.filter((p) => {
          const raw = p as any;

          // Match by locationId (most reliable)
          if (staffLocationId) {
            const pLocId =
              raw.locationId ??
              raw.location?.id ??
              null;
            if (pLocId && pLocId === staffLocationId) return true;
          }

          // Fallback: match by location name
          if (staffLocationName) {
            const pLocName =
              raw.location?.name ??
              raw.locationSlug ??
              null;
            if (
              pLocName &&
              pLocName.toLowerCase() === staffLocationName.toLowerCase()
            ) return true;
          }

          return false;
        });

        setSquad(filtered);
      })
      .catch((err) =>
        setApiError(err instanceof Error ? err.message : "Failed to load squad.")
      )
      .finally(() => setLoading(false));
  }, [staffLocationId, staffLocationName]);

  const columns: Column<Participant>[] = [
    {
      key: "firstNameEn", header: "Participant", sortable: true,
      render: (r) => {
        const fullName = `${r.firstNameEn} ${r.lastNameEn}`;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar text-xs font-semibold text-white">
              {fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
            <span className="font-medium">{fullName}</span>
          </div>
        );
      },
    },
    {
      key: "dateOfBirth", header: "Date of Birth",
      render: (r) => r.dateOfBirth ?? "—",
    },
    {
      key: "locationSlug", header: "Location",
      render: (r) => {
        const loc = (r as any).location;
        return loc?.name ?? r.locationSlug ?? "—";
      },
    },
    {
      key: "gender", header: "Gender",
      render: (r) => (
        <span className="capitalize">{r.gender?.toLowerCase() ?? "—"}</span>
      ),
    },
    {
      key: "status", header: "Status",
      render: (r) => <StatusBadge status={mapStatus(r.status ?? "")} />,
    },
    {
      key: "joinedDate", header: "Joined",
      render: (r) => {
        const raw = (r.joinedDate ?? r.createdAt) as string | undefined;
        if (!raw) return "—";
        return new Date(raw).toLocaleDateString("en-GB", {
          day: "2-digit", month: "short", year: "numeric",
        });
      },
    },
    {
      key: "actions", header: "",
      render: (r) => (
        <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => setSelected(r)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="My Squad"
        description={
          loading
            ? "Loading…"
            : staffLocationName
              ? `${squad.length} participants at ${staffLocationName}`
              : `${squad.length} participants assigned`
        }
      />

      <div className="space-y-6 p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading squad…</p>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {apiError}
          </div>
        ) : !staffLocationId && !staffLocationName ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No location assigned to your account. Please contact an administrator.
          </div>
        ) : squad.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No participants found at your assigned location.
          </p>
        ) : (
          <DataTable
            data={squad}
            columns={columns}
            searchKeys={["firstNameEn", "lastNameEn"]}
            searchPlaceholder="Search squad…"
          />
        )}
      </div>

      {/* ── Detail drawer ── */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.firstNameEn} {selected.lastNameEn}</SheetTitle>
                <SheetDescription>{selected.uniqueId ?? "—"}</SheetDescription>
              </SheetHeader>

              <div className="space-y-5 px-4 pb-6">
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="guardian">Guardian</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <InfoBox label="First Name" value={selected.firstNameEn} />
                      <InfoBox label="Last Name" value={selected.lastNameEn} />
                      <InfoBox label="Date of Birth" value={selected.dateOfBirth ?? "—"} />
                      <InfoBox label="Gender" value={
                        <span className="capitalize">{selected.gender?.toLowerCase() ?? "—"}</span>
                      } />
                      <InfoBox label="Location" value={
                        (selected as any).location?.name ?? selected.locationSlug ?? "—"
                      } />
                      <InfoBox label="Phone" value={selected.phone ?? "—"} />
                      <InfoBox label="Status" value={
                        <StatusBadge status={mapStatus(selected.status ?? "")} />
                      } />
                      <InfoBox label="Joined" value={(() => {
                        const raw = (selected.joinedDate ?? selected.createdAt) as string | undefined;
                        if (!raw) return "—";
                        return new Date(raw).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        });
                      })()} />
                    </div>
                  </TabsContent>

                  <TabsContent value="guardian" className="mt-4">
                    {!selected.guardian ? (
                      <p className="text-sm text-muted-foreground">No guardian on file.</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <InfoBox label="Guardian Name" value={selected.guardian.fullName ?? "—"} />
                        <InfoBox label="Relationship" value={selected.guardian.relationship ?? "—"} />
                        <InfoBox label="Guardian Phone" value={selected.guardian.phone ?? "—"} />
                        <InfoBox label="Guardian Email" value={selected.guardian.email ?? "—"} />
                      </div>
                    )}
                    <div className="mt-4 flex items-start gap-2 rounded-md bg-blue-50 p-3 text-xs text-blue-900">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>Read-only view. Contact the academy office for changes.</span>
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

function InfoBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-muted/30 p-2.5">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}