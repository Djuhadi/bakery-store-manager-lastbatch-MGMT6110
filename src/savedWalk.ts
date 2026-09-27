import { BakeryItem, DecisionType } from './types';

// Tonight's decisions, kept on this device so a refresh or a reopened page keeps the walk
const STORAGE_KEY = 'lastbatch_tonight_walk';

const DECISIONS: DecisionType[] = ['20_off', '50_off', 'pull'];

interface SavedDecision {
  decision: DecisionType;
  decidedAt?: string;
  decidedAtMs?: number;
}

interface SavedWalk {
  date: string; // local calendar date, so the walk starts fresh the next day
  decisions: Record<string, SavedDecision>;
}

const localDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * Puts back tonight's saved decisions, if any were saved today on this device.
 */
export function loadTonightsWalk(
  items: BakeryItem[],
  today: Date
): { items: BakeryItem[]; restoredCount: number } {
  try {
    const saved: SavedWalk | null = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || saved.date !== localDate(today) || !saved.decisions) {
      return { items, restoredCount: 0 };
    }
    let restoredCount = 0;
    const restored = items.map((item) => {
      const s = saved.decisions[item.id];
      if (!s || !DECISIONS.includes(s.decision)) return item;
      restoredCount += 1;
      return { ...item, decision: s.decision, decidedAt: s.decidedAt, decidedAtMs: s.decidedAtMs };
    });
    return { items: restored, restoredCount };
  } catch {
    // Storage blocked or unreadable: start the walk fresh
    return { items, restoredCount: 0 };
  }
}

/**
 * Saves tonight's decisions on this device, under today's date.
 */
export function saveTonightsWalk(items: BakeryItem[], today: Date) {
  const decisions: Record<string, SavedDecision> = {};
  items.forEach((item) => {
    if (item.decision) {
      decisions[item.id] = {
        decision: item.decision,
        decidedAt: item.decidedAt,
        decidedAtMs: item.decidedAtMs,
      };
    }
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: localDate(today), decisions }));
  } catch {
    // Storage restricted: the walk still works, it just is not saved
  }
}
