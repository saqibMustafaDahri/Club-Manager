import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
import { sessionsApi, type Session } from "@/api/sessions";
import { locationsApi } from "@/api/locations";
import { enrolmentsApi } from "@/api/enrolments";

export const Route = createFileRoute("/location-manager/sessions")({
  component: SessionsPage,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

const toBadgeStatus = (s: string) => {
  if (s === "OPEN") return "OPEN";
  if (s === "CLOSED") return "CLOSED";
  return "DRAFT";
};

const formatDate = (raw: string | null | undefined): string => {
  if (!raw || raw === "—") return "—";
  return new Date(raw).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

function SessionsPage() {
  const [selected, setSelected] = useState<Session | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const myLocationId = user?.locationId ?? user?.location?.id ?? user?.locationAccess ?? null;

        console.log("[DEBUG] Logged-in user:", JSON.stringify(user, null, 2));
        console.log("[DEBUG] myLocationId:", myLocationId);

        // Approach 1: Fetch all sessions, then filter to those linked to this manager's location
        const [allSessions, allEnrolments, allLocations] = await Promise.all([
          sessionsApi.getAll(),
          enrolmentsApi.getAll(),
          locationsApi.getAll()
        ]);
        console.log("[DEBUG] All sessions count:", allSessions.length);
        console.log("[DEBUG] First session:", JSON.stringify(allSessions[0], null, 2));

        let mySessions: Session[] = [];

        if (myLocationId) {
          const myLocData = allLocations.find(l => l.id === myLocationId);
          const myLocCapacity = myLocData?.capacity ?? 0;

          mySessions = allSessions.filter((s: any) =>
            s.locations?.some((sl: any) => sl.locationId === myLocationId) ||
            s.sessionLocations?.some((sl: any) => sl.locationId === myLocationId) ||
            s.locationId === myLocationId
          ).map((s: any) => {
            const enrolled = allEnrolments.filter(e => e.sessionId === s.id && e.locationId === myLocationId);

            // Calculate total session capacity across all locations
            const totalCapacity = (s.locations ?? []).reduce((acc: number, loc: any) => {
              const lData = allLocations.find((l) => l.id === loc.locationId);
              return acc + (lData?.capacity ?? 0);
            }, 0) || (s.capacity ?? 0);

            return {
              ...s,
              enrolledCount: enrolled.length,
              capacity: myLocCapacity, // Specific to this location
              totalCapacity: totalCapacity // Session overall
            };
          });
        }

        console.log("[DEBUG] Filtered sessions (approach 1):", mySessions.length);

        // Approach 2 (fallback): If sessions API filtering gives 0 results,
        // try extracting sessions directly from the locations API response
        if (mySessions.length === 0) {
          console.log("[DEBUG] All locations count:", allLocations.length);
          console.log("[DEBUG] First location keys:", allLocations[0] ? Object.keys(allLocations[0]) : []);
          console.log("[DEBUG] First location full:", JSON.stringify(allLocations[0], null, 2));

          // Find the manager's own location(s)
          const myLocations = allLocations.filter((loc: any) => {
            if (myLocationId && loc.id === myLocationId) return true;
            // Also check if user is in the location's `users` array
            if (loc.users && Array.isArray(loc.users)) {
              return loc.users.some((u: any) => u.id === user?.id || u === user?.id);
            }
            return false;
          });

          console.log("[DEBUG] My locations:", myLocations.length);

          // Extract sessions from inside the location object
          const extractedSessions = myLocations.flatMap((loc: any) => {
            const raw = loc.session_location ?? loc.sessionLocations ?? loc.sessions ?? [];
            console.log("[DEBUG] Sessions inside location", loc.id, ":", raw.length, JSON.stringify(raw[0], null, 2));
            return raw.map((sl: any) => {
              const sessionId = sl.session?.id ?? sl.id ?? sl.sessionId;
              const enrolled = allEnrolments.filter(e => e.sessionId === sessionId && e.locationId === myLocationId);
              const myLocData = allLocations.find(l => l.id === myLocationId);
              return {
                // The nested session might be the session itself or contain a `session` key
                id: sessionId,
                name: sl.session?.name ?? sl.name ?? "—",
                startDate: sl.session?.startDate ?? sl.startDate ?? "—",
                endDate: sl.session?.endDate ?? sl.endDate ?? "—",
                baseFee: sl.session?.baseFee ?? sl.feeOverride ?? sl.baseFee ?? 0,
                capacity: myLocData?.capacity ?? sl.session?.capacity ?? sl.capacity ?? 0,
                totalCapacity: sl.session?.capacity ?? 0,
                enrolledCount: enrolled.length,
                status: sl.session?.status ?? sl.status ?? "OPEN",
                locations: [],
              };
            });
          });

          mySessions = extractedSessions;
          console.log("[DEBUG] Extracted sessions (approach 2):", mySessions.length);
        }

        setSessions(mySessions);
      } catch (err) {
        console.error("[DEBUG] Error fetching sessions:", err);
        setApiError(err instanceof Error ? err.message : "Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchMySessions();
  }, []);

  const columns: Column<Session>[] = [
    {
      key: "name", header: "Name", sortable: true,
      render: (r) => (
        <button type="button" onClick={() => setSelected(r)} className="font-medium hover:text-primary">
          {r.name}
        </button>
      ),
    },
    { key: "startDate", header: "Start", render: (r) => formatDate(r.startDate) },
    { key: "endDate", header: "End", render: (r) => formatDate(r.endDate) },
    { key: "baseFee", header: "Base Fee", render: (r) => SAR(r.baseFee) },
    { key: "enrolledCount", header: "Enrolled / Capacity", render: (r) => `${r.enrolledCount ?? 0} / ${r.capacity ?? "—"}` },
    // { key: "totalCapacity", header: "Total Session Cap", render: (r) => (r as any).totalCapacity ?? r.capacity ?? "—" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={toBadgeStatus(r.status)} /> },
    { key: "actions", header: "Actions", render: (r) => <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>View</Button> },
  ];

  return (
    <>
      <PageHeader
        title="My Sessions"
        description="Location Sessions"
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
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading sessions…</p>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {apiError}
          </div>
        ) : (
          <DataTable
            data={sessions}
            columns={columns}
            searchKeys={["name"]}
            searchPlaceholder="Search sessions…"
          />
        )}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>Location Session</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Start" value={formatDate(selected.startDate)} />
                  <Info label="End" value={formatDate(selected.endDate)} />
                  <Info label="Status" value={<StatusBadge status={toBadgeStatus(selected.status)} />} />
                  <Info label="Location Capacity" value={`${selected.enrolledCount ?? 0} / ${selected.capacity ?? "—"}`} />
                  <Info label="Total Session Capacity" value={(selected as any).totalCapacity ?? selected.capacity ?? "—"} />
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 text-sm font-semibold">Fee breakdown</h4>
                  <Row label="Base fee" value={SAR(selected.baseFee)} />
                  <Row label="Enrolled" value={selected.enrolledCount ?? 0} />
                  <Row label="Projected revenue" value={SAR(selected.baseFee * (selected.enrolledCount ?? 0))} bold />
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
