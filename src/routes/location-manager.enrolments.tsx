import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Download, Eye, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { enrolmentsApi, type Enrolment } from "@/api/enrolments";
import { participantsApi, type Participant } from "@/api/participants";
import { locationsApi, type Location } from "@/api/locations";
import { sessionsApi, type Session } from "@/api/sessions";

export const Route = createFileRoute("/location-manager/enrolments")({
  component: EnrolmentsPage,
});

function EnrolmentsPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Enrolment | null>(null);

  const [reEnrolOpen, setReEnrolOpen] = useState(false);
  const [reEnrolSelected, setReEnrolSelected] = useState<Enrolment | null>(null);
  const [reEnrolForm, setReEnrolForm] = useState({ sessionId: "", paymentPlanType: "" });
  const [reEnrolLoading, setReEnrolLoading] = useState(false);
  const [reEnrolError, setReEnrolError] = useState<string | null>(null);

  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [form, setForm] = useState({
    participantId: "", sessionId: "", locationId: "", paymentPlanType: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [eData, pData, lData, sData] = await Promise.all([
          enrolmentsApi.getAll(),
          participantsApi.getAll(),
          locationsApi.getAll(),
          sessionsApi.getAll(),
        ]);
        setEnrolments(eData);
        setParticipants(pData);
        setLocations(lData);
        setSessions(sData);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return enrolments.filter((e) => {
      const p = participants.find((part) => part.id === e.participantId);
      const fullName = p ? `${p.firstNameEn} ${p.lastNameEn}` : "";
      return !q || fullName.toLowerCase().includes(q);
    });
  }, [enrolments, participants, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.participantId) { setFormError("Please select a participant."); return; }
    if (!form.sessionId) { setFormError("Please select a session."); return; }
    if (!form.locationId) { setFormError("Please select a location."); return; }
    if (!form.paymentPlanType) { setFormError("Please select a payment plan type."); return; }
    setFormError(null);
    setFormLoading(true);
    try {
      const created = await enrolmentsApi.create(form);
      setEnrolments((prev) => [created, ...prev]);
      setForm({ participantId: "", sessionId: "", locationId: "", paymentPlanType: "" });
      setAddOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create enrolment.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleReEnrol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reEnrolSelected) return;
    if (!reEnrolForm.sessionId) { setReEnrolError("Please select a session."); return; }
    if (!reEnrolForm.paymentPlanType) { setReEnrolError("Please select a payment plan type."); return; }
    setReEnrolError(null);
    setReEnrolLoading(true);
    try {
      const updated = await enrolmentsApi.reEnrol(reEnrolSelected.id, reEnrolForm);
      setEnrolments((prev) => prev.map((en) => (en.id === updated.id ? updated : en)));
      setReEnrolForm({ sessionId: "", paymentPlanType: "" });
      setReEnrolOpen(false);
      setReEnrolSelected(null);
    } catch (err) {
      setReEnrolError(err instanceof Error ? err.message : "Failed to re-enrol.");
    } finally {
      setReEnrolLoading(false);
    }
  };

  const columns: Column<Enrolment>[] = [
    {
      key: "participant", header: "Participant",
      render: (r) => {
        const p = participants.find((part) => part.id === r.participantId);
        return p ? `${p.firstNameEn} ${p.lastNameEn}` : r.participantId;
      },
    },
    {
      key: "session", header: "Session",
      render: (r) => sessions.find((s) => s.id === r.sessionId)?.name ?? r.sessionId,
    },
    {
      key: "location", header: "Location",
      render: (r) => locations.find((l) => l.id === r.locationId)?.name ?? r.locationId,
    },
    { key: "paymentPlanType", header: "Payment Plan", render: (r) => r.paymentPlanType },
    {
      key: "status", header: "Status",
      render: (r) => <StatusBadge status={r.status || "Active"} />,
    },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSelected(r)} title="View Details">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {
            setReEnrolSelected(r);
            setReEnrolForm({ sessionId: "", paymentPlanType: "" });
            setReEnrolOpen(true);
          }} title="Re-enrol">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Enrolments"
        description={`${enrolments.length} total`}
        actions={
          <>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button onClick={() => setAddOpen(true)}>Add Enrolment</Button>
          </>
        }
      />

      <div className="p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading enrolments…</p>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</div>
        ) : (
          <DataTable
            data={filtered}
            columns={columns}
            searchPlaceholder="Quick search…"
            filters={
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search participant…" className="w-[220px]" />
            }
          />
        )}
      </div>

      {/* ── Detail Drawer with tabs ── */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader className="my-4">
            <SheetTitle>Enrolment Details</SheetTitle>
          </SheetHeader>
          {selected && (
            <EnrolmentDetail
              enrolment={selected}
              participants={participants}
              sessions={sessions}
              locations={locations}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* ── Add Enrolment Drawer ── */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader className="my-4">
            <SheetTitle>Add Enrolment</SheetTitle>
            <SheetDescription>Create a new enrolment.</SheetDescription>
          </SheetHeader>
          <form className="space-y-4 pb-6" onSubmit={handleCreate}>
            {formError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</div>
            )}
            <div className="space-y-1.5">
              <Label>Participant</Label>
              <Select value={form.participantId} onValueChange={(val) => setForm((f) => ({ ...f, participantId: val }))}>
                <SelectTrigger><SelectValue placeholder="Select participant" /></SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.firstNameEn} {p.lastNameEn} {p.uniqueId ? `(${p.uniqueId})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Select value={form.locationId} onValueChange={(val) => setForm((f) => ({ ...f, locationId: val, sessionId: "" }))}>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Session</Label>
              <Select value={form.sessionId} onValueChange={(val) => setForm((f) => ({ ...f, sessionId: val }))} disabled={!form.locationId}>
                <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
                <SelectContent>
                  {sessions
                    .filter((s) => s.locations.some((sl) => sl.locationId === form.locationId))
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment Plan Type</Label>
              <Select value={form.paymentPlanType} onValueChange={(val) => setForm((f) => ({ ...f, paymentPlanType: val }))}>
                <SelectTrigger><SelectValue placeholder="Select plan type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL">Full</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="SEASONAL">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={formLoading}>Cancel</Button>
              <Button type="submit" disabled={formLoading}>{formLoading ? "Creating…" : "Create Enrolment"}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* ── Re-enrol Drawer ── */}
      <Sheet open={reEnrolOpen} onOpenChange={setReEnrolOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="my-4">
            <SheetTitle>Re-enrol</SheetTitle>
            <SheetDescription>Re-enrol participant for a new session.</SheetDescription>
          </SheetHeader>
          <form className="space-y-4 pb-6" onSubmit={handleReEnrol}>
            {reEnrolError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{reEnrolError}</div>
            )}
            <div className="space-y-1.5">
              <Label>Session</Label>
              <Select value={reEnrolForm.sessionId} onValueChange={(val) => setReEnrolForm((f) => ({ ...f, sessionId: val }))}>
                <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
                <SelectContent>
                  {sessions
                    .filter((s) => reEnrolSelected && s.locations.some((sl) => sl.locationId === reEnrolSelected.locationId))
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment Plan Type</Label>
              <Select value={reEnrolForm.paymentPlanType} onValueChange={(val) => setReEnrolForm((f) => ({ ...f, paymentPlanType: val }))}>
                <SelectTrigger><SelectValue placeholder="Select plan type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL">Full</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="SEASONAL">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setReEnrolOpen(false)} disabled={reEnrolLoading}>Cancel</Button>
              <Button type="submit" disabled={reEnrolLoading}>{reEnrolLoading ? "Processing…" : "Re-enrol"}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ── Enrolment Detail with tabs ────────────────────────────────────────────────
function EnrolmentDetail({
  enrolment,
  participants,
  sessions,
  locations,
}: {
  enrolment: Enrolment;
  participants: Participant[];
  sessions: Session[];
  locations: Location[];
}) {
  const participant = participants.find((p) => p.id === enrolment.participantId);
  const session = sessions.find((s) => s.id === enrolment.sessionId);
  const location = locations.find((l) => l.id === enrolment.locationId);

  // ── Payment Plan form state ──────────────────────────────────────────────
  const [ppForm, setPpForm] = useState({
    planType: "MONTHLY" as "MONTHLY" | "QUARTERLY" | "CUSTOM",
    instalmentCount: "",
  });
  const [ppLoading, setPpLoading] = useState(false);
  const [ppError, setPpError] = useState<string | null>(null);
  const [ppSuccess, setPpSuccess] = useState(false);

  // ── Fee Override form state ──────────────────────────────────────────────
  const [feeForm, setFeeForm] = useState({ amount: "", reason: "" });
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [feeSuccess, setFeeSuccess] = useState(false);

  const handleAddPaymentPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ppForm.instalmentCount) { setPpError("Please enter instalment count."); return; }
    setPpError(null);
    setPpLoading(true);
    try {
      await enrolmentsApi.createPaymentPlan(enrolment.id, {
        planType: ppForm.planType,
        instalmentCount: Number(ppForm.instalmentCount),
      });
      setPpSuccess(true);
      setPpForm({ planType: "MONTHLY", instalmentCount: "" });
      setTimeout(() => setPpSuccess(false), 3000);
    } catch (err) {
      setPpError(err instanceof Error ? err.message : "Failed to add payment plan.");
    } finally {
      setPpLoading(false);
    }
  };

  const handleFeeOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeForm.amount) { setFeeError("Please enter an amount."); return; }
    if (!feeForm.reason) { setFeeError("Please enter a reason."); return; }
    setFeeError(null);
    setFeeLoading(true);
    try {
      await enrolmentsApi.setFeeOverride(enrolment.id, {
        amount: Number(feeForm.amount),
        reason: feeForm.reason,
      });
      setFeeSuccess(true);
      setFeeForm({ amount: "", reason: "" });
      setTimeout(() => setFeeSuccess(false), 3000);
    } catch (err) {
      setFeeError(err instanceof Error ? err.message : "Failed to set fee override.");
    } finally {
      setFeeLoading(false);
    }
  };

  return (
    <Tabs defaultValue="overview" className="mt-2">
      <TabsList className="w-full">
        <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
        {/* <TabsTrigger value="payment-plan" className="flex-1">Payment Plan</TabsTrigger> */}
        {/* <TabsTrigger value="fee-override" className="flex-1">Fee Override</TabsTrigger> */}
      </TabsList>

      {/* ── Overview ── */}
      <TabsContent value="overview" className="mt-4 space-y-3">
        <Info label="Participant" value={participant ? `${participant.firstNameEn} ${participant.lastNameEn}` : "—"} />
        <Info label="Session" value={session?.name ?? "—"} />
        <Info label="Location" value={location?.name ?? "—"} />
        <Info label="Payment Plan" value={enrolment.paymentPlanType} />
        <Info label="Status" value={<StatusBadge status={enrolment.status || "Active"} />} />
      </TabsContent>

      {/* ── Payment Plan ── */}
      {/* <TabsContent value="payment-plan" className="mt-4">
        <div className="rounded-lg border p-4 space-y-4">
          <h4 className="text-sm font-semibold">Add Payment Plan</h4>

          {ppError && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{ppError}</div>
          )}
          {ppSuccess && (
            <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600">
              Payment plan added successfully.
            </div>
          )}

          <form className="space-y-3" onSubmit={handleAddPaymentPlan}>
            <div className="space-y-1.5">
              <Label>Plan Type</Label>
              <Select
                value={ppForm.planType}
                onValueChange={(v) => setPpForm((f) => ({ ...f, planType: v as typeof f.planType }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Instalment Count</Label>
              <Input
                type="number"
                min={1}
                placeholder="3"
                value={ppForm.instalmentCount}
                onChange={(e) => setPpForm((f) => ({ ...f, instalmentCount: e.target.value }))}
                required
              />
            </div>

            <Button type="submit" size="sm" disabled={ppLoading} className="w-full">
              {ppLoading ? "Saving…" : "Save Payment Plan"}
            </Button>
          </form>
        </div>
      </TabsContent> */}

      {/* ── Fee Override ── */}
      {/* <TabsContent value="fee-override" className="mt-4">
        <div className="rounded-lg border p-4 space-y-4">
          <h4 className="text-sm font-semibold">Set Fee Override</h4>

          {feeError && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{feeError}</div>
          )}
          {feeSuccess && (
            <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600">
              Fee override set successfully.
            </div>
          )}

          <form className="space-y-3" onSubmit={handleFeeOverride}>
            <div className="space-y-1.5">
              <Label>Override Amount (SAR)</Label>
              <Input
                type="number"
                min={0}
                placeholder="1200"
                value={feeForm.amount}
                onChange={(e) => setFeeForm((f) => ({ ...f, amount: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Input
                placeholder="Family discount"
                value={feeForm.reason}
                onChange={(e) => setFeeForm((f) => ({ ...f, reason: e.target.value }))}
                required
              />
            </div>

            <Button type="submit" size="sm" disabled={feeLoading} className="w-full">
              {feeLoading ? "Saving…" : "Set Fee Override"}
            </Button>
          </form>
        </div>
      </TabsContent> */}
    </Tabs>
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