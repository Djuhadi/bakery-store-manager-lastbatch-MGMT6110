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
  decidedAtMs?: number; // when the decision was made, for "last decision" on This week
}

export interface DayWasteRecord {
  id: string;
  dayLabel: string; // e.g. "Sunday (Yesterday)"
  dateStr: string;  // e.g. "Sep 6"
  markedDownCount: number; // units
  pulledCount: number;     // units
  moneyLost: number; // in dollars
  // Where the row's numbers come from: tonight's live list, a walk saved on this
  // device on that date, or sample history
  kind: 'tonight' | 'saved' | 'sample';
}

// Units of one Closing list item pulled on one day
export interface DayPull {
  itemId: string;
  units: number;
}

// A sample day before today; its weekday and date are worked out from today's date.
export interface SampleDayRecord {
  id: string;
  markedDownCount: number;
  pulledCount: number; // equals the units in pulls
  moneyLost: number;
  pulls: DayPull[];
}

export interface PulledProductRanking {
  id: string;
  name: string;
  category: string;
  timesPulled: number; // number of times/days pulled this week
  unitsPulled: number; // total units pulled
  estimatedLoss: number; // in dollars
}

export interface ForecastResponse {
  area: string;
  forecast: string | null;
  validPeriod: string;
  fetchedAt: string;
  areas?: string[];
}
