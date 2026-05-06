export interface MonthlyRevenue {
  month: string;
  revenue: number;
  target: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface CapacityRow {
  location: string;
  enrolled: number;
  capacity: number;
}

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: "Jan", revenue: 142000, target: 150000 },
  { month: "Feb", revenue: 188000, target: 170000 },
  { month: "Mar", revenue: 205000, target: 200000 },
  { month: "Apr", revenue: 192000, target: 200000 },
  { month: "May", revenue: 178000, target: 180000 },
  { month: "Jun", revenue: 234000, target: 220000 },
  { month: "Jul", revenue: 261000, target: 240000 },
  { month: "Aug", revenue: 248000, target: 240000 },
  { month: "Sep", revenue: 296000, target: 280000 },
  { month: "Oct", revenue: 312000, target: 300000 },
  { month: "Nov", revenue: 287000, target: 290000 },
  { month: "Dec", revenue: 264000, target: 270000 },
];

export const funnelData: FunnelStage[] = [
  { stage: "Inquiry", count: 420 },
  { stage: "Documents", count: 312 },
  { stage: "Fee", count: 248 },
  { stage: "Active", count: 671 },
  { stage: "Completed", count: 184 },
];

export const capacityData: CapacityRow[] = [
  { location: "Riyadh Academy", enrolled: 312, capacity: 400 },
  { location: "Jeddah Branch", enrolled: 221, capacity: 280 },
  { location: "Dammam Centre", enrolled: 138, capacity: 200 },
];
