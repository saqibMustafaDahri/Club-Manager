export type ParticipantStatus =
  | "Inquiry"
  | "Documents Pending"
  | "Fee Pending"
  | "Active"
  | "On Hold"
  | "Completed"
  | "Withdrawn";

export type DocumentStatus = "Uploaded" | "Missing" | "Under Review";

export interface ParticipantDocument {
  name: string;
  status: DocumentStatus;
}

export interface ParticipantNote {
  text: string;
  author: string;
  timestamp: string;
}

export interface MockParticipant {
  id: string;
  fullName: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  location: string;
  session: string;
  status: ParticipantStatus;
  age: number;
  nationality: string;
  joinedDate: string;
  uniqueId: string;
  documents: ParticipantDocument[];
  notes: ParticipantNote[];
}

export const mockParticipants: MockParticipant[] = [
  {
    id: "p-001", uniqueId: "NMR-1001",
    fullName: "Ahmed Al-Saud", guardianName: "Mohammed Al-Saud",
    guardianPhone: "+966 50 123 4567", guardianEmail: "m.alsaud@example.sa",
    location: "Riyadh Academy", session: "Spring 2025", status: "Active",
    age: 11, nationality: "Saudi", joinedDate: "2025-01-20",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Uploaded" },
      { name: "Photo", status: "Uploaded" },
    ],
    notes: [{ text: "Excellent attendance.", author: "Coach Faris", timestamp: "2025-04-12T09:00:00Z" }],
  },
  {
    id: "p-002", uniqueId: "NMR-1002",
    fullName: "Lina Al-Qahtani", guardianName: "Abdulrahman Al-Qahtani",
    guardianPhone: "+966 55 234 5678", guardianEmail: "a.qahtani@example.sa",
    location: "Jeddah Branch", session: "Summer Camp 2025", status: "Active",
    age: 9, nationality: "Saudi", joinedDate: "2025-05-30",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Under Review" },
    ],
    notes: [],
  },
  {
    id: "p-003", uniqueId: "NMR-1003",
    fullName: "Yousef Al-Otaibi", guardianName: "Salem Al-Otaibi",
    guardianPhone: "+966 56 345 6789", guardianEmail: "salem.o@example.sa",
    location: "Riyadh Academy", session: "Fall 2025", status: "Fee Pending",
    age: 13, nationality: "Saudi", joinedDate: "2025-08-12",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Uploaded" },
    ],
    notes: [{ text: "Awaiting first instalment.", author: "Finance Team", timestamp: "2025-08-20T11:30:00Z" }],
  },
  {
    id: "p-004", uniqueId: "NMR-1004",
    fullName: "Mariam Al-Zahrani", guardianName: "Hassan Al-Zahrani",
    guardianPhone: "+966 53 456 7890", guardianEmail: "h.zahrani@example.sa",
    location: "Dammam Centre", session: "Winter Programme", status: "Inquiry",
    age: 8, nationality: "Saudi", joinedDate: "2025-11-02",
    documents: [{ name: "ID Copy", status: "Missing" }],
    notes: [{ text: "Trial requested for next week.", author: "Front Desk", timestamp: "2025-11-02T14:00:00Z" }],
  },
  {
    id: "p-005", uniqueId: "NMR-1005",
    fullName: "Omar Al-Harbi", guardianName: "Nasser Al-Harbi",
    guardianPhone: "+966 54 567 8901", guardianEmail: "n.harbi@example.sa",
    location: "Jeddah Branch", session: "Summer Camp 2025", status: "Documents Pending",
    age: 12, nationality: "Saudi", joinedDate: "2025-06-01",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Missing" },
      { name: "Photo", status: "Missing" },
    ],
    notes: [],
  },
  {
    id: "p-006", uniqueId: "NMR-1006",
    fullName: "Fatima Al-Dossari", guardianName: "Tariq Al-Dossari",
    guardianPhone: "+966 50 678 9012", guardianEmail: "t.dossari@example.sa",
    location: "Riyadh Academy", session: "Spring 2025", status: "Completed",
    age: 14, nationality: "Saudi", joinedDate: "2025-02-05",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Uploaded" },
      { name: "Photo", status: "Uploaded" },
    ],
    notes: [{ text: "Graduated to advanced squad.", author: "Coach Faris", timestamp: "2025-05-16T10:00:00Z" }],
  },
  {
    id: "p-007", uniqueId: "NMR-1007",
    fullName: "Khalid Al-Mutairi", guardianName: "Bandar Al-Mutairi",
    guardianPhone: "+966 55 789 0123", guardianEmail: "b.mutairi@example.sa",
    location: "Riyadh Academy", session: "Fall 2025", status: "Active",
    age: 10, nationality: "Saudi", joinedDate: "2025-09-04",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Uploaded" },
    ],
    notes: [],
  },
  {
    id: "p-008", uniqueId: "NMR-1008",
    fullName: "Noura Al-Ghamdi", guardianName: "Saad Al-Ghamdi",
    guardianPhone: "+966 56 890 1234", guardianEmail: "s.ghamdi@example.sa",
    location: "Jeddah Branch", session: "Summer Camp 2025", status: "On Hold",
    age: 11, nationality: "Saudi", joinedDate: "2025-06-18",
    documents: [{ name: "ID Copy", status: "Uploaded" }],
    notes: [{ text: "Paused due to travel.", author: "Location Manager", timestamp: "2025-07-01T08:30:00Z" }],
  },
  {
    id: "p-009", uniqueId: "NMR-1009",
    fullName: "Hassan Al-Anazi", guardianName: "Majed Al-Anazi",
    guardianPhone: "+966 53 901 2345", guardianEmail: "m.anazi@example.sa",
    location: "Dammam Centre", session: "Winter Programme", status: "Active",
    age: 13, nationality: "Saudi", joinedDate: "2025-12-22",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Uploaded" },
    ],
    notes: [],
  },
  {
    id: "p-010", uniqueId: "NMR-1010",
    fullName: "Reem Al-Subaie", guardianName: "Yousef Al-Subaie",
    guardianPhone: "+966 54 012 3456", guardianEmail: "y.subaie@example.sa",
    location: "Riyadh Academy", session: "Fall 2025", status: "Active",
    age: 9, nationality: "Bahraini", joinedDate: "2025-09-10",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Uploaded" },
    ],
    notes: [],
  },
  {
    id: "p-011", uniqueId: "NMR-1011",
    fullName: "Abdullah Al-Shehri", guardianName: "Ibrahim Al-Shehri",
    guardianPhone: "+966 50 123 7654", guardianEmail: "i.shehri@example.sa",
    location: "Jeddah Branch", session: "Summer Camp 2025", status: "Withdrawn",
    age: 12, nationality: "Saudi", joinedDate: "2025-06-05",
    documents: [{ name: "ID Copy", status: "Uploaded" }],
    notes: [{ text: "Family relocated.", author: "Front Desk", timestamp: "2025-07-20T13:00:00Z" }],
  },
  {
    id: "p-012", uniqueId: "NMR-1012",
    fullName: "Hala Al-Fahad", guardianName: "Waleed Al-Fahad",
    guardianPhone: "+966 55 234 8765", guardianEmail: "w.fahad@example.sa",
    location: "Dammam Centre", session: "Winter Programme", status: "Documents Pending",
    age: 10, nationality: "Kuwaiti", joinedDate: "2025-12-28",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Missing" },
    ],
    notes: [],
  },
  {
    id: "p-013", uniqueId: "NMR-1013",
    fullName: "Saif Al-Rashid", guardianName: "Fahad Al-Rashid",
    guardianPhone: "+966 56 345 9876", guardianEmail: "f.rashid@example.sa",
    location: "Riyadh Academy", session: "Annual Enrolment 2026", status: "Inquiry",
    age: 11, nationality: "Emirati", joinedDate: "2025-11-25",
    documents: [{ name: "ID Copy", status: "Missing" }],
    notes: [],
  },
  {
    id: "p-014", uniqueId: "NMR-1014",
    fullName: "Latifa Al-Khalifa", guardianName: "Ali Al-Khalifa",
    guardianPhone: "+966 53 456 0987", guardianEmail: "ali.k@example.sa",
    location: "Jeddah Branch", session: "Summer Camp 2025", status: "Active",
    age: 8, nationality: "Saudi", joinedDate: "2025-06-12",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Uploaded" },
      { name: "Photo", status: "Uploaded" },
    ],
    notes: [],
  },
  {
    id: "p-015", uniqueId: "NMR-1015",
    fullName: "Talal Al-Juhani", guardianName: "Rakan Al-Juhani",
    guardianPhone: "+966 54 567 1098", guardianEmail: "r.juhani@example.sa",
    location: "Riyadh Academy", session: "Fall 2025", status: "Fee Pending",
    age: 13, nationality: "Saudi", joinedDate: "2025-09-15",
    documents: [
      { name: "ID Copy", status: "Uploaded" },
      { name: "Medical Form", status: "Under Review" },
    ],
    notes: [{ text: "Reminder sent for outstanding balance.", author: "Finance Team", timestamp: "2025-10-05T09:15:00Z" }],
  },
];
