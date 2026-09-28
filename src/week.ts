import { BakeryItem, DayPull, DayWasteRecord, DecisionType, PulledProductRanking } from './types';
import { INITIAL_CLOSING_ITEMS, SAMPLE_PAST_SIX_DAYS } from './data';
import { SavedDecisions, isSavedDecision, loadPastWalks, localDate } from './savedWalk';

// Share of the full price given up by each decision (also used for the loss line on each card)
export const PRICE_GIVEN_UP: Record<DecisionType, number> = {
  '20_off': 0.2,
  '50_off': 0.5,
  pull: 1,
};

// Tonight plus the six days before it
export const DAYS_COVERED = SAMPLE_PAST_SIX_DAYS.length + 1;

/**
 * What a product's pull pattern suggests, in words the numbers can support.
 * Pulls show waste but never a sell-out, so the most it says is "consider",
 * and never how many to bake.
 */
export function pullPattern(timesPulled: number): string {
  if (timesPulled >= 4) return 'Pulled most days. Consider baking less, if it never sold out this week.';
  if (timesPulled >= 2) return 'Pulled some days. Watch it before changing the bake.';
  return 'Pulled once. No pattern yet.';
}

const daysBefore = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

const weekdayName = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long' });
const shortDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const shortDay = (d: Date) =>
  d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

// A night's totals from its decided items, in units, as the loss line on each card works them out
const nightTotals = (decided: BakeryItem[]) => ({
  markedDownCount: decided
    .filter((item) => item.decision !== 'pull')
    .reduce((sum, item) => sum + item.quantityLeft, 0),
  pulledCount: decided
    .filter((item) => item.decision === 'pull')
    .reduce((sum, item) => sum + item.quantityLeft, 0),
  moneyLost: decided.reduce(
    (sum, item) => sum + item.quantityLeft * item.fullPrice * PRICE_GIVEN_UP[item.decision!],
    0
  ),
});

const pullsOf = (decided: BakeryItem[]): DayPull[] =>
  decided
    .filter((item) => item.decision === 'pull')
    .map((item) => ({ itemId: item.id, units: item.quantityLeft }));

// A saved night's decisions applied to the Closing list it was made on
const decidedOnNight = (saved: SavedDecisions): BakeryItem[] =>
  INITIAL_CLOSING_ITEMS.filter((item) => isSavedDecision(saved[item.id])).map((item) => ({
    ...item,
    ...saved[item.id],
  }));

export interface ThisWeek {
  records: DayWasteRecord[];         // tonight first, then the six days before it
  mostPulled: PulledProductRanking[]; // built from the same seven rows, worst first
  coverage: string;                   // e.g. "Tue, Sep 22 to Mon, Sep 28"
  lastDecisionAt: string | null;      // time of tonight's latest decision still standing
  savedDays: number;                  // earlier days that are real walks saved on this device
}

/**
 * Builds the This week tab: a live row for tonight from the Closing list, then
 * each of the six days before it, from a walk saved on this device on that date
 * or from sample history. The ranking is built from the same seven rows, so it
 * always agrees with them.
 */
export function buildThisWeek(
  items: BakeryItem[],
  today: Date,
  pastWalks: Record<string, SavedDecisions> = loadPastWalks(today)
): ThisWeek {
  const decidedTonight = items.filter((item) => item.decision);

  const tonight: DayWasteRecord = {
    id: 'tonight',
    dayLabel: 'Tonight',
    dateStr: shortDate(today),
    ...nightTotals(decidedTonight),
    kind: 'tonight',
  };
  const nightsPulls: DayPull[][] = [pullsOf(decidedTonight)];

  const pastDays: DayWasteRecord[] = SAMPLE_PAST_SIX_DAYS.map((sample, idx) => {
    const date = daysBefore(today, idx + 1);
    const labels = { dayLabel: weekdayName(date), dateStr: shortDate(date) };
    const saved = pastWalks[localDate(date)];
    const decided = saved ? decidedOnNight(saved) : [];
    if (decided.length) {
      nightsPulls.push(pullsOf(decided));
      return { id: `saved-${localDate(date)}`, ...labels, ...nightTotals(decided), kind: 'saved' };
    }
    nightsPulls.push(sample.pulls);
    return {
      id: sample.id,
      ...labels,
      markedDownCount: sample.markedDownCount,
      pulledCount: sample.pulledCount,
      moneyLost: sample.moneyLost,
      kind: 'sample',
    };
  });

  // Rank by Closing list item across the same seven rows, worst first
  const byItem = new Map<string, PulledProductRanking>();
  nightsPulls.forEach((pulls) =>
    pulls.forEach(({ itemId, units }) => {
      const item = INITIAL_CLOSING_ITEMS.find((i) => i.id === itemId);
      if (!item) return;
      const ranked = byItem.get(itemId) ?? {
        id: itemId,
        name: item.name,
        category: item.category,
        timesPulled: 0,
        unitsPulled: 0,
        estimatedLoss: 0,
      };
      ranked.timesPulled += 1;
      ranked.unitsPulled += units;
      ranked.estimatedLoss += units * item.fullPrice;
      byItem.set(itemId, ranked);
    })
  );
  const mostPulled = [...byItem.values()].sort(
    (a, b) => b.timesPulled - a.timesPulled || b.unitsPulled - a.unitsPulled
  );

  const latestMs = Math.max(0, ...decidedTonight.map((item) => item.decidedAtMs ?? 0));
  const lastDecisionAt = latestMs
    ? new Date(latestMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return {
    records: [tonight, ...pastDays],
    mostPulled,
    coverage: `${shortDay(daysBefore(today, SAMPLE_PAST_SIX_DAYS.length))} to ${shortDay(today)}`,
    lastDecisionAt,
    savedDays: pastDays.filter((day) => day.kind === 'saved').length,
  };
}
