import { BakeryItem, DayWasteRecord, DecisionType, PulledProductRanking } from './types';
import { SAMPLE_PAST_SIX_DAYS, MOST_PULLED_PRODUCTS } from './data';

// Share of the full price given up by each decision
const PRICE_GIVEN_UP: Record<DecisionType, number> = {
  '20_off': 0.2,
  '50_off': 0.5,
  pull: 1,
};

const daysBefore = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

const weekdayName = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long' });
const shortDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const shortDay = (d: Date) =>
  d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export interface ThisWeek {
  records: DayWasteRecord[];         // tonight first, then the six sample days
  mostPulled: PulledProductRanking[]; // sample pulls plus tonight's, worst first
  coverage: string;                   // e.g. "Tue, Sep 22 to Mon, Sep 28"
  lastDecisionAt: string | null;      // time of tonight's latest decision still standing
}

/**
 * Builds the This week tab: a live row for tonight from the Closing list,
 * and six sample days dated back from today.
 */
export function buildThisWeek(items: BakeryItem[], today: Date): ThisWeek {
  const decided = items.filter((item) => item.decision);
  const pulled = decided.filter((item) => item.decision === 'pull');

  const tonight: DayWasteRecord = {
    id: 'tonight',
    dayLabel: 'Tonight',
    dateStr: shortDate(today),
    markedDownCount: decided
      .filter((item) => item.decision !== 'pull')
      .reduce((sum, item) => sum + item.quantityLeft, 0),
    pulledCount: pulled.reduce((sum, item) => sum + item.quantityLeft, 0),
    moneyLost: decided.reduce(
      (sum, item) => sum + item.quantityLeft * item.fullPrice * PRICE_GIVEN_UP[item.decision!],
      0
    ),
    isTonight: true,
  };

  const pastDays: DayWasteRecord[] = SAMPLE_PAST_SIX_DAYS.map((day, idx) => {
    const date = daysBefore(today, idx + 1);
    return { ...day, dayLabel: weekdayName(date), dateStr: shortDate(date) };
  });

  // Fold tonight's pulls into the sample ranking, then re-rank worst first
  const mostPulled = MOST_PULLED_PRODUCTS.map((product) => ({ ...product }));
  pulled.forEach((item) => {
    const loss = item.quantityLeft * item.fullPrice;
    const existing = mostPulled.find((product) => product.name === item.name);
    if (existing) {
      existing.timesPulled += 1;
      existing.unitsPulled += item.quantityLeft;
      existing.estimatedLoss += loss;
    } else {
      mostPulled.push({
        id: `tonight-${item.id}`,
        name: item.name,
        category: item.category,
        timesPulled: 1,
        unitsPulled: item.quantityLeft,
        estimatedLoss: loss,
      });
    }
  });
  mostPulled.sort((a, b) => b.timesPulled - a.timesPulled || b.unitsPulled - a.unitsPulled);

  const latestMs = Math.max(0, ...decided.map((item) => item.decidedAtMs ?? 0));
  const lastDecisionAt = latestMs
    ? new Date(latestMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return {
    records: [tonight, ...pastDays],
    mostPulled,
    coverage: `${shortDay(daysBefore(today, SAMPLE_PAST_SIX_DAYS.length))} to ${shortDay(today)}`,
    lastDecisionAt,
  };
}
