// import { createFileRoute } from "@tanstack/react-router";
// import { useMemo, useState } from "react";
// import { Download, Eye, Pencil } from "lucide-react";
// import { PageHeader } from "@/components/PageHeader";
// import { DataTable, type Column } from "@/components/DataTable";
// import { StatusBadge } from "@/components/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// import {
//   Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
// } from "@/components/ui/sheet";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { mockParticipants, type MockParticipant } from "@/data/mockParticipants";
// import { mockLocations } from "@/data/mockLocations";
// import { mockSessions } from "@/data/mockSessions";
// import { mockPayments } from "@/data/mockPayments";

// export const Route = createFileRoute("/admin/participants")({
//   component: ParticipantsPage,
// });

// const initials = (n: string) => n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
// const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

// function ParticipantsPage() {
//   const [locFilter, setLocFilter] = useState("all");
//   const [sesFilter, setSesFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<MockParticipant | null>(null);
//   const [addOpen, setAddOpen] = useState(false);

//   const filtered = useMemo(() => {
//     const q = search.toLowerCase().trim();
//     return mockParticipants.filter((p) => {
//       if (locFilter !== "all" && p.location !== locFilter) return false;
//       if (sesFilter !== "all" && p.session !== sesFilter) return false;
//       if (statusFilter !== "all" && p.status !== statusFilter) return false;
//       if (q) {
//         const hay = `${p.fullName} ${p.guardianPhone} ${p.uniqueId}`.toLowerCase();
//         if (!hay.includes(q)) return false;
//       }
//       return true;
//     });
//   }, [locFilter, sesFilter, statusFilter, search]);

//   const columns: Column<MockParticipant>[] = [
//     {
//       key: "fullName", header: "Participant",
//       render: (r) => (
//         <button type="button" onClick={() => setSelected(r)} className="flex items-center gap-3 text-left">
//           <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
//             {initials(r.fullName)}
//           </div>
//           <div>
//             <p className="text-sm font-medium text-foreground hover:text-primary">{r.fullName}</p>
//             <p className="text-xs text-muted-foreground">{r.uniqueId}</p>
//           </div>
//         </button>
//       ),
//     },
//     { key: "guardianName", header: "Guardian" },
//     { key: "location", header: "Location" },
//     { key: "session", header: "Session" },
//     { key: "status", header: "Status", render: (r) => <StatusBadge status={mapStatus(r.status)} /> },
//     { key: "joinedDate", header: "Joined" },
//     {
//       key: "actions", header: "Actions",
//       render: (r) => (
//         <div className="flex gap-1">
//           <Button variant="ghost" size="icon" onClick={() => setSelected(r)}><Eye className="h-4 w-4" /></Button>
//           <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
//         </div>
//       ),
//     },
//   ];

//   const filters = (
//     <>
//       <Input
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search name, phone, ID…"
//         className="w-[220px]"
//       />
//       <Select value={locFilter} onValueChange={setLocFilter}>
//         <SelectTrigger className="w-[160px]"><SelectValue placeholder="Location" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Locations</SelectItem>
//           {mockLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
//         </SelectContent>
//       </Select>
//       <Select value={sesFilter} onValueChange={setSesFilter}>
//         <SelectTrigger className="w-[160px]"><SelectValue placeholder="Session" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Sessions</SelectItem>
//           {mockSessions.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
//         </SelectContent>
//       </Select>
//       <Select value={statusFilter} onValueChange={setStatusFilter}>
//         <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Status</SelectItem>
//           {["Inquiry", "Documents Pending", "Fee Pending", "Active", "On Hold", "Completed", "Withdrawn"].map((s) => (
//             <SelectItem key={s} value={s}>{s}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </>
//   );

//   return (
//     <>
//       <PageHeader
//         title="Participants"
//         description={`${mockParticipants.length} total`}
//         actions={
//           <>
//             <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
//             <Button onClick={() => setAddOpen(true)}>Add Participant</Button>
//           </>
//         }
//       />
//       <div className="p-6">
//         <DataTable
//           data={filtered}
//           columns={columns}
//           searchPlaceholder="Quick search…"
//           filters={filters}
//         />
//       </div>

//       {/* <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
//         <SheetContent className="w-full sm:max-w-2xl">
//           {selected && <ParticipantDetail p={selected} />}
//         </SheetContent>
//       </Sheet>

//       <Sheet open={addOpen} onOpenChange={setAddOpen}>
//         <SheetContent className="w-full sm:max-w-lg">
//           <SheetHeader>
//             <SheetTitle>Add Participant</SheetTitle>
//             <SheetDescription>Register a new participant.</SheetDescription>
//           </SheetHeader>
//           <form className="space-y-3 px-4 pb-6" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); }}>
//             <Field label="Full Name"><Input /></Field>
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Age"><Input type="number" /></Field>
//               <Field label="Nationality"><Input placeholder="Saudi" /></Field>
//             </div>
//             <Field label="Guardian Name"><Input /></Field>
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Guardian Phone"><Input placeholder="+966 …" /></Field>
//               <Field label="Guardian Email"><Input type="email" /></Field>
//             </div>
//             <Field label="Location">
//               <Select>
//                 <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
//                 <SelectContent>
//                   {mockLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </Field>
//             <Field label="Session">
//               <Select>
//                 <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
//                 <SelectContent>
//                   {mockSessions.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </Field>
//             <Field label="Payment Plan">
//               <Select>
//                 <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Full">Full</SelectItem>
//                   <SelectItem value="Monthly">Monthly</SelectItem>
//                   <SelectItem value="Seasonal">Seasonal</SelectItem>
//                 </SelectContent>
//               </Select>
//             </Field>
//             <SheetFooter>
//               <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
//               <Button type="submit">Create Participant</Button>
//             </SheetFooter>
//           </form>
//         </SheetContent>
//       </Sheet> */}
//       <Sheet open={addOpen} onOpenChange={setAddOpen}>
//         <SheetContent className="w-full sm:max-w-lg">
//           <SheetHeader className="my-4">
//             <SheetTitle>Add Participant</SheetTitle>
//             <SheetDescription>Register a new participant.</SheetDescription>
//           </SheetHeader>

//           <form className="space-y-3 pb-6" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); }}>

//             {/* Name Fields */}
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="First Name (En)"><Input name="firstNameEn" placeholder="Ahmed" /></Field>
//               <Field label="Last Name (En)"><Input name="lastNameEn" placeholder="Ali" /></Field>
//             </div>

//             {/* DOB & Gender */}
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Date of Birth"><Input name="dateOfBirth" type="date" /></Field>
//               <Field label="Gender">
//                 <Select name="gender">
//                   <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="MALE">Male</SelectItem>
//                     <SelectItem value="FEMALE">Female</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </Field>
//             </div>

//             {/* Phone & Location */}
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Phone"><Input name="phone" placeholder="+923110098721" /></Field>
//               <Field label="Location">
//                 <Select name="locationSlug">
//                   <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
//                   <SelectContent>
//                     {/* {mockLocations.map((l) => (
//                 <SelectItem key={l.id} value={l.slug}>{l.name}</SelectItem>
//               ))} */}
//                   </SelectContent>
//                 </Select>
//               </Field>
//             </div>

//             <hr className="my-4 border-muted" />
//             <p className="text-sm ">Guardian Information</p>

//             {/* Guardian Main Details */}
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Guardian Name"><Input name="guardian.fullName" placeholder="Mohammad Ali" /></Field>
//               <Field label="Relationship"><Input name="guardian.relationship" placeholder="Brother" /></Field>
//             </div>

//             {/* Guardian Contact Details */}
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Guardian Phone"><Input name="guardian.phone" placeholder="+923220098712" /></Field>
//               <Field label="Guardian Email"><Input name="guardian.email" type="email" placeholder="muhammad.ali@gmail.com" /></Field>
//             </div>

//             <SheetFooter className="pt-4">
//               <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
//               <Button type="submit">Create Participant</Button>
//             </SheetFooter>
//           </form>
//         </SheetContent>
//       </Sheet>
//     </>
//   );
// }

// function mapStatus(s: string): string {
//   // StatusBadge styles: Active/Pending/On Hold/Withdrawn/Completed
//   if (s === "Documents Pending" || s === "Fee Pending" || s === "Inquiry") return "Pending";
//   return s;
// }

// function ParticipantDetail({ p }: { p: MockParticipant }) {
//   const payments = mockPayments.filter((pp) => pp.participantId === p.id);
//   return (
//     <>
//       <SheetHeader>
//         <div className="flex items-center gap-3">
//           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
//             {initials(p.fullName)}
//           </div>
//           <div className="flex-1">
//             <SheetTitle>{p.fullName}</SheetTitle>
//             <SheetDescription>{p.uniqueId}</SheetDescription>
//           </div>
//           <StatusBadge status={mapStatus(p.status)} />
//         </div>
//       </SheetHeader>
//       <div className="px-4 pb-6">
//         <Tabs defaultValue="overview">
//           <TabsList className="w-full">
//             <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
//             <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
//             <TabsTrigger value="payments" className="flex-1">Payments</TabsTrigger>
//             <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
//           </TabsList>

//           <TabsContent value="overview" className="mt-4">
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <Info label="Age" value={p.age} />
//               <Info label="Nationality" value={p.nationality} />
//               <Info label="Joined" value={p.joinedDate} />
//               <Info label="Status" value={p.status} />
//               <Info label="Location" value={p.location} />
//               <Info label="Session" value={p.session} />
//               <Info label="Guardian" value={p.guardianName} />
//               <Info label="Phone" value={p.guardianPhone} />
//               <Info label="Email" value={p.guardianEmail} />
//             </div>
//           </TabsContent>

//           <TabsContent value="documents" className="mt-4 space-y-2">
//             {p.documents.map((d, i) => (
//               <div key={i} className="flex items-center justify-between rounded-md border p-3">
//                 <div>
//                   <p className="text-sm font-medium">{d.name}</p>
//                   <StatusBadge status={d.status === "Uploaded" ? "Active" : d.status === "Missing" ? "On Hold" : "Pending"} />
//                 </div>
//                 <Button size="sm" variant="outline">Upload</Button>
//               </div>
//             ))}
//             {p.documents.length === 0 && <p className="text-sm text-muted-foreground">No documents on file.</p>}
//           </TabsContent>

//           <TabsContent value="payments" className="mt-4 space-y-3">
//             {payments.length === 0 && <p className="text-sm text-muted-foreground">No payment records yet.</p>}
//             {payments.map((pay) => (
//               <div key={pay.id} className="rounded-lg border p-4">
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <Info label="Plan" value={pay.plan} />
//                   <Info label="Status" value={<StatusBadge status={pay.status} />} />
//                   <Info label="Total" value={SAR(pay.totalFee)} />
//                   <Info label="Paid" value={SAR(pay.paidAmount)} />
//                   <Info label="Balance" value={SAR(pay.balance)} />
//                 </div>
//                 {pay.invoices.length > 0 && (
//                   <ul className="mt-3 divide-y border-t pt-3">
//                     {pay.invoices.map((inv) => (
//                       <li key={inv.id} className="flex items-center justify-between py-2 text-sm">
//                         <div>
//                           <p className="font-medium">{inv.id}</p>
//                           <p className="text-xs text-muted-foreground">{inv.date} • {inv.method}</p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span>{SAR(inv.amount)}</span>
//                           <Button size="icon" variant="ghost" asChild>
//                             <a href={inv.receiptUrl}><Download className="h-4 w-4" /></a>
//                           </Button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </TabsContent>

//           <TabsContent value="notes" className="mt-4 space-y-3">
//             {p.notes.map((n, i) => (
//               <div key={i} className="rounded-md border p-3">
//                 <p className="text-sm">{n.text}</p>
//                 <p className="mt-1 text-xs text-muted-foreground">{n.author} • {new Date(n.timestamp).toLocaleString()}</p>
//               </div>
//             ))}
//             {p.notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
//             <div className="space-y-2 pt-2">
//               <Textarea placeholder="Add a note…" />
//               <Button size="sm">Add Note</Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </>
//   );
// }

// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//   return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
// }
// function Info({ label, value }: { label: string; value: React.ReactNode }) {
//   return (
//     <div className="rounded-md bg-muted/30 p-2.5">
//       <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
//       <p className="mt-0.5 text-sm font-medium">{value}</p>
//     </div>
//   );
// }





























// import { createFileRoute } from "@tanstack/react-router";
// import { useMemo, useState, useEffect } from "react";
// import { Download, Eye, Pencil } from "lucide-react";
// import { PageHeader } from "@/components/PageHeader";
// import { DataTable, type Column } from "@/components/DataTable";
// import { StatusBadge } from "@/components/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// import {
//   Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
// } from "@/components/ui/sheet";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { participantsApi, type Participant, type Gender } from "@/api/participants";
// import { locationsApi, type Location } from "@/api/locations";
// import { mockPayments } from "@/data/mockPayments";

// export const Route = createFileRoute("/admin/participants")({
//   component: ParticipantsPage,
// });

// const initials = (n: string) =>
//   n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
// const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

// function mapStatus(s: string): string {
//   if (s === "Documents Pending" || s === "Fee Pending" || s === "Inquiry") return "Pending";
//   return s;
// }

// function ParticipantsPage() {
//   const [locFilter, setLocFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<Participant | null>(null);
//   const [addOpen, setAddOpen] = useState(false);

//   // ── Real data state ──────────────────────────────────────────────────────
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [apiError, setApiError] = useState<string | null>(null);

//   // ── Add form state ───────────────────────────────────────────────────────
//   const [form, setForm] = useState({
//     firstNameEn: "",
//     lastNameEn: "",
//     dateOfBirth: "",
//     gender: "" as Gender | "",
//     phone: "",
//     locationSlug: "",
//     guardianFullName: "",
//     guardianRelationship: "",
//     guardianPhone: "",
//     guardianEmail: "",
//   });
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   // ── Fetch on mount ───────────────────────────────────────────────────────
//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [pData, lData] = await Promise.all([
//           participantsApi.getAll(),
//           locationsApi.getAll(),
//         ]);
//         setParticipants(pData);
//         setLocations(lData);
//       } catch (err) {
//         setApiError(err instanceof Error ? err.message : "Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   // ── Filtered list ────────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     const q = search.toLowerCase().trim();
//     return participants.filter((p) => {
//       const fullName = `${p.firstNameEn} ${p.lastNameEn}`;
//       if (locFilter !== "all" && p.locationSlug !== locFilter) return false;
//       if (statusFilter !== "all" && p.status !== statusFilter) return false;
//       if (q) {
//         const hay = `${fullName} ${p.phone} ${p.uniqueId ?? ""}`.toLowerCase();
//         if (!hay.includes(q)) return false;
//       }
//       return true;
//     });
//   }, [participants, locFilter, statusFilter, search]);

//   // ── Create participant handler ────────────────────────────────────────────
//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.gender) { setFormError("Please select a gender."); return; }
//     if (!form.locationSlug) { setFormError("Please select a location."); return; }
//     setFormError(null);
//     setFormLoading(true);
//     try {
//       const created = await participantsApi.register({
//         firstNameEn: form.firstNameEn,
//         lastNameEn: form.lastNameEn,
//         dateOfBirth: form.dateOfBirth,
//         gender: form.gender as Gender,
//         phone: form.phone,
//         locationSlug: form.locationSlug,
//         guardian: {
//           fullName: form.guardianFullName,
//           relationship: form.guardianRelationship,
//           phone: form.guardianPhone,
//           email: form.guardianEmail,
//         },
//       });
//       setParticipants((prev) => [...prev, created]);
//       setForm({
//         firstNameEn: "", lastNameEn: "", dateOfBirth: "", gender: "",
//         phone: "", locationSlug: "",
//         guardianFullName: "", guardianRelationship: "",
//         guardianPhone: "", guardianEmail: "",
//       });
//       setAddOpen(false);
//     } catch (err) {
//       setFormError(err instanceof Error ? err.message : "Failed to register participant.");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ── Table columns ─────────────────────────────────────────────────────────
//   const columns: Column<Participant>[] = [
//     {
//       key: "firstNameEn", header: "Participant",
//       render: (r) => {
//         const fullName = `${r.firstNameEn} ${r.lastNameEn}`;
//         return (
//           <button type="button" onClick={() => setSelected(r)} className="flex items-center gap-3 text-left">
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
//               {initials(fullName)}
//             </div>
//             <div>
//               <p className="text-sm font-medium text-foreground hover:text-primary">{fullName}</p>
//               <p className="text-xs text-muted-foreground">{r.uniqueId ?? "—"}</p>
//             </div>
//           </button>
//         );
//       },
//     },
//     // {
//     //   key: "guardian", header: "Guardian",
//     //   render: (r) => (r.guardian as { fullName: string })?.fullName ?? "—",
//     // },


//     {
//       key: "guardian", header: "Guardian",
//       render: (r) => {
//         const g = r.guardian as { fullName?: string } | null;
//         return g?.fullName ?? (r as any).guardianFullName ?? "—";
//       },
//     },





//     // { key: "locationSlug", header: "Location" },



//     {
//       key: "locationSlug",
//       header: "Location",
//       render: (r) => {
//         // If API returns a location object, pull the name out
//         const loc = (r as any).location;
//         return loc?.name ?? r.locationSlug ?? "—";
//       }
//     },




//     {
//       key: "status", header: "Status",
//       render: (r) => <StatusBadge status={mapStatus(r.status ?? "Pending")} />,
//     },
//     // { key: "joinedDate", header: "Joined", render: (r) => (r.joinedDate as string) ?? "—" },


//     {
//       key: "joinedDate",
//       header: "Joined",
//       render: (r) => {
//         const raw = (r.joinedDate ?? r.createdAt) as string | undefined;
//         if (!raw) return "—";
//         return new Date(raw).toLocaleDateString("en-GB", {
//           day: "2-digit", month: "short", year: "numeric",
//         });
//       }
//     },




//     {
//       key: "actions", header: "Actions",
//       render: (r) => (
//         <div className="flex gap-1">
//           <Button variant="ghost" size="icon" onClick={() => setSelected(r)}>
//             <Eye className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon">
//             <Pencil className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   const filters = (
//     <>
//       <Input
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search name, phone, ID…"
//         className="w-[220px]"
//       />
//       <Select value={locFilter} onValueChange={setLocFilter}>
//         <SelectTrigger className="w-[160px]"><SelectValue placeholder="Location" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Locations</SelectItem>
//           {locations.map((l) => (
//             <SelectItem key={l.id} value={l.slug || l.name || l.id}>{l.name}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       <Select value={statusFilter} onValueChange={setStatusFilter}>
//         <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Status</SelectItem>
//           {["Inquiry", "Documents Pending", "Fee Pending", "Active", "On Hold", "Completed", "Withdrawn"].map((s) => (
//             <SelectItem key={s} value={s}>{s}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </>
//   );

//   return (
//     <>
//       <PageHeader
//         title="Participants"
//         description={`${participants.length} total`}
//         actions={
//           <>
//             <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
//             <Button onClick={() => setAddOpen(true)}>Add Participant</Button>
//           </>
//         }
//       />

//       <div className="p-6">
//         {loading ? (
//           <p className="text-sm text-muted-foreground">Loading participants…</p>
//         ) : apiError ? (
//           <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//             {apiError}
//           </div>
//         ) : (
//           <DataTable
//             data={filtered}
//             columns={columns}
//             searchPlaceholder="Quick search…"
//             filters={filters}
//           />
//         )}
//       </div>

//       {/* ── Detail drawer ── */}
//       <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
//         <SheetContent className="w-full sm:max-w-2xl">
//           {selected && <ParticipantDetail p={selected} />}
//         </SheetContent>
//       </Sheet>

//       {/* ── Add Participant drawer ── */}
//       <Sheet open={addOpen} onOpenChange={setAddOpen}>
//         <SheetContent className="w-full sm:max-w-lg">
//           <SheetHeader className="my-4">
//             <SheetTitle>Add Participant</SheetTitle>
//             <SheetDescription>Register a new participant.</SheetDescription>
//           </SheetHeader>

//           <form className="space-y-3 pb-6" onSubmit={handleCreate}>

//             {formError && (
//               <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//                 {formError}
//               </div>
//             )}

//             {/* Name */}
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="First Name (En)">
//                 <Input
//                   placeholder="Ahmed"
//                   value={form.firstNameEn}
//                   onChange={(e) => setForm((f) => ({ ...f, firstNameEn: e.target.value }))}
//                   required
//                 />
//               </Field>
//               <Field label="Last Name (En)">
//                 <Input
//                   placeholder="Ali"
//                   value={form.lastNameEn}
//                   onChange={(e) => setForm((f) => ({ ...f, lastNameEn: e.target.value }))}
//                   required
//                 />
//               </Field>
//             </div>

//             {/* DOB & Gender */}
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Date of Birth">
//                 <Input
//                   type="date"
//                   value={form.dateOfBirth}
//                   onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
//                   required
//                 />
//               </Field>
//               <Field label="Gender">
//                 <Select
//                   value={form.gender}
//                   onValueChange={(val) => setForm((f) => ({ ...f, gender: val as Gender }))}
//                 >
//                   <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="MALE">Male</SelectItem>
//                     <SelectItem value="FEMALE">Female</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </Field>
//             </div>

//             {/* Phone & Location */}
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Phone">
//                 <Input
//                   placeholder="+923110098721"
//                   value={form.phone}
//                   onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
//                   required
//                 />
//               </Field>
//               <Field label="Location">
//                 <Select
//                   value={form.locationSlug}
//                   onValueChange={(val) => setForm((f) => ({ ...f, locationSlug: val }))}
//                 >
//                   <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
//                   <SelectContent>
//                     {locations.map((l) => (
//                       <SelectItem key={l.id} value={l.slug || l.name || l.id}>{l.name}</SelectItem>
//                     ))}

//                   </SelectContent>
//                 </Select>
//               </Field>
//             </div>

//             <hr className="my-4 border-muted" />
//             <p className="text-sm">Guardian Information</p>

//             {/* Guardian main */}
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Guardian Name">
//                 <Input
//                   placeholder="Mohammad Ali"
//                   value={form.guardianFullName}
//                   onChange={(e) => setForm((f) => ({ ...f, guardianFullName: e.target.value }))}
//                   required
//                 />
//               </Field>
//               <Field label="Relationship">
//                 <Input
//                   placeholder="Brother"
//                   value={form.guardianRelationship}
//                   onChange={(e) => setForm((f) => ({ ...f, guardianRelationship: e.target.value }))}
//                   required
//                 />
//               </Field>
//             </div>

//             {/* Guardian contact */}
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Guardian Phone">
//                 <Input
//                   placeholder="+923220098712"
//                   value={form.guardianPhone}
//                   onChange={(e) => setForm((f) => ({ ...f, guardianPhone: e.target.value }))}
//                   required
//                 />
//               </Field>
//               <Field label="Guardian Email">
//                 <Input
//                   type="email"
//                   placeholder="muhammad.ali@gmail.com"
//                   value={form.guardianEmail}
//                   onChange={(e) => setForm((f) => ({ ...f, guardianEmail: e.target.value }))}
//                   required
//                 />
//               </Field>
//             </div>

//             <SheetFooter className="pt-4">
//               <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={formLoading}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={formLoading}>
//                 {formLoading ? "Registering…" : "Create Participant"}
//               </Button>
//             </SheetFooter>
//           </form>
//         </SheetContent>
//       </Sheet>
//     </>
//   );
// }

// // ── Detail view ───────────────────────────────────────────────────────────────
// function ParticipantDetail({ p }: { p: Participant }) {
//   const fullName = `${p.firstNameEn} ${p.lastNameEn}`;
//   const payments = mockPayments.filter((pp) => pp.participantId === p.id);
//   const guardian = p.guardian as {
//     fullName: string; relationship: string; phone: string; email: string;
//   };

//   return (
//     <>
//       <SheetHeader>
//         <div className="flex items-center gap-3">
//           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
//             {initials(fullName)}
//           </div>
//           <div className="flex-1">
//             <SheetTitle>{fullName}</SheetTitle>
//             <SheetDescription>{p.uniqueId ?? "—"}</SheetDescription>
//           </div>
//           <StatusBadge status={mapStatus(p.status ?? "Pending")} />
//         </div>
//       </SheetHeader>

//       <div className="px-4 pb-6">
//         <Tabs defaultValue="overview">
//           <TabsList className="w-full">
//             <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
//             <TabsTrigger value="payments" className="flex-1">Payments</TabsTrigger>
//             <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
//           </TabsList>

//           <TabsContent value="overview" className="mt-4">
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <Info label="Date of Birth" value={p.dateOfBirth} />
//               <Info label="Gender" value={p.gender} />
//               <Info label="Phone" value={p.phone} />
//               <Info label="Location" value={p.locationSlug} />
//               <Info label="Status" value={p.status ?? "—"} />
//               <Info label="Joined" value={(p.joinedDate as string) ?? "—"} />
//               <Info label="Guardian" value={guardian?.fullName ?? "—"} />
//               <Info label="Relationship" value={guardian?.relationship ?? "—"} />
//               <Info label="Guardian Phone" value={guardian?.phone ?? "—"} />
//               <Info label="Guardian Email" value={guardian?.email ?? "—"} />
//             </div>
//           </TabsContent>

//           <TabsContent value="payments" className="mt-4 space-y-3">
//             {payments.length === 0 && (
//               <p className="text-sm text-muted-foreground">No payment records yet.</p>
//             )}
//             {payments.map((pay) => (
//               <div key={pay.id} className="rounded-lg border p-4">
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <Info label="Plan" value={pay.plan} />
//                   <Info label="Status" value={<StatusBadge status={pay.status} />} />
//                   <Info label="Total" value={SAR(pay.totalFee)} />
//                   <Info label="Paid" value={SAR(pay.paidAmount)} />
//                   <Info label="Balance" value={SAR(pay.balance)} />
//                 </div>
//                 {pay.invoices.length > 0 && (
//                   <ul className="mt-3 divide-y border-t pt-3">
//                     {pay.invoices.map((inv) => (
//                       <li key={inv.id} className="flex items-center justify-between py-2 text-sm">
//                         <div>
//                           <p className="font-medium">{inv.id}</p>
//                           <p className="text-xs text-muted-foreground">{inv.date} • {inv.method}</p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span>{SAR(inv.amount)}</span>
//                           <Button size="icon" variant="ghost" asChild>
//                             <a href={inv.receiptUrl}><Download className="h-4 w-4" /></a>
//                           </Button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </TabsContent>

//           <TabsContent value="notes" className="mt-4 space-y-3">
//             <p className="text-sm text-muted-foreground">No notes yet.</p>
//             <div className="space-y-2 pt-2">
//               <Textarea placeholder="Add a note…" />
//               <Button size="sm">Add Note</Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </>
//   );
// }

// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//   return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
// }
// function Info({ label, value }: { label: string; value: React.ReactNode }) {
//   return (
//     <div className="rounded-md bg-muted/30 p-2.5">
//       <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
//       <p className="mt-0.5 text-sm font-medium">{value}</p>
//     </div>
//   );
// }



// import { createFileRoute } from "@tanstack/react-router";
// import { useMemo, useState, useEffect } from "react";
// import { Download, Eye, Pencil } from "lucide-react";
// import { PageHeader } from "@/components/PageHeader";
// import { DataTable, type Column } from "@/components/DataTable";
// import { StatusBadge } from "@/components/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// import {
//   Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
// } from "@/components/ui/sheet";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   participantsApi, type Participant, type Gender, type ParticipantStatus, STATUS_OPTIONS,
// } from "@/api/participants";
// import { locationsApi, type Location } from "@/api/locations";
// import { mockPayments } from "@/data/mockPayments";

// export const Route = createFileRoute("/admin/participants")({
//   component: ParticipantsPage,
// });

// const initials = (n: string) =>
//   n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
// const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

// const statusDisplayMap: Record<string, string> = {
//   INQUIRY: "Inquiry",
//   DOCUMENTS_PENDING: "Documents Pending",
//   FEE_PENDING: "Fee Pending",
//   ACTIVE: "Active",
//   ON_HOLD: "On Hold",
//   COMPLETED: "Completed",
//   WITHDRAWN: "Withdrawn",
// };

// function mapStatus(s: string): string {
//   if (s === "INQUIRY") return "Inquiry";
//   if (s === "DOCUMENTS_PENDING") return "DOCUMENTS PENDING";
//   if (s === "FEE_PENDING") return "FEE PENDING";
//   // if (s === "DOCUMENTS_PENDING" || s === "FEE_PENDING" || s === "INQUIRY") return "Pending";
//   // if (s === "Documents Pending" || s === "Fee Pending" || s === "Inquiry") return "Pending";
//   if (s === "ON_HOLD") return "On Hold";
//   if (s === "ACTIVE") return "Active";
//   if (s === "COMPLETED") return "Completed";
//   if (s === "WITHDRAWN") return "Withdrawn";
//   return s;
// }

// function ParticipantsPage() {
//   const [locFilter, setLocFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<Participant | null>(null);
//   const [addOpen, setAddOpen] = useState(false);

//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [apiError, setApiError] = useState<string | null>(null);

//   const [form, setForm] = useState({
//     firstNameEn: "", lastNameEn: "", dateOfBirth: "",
//     gender: "" as Gender | "", phone: "", locationSlug: "",
//     guardianFullName: "", guardianRelationship: "",
//     guardianPhone: "", guardianEmail: "",
//   });
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [pData, lData] = await Promise.all([
//           participantsApi.getAll(),
//           locationsApi.getAll(),
//         ]);
//         setParticipants(pData);
//         setLocations(lData);
//       } catch (err) {
//         setApiError(err instanceof Error ? err.message : "Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   const filtered = useMemo(() => {
//     const q = search.toLowerCase().trim();
//     return participants.filter((p) => {
//       const fullName = `${p.firstNameEn} ${p.lastNameEn}`;
//       if (locFilter !== "all" && p.locationSlug !== locFilter) return false;
//       if (statusFilter !== "all" && p.status !== statusFilter) return false;
//       if (q) {
//         const hay = `${fullName} ${p.phone} ${p.uniqueId ?? ""}`.toLowerCase();
//         if (!hay.includes(q)) return false;
//       }
//       return true;
//     });
//   }, [participants, locFilter, statusFilter, search]);

//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.gender) { setFormError("Please select a gender."); return; }
//     if (!form.locationSlug) { setFormError("Please select a location."); return; }
//     setFormError(null);
//     setFormLoading(true);
//     try {
//       const created = await participantsApi.register({
//         firstNameEn: form.firstNameEn, lastNameEn: form.lastNameEn,
//         dateOfBirth: form.dateOfBirth, gender: form.gender as Gender,
//         phone: form.phone, locationSlug: form.locationSlug,
//         guardian: {
//           fullName: form.guardianFullName, relationship: form.guardianRelationship,
//           phone: form.guardianPhone, email: form.guardianEmail,
//         },
//       });
//       setParticipants((prev) => [...prev, created]);
//       setForm({
//         firstNameEn: "", lastNameEn: "", dateOfBirth: "", gender: "",
//         phone: "", locationSlug: "", guardianFullName: "",
//         guardianRelationship: "", guardianPhone: "", guardianEmail: "",
//       });
//       setAddOpen(false);
//     } catch (err) {
//       setFormError(err instanceof Error ? err.message : "Failed to register participant.");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleStatusUpdate = (updated: Participant) => {
//     setParticipants((prev) =>
//       prev.map((p) => (p.id === updated.id ? { ...p, status: updated.status } : p))
//     );
//     setSelected((prev) => prev ? { ...prev, status: updated.status } : prev);
//   };

//   const columns: Column<Participant>[] = [
//     {
//       key: "firstNameEn", header: "Participant",
//       render: (r) => {
//         const fullName = `${r.firstNameEn} ${r.lastNameEn}`;
//         return (
//           <button type="button" onClick={() => setSelected(r)} className="flex items-center gap-3 text-left">
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
//               {initials(fullName)}
//             </div>
//             <div>
//               <p className="text-sm font-medium text-foreground hover:text-primary">{fullName}</p>
//               <p className="text-xs text-muted-foreground">{r.uniqueId ?? "—"}</p>
//             </div>
//           </button>
//         );
//       },
//     },
//     {
//       key: "guardian", header: "Guardian",
//       render: (r) => {
//         const g = r.guardian as { fullName?: string } | null;
//         return g?.fullName ?? (r as any).guardianFullName ?? "—";
//       },
//     },
//     {
//       key: "locationSlug", header: "Location",
//       render: (r) => {
//         const loc = (r as any).location;
//         return loc?.name ?? r.locationSlug ?? "—";
//       },
//     },
//     {
//       key: "status", header: "Status",
//       render: (r) => <StatusBadge status={mapStatus(r.status ?? "Pending")} />,
//     },
//     {
//       key: "joinedDate", header: "Joined",
//       render: (r) => {
//         const raw = (r.joinedDate ?? r.createdAt) as string | undefined;
//         if (!raw) return "—";
//         return new Date(raw).toLocaleDateString("en-GB", {
//           day: "2-digit", month: "short", year: "numeric",
//         });
//       },
//     },
//     {
//       key: "actions", header: "Actions",
//       render: (r) => (
//         <div className="flex gap-1">
//           <Button variant="ghost" size="icon" onClick={() => setSelected(r)}>
//             <Eye className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" onClick={() => setSelected(r)}>
//             <Pencil className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   const filters = (
//     <>
//       <Input
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search name, phone, ID…"
//         className="w-[220px]"
//       />
//       <Select value={locFilter} onValueChange={setLocFilter}>
//         <SelectTrigger className="w-[160px]"><SelectValue placeholder="Location" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Locations</SelectItem>
//           {locations.map((l) => (
//             <SelectItem key={l.id} value={l.slug || l.name || l.id}>{l.name}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       <Select value={statusFilter} onValueChange={setStatusFilter}>
//         <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Status</SelectItem>
//           {STATUS_OPTIONS.map((s) => (
//             <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </>
//   );

//   return (
//     <>
//       <PageHeader
//         title="Participants"
//         description={`${participants.length} total`}
//         actions={
//           <>
//             <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
//             <Button onClick={() => setAddOpen(true)}>Add Participant</Button>
//           </>
//         }
//       />

//       <div className="p-6">
//         {loading ? (
//           <p className="text-sm text-muted-foreground">Loading participants…</p>
//         ) : apiError ? (
//           <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//             {apiError}
//           </div>
//         ) : (
//           <DataTable
//             data={filtered}
//             columns={columns}
//             searchPlaceholder="Quick search…"
//             filters={filters}
//           />
//         )}
//       </div>

//       {/* ── Detail drawer ── */}
//       <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
//         <SheetContent className="w-full sm:max-w-2xl">
//           {selected && (
//             <ParticipantDetail
//               p={selected}
//               onStatusUpdate={handleStatusUpdate}
//             />
//           )}
//         </SheetContent>
//       </Sheet>

//       {/* ── Add Participant drawer ── */}
//       <Sheet open={addOpen} onOpenChange={setAddOpen}>
//         <SheetContent className="w-full sm:max-w-lg">
//           <SheetHeader className="my-4">
//             <SheetTitle>Add Participant</SheetTitle>
//             <SheetDescription>Register a new participant.</SheetDescription>
//           </SheetHeader>

//           <form className="space-y-3 pb-6" onSubmit={handleCreate}>
//             {formError && (
//               <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//                 {formError}
//               </div>
//             )}

//             <div className="grid grid-cols-2 gap-3">
//               <Field label="First Name (En)">
//                 <Input placeholder="Ahmed" value={form.firstNameEn}
//                   onChange={(e) => setForm((f) => ({ ...f, firstNameEn: e.target.value }))} required />
//               </Field>
//               <Field label="Last Name (En)">
//                 <Input placeholder="Ali" value={form.lastNameEn}
//                   onChange={(e) => setForm((f) => ({ ...f, lastNameEn: e.target.value }))} required />
//               </Field>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Date of Birth">
//                 <Input type="date" value={form.dateOfBirth}
//                   onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} required />
//               </Field>
//               <Field label="Gender">
//                 <Select value={form.gender}
//                   onValueChange={(val) => setForm((f) => ({ ...f, gender: val as Gender }))}>
//                   <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="MALE">Male</SelectItem>
//                     <SelectItem value="FEMALE">Female</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </Field>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Phone">
//                 <Input placeholder="+923110098721" value={form.phone}
//                   onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
//               </Field>
//               <Field label="Location">
//                 <Select value={form.locationSlug}
//                   onValueChange={(val) => setForm((f) => ({ ...f, locationSlug: val }))}>
//                   <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
//                   <SelectContent>
//                     {locations.map((l) => (
//                       <SelectItem key={l.id} value={l.slug || l.name.toLowerCase().replace(/\s+/g, '-')}>{l.name}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </Field>
//             </div>

//             <hr className="my-4 border-muted" />
//             <p className="text-sm">Guardian Information</p>

//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Guardian Name">
//                 <Input placeholder="Mohammad Ali" value={form.guardianFullName}
//                   onChange={(e) => setForm((f) => ({ ...f, guardianFullName: e.target.value }))} required />
//               </Field>
//               <Field label="Relationship">
//                 <Input placeholder="Brother" value={form.guardianRelationship}
//                   onChange={(e) => setForm((f) => ({ ...f, guardianRelationship: e.target.value }))} required />
//               </Field>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Guardian Phone">
//                 <Input placeholder="+923220098712" value={form.guardianPhone}
//                   onChange={(e) => setForm((f) => ({ ...f, guardianPhone: e.target.value }))} required />
//               </Field>
//               <Field label="Guardian Email">
//                 <Input type="email" placeholder="muhammad.ali@gmail.com" value={form.guardianEmail}
//                   onChange={(e) => setForm((f) => ({ ...f, guardianEmail: e.target.value }))} required />
//               </Field>
//             </div>

//             <SheetFooter className="pt-4">
//               <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={formLoading}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={formLoading}>
//                 {formLoading ? "Registering…" : "Create Participant"}
//               </Button>
//             </SheetFooter>
//           </form>
//         </SheetContent>
//       </Sheet>
//     </>
//   );
// }

// // ── Detail view ───────────────────────────────────────────────────────────────
// function ParticipantDetail({
//   p,
//   onStatusUpdate,
// }: {
//   p: Participant;
//   onStatusUpdate: (updated: Participant) => void;
// }) {
//   const fullName = `${p.firstNameEn} ${p.lastNameEn}`;
//   const payments = mockPayments.filter((pp) => pp.participantId === p.id);
//   const guardian = p.guardian as {
//     fullName: string; relationship: string; phone: string; email: string;
//   };

//   const [currentStatus, setCurrentStatus] = useState(p.status ?? "INQUIRY");
//   const [statusValue, setStatusValue] = useState<ParticipantStatus>(
//     (p.status as ParticipantStatus) ?? "INQUIRY"
//   );
//   const [reason, setReason] = useState("");
//   const [statusLoading, setStatusLoading] = useState(false);
//   const [statusError, setStatusError] = useState<string | null>(null);
//   const [statusSuccess, setStatusSuccess] = useState(false);

//   const handleStatusSave = async () => {
//     setStatusLoading(true);
//     setStatusError(null);
//     setStatusSuccess(false);
//     try {
//       const updated = await participantsApi.updateStatus(p.id, {
//         status: statusValue,
//         ...(reason.trim() ? { reason: reason.trim() } : {}),
//       });
//       // Update local state immediately so header + overview reflect new status
//       setCurrentStatus(statusValue);
//       onStatusUpdate({ ...p, ...updated, status: statusValue });
//       setStatusSuccess(true);
//       setReason("");
//       setTimeout(() => setStatusSuccess(false), 3000);
//     } catch (err) {
//       setStatusError(err instanceof Error ? err.message : "Failed to update status.");
//     } finally {
//       setStatusLoading(false);
//     }
//   };

//   return (
//     <>
//       <SheetHeader>
//         <div className="flex items-center gap-3">
//           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
//             {initials(fullName)}
//           </div>
//           <div className="flex-1">
//             <SheetTitle>{fullName}</SheetTitle>
//             <SheetDescription>{p.uniqueId ?? "—"}</SheetDescription>
//           </div>
//           <StatusBadge status={mapStatus(currentStatus)} />
//         </div>
//       </SheetHeader>

//       <div className="px-4 pb-6">
//         <Tabs defaultValue="overview">
//           <TabsList className="w-full">
//             <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
//             <TabsTrigger value="status" className="flex-1">Update Status</TabsTrigger>
//             <TabsTrigger value="payments" className="flex-1">Payments</TabsTrigger>
//             <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
//           </TabsList>

//           {/* ── Overview ── */}
//           <TabsContent value="overview" className="mt-4">
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <Info label="Date of Birth" value={p.dateOfBirth} />
//               <Info label="Gender" value={p.gender} />
//               <Info label="Phone" value={p.phone} />
//               <Info label="Location" value={p.locationSlug} />
//               <Info label="Status" value={statusDisplayMap[currentStatus] ?? currentStatus} />
//               <Info label="Joined" value={(p.joinedDate as string) ?? "—"} />
//               <Info label="Guardian" value={guardian?.fullName ?? "—"} />
//               <Info label="Relationship" value={guardian?.relationship ?? "—"} />
//               <Info label="Guardian Phone" value={guardian?.phone ?? "—"} />
//               <Info label="Guardian Email" value={guardian?.email ?? "—"} />
//             </div>
//           </TabsContent>

//           {/* ── Update Status ── */}
//           <TabsContent value="status" className="mt-4 space-y-4">
//             <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
//               <div className="space-y-1.5">
//                 <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Status</p>
//                 <StatusBadge status={mapStatus(currentStatus)} />
//               </div>

//               <div className="space-y-1.5">
//                 <Label>New Status</Label>
//                 <Select
//                   value={statusValue}
//                   onValueChange={(val) => setStatusValue(val as ParticipantStatus)}
//                 >
//                   <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
//                   <SelectContent>
//                     {STATUS_OPTIONS.map((s) => (
//                       <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-1.5">
//                 <Label>Reason <span className="text-muted-foreground">(optional)</span></Label>
//                 <Textarea
//                   placeholder="Add an audit note…"
//                   value={reason}
//                   onChange={(e) => setReason(e.target.value)}
//                   rows={3}
//                 />
//               </div>

//               {statusError && (
//                 <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//                   {statusError}
//                 </div>
//               )}
//               {statusSuccess && (
//                 <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600">
//                   Status updated successfully.
//                 </div>
//               )}

//               <Button
//                 onClick={handleStatusSave}
//                 disabled={statusLoading || statusValue === currentStatus}
//                 className="w-full"
//               >
//                 {statusLoading ? "Saving…" : "Save Status"}
//               </Button>
//             </div>
//           </TabsContent>

//           {/* ── Payments ── */}
//           <TabsContent value="payments" className="mt-4 space-y-3">
//             {payments.length === 0 && (
//               <p className="text-sm text-muted-foreground">No payment records yet.</p>
//             )}
//             {payments.map((pay) => (
//               <div key={pay.id} className="rounded-lg border p-4">
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <Info label="Plan" value={pay.plan} />
//                   <Info label="Status" value={<StatusBadge status={pay.status} />} />
//                   <Info label="Total" value={SAR(pay.totalFee)} />
//                   <Info label="Paid" value={SAR(pay.paidAmount)} />
//                   <Info label="Balance" value={SAR(pay.balance)} />
//                 </div>
//                 {pay.invoices.length > 0 && (
//                   <ul className="mt-3 divide-y border-t pt-3">
//                     {pay.invoices.map((inv) => (
//                       <li key={inv.id} className="flex items-center justify-between py-2 text-sm">
//                         <div>
//                           <p className="font-medium">{inv.id}</p>
//                           <p className="text-xs text-muted-foreground">{inv.date} • {inv.method}</p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span>{SAR(inv.amount)}</span>
//                           <Button size="icon" variant="ghost" asChild>
//                             <a href={inv.receiptUrl}><Download className="h-4 w-4" /></a>
//                           </Button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </TabsContent>

//           {/* ── Notes ── */}
//           <TabsContent value="notes" className="mt-4 space-y-3">
//             <p className="text-sm text-muted-foreground">No notes yet.</p>
//             <div className="space-y-2 pt-2">
//               <Textarea placeholder="Add a note…" />
//               <Button size="sm">Add Note</Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </>
//   );
// }

// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//   return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
// }

// function Info({ label, value }: { label: string; value: React.ReactNode }) {
//   return (
//     <div className="rounded-md bg-muted/30 p-2.5">
//       <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
//       <p className="mt-0.5 text-sm font-medium">{value}</p>
//     </div>
//   );
// }


import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Download, Eye, Pencil, Send } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  participantsApi, type Participant, type Gender, type ParticipantStatus, STATUS_OPTIONS,
} from "@/api/participants";
import { guardianAuthApi } from "@/api/guardianAuth";
import { locationsApi, type Location } from "@/api/locations";
import { sessionsApi, type Session } from "@/api/sessions";
import { mockPayments } from "@/data/mockPayments";

export const Route = createFileRoute("/admin/participants")({
  component: ParticipantsPage,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const initials = (n: string) =>
  n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

const statusDisplayMap: Record<string, string> = {
  INQUIRY: "Inquiry",
  DOCUMENTS_PENDING: "Documents Pending",
  FEE_PENDING: "Fee Pending",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  WITHDRAWN: "Withdrawn",
};

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

// ─── Main Page ────────────────────────────────────────────────────────────────

function ParticipantsPage() {
  const [locFilter, setLocFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Participant | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Per-row magic link sending state: participantId → "idle" | "sending" | "sent" | "error"
  const [linkStatus, setLinkStatus] = useState<Record<string, "idle" | "sending" | "sent" | "error">>({});

  const [form, setForm] = useState({
    firstNameEn: "", lastNameEn: "", dateOfBirth: "",
    gender: "" as Gender | "", phone: "", locationSlug: "",
    sessionId: "", guardianFullName: "", guardianRelationship: "",
    guardianPhone: "", guardianEmail: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pData, lData, sData] = await Promise.all([
          participantsApi.getAll(),
          locationsApi.getAll(),
          sessionsApi.getAll(),
        ]);
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
    return participants.filter((p) => {
      const fullName = `${p.firstNameEn} ${p.lastNameEn}`;
      if (locFilter !== "all" && p.locationSlug !== locFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (q) {
        const hay = `${fullName} ${p.phone} ${p.uniqueId ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [participants, locFilter, statusFilter, search]);

  /**
   * Sends a magic link to the guardian of a given participant.
   * tenantSlug comes from the location slug stored on the participant.
   */
  const handleSendMagicLink = async (p: Participant) => {
    const guardian = p.guardian as { email?: string } | null;
    const email = guardian?.email ?? (p as any).guardianEmail;
    const tenantSlug = p.locationSlug ?? (p as any).location?.slug ?? "";

    if (!email) {
      alert("No guardian email on record for this participant.");
      return;
    }

    setLinkStatus((prev) => ({ ...prev, [p.id]: "sending" }));
    try {
      await guardianAuthApi.requestLink(tenantSlug, email);
      setLinkStatus((prev) => ({ ...prev, [p.id]: "sent" }));
      // Reset back to idle after 4 s so the icon doesn't stay green forever
      setTimeout(() => setLinkStatus((prev) => ({ ...prev, [p.id]: "idle" })), 4000);
    } catch {
      setLinkStatus((prev) => ({ ...prev, [p.id]: "error" }));
      setTimeout(() => setLinkStatus((prev) => ({ ...prev, [p.id]: "idle" })), 4000);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.gender) { setFormError("Please select a gender."); return; }
    if (!form.locationSlug) { setFormError("Please select a location."); return; }
    setFormError(null);
    setFormLoading(true);
    try {
      const created = await participantsApi.register({
        firstNameEn: form.firstNameEn,
        lastNameEn: form.lastNameEn,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender as Gender,
        phone: form.phone,
        locationSlug: form.locationSlug,
        sessionId: form.sessionId || undefined,
        guardian: {
          fullName: form.guardianFullName,
          relationship: form.guardianRelationship,
          phone: form.guardianPhone,
          email: form.guardianEmail,
        },
      });
      setParticipants((prev) => [...prev, created]);
      setForm({
        firstNameEn: "", lastNameEn: "", dateOfBirth: "", gender: "",
        phone: "", locationSlug: "", sessionId: "", guardianFullName: "",
        guardianRelationship: "", guardianPhone: "", guardianEmail: "",
      });
      setAddOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to register participant.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusUpdate = (updated: Participant) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, status: updated.status } : p))
    );
    setSelected((prev) => prev ? { ...prev, status: updated.status } : prev);
  };

  const columns: Column<Participant>[] = [
    {
      key: "firstNameEn", header: "Participant",
      render: (r) => {
        const fullName = `${r.firstNameEn} ${r.lastNameEn}`;
        return (
          <button type="button" onClick={() => setSelected(r)} className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
              {initials(fullName)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground hover:text-primary">{fullName}</p>
              <p className="text-xs text-muted-foreground">{r.uniqueId ?? "—"}</p>
            </div>
          </button>
        );
      },
    },
    {
      key: "guardian", header: "Guardian",
      render: (r) => {
        const g = r.guardian as { fullName?: string } | null;
        return g?.fullName ?? (r as any).guardianFullName ?? "—";
      },
    },
    {
      key: "locationSlug", header: "Location",
      render: (r) => {
        const loc = (r as any).location;
        return loc?.name ?? r.locationSlug ?? "—";
      },
    },
    {
      key: "status", header: "Status",
      render: (r) => <StatusBadge status={mapStatus(r.status ?? "Pending")} />,
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
      key: "actions", header: "Actions",
      render: (r) => {
        const ls = linkStatus[r.id] ?? "idle";
        return (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => setSelected(r)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSelected(r)}>
              <Pencil className="h-4 w-4" />
            </Button>
            {/* Send magic link to guardian */}
            <Button
              variant="ghost"
              size="icon"
              disabled={ls === "sending"}
              onClick={() => handleSendMagicLink(r)}
              title="Send guardian magic link"
              className={
                ls === "sent" ? "text-green-600" :
                  ls === "error" ? "text-destructive" : ""
              }
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const filters = (
    <>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, phone, ID…"
        className="w-[220px]"
      />
      <Select value={locFilter} onValueChange={setLocFilter}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Location" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {locations.map((l) => (
            <SelectItem key={l.id} value={l.slug || l.name || l.id}>{l.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <>
      <PageHeader
        title="Participants"
        description={`${participants.length} total`}
        actions={
          <>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button onClick={() => setAddOpen(true)}>Add Participant</Button>
          </>
        }
      />

      <div className="p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading participants…</p>
        ) : apiError ? (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {apiError}
          </div>
        ) : (
          <DataTable
            data={filtered}
            columns={columns}
            searchPlaceholder="Quick search…"
            filters={filters}
          />
        )}
      </div>

      {/* ── Detail drawer ── */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-2xl">
          {selected && (
            <ParticipantDetail
              p={selected}
              onStatusUpdate={handleStatusUpdate}
              onSendMagicLink={handleSendMagicLink}
              magicLinkStatus={linkStatus[selected.id] ?? "idle"}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* ── Add Participant drawer ── */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader className="my-4">
            <SheetTitle>Add Participant</SheetTitle>
            <SheetDescription>Register a new participant.</SheetDescription>
          </SheetHeader>

          <form className="space-y-3 pb-6" onSubmit={handleCreate}>
            {formError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name (En)">
                <Input placeholder="Ahmed" value={form.firstNameEn}
                  onChange={(e) => setForm((f) => ({ ...f, firstNameEn: e.target.value }))} required />
              </Field>
              <Field label="Last Name (En)">
                <Input placeholder="Ali" value={form.lastNameEn}
                  onChange={(e) => setForm((f) => ({ ...f, lastNameEn: e.target.value }))} required />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Date of Birth">
                <Input type="date" value={form.dateOfBirth}
                  onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} required />
              </Field>
              <Field label="Gender">
                <Select value={form.gender}
                  onValueChange={(val) => setForm((f) => ({ ...f, gender: val as Gender }))}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone">
                <Input placeholder="+923110098721" value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
              </Field>
              <Field label="Location">
                <Select value={form.locationSlug}
                  onValueChange={(val) => setForm((f) => ({ ...f, locationSlug: val, sessionId: "" }))}>
                  <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>
                    {locations.map((l) => (
                      <SelectItem
                        key={l.id}
                        value={l.slug || l.name.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Field label="Session">
                <Select value={form.sessionId}
                  onValueChange={(val) => setForm((f) => ({ ...f, sessionId: val }))} disabled={!form.locationSlug}>
                  <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
                  <SelectContent>
                    {sessions
                      .filter((s) => {
                        const selectedLoc = locations.find((loc) => (loc.slug || loc.name.toLowerCase().replace(/\s+/g, "-")) === form.locationSlug);
                        return selectedLoc && s.locations.some((sl) => sl.locationId === selectedLoc.id);
                      })
                      .map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <hr className="my-4 border-muted" />
            <p className="text-sm">Guardian Information</p>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Guardian Name">
                <Input placeholder="Mohammad Ali" value={form.guardianFullName}
                  onChange={(e) => setForm((f) => ({ ...f, guardianFullName: e.target.value }))} required />
              </Field>
              <Field label="Relationship">
                <Input placeholder="Brother" value={form.guardianRelationship}
                  onChange={(e) => setForm((f) => ({ ...f, guardianRelationship: e.target.value }))} required />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Guardian Phone">
                <Input placeholder="+923220098712" value={form.guardianPhone}
                  onChange={(e) => setForm((f) => ({ ...f, guardianPhone: e.target.value }))} required />
              </Field>
              <Field label="Guardian Email">
                <Input type="email" placeholder="muhammad.ali@gmail.com" value={form.guardianEmail}
                  onChange={(e) => setForm((f) => ({ ...f, guardianEmail: e.target.value }))} required />
              </Field>
            </div>

            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Registering…" : "Create Participant"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ─── Participant Detail ───────────────────────────────────────────────────────

function ParticipantDetail({
  p,
  onStatusUpdate,
  onSendMagicLink,
  magicLinkStatus,
}: {
  p: Participant;
  onStatusUpdate: (updated: Participant) => void;
  onSendMagicLink: (p: Participant) => void;
  magicLinkStatus: "idle" | "sending" | "sent" | "error";
}) {
  const fullName = `${p.firstNameEn} ${p.lastNameEn}`;
  const payments = mockPayments.filter((pp) => pp.participantId === p.id);
  const guardian = p.guardian as {
    fullName: string; relationship: string; phone: string; email: string;
  };

  const [currentStatus, setCurrentStatus] = useState(p.status ?? "INQUIRY");
  const [statusValue, setStatusValue] = useState<ParticipantStatus>(
    (p.status as ParticipantStatus) ?? "INQUIRY"
  );
  const [reason, setReason] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState(false);

  const handleStatusSave = async () => {
    setStatusLoading(true);
    setStatusError(null);
    setStatusSuccess(false);
    try {
      const updated = await participantsApi.updateStatus(p.id, {
        status: statusValue,
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      });
      setCurrentStatus(statusValue);
      onStatusUpdate({ ...p, ...updated, status: statusValue });
      setStatusSuccess(true);
      setReason("");
      setTimeout(() => setStatusSuccess(false), 3000);
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const magicLinkLabel = {
    idle: "Send Magic Link",
    sending: "Sending…",
    sent: "Link Sent!",
    error: "Failed — Retry",
  }[magicLinkStatus];

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
            {initials(fullName)}
          </div>
          <div className="flex-1">
            <SheetTitle>{fullName}</SheetTitle>
            <SheetDescription>{p.uniqueId ?? "—"}</SheetDescription>
          </div>
          <StatusBadge status={mapStatus(currentStatus)} />
        </div>
      </SheetHeader>

      <div className="px-4 pb-6">
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="status" className="flex-1">Update Status</TabsTrigger>
            <TabsTrigger value="payments" className="flex-1">Payments</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Date of Birth" value={p.dateOfBirth} />
              <Info label="Gender" value={p.gender} />
              <Info label="Phone" value={p.phone} />
              <Info label="Location" value={p.locationSlug} />
              <Info label="Status" value={statusDisplayMap[currentStatus] ?? currentStatus} />
              <Info label="Joined" value={(p.joinedDate as string) ?? "—"} />
              <Info label="Guardian" value={guardian?.fullName ?? "—"} />
              <Info label="Relationship" value={guardian?.relationship ?? "—"} />
              <Info label="Guardian Phone" value={guardian?.phone ?? "—"} />
              <Info label="Guardian Email" value={guardian?.email ?? "—"} />
            </div>

            {/* Magic link action — sits right below guardian info */}
            <div className="rounded-lg border bg-muted/20 p-4 space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Guardian Portal Access</p>
              <p className="text-sm text-muted-foreground">
                Send a magic link to <span className="font-medium text-foreground">{guardian?.email ?? "guardian's email"}</span> so they can log into the guardian portal.
              </p>
              <Button
                size="sm"
                variant={magicLinkStatus === "sent" ? "outline" : "default"}
                disabled={magicLinkStatus === "sending"}
                onClick={() => onSendMagicLink(p)}
                className={
                  magicLinkStatus === "sent" ? "text-green-600 border-green-600" :
                    magicLinkStatus === "error" ? "text-destructive border-destructive" : ""
                }
              >
                <Send className="mr-2 h-4 w-4" />
                {magicLinkLabel}
              </Button>
            </div>
          </TabsContent>

          {/* ── Update Status ── */}
          <TabsContent value="status" className="mt-4 space-y-4">
            <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Status</p>
                <StatusBadge status={mapStatus(currentStatus)} />
              </div>
              <div className="space-y-1.5">
                <Label>New Status</Label>
                <Select value={statusValue} onValueChange={(val) => setStatusValue(val as ParticipantStatus)}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Reason <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea placeholder="Add an audit note…" value={reason}
                  onChange={(e) => setReason(e.target.value)} rows={3} />
              </div>
              {statusError && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{statusError}</div>
              )}
              {statusSuccess && (
                <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600">
                  Status updated successfully.
                </div>
              )}
              <Button onClick={handleStatusSave} disabled={statusLoading || statusValue === currentStatus} className="w-full">
                {statusLoading ? "Saving…" : "Save Status"}
              </Button>
            </div>
          </TabsContent>

          {/* ── Payments ── */}
          <TabsContent value="payments" className="mt-4 space-y-3">
            {payments.length === 0 && (
              <p className="text-sm text-muted-foreground">No payment records yet.</p>
            )}
            {payments.map((pay) => (
              <div key={pay.id} className="rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Plan" value={pay.plan} />
                  <Info label="Status" value={<StatusBadge status={pay.status} />} />
                  <Info label="Total" value={SAR(pay.totalFee)} />
                  <Info label="Paid" value={SAR(pay.paidAmount)} />
                  <Info label="Balance" value={SAR(pay.balance)} />
                </div>
                {pay.invoices.length > 0 && (
                  <ul className="mt-3 divide-y border-t pt-3">
                    {pay.invoices.map((inv) => (
                      <li key={inv.id} className="flex items-center justify-between py-2 text-sm">
                        <div>
                          <p className="font-medium">{inv.id}</p>
                          <p className="text-xs text-muted-foreground">{inv.date} • {inv.method}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>{SAR(inv.amount)}</span>
                          <Button size="icon" variant="ghost" asChild>
                            <a href={inv.receiptUrl}><Download className="h-4 w-4" /></a>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </TabsContent>

          {/* ── Notes ── */}
          <TabsContent value="notes" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">No notes yet.</p>
            <div className="space-y-2 pt-2">
              <Textarea placeholder="Add a note…" />
              <Button size="sm">Add Note</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-muted/30 p-2.5">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}