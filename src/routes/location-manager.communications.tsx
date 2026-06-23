// import { createFileRoute } from "@tanstack/react-router";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Send } from "lucide-react";
// import { PageHeader } from "@/components/PageHeader";
// import { StatusBadge } from "@/components/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// import { mockMessages, type RecipientGroup } from "@/data/mockMessages";
// import { mockParticipants } from "@/data/mockParticipants";

// export const Route = createFileRoute("/location-manager/communications")({
//   component: CommunicationsPage,
// });

// const RIYADH_NAME = "Riyadh Academy";

// const groupCount: Record<RecipientGroup, number> = {
//   "All Participants": mockParticipants.filter((p) => p.location === RIYADH_NAME).length,
//   "Active Only": mockParticipants.filter((p) => p.location === RIYADH_NAME && p.status === "Active").length,
//   "Pending Fees": mockParticipants.filter((p) => p.location === RIYADH_NAME && p.status === "Fee Pending").length,
//   "By Session": mockParticipants.filter((p) => p.location === RIYADH_NAME && p.session === "Fall 2025").length,
// };

// function CommunicationsPage() {
//   const [group, setGroup] = useState<RecipientGroup>("All Participants");
//   const [whatsapp, setWhatsapp] = useState(true);
//   const [email, setEmail] = useState(true);
//   const [message, setMessage] = useState("");

//   const handleSend = (e: React.FormEvent) => {
//     e.preventDefault();
//     const count = groupCount[group];
//     toast.success(`Announcement sent to ${count} participants`);
//     setMessage("");
//   };

//   return (
//     <>
//       <PageHeader
//         title="Communications"
//         description="Riyadh Academy"
//         actions={<Button>Send Announcement</Button>}
//       />
//       <div className="grid gap-6 p-6 lg:grid-cols-2">
//         {/* Sent history */}
//         <div className="rounded-xl border bg-card shadow-sm">
//           <div className="border-b px-5 py-4">
//             <h2 className="text-base font-semibold">Sent Messages</h2>
//             <p className="text-xs text-muted-foreground">{mockMessages.length} announcements</p>
//           </div>
//           <ul className="divide-y">
//             {mockMessages.map((m) => (
//               <li key={m.id} className="px-5 py-4">
//                 <div className="flex items-center justify-between gap-3">
//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-center gap-2">
//                       <p className="text-sm font-medium">{m.recipientGroup}</p>
//                       <span className="text-xs text-muted-foreground">• {m.recipientCount} recipients</span>
//                     </div>
//                     <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{m.preview}</p>
//                     <p className="mt-1 text-xs text-muted-foreground">{m.channel} • {m.sentDate}</p>
//                   </div>
//                   <StatusBadge status={m.status} />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* New announcement */}
//         <form
//           onSubmit={handleSend}
//           className="rounded-xl border bg-card p-5 shadow-sm"
//         >
//           <h2 className="text-base font-semibold">Send New Announcement</h2>
//           <p className="text-xs text-muted-foreground">Reach participants by WhatsApp or Email.</p>

//           <div className="mt-5 space-y-4">
//             <div className="space-y-1.5">
//               <Label>To</Label>
//               <Select value={group} onValueChange={(v) => setGroup(v as RecipientGroup)}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="All Participants">All Participants ({groupCount["All Participants"]})</SelectItem>
//                   <SelectItem value="Active Only">Active Only ({groupCount["Active Only"]})</SelectItem>
//                   <SelectItem value="Pending Fees">Pending Fees ({groupCount["Pending Fees"]})</SelectItem>
//                   <SelectItem value="By Session">By Session ({groupCount["By Session"]})</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Channel</Label>
//               <div className="flex gap-4 rounded-md border p-3">
//                 <label className="flex items-center gap-2 text-sm">
//                   <Checkbox checked={whatsapp} onCheckedChange={(v) => setWhatsapp(!!v)} /> WhatsApp
//                 </label>
//                 <label className="flex items-center gap-2 text-sm">
//                   <Checkbox checked={email} onCheckedChange={(v) => setEmail(!!v)} /> Email
//                 </label>
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <Label>Message</Label>
//               <Textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type your announcement…"
//                 rows={6}
//               />
//             </div>

//             <Button type="submit" disabled={!message.trim() || (!whatsapp && !email)}>
//               <Send className="mr-2 h-4 w-4" /> Send
//             </Button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { mockParticipants } from "@/data/mockParticipants";
import { type RecipientGroup } from "@/data/mockMessages";
import { notificationsApi, type Notification } from "@/api/notifications"; // Adjust path to your file

export const Route = createFileRoute("/location-manager/communications")({
  component: CommunicationsPage,
});

const RIYADH_NAME = "Riyadh Academy";

const groupCount: Record<RecipientGroup, number> = {
  "All Participants": mockParticipants.filter((p) => p.location === RIYADH_NAME).length,
  "Active Only": mockParticipants.filter((p) => p.location === RIYADH_NAME && p.status === "Active").length,
  "Pending Fees": mockParticipants.filter((p) => p.location === RIYADH_NAME && p.status === "Fee Pending").length,
  "By Session": mockParticipants.filter((p) => p.location === RIYADH_NAME && p.session === "Fall 2025").length,
};

function CommunicationsPage() {
  // UI Fields State
  const [group, setGroup] = useState<RecipientGroup>("All Participants");
  const [whatsapp, setWhatsapp] = useState(true);
  const [email, setEmail] = useState(true);
  const [message, setMessage] = useState("");

  // Axios Data Fetching States
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 1. Fetch function using your notificationsApi
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await notificationsApi.getAll(1, 50); // Grabbing latest 50 logs
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Run the fetch when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // 2. Handle the Axios POST submission
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);

      // Using your retry client method as a placeholder wrapper for sending
      await notificationsApi.retry(message);

      toast.success(`Announcement sent to ${groupCount[group]} participants`);
      setMessage("");

      // Refresh the notification history instantly after a successful send
      await fetchNotifications();
    } catch (error) {
      console.error("Error sending announcement:", error);
      toast.error("Failed to distribute announcement. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Just now";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <PageHeader
        title="Communications"
        description={RIYADH_NAME}
        actions={
          <Button onClick={() => document.getElementById("announcement-form")?.scrollIntoView({ behavior: 'smooth' })}>
            New Announcement
          </Button>
        }
      />
      <div className="grid gap-6 p-6 lg:grid-cols-2">

        {/* Sent History Stack */}
        <div className="rounded-xl border bg-card shadow-sm flex flex-col h-[650px]">
          <div className="border-b px-5 py-4">
            <h2 className="text-base font-semibold">Sent Messages</h2>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading histories..." : `${notifications.length} distribution records found`}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm">Retrieving outbound messages...</p>
              </div>
            )}

            {isError && (
              <div className="p-6 text-center text-sm text-destructive h-full flex flex-col items-center justify-center gap-2">
                <p>Failed to load sent communication tracking logs.</p>
                <Button variant="outline" size="sm" onClick={fetchNotifications}>Retry Fetch</Button>
              </div>
            )}

            {!isLoading && !isError && notifications.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                No past announcements found for this branch.
              </div>
            )}

            {!isLoading && !isError && notifications.map((m) => (
              <div key={m.id} className="px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* <p className="text-sm font-medium text-foreground">
                        {m.participantName || m.type || "Bulk Group Broadcast"}
                      </p> */}
                      <span className="text-xs text-muted-foreground">
                        {m.channel}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground whitespace-pre-wrap">
                      {m.bodyText || "No preview content text available."}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground/80">
                      {formatDate(m.sentAt)} {m.balance ? `• Outstanding balance: $${m.balance}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={m.status || "Sent"} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New announcement input form */}
        <form
          id="announcement-form"
          onSubmit={handleSend}
          className="rounded-xl border bg-card p-5 shadow-sm h-fit sticky top-6"
        >
          <h2 className="text-base font-semibold">Send New Announcement</h2>
          <p className="text-xs text-muted-foreground">Reach participants by WhatsApp or Email.</p>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label>To</Label>
              <Select value={group} onValueChange={(v) => setGroup(v as RecipientGroup)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Participants">All Participants ({groupCount["All Participants"]})</SelectItem>
                  <SelectItem value="Active Only">Active Only ({groupCount["Active Only"]})</SelectItem>
                  <SelectItem value="Pending Fees">Pending Fees ({groupCount["Pending Fees"]})</SelectItem>
                  <SelectItem value="By Session">By Session ({groupCount["By Session"]})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Channel</Label>
              <div className="flex gap-4 rounded-md border p-3 bg-background/50">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                  <Checkbox checked={whatsapp} onCheckedChange={(v) => setWhatsapp(!!v)} /> WhatsApp
                </label>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                  <Checkbox checked={email} onCheckedChange={(v) => setEmail(!!v)} /> Email
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your announcement content here..."
                rows={6}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={!message.trim() || (!whatsapp && !email) || isSending}
              className="w-full sm:w-auto"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Announcement
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}