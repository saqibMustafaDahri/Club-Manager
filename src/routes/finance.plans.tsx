import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  CalendarClock, CalendarDays, Coins, Eye, Plus, ChevronLeft,
  CreditCard, BadgePercent, Search, CheckCircle2, Loader2, AlertCircle,
} from "lucide-react";
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
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { enrolmentsApi, type Enrolment } from "@/api/enrolments";
import { participantsApi, type Participant } from "@/api/participants";
import { sessionsApi, type Session } from "@/api/sessions";
import { locationsApi, type Location } from "@/api/locations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance/plans")({
  component: PlansPage,
});

const SAR = (n: number) => `SAR ${(n ?? 0).toLocaleString()}`;

type WizardStep = "select-enrolment" | "select-action" | "payment-plan" | "fee-override";

function PlansPage() {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [eData, pData, sData, lData] = await Promise.all([
          enrolmentsApi.getAll(),
          participantsApi.getAll(),
          sessionsApi.getAll(),
          locationsApi.getAll(),
        ]);
        setEnrolments(eData);
        setParticipants(pData);
        setSessions(sData);
        setLocations(lData);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Lookup helpers ───────────────────────────────────────────────────────────
  const participantName = (id: string) => {
    const p = participants.find((x) => x.id === id);
    return p ? `${p.firstNameEn} ${p.lastNameEn}` : "—";
  };
  const sessionName = (id: string) => sessions.find((s) => s.id === id)?.name ?? "—";
  const locationName = (id: string) => locations.find((l) => l.id === id)?.name ?? "—";
  const sessionFee = (id: string) => sessions.find((s) => s.id === id)?.baseFee ?? 0;

  // ── Plan filter ──────────────────────────────────────────────────────────────
  const [planFilter, setPlanFilter] = useState<string>("all");

  // Plan counts from real data
  const byPlan = (plan: string) =>
    enrolments.filter((e) => e.paymentPlanType?.toUpperCase() === plan.toUpperCase());

  const fullCount = byPlan("FULL").length;
  const monthlyCount = byPlan("MONTHLY").length;
  const seasonalCount = byPlan("SEASONAL").length;

  const filtered = useMemo(() => {
    if (planFilter === "all") return enrolments;
    return enrolments.filter(
      (e) => e.paymentPlanType?.toUpperCase() === planFilter.toUpperCase()
    );
  }, [enrolments, planFilter]);

  // ── Row-level detail drawer ──────────────────────────────────────────────────
  const [selected, setSelected] = useState<Enrolment | null>(null);

  // ── Header wizard ────────────────────────────────────────────────────────────
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>("select-enrolment");
  const [wizardEnrolment, setWizardEnrolment] = useState<Enrolment | null>(null);
  const [enrolSearch, setEnrolSearch] = useState("");

  const openWizard = () => {
    setWizardStep("select-enrolment");
    setWizardEnrolment(null);
    setEnrolSearch("");
    setWizardOpen(true);
  };

  // Search in wizard
  const enrolResults = useMemo(() => {
    const q = enrolSearch.toLowerCase().trim();
    if (!q) return enrolments.slice(0, 8);
    return enrolments.filter((e) => {
      const name = participantName(e.participantId).toLowerCase();
      const sName = sessionName(e.sessionId).toLowerCase();
      const lName = locationName(e.locationId).toLowerCase();
      return name.includes(q) || sName.includes(q) || lName.includes(q);
    });
  }, [enrolSearch, enrolments, participants, sessions, locations]);

  // ── Table columns ────────────────────────────────────────────────────────────
  const columns: Column<Enrolment>[] = [
    {
      key: "participant",
      header: "Participant",
      sortable: true,
      render: (r) => participantName(r.participantId),
    },
    {
      key: "session",
      header: "Session",
      render: (r) => sessionName(r.sessionId),
    },
    {
      key: "location",
      header: "Location",
      render: (r) => locationName(r.locationId),
    },
    {
      key: "paymentPlanType",
      header: "Plan",
      render: (r) => r.paymentPlanType || "—",
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status || "Active"} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelected(r)}
          title="View & Manage"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const planFilterEl = (
    <Select value={planFilter} onValueChange={setPlanFilter}>
      <SelectTrigger className="w-[160px]"><SelectValue placeholder="Plan" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Plans</SelectItem>
        <SelectItem value="FULL">Full</SelectItem>
        <SelectItem value="MONTHLY">Monthly</SelectItem>
        <SelectItem value="SEASONAL">Seasonal</SelectItem>
      </SelectContent>
    </Select>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <PageHeader
        title="Payment Plans"
        actions={
          <Button onClick={openWizard} className="gap-2" disabled={loading}>
            <Plus className="h-4 w-4" />
            Manage Enrolment
          </Button>
        }
      />

      <div className="space-y-6 p-6">
        {/* ── Plan summary cards ── */}
        <div className="grid gap-4 md:grid-cols-3">
          <PlanCard
            title="Full Payment"
            subtitle="One-time"
            icon={Coins}
            metric={`${fullCount} enrolments`}
            secondary="Full upfront payment"
            onClick={() => setPlanFilter("FULL")}
            active={planFilter === "FULL"}
          />
          <PlanCard
            title="Monthly"
            subtitle="Recurring"
            icon={CalendarClock}
            metric={`${monthlyCount} enrolments`}
            secondary="Monthly instalment plan"
            onClick={() => setPlanFilter("MONTHLY")}
            active={planFilter === "MONTHLY"}
          />
          <PlanCard
            title="Seasonal"
            subtitle="Per season"
            icon={CalendarDays}
            metric={`${seasonalCount} enrolments`}
            secondary="Seasonal payment plan"
            onClick={() => setPlanFilter("SEASONAL")}
            active={planFilter === "SEASONAL"}
          />
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading enrolments…</span>
          </div>
        ) : apiError ? (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {apiError}
          </div>
        ) : (
          <DataTable
            data={filtered}
            columns={columns}
            searchKeys={["participantId"]}
            searchPlaceholder="Search enrolments…"
            filters={planFilterEl}
          />
        )}
      </div>

      {/* ── Row-level detail drawer (eye icon) ── */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="my-4">
            <SheetTitle>Enrolment Management</SheetTitle>
          </SheetHeader>
          {selected && (
            <EnrolmentManageDetail
              enrolment={selected}
              participantName={participantName(selected.participantId)}
              sessionName={sessionName(selected.sessionId)}
              locationName={locationName(selected.locationId)}
              baseFee={sessionFee(selected.sessionId)}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* ── Header wizard ── */}
      <Sheet open={wizardOpen} onOpenChange={(o) => { if (!o) setWizardOpen(false); }}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="my-4">
            <SheetTitle className="flex items-center gap-2">
              {wizardStep !== "select-enrolment" && (
                <button
                  onClick={() =>
                    setWizardStep(
                      wizardStep === "select-action" ? "select-enrolment" : "select-action"
                    )
                  }
                  className="rounded-md p-1 hover:bg-muted transition-colors"
                  title="Back"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              {wizardStep === "select-enrolment" && "Select Enrolment"}
              {wizardStep === "select-action" && "Choose Action"}
              {wizardStep === "payment-plan" && "Add Payment Plan"}
              {wizardStep === "fee-override" && "Set Fee Override"}
            </SheetTitle>
            <SheetDescription>
              {wizardStep === "select-enrolment" && "Search and select an enrolment to manage."}
              {wizardStep === "select-action" && wizardEnrolment &&
                `Managing: ${participantName(wizardEnrolment.participantId)} — ${sessionName(wizardEnrolment.sessionId)}`}
              {wizardStep === "payment-plan" && wizardEnrolment &&
                `For: ${participantName(wizardEnrolment.participantId)}`}
              {wizardStep === "fee-override" && wizardEnrolment &&
                `For: ${participantName(wizardEnrolment.participantId)}`}
            </SheetDescription>
          </SheetHeader>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {(["select-enrolment", "select-action", "payment-plan"] as WizardStep[]).map((step, i) => {
              const order: Record<WizardStep, number> = {
                "select-enrolment": 0, "select-action": 1,
                "payment-plan": 2, "fee-override": 2,
              };
              const cur = order[wizardStep];
              const idx = order[step];
              return (
                <div key={step} className="flex items-center gap-2">
                  <div className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    idx < cur ? "bg-brand text-white" :
                    idx === cur ? "bg-brand/90 text-white ring-2 ring-brand/30" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {idx < cur ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={cn("text-xs",
                    idx === cur ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {step === "select-enrolment" ? "Select" : step === "select-action" ? "Action" : "Configure"}
                  </span>
                  {i < 2 && <div className="h-px w-6 bg-border" />}
                </div>
              );
            })}
          </div>

          {/* Step 1: Select Enrolment */}
          {wizardStep === "select-enrolment" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search by participant, session or location…"
                  value={enrolSearch}
                  onChange={(e) => setEnrolSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {enrolResults.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No enrolments found.</p>
                )}
                {enrolResults.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      setWizardEnrolment(e);
                      setWizardStep("select-action");
                    }}
                    className="w-full rounded-lg border bg-card p-3.5 text-left transition-all hover:shadow-md hover:border-brand/40 hover:bg-brand/5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{participantName(e.participantId)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {sessionName(e.sessionId)} · {locationName(e.locationId)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StatusBadge status={e.status || "Active"} />
                        <span className="text-xs text-muted-foreground">{e.paymentPlanType || "—"}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Action */}
          {wizardStep === "select-action" && wizardEnrolment && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/40 border p-3.5 space-y-1">
                <p className="text-sm font-semibold">{participantName(wizardEnrolment.participantId)}</p>
                <p className="text-xs text-muted-foreground">
                  {sessionName(wizardEnrolment.sessionId)} · {locationName(wizardEnrolment.locationId)}
                </p>
                <p className="text-xs pt-1">Plan: <strong>{wizardEnrolment.paymentPlanType || "—"}</strong></p>
              </div>

              <p className="text-sm text-muted-foreground">What would you like to do?</p>

              <div className="grid gap-3">
                <button
                  onClick={() => setWizardStep("payment-plan")}
                  className="group flex items-start gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md hover:border-brand/40 hover:bg-brand/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20 transition-colors">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Add Payment Plan</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Set up monthly, quarterly or custom instalment schedule.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setWizardStep("fee-override")}
                  className="group flex items-start gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md hover:border-amber-400/40 hover:bg-amber-500/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/20 transition-colors">
                    <BadgePercent className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Set Fee Override</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Override the standard fee with a custom amount and reason.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3a: Payment Plan */}
          {wizardStep === "payment-plan" && wizardEnrolment && (
            <WizardPaymentPlanForm
              enrolment={wizardEnrolment}
              displayName={participantName(wizardEnrolment.participantId)}
              sessionLabel={sessionName(wizardEnrolment.sessionId)}
              baseFee={sessionFee(wizardEnrolment.sessionId)}
              onDone={() => setWizardOpen(false)}
            />
          )}

          {/* Step 3b: Fee Override */}
          {wizardStep === "fee-override" && wizardEnrolment && (
            <WizardFeeOverrideForm
              enrolment={wizardEnrolment}
              displayName={participantName(wizardEnrolment.participantId)}
              sessionLabel={sessionName(wizardEnrolment.sessionId)}
              baseFee={sessionFee(wizardEnrolment.sessionId)}
              onDone={() => setWizardOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

// ── Wizard: Payment Plan ────────────────────────────────────────────────────
function WizardPaymentPlanForm({
  enrolment, displayName, sessionLabel, baseFee, onDone,
}: {
  enrolment: Enrolment;
  displayName: string;
  sessionLabel: string;
  baseFee: number;
  onDone: () => void;
}) {
  const [ppForm, setPpForm] = useState({
    planType: "FULL" as "FULL" | "MONTHLY" | "SEASONAL",
    instalmentCount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ppForm.instalmentCount) { setError("Please enter instalment count."); return; }
    setError(null);
    setLoading(true);
    try {
      await enrolmentsApi.createPaymentPlan(enrolment.id, {
        planType: ppForm.planType,
        instalmentCount: Number(ppForm.instalmentCount),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add payment plan.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-lg">Payment Plan Added!</p>
          <p className="text-sm text-muted-foreground mt-1">
            {ppForm.planType.charAt(0) + ppForm.planType.slice(1).toLowerCase()} plan with{" "}
            {ppForm.instalmentCount} instalments saved for <strong>{displayName}</strong>.
          </p>
        </div>
        <Button onClick={onDone} className="mt-2">Done</Button>
      </div>
    );
  }

  const perInstalment =
    ppForm.instalmentCount && baseFee
      ? Math.round(baseFee / Number(ppForm.instalmentCount))
      : null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/40 border p-3 text-sm">
        <p className="font-medium">{displayName}</p>
        <p className="text-xs text-muted-foreground">{sessionLabel}{baseFee ? ` · Base fee: ${SAR(baseFee)}` : ""}</p>
      </div>

      {error && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label>Plan Type</Label>
          <Select value={ppForm.planType} onValueChange={(v) => setPpForm((f) => ({ ...f, planType: v as typeof f.planType }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="FULL">Full</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="SEASONAL">Seasonal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Instalment Count</Label>
          <Input
            type="number" min={1} placeholder="e.g. 4"
            value={ppForm.instalmentCount}
            onChange={(e) => setPpForm((f) => ({ ...f, instalmentCount: e.target.value }))}
            required
          />
          {perInstalment !== null && (
            <p className="text-xs text-muted-foreground">≈ {SAR(perInstalment)} per instalment</p>
          )}
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Payment Plan"}
        </Button>
      </form>
    </div>
  );
}

// ── Wizard: Fee Override ────────────────────────────────────────────────────
function WizardFeeOverrideForm({
  enrolment, displayName, sessionLabel, baseFee, onDone,
}: {
  enrolment: Enrolment;
  displayName: string;
  sessionLabel: string;
  baseFee: number;
  onDone: () => void;
}) {
  const [feeForm, setFeeForm] = useState({ amount: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeForm.amount) { setError("Please enter an amount."); return; }
    if (!feeForm.reason) { setError("Please enter a reason."); return; }
    setError(null);
    setLoading(true);
    try {
      await enrolmentsApi.setFeeOverride(enrolment.id, {
        amount: Number(feeForm.amount),
        reason: feeForm.reason,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set fee override.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-lg">Fee Override Applied!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Override of <strong>{SAR(Number(feeForm.amount))}</strong> set for <strong>{displayName}</strong>.
          </p>
        </div>
        <Button onClick={onDone} className="mt-2">Done</Button>
      </div>
    );
  }

  const discount = baseFee && feeForm.amount ? baseFee - Number(feeForm.amount) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/40 border p-3 text-sm">
        <p className="font-medium">{displayName}</p>
        <p className="text-xs text-muted-foreground">{sessionLabel}{baseFee ? ` · Standard fee: ${SAR(baseFee)}` : ""}</p>
      </div>

      {error && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label>Override Amount (SAR)</Label>
          <Input
            type="number" min={0} placeholder="e.g. 1200"
            value={feeForm.amount}
            onChange={(e) => setFeeForm((f) => ({ ...f, amount: e.target.value }))}
            required
          />
          {discount !== null && (
            <p className={cn("text-xs", discount > 0 ? "text-amber-600" : "text-muted-foreground")}>
              {discount > 0
                ? `Discount of ${SAR(discount)} from standard fee`
                : "No discount vs. standard fee"}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Reason</Label>
          <Input
            placeholder="e.g. Family discount, scholarship…"
            value={feeForm.reason}
            onChange={(e) => setFeeForm((f) => ({ ...f, reason: e.target.value }))}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Apply Fee Override"}
        </Button>
      </form>
    </div>
  );
}

// ── Row-level detail tabs (eye icon) ─────────────────────────────────────────
function EnrolmentManageDetail({
  enrolment, participantName, sessionName, locationName, baseFee,
}: {
  enrolment: Enrolment;
  participantName: string;
  sessionName: string;
  locationName: string;
  baseFee: number;
}) {
  const [ppForm, setPpForm] = useState({
    planType: "FULL" as "FULL" | "MONTHLY" | "SEASONAL",
    instalmentCount: "",
  });
  const [ppLoading, setPpLoading] = useState(false);
  const [ppError, setPpError] = useState<string | null>(null);
  const [ppSuccess, setPpSuccess] = useState(false);

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
        <TabsTrigger value="payment-plan" className="flex-1">Payment Plan</TabsTrigger>
        <TabsTrigger value="fee-override" className="flex-1">Fee Override</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 space-y-3">
        <Info label="Participant" value={participantName} />
        <Info label="Session" value={sessionName} />
        <Info label="Location" value={locationName} />
        <Info label="Payment Plan" value={enrolment.paymentPlanType || "—"} />
        {baseFee > 0 && <Info label="Session Base Fee" value={SAR(baseFee)} />}
        <Info label="Status" value={<StatusBadge status={enrolment.status || "Active"} />} />
      </TabsContent>

      <TabsContent value="payment-plan" className="mt-4">
        <div className="rounded-lg border p-4 space-y-4">
          <h4 className="text-sm font-semibold">Add Payment Plan</h4>
          {ppError && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{ppError}</div>}
          {ppSuccess && <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600">Payment plan added successfully.</div>}
          <form className="space-y-3" onSubmit={handleAddPaymentPlan}>
            <div className="space-y-1.5">
              <Label>Plan Type</Label>
              <Select value={ppForm.planType} onValueChange={(v) => setPpForm((f) => ({ ...f, planType: v as typeof f.planType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL">Full</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="SEASONAL">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Instalment Count</Label>
              <Input type="number" min={1} placeholder="3" value={ppForm.instalmentCount}
                onChange={(e) => setPpForm((f) => ({ ...f, instalmentCount: e.target.value }))} required />
              {ppForm.instalmentCount && baseFee > 0 && (
                <p className="text-xs text-muted-foreground">
                  ≈ {SAR(Math.round(baseFee / Number(ppForm.instalmentCount)))} per instalment
                </p>
              )}
            </div>
            <Button type="submit" size="sm" disabled={ppLoading} className="w-full">
              {ppLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Payment Plan"}
            </Button>
          </form>
        </div>
      </TabsContent>

      <TabsContent value="fee-override" className="mt-4">
        <div className="rounded-lg border p-4 space-y-4">
          <h4 className="text-sm font-semibold">Set Fee Override</h4>
          {feeError && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{feeError}</div>}
          {feeSuccess && <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600">Fee override set successfully.</div>}
          <form className="space-y-3" onSubmit={handleFeeOverride}>
            <div className="space-y-1.5">
              <Label>Override Amount (SAR)</Label>
              <Input type="number" min={0} placeholder="1200" value={feeForm.amount}
                onChange={(e) => setFeeForm((f) => ({ ...f, amount: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Input placeholder="Family discount" value={feeForm.reason}
                onChange={(e) => setFeeForm((f) => ({ ...f, reason: e.target.value }))} required />
            </div>
            <Button type="submit" size="sm" disabled={feeLoading} className="w-full">
              {feeLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Set Fee Override"}
            </Button>
          </form>
        </div>
      </TabsContent>
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

function PlanCard({
  title, subtitle, icon: Icon, metric, secondary, onClick, active,
}: {
  title: string; subtitle: string; icon: typeof Coins;
  metric: string; secondary: string; onClick: () => void; active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md",
        active && "ring-2 ring-brand"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{subtitle}</p>
          <h3 className="mt-1 text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold">{metric}</p>
      <p className="mt-1 text-xs text-muted-foreground">{secondary}</p>
    </button>
  );
}
