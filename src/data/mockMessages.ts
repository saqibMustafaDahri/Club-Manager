export type MessageChannel = "WhatsApp" | "Email" | "WhatsApp + Email";
export type DeliveryStatus = "Sent" | "Pending" | "Failed";
export type RecipientGroup = "All Participants" | "Active Only" | "Pending Fees" | "By Session";

export interface MockMessage {
  id: string;
  recipientGroup: RecipientGroup;
  recipientCount: number;
  preview: string;
  channel: MessageChannel;
  sentDate: string;
  status: DeliveryStatus;
}

export const mockMessages: MockMessage[] = [
  { id: "msg-01", recipientGroup: "All Participants", recipientCount: 312, preview: "Reminder: Spring training starts at 4pm tomorrow.", channel: "WhatsApp + Email", sentDate: "2025-11-28 09:00", status: "Sent" },
  { id: "msg-02", recipientGroup: "Pending Fees", recipientCount: 24, preview: "Your November invoice is due. Tap to pay.", channel: "WhatsApp", sentDate: "2025-11-25 14:30", status: "Sent" },
  { id: "msg-03", recipientGroup: "Active Only", recipientCount: 248, preview: "New squad assignments published — please check.", channel: "Email", sentDate: "2025-11-22 11:15", status: "Sent" },
  { id: "msg-04", recipientGroup: "By Session", recipientCount: 32, preview: "Summer Camp 2025 closing ceremony details enclosed.", channel: "WhatsApp + Email", sentDate: "2025-11-18 17:00", status: "Sent" },
  { id: "msg-05", recipientGroup: "All Participants", recipientCount: 312, preview: "Holiday schedule update — see attached calendar.", channel: "Email", sentDate: "2025-11-12 08:45", status: "Sent" },
  { id: "msg-06", recipientGroup: "Pending Fees", recipientCount: 11, preview: "Final reminder before access is paused.", channel: "WhatsApp", sentDate: "2025-11-05 10:20", status: "Failed" },
];
