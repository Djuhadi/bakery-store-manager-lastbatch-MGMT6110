import { BakeryItem, DecisionType } from './types';

// Tonight's decisions, kept on this device so a refresh or a reopened page keeps the walk
const STORAGE_KEY = 'lastbatch_tonight_walk';

// Every night's decisions by date, kept on this device so This week can show real past nights
const HISTORY_KEY = 'lastbatch_walk_history';
const HISTORY_DAYS = 7; // tonight plus the six days This week shows before it

const DECISIONS: DecisionType[] = ['20_off', '50_off', 'pull'];

export interface SavedDecision {
  decision: DecisionType;
  decidedAt?: string;
  decidedAtMs?: number;
}

// One night's decisions, by Closing list item id
export type SavedDecisions = Record<string, SavedDecision>;

interface SavedWalk {
  date: string; // local calendar date, so the walk starts fresh the next day
  decisions: SavedDecisions;
}

export const localDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const daysBefore = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

export const isSavedDecision = (s: SavedDecision | undefined): s is SavedDecision =>
  !!s && DECISIONS.includes(s.decision);

const readHistory = (): Record<string, SavedDecisions> => {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    return history && typeof history === 'object' ? history : {};
  } catch {
    return {};
  }
};

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
      if (!isSavedDecision(s)) return item;
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
 * The walks saved on this device before today, by date. Tonight is left out,
 * because This week reads it from the live Closing list.
 */
export function loadPastWalks(today: Date): Record<string, SavedDecisions> {
  const history = readHistory();
  // A walk saved before history was kept still counts for its own date
  try {
    const last: SavedWalk | null = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (last?.date && last.decisions && Object.keys(last.decisions).length && !history[last.date]) {
      history[last.date] = last.decisions;
    }
  } catch {
    // unreadable: use the history alone
  }
  delete history[localDate(today)];
  return history;
}

/**
 * Saves tonight's decisions on this device, under today's date, and keeps the
 * last seven nights for This week. Start over empties tonight only.
 */
export function saveTonightsWalk(items: BakeryItem[], today: Date) {
  const decisions: SavedDecisions = {};
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
    const tonight = localDate(today);
    const history = readHistory();

    // Before overwriting it, move an earlier night's walk into the history,
    // so a walk saved before history was kept is not lost the next day
    try {
      const last: SavedWalk | null = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (last?.date && last.date !== tonight && last.decisions && !history[last.date]) {
        if (Object.keys(last.decisions).length) history[last.date] = last.decisions;
      }
    } catch {
      // unreadable: nothing to move
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: tonight, decisions }));

    if (Object.keys(decisions).length) {
      history[tonight] = decisions;
    } else {
      delete history[tonight];
    }
    const oldestKept = localDate(daysBefore(today, HISTORY_DAYS - 1));
    Object.keys(history).forEach((date) => {
      if (date < oldestKept) delete history[date];
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Storage restricted: the walk still works, it just is not saved
  }
}
