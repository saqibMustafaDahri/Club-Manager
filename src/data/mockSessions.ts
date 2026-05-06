export type SessionStatus = "Open" | "Closed" | "Upcoming";

export interface MockSession {
  id: string;
  name: string;
  locationId: string;
  startDate: string;
  endDate: string;
  baseFee: number;
  currency: "SAR";
  status: SessionStatus;
  enrolledCount: number;
  capacity: number;
}

export const mockSessions: MockSession[] = [
  {
    id: "ses-spring-25",
    name: "Spring 2025",
    locationId: "loc-riy",
    startDate: "2025-02-01",
    endDate: "2025-05-15",
    baseFee: 1800,
    currency: "SAR",
    status: "Closed",
    enrolledCount: 142,
    capacity: 150,
  },
  {
    id: "ses-summer-25",
    name: "Summer Camp 2025",
    locationId: "loc-jed",
    startDate: "2025-06-15",
    endDate: "2025-08-20",
    baseFee: 1200,
    currency: "SAR",
    status: "Open",
    enrolledCount: 98,
    capacity: 120,
  },
  {
    id: "ses-fall-25",
    name: "Fall 2025",
    locationId: "loc-riy",
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    baseFee: 2000,
    currency: "SAR",
    status: "Open",
    enrolledCount: 175,
    capacity: 200,
  },
  {
    id: "ses-winter-25",
    name: "Winter Programme",
    locationId: "loc-dmm",
    startDate: "2025-12-20",
    endDate: "2026-02-10",
    baseFee: 1500,
    currency: "SAR",
    status: "Upcoming",
    enrolledCount: 42,
    capacity: 100,
  },
  {
    id: "ses-annual-26",
    name: "Annual Enrolment 2026",
    locationId: "loc-riy",
    startDate: "2026-01-15",
    endDate: "2026-12-15",
    baseFee: 5400,
    currency: "SAR",
    status: "Upcoming",
    enrolledCount: 18,
    capacity: 250,
  },
];
