export type DecisionType = '20_off' | '50_off' | 'pull';

export interface BakeryItem {
  id: string;
  name: string;
  category: string;
  bakedAt: string; // e.g., "5:15 AM"
  bakeMinutes: number; // minutes from midnight (for sorting earliest first)
  quantityLeft: number;
  fullPrice: number;
  decision?: DecisionType;
  decidedAt?: string;
}

export interface DayWasteRecord {
  id: string;
  dayLabel: string; // e.g. "Sunday (Yesterday)"
  dateStr: string;  // e.g. "Sep 6"
  markedDownCount: number;
  pulledCount: number;
  moneyLost: number; // in dollars
}

export interface PulledProductRanking {
  id: string;
  name: string;
  category: string;
  timesPulled: number; // number of times/days pulled this week
  unitsPulled: number; // total units pulled
  estimatedLoss: number; // in dollars
}
