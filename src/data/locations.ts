export interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  manager: string;
  participants: number;
  staff: number;
  status: "Active" | "Pending" | "On Hold";
  monthlyRevenue: number;
}

export const locations: Location[] = [
  { id: "L-01", name: "Dublin North", city: "Dublin", country: "Ireland", manager: "Sinead Kelly", participants: 312, staff: 18, status: "Active", monthlyRevenue: 38400 },
  { id: "L-02", name: "London West", city: "London", country: "UK", manager: "James Carter", participants: 421, staff: 24, status: "Active", monthlyRevenue: 52800 },
  { id: "L-03", name: "Berlin Mitte", city: "Berlin", country: "Germany", manager: "Klaus Becker", participants: 198, staff: 12, status: "Active", monthlyRevenue: 24750 },
  { id: "L-04", name: "Paris Sud", city: "Paris", country: "France", manager: "Camille Rousseau", participants: 256, staff: 15, status: "Active", monthlyRevenue: 31200 },
  { id: "L-05", name: "Lisbon Centre", city: "Lisbon", country: "Portugal", manager: "Joana Silva", participants: 144, staff: 9, status: "Active", monthlyRevenue: 17500 },
  { id: "L-06", name: "Cork City", city: "Cork", country: "Ireland", manager: "Padraig O'Brien", participants: 87, staff: 6, status: "Pending", monthlyRevenue: 9800 },
  { id: "L-07", name: "Copenhagen", city: "Copenhagen", country: "Denmark", manager: "Mette Holm", participants: 102, staff: 7, status: "On Hold", monthlyRevenue: 0 },
];
