export interface Participant {
  id: string;
  name: string;
  age: number;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  location: string;
  programme: string;
  status: "Active" | "Pending" | "On Hold" | "Withdrawn" | "Completed";
  joinedAt: string;
  outstandingFees: number;
}

export const participants: Participant[] = [
  { id: "P-1042", name: "Liam O'Connor", age: 9, guardianName: "Aoife O'Connor", guardianEmail: "aoife@example.com", guardianPhone: "+353 87 123 4567", location: "Dublin North", programme: "Football U10", status: "Active", joinedAt: "2024-09-12", outstandingFees: 0 },
  { id: "P-1043", name: "Sofia Martins", age: 11, guardianName: "Bruno Martins", guardianEmail: "bruno@example.com", guardianPhone: "+44 7700 900123", location: "London West", programme: "Football U12", status: "Active", joinedAt: "2024-08-30", outstandingFees: 0 },
  { id: "P-1044", name: "Noah Schmidt", age: 8, guardianName: "Hannah Schmidt", guardianEmail: "hannah@example.com", guardianPhone: "+49 151 23456789", location: "Berlin Mitte", programme: "Multi-Sport U8", status: "Pending", joinedAt: "2026-04-22", outstandingFees: 180 },
  { id: "P-1045", name: "Maya Patel", age: 13, guardianName: "Ravi Patel", guardianEmail: "ravi@example.com", guardianPhone: "+44 7700 900456", location: "London West", programme: "Athletics U14", status: "Active", joinedAt: "2025-01-08", outstandingFees: 0 },
  { id: "P-1046", name: "Jakub Nowak", age: 10, guardianName: "Eva Nowak", guardianEmail: "eva@example.com", guardianPhone: "+353 86 555 0199", location: "Dublin North", programme: "Football U10", status: "On Hold", joinedAt: "2024-11-03", outstandingFees: 240 },
  { id: "P-1047", name: "Chloe Dubois", age: 12, guardianName: "Marc Dubois", guardianEmail: "marc@example.com", guardianPhone: "+33 6 12 34 56 78", location: "Paris Sud", programme: "Football U12", status: "Active", joinedAt: "2024-10-15", outstandingFees: 0 },
  { id: "P-1048", name: "Ethan Walsh", age: 7, guardianName: "Niamh Walsh", guardianEmail: "niamh@example.com", guardianPhone: "+353 87 222 3344", location: "Dublin North", programme: "Multi-Sport U8", status: "Withdrawn", joinedAt: "2024-06-01", outstandingFees: 0 },
  { id: "P-1049", name: "Aria Costa", age: 14, guardianName: "Diego Costa", guardianEmail: "diego@example.com", guardianPhone: "+351 91 234 5678", location: "Lisbon Centre", programme: "Athletics U14", status: "Active", joinedAt: "2025-02-19", outstandingFees: 60 },
  { id: "P-1050", name: "Owen Byrne", age: 9, guardianName: "Sarah Byrne", guardianEmail: "sarah@example.com", guardianPhone: "+353 85 444 7788", location: "Dublin North", programme: "Football U10", status: "Active", joinedAt: "2025-03-04", outstandingFees: 0 },
  { id: "P-1051", name: "Isla Murphy", age: 11, guardianName: "Conor Murphy", guardianEmail: "conor@example.com", guardianPhone: "+353 86 778 9911", location: "Cork City", programme: "Football U12", status: "Completed", joinedAt: "2023-09-01", outstandingFees: 0 },
  { id: "P-1052", name: "Yusuf Demir", age: 10, guardianName: "Selin Demir", guardianEmail: "selin@example.com", guardianPhone: "+44 7700 900777", location: "London West", programme: "Football U10", status: "Active", joinedAt: "2025-04-12", outstandingFees: 0 },
  { id: "P-1053", name: "Mila Andersen", age: 8, guardianName: "Lars Andersen", guardianEmail: "lars@example.com", guardianPhone: "+45 20 12 34 56", location: "Copenhagen", programme: "Multi-Sport U8", status: "Pending", joinedAt: "2026-04-30", outstandingFees: 120 },
];
