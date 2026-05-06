export interface Session {
  id: string;
  programme: string;
  location: string;
  coach: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export const sessions: Session[] = [
  { id: "S-2201", programme: "Football U10", location: "Dublin North", coach: "Mark Doyle", date: "2026-05-06", startTime: "16:30", endTime: "17:30", capacity: 20, enrolled: 18, status: "Scheduled" },
  { id: "S-2202", programme: "Football U12", location: "London West", coach: "Priya Shah", date: "2026-05-06", startTime: "17:00", endTime: "18:15", capacity: 22, enrolled: 22, status: "Scheduled" },
  { id: "S-2203", programme: "Multi-Sport U8", location: "Berlin Mitte", coach: "Tomás Weber", date: "2026-05-07", startTime: "16:00", endTime: "17:00", capacity: 16, enrolled: 12, status: "Scheduled" },
  { id: "S-2204", programme: "Athletics U14", location: "London West", coach: "Priya Shah", date: "2026-05-07", startTime: "18:30", endTime: "19:45", capacity: 18, enrolled: 14, status: "Scheduled" },
  { id: "S-2205", programme: "Football U10", location: "Dublin North", coach: "Mark Doyle", date: "2026-05-04", startTime: "16:30", endTime: "17:30", capacity: 20, enrolled: 19, status: "Completed" },
  { id: "S-2206", programme: "Football U12", location: "Paris Sud", coach: "Lucie Bernard", date: "2026-05-08", startTime: "17:30", endTime: "18:45", capacity: 22, enrolled: 20, status: "Scheduled" },
  { id: "S-2207", programme: "Athletics U14", location: "Lisbon Centre", coach: "Rui Mendes", date: "2026-05-09", startTime: "10:00", endTime: "11:30", capacity: 18, enrolled: 9, status: "Scheduled" },
  { id: "S-2208", programme: "Football U10", location: "Dublin North", coach: "Mark Doyle", date: "2026-05-02", startTime: "10:00", endTime: "11:00", capacity: 20, enrolled: 17, status: "Cancelled" },
];

export interface AttendanceRecord {
  sessionId: string;
  participantId: string;
  participantName: string;
  status: "Present" | "Absent" | "Late";
}

export const attendance: AttendanceRecord[] = [
  { sessionId: "S-2205", participantId: "P-1042", participantName: "Liam O'Connor", status: "Present" },
  { sessionId: "S-2205", participantId: "P-1046", participantName: "Jakub Nowak", status: "Absent" },
  { sessionId: "S-2205", participantId: "P-1050", participantName: "Owen Byrne", status: "Present" },
  { sessionId: "S-2205", participantId: "P-1048", participantName: "Ethan Walsh", status: "Late" },
];
