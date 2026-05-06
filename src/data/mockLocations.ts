export type LocationStatus = "Active" | "Inactive";

export interface MockLocation {
  id: string;
  name: string;
  city: string;
  capacity: number;
  enrolled: number;
  status: LocationStatus;
  manager: string;
  createdAt: string;
}

export const mockLocations: MockLocation[] = [
  {
    id: "loc-riy",
    name: "Riyadh Academy",
    city: "Riyadh",
    capacity: 400,
    enrolled: 312,
    status: "Active",
    manager: "Khalid Al-Saud",
    createdAt: "2022-03-14",
  },
  {
    id: "loc-jed",
    name: "Jeddah Branch",
    city: "Jeddah",
    capacity: 280,
    enrolled: 221,
    status: "Active",
    manager: "Sara Al-Harbi",
    createdAt: "2022-09-01",
  },
  {
    id: "loc-dmm",
    name: "Dammam Centre",
    city: "Dammam",
    capacity: 200,
    enrolled: 138,
    status: "Active",
    manager: "Faisal Al-Qahtani",
    createdAt: "2023-06-22",
  },
];
