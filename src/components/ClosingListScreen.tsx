import React, { useMemo, useState } from 'react';
import { BakeryItem, DecisionType } from '../types';
import { ClosingItemCard } from './ClosingItemCard';
import { DecidedItemRow } from './DecidedItemRow';
import { WeatherStrip } from './WeatherStrip';
import { buildThisWeek, pullPattern, DAYS_COVERED } from '../week';

const BUTTON_HELP_KEY = 'lastbatch_button_help';
import { CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ClosingListScreenProps {
  items: BakeryItem[];
  onDecide: (itemId: string, decision: DecisionType) => void;
  onUndo: (itemId: string) => void;
  lastActionItem?: BakeryItem | null;
  restoredCount: number; // decisions brought back from earlier tonight on this device
  onStartOver: () => void;
  onReviewWeek: () => void; // opens This week from the done card
}

export const ClosingListScreen: React.FC<ClosingListScreenProps> = ({
  items,
  onDecide,
  onUndo,
  lastActionItem,
  restoredCount,
  onStartOver,
  onReviewWeek,
}) => {
  const [confirmingStartOver, setConfirmingStartOver] = useState(false);

  // Button help: open until the manager hides it once on this device
  const [showButtonHelp, setShowButtonHelp] = useState(() => {
    try {
      return localStorage.getItem(BUTTON_HELP_KEY) !== 'hidden';
    } catch {
      return true;
    }
  });
  const hideButtonHelp = () => {
    setShowButtonHelp(false);
    try {
      localStorage.setItem(BUTTON_HELP_KEY, 'hidden');
    } catch {
      // storage restricted: it stays hidden for this visit only
    }
  };
  // The two products pulled most often, tonight included, for the done card
  const topPulled = buildThisWeek(items, new Date()).mostPulled.slice(0, 2);

  // Undecided items, sorted by bakeMinutes ascending (longest ago / earliest baked first)
  const undecidedItems = useMemo(() => {
    return items
      .filter((item) => !item.decision)
      .sort((a, b) => a.bakeMinutes - b.bakeMinutes);
  }, [items]);

  // Decided items, sorted by newest decision first
  const decidedItems = useMemo(() => {
    return items.filter((item) => !!item.decision);
  }, [items]);

  const undecidedCount = undecidedItems.length;
  const totalCount = items.length;
  const decidedCount = decidedItems.length;

  const totalMarkedDown = decidedItems.filter(
    (i) => i.decision === '20_off' || i.decision === '50_off'
  ).length;
  const totalPulled = decidedItems.filter((i) => i.decision === 'pull').length;

  return (
    <div className="pb-16 pt-3 px-4 max-w-md mx-auto space-y-4">
      {/* Top Counter Bar: Always shows how many items are still undecided */}
      <section
        id="undecided-counter-section"
        aria-live="polite"
        className={`rounded-xl p-4 border transition-all shadow-xs ${
          undecidedCount > 0
            ? 'bg-amber-500 text-stone-950 border-amber-400'
            : 'bg-emerald-700 text-white border-emerald-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider opacity-85">
              5:00 PM Shelf Walk
            </div>
            <div className="text-2xl font-black tracking-tight mt-0.5">
              {undecidedCount > 0 ? (
                <span>
                  {undecidedCount} {undecidedCount === 1 ? 'item' : 'items'} left to decide
                </span>
              ) : (
                <span>All items decided</span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block text-sm font-extrabold px-2.5 py-1 rounded-full bg-stone-950/15">
              {decidedCount} of {totalCount} decided
            </span>
          </div>
        </div>

        {/* Visual progress bar */}
        <div className="w-full bg-stone-950/20 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              undecidedCount === 0 ? 'bg-white' : 'bg-stone-950'
            }`}
            style={{ width: `${(decidedCount / totalCount) * 100}%` }}
          />
        </div>

        {/* Decisions survive a refresh; say so, and offer a way to clear the walk */}
        {decidedCount > 0 && (
          <div id="walk-saved-note" className="flex items-center justify-between gap-2 mt-2.5 text-xs">
            <span className="font-semibold opacity-85">
              {restoredCount > 0
                ? 'Restored from earlier tonight on this device.'
                : 'Saved on this device.'}
            </span>
            {confirmingStartOver ? (
              <span className="shrink-0 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onStartOver();
                    setConfirmingStartOver(false);
                  }}
                  className="font-black underline underline-offset-2"
                >
                  Clear all {decidedCount} {decidedCount === 1 ? 'decision' : 'decisions'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingStartOver(false)}
                  className="font-semibold underline underline-offset-2 opacity-85"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingStartOver(true)}
                className="shrink-0 font-bold underline underline-offset-2"
              >
                Start over
              </button>
            )}
          </div>
        )}
      </section>

      {/* Undo for the latest decision, pinned to the bottom of the screen so it is in view
          wherever the manager is on the list */}
      {lastActionItem && lastActionItem.decision && (
        <div className="fixed bottom-3 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
          <div
            id="recent-undo-banner"
            role="status"
            className="pointer-events-auto w-full max-w-[26rem] flex items-center justify-between gap-2 p-3 bg-stone-900 text-stone-100 rounded-lg text-xs font-medium shadow-lg animate-fade-in"
          >
            <div className="truncate">
              {lastActionItem.decision === 'pull' ? (
                <>
                  Pulled <span className="font-bold text-rose-300">{lastActionItem.name}</span>
                </>
              ) : (
                <>
                  Marked down <span className="font-bold text-amber-300">{lastActionItem.name}</span>
                  {' · '}
                  {lastActionItem.decision === '20_off' ? '20% off' : '50% off'}
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => onUndo(lastActionItem.id)}
              className="shrink-0 px-2.5 py-1 rounded bg-stone-700 hover:bg-stone-600 text-amber-300 font-bold active:scale-95"
            >
              Undo
            </button>
          </div>
        </div>
      )}

      {/* Closing-hour weather conditions strip for City area */}
      <WeatherStrip />

      {/* Main List Area */}
      {undecidedCount > 0 ? (
        <section id="undecided-items-list" className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span className="font-semibold text-stone-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Urgent First · Longest baked on shelf
            </span>
            {showButtonHelp ? (
              <span>Tap decision to settle</span>
            ) : (
              <button
                type="button"
                onClick={() => setShowButtonHelp(true)}
                className="shrink-0 font-semibold text-stone-700 underline underline-offset-2"
              >
                What do the buttons mean?
              </button>
            )}
          </div>

          {/* Open on a manager's first visit, then out of the way until asked for */}
          {showButtonHelp && (
            <div
              id="button-help"
              className="rounded-xl border border-stone-300 bg-white p-3 text-xs text-stone-700 leading-snug space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-stone-900">What the buttons do</span>
                <button
                  type="button"
                  onClick={hideButtonHelp}
                  className="shrink-0 font-semibold underline underline-offset-2"
                >
                  Hide
                </button>
              </div>
              <p>
                <span className="font-bold">20% off / 50% off:</span> sell it tonight at the lower
                price shown on the button. The line under the buttons shows what each choice loses on
                all units left.
              </p>
              <p>
                <span className="font-bold">Pull:</span> take it off the shelf and discard it. Nothing
                is recovered.
              </p>
              <p>
                Items are listed oldest bake first. Your shop's own markdown rules decide which you
                choose, and every choice can be undone.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {undecidedItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ClosingItemCard
                  item={item}
                  onDecide={onDecide}
                  isUrgent={index === 0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      ) : (
        /* Completed State: When every item has been decided, list is replaced by message */
        <section
          id="closing-done-card"
          className="rounded-2xl bg-emerald-50 border-2 border-emerald-400 p-6 text-center space-y-3 shadow-sm"
        >
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-emerald-950">
              Closing list is done
            </h2>
            <p className="text-sm text-emerald-800 mt-1 max-w-xs mx-auto">
              Every unsold shelf item has been decided for today’s 6:00 PM closing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-left">
            <div className="bg-white/80 border border-emerald-200 rounded-lg p-3">
              <div className="text-xs text-emerald-700 font-semibold">Marked Down</div>
              <div className="text-xl font-black text-emerald-950">{totalMarkedDown} items</div>
            </div>
            <div className="bg-white/80 border border-emerald-200 rounded-lg p-3">
              <div className="text-xs text-rose-700 font-semibold">Pulled / Discard</div>
              <div className="text-xl font-black text-rose-950">{totalPulled} items</div>
            </div>
          </div>

          {/* Before tomorrow's bake: the products pulled most often, and the way to the full list */}
          <div id="done-bake-review" className="text-left bg-white/80 border border-emerald-200 rounded-lg p-3 space-y-1.5">
            <div className="text-xs text-emerald-800 font-bold">
              Pulled most over the last {DAYS_COVERED} days
            </div>
            {topPulled.map((product) => (
              <p key={product.id} className="text-xs text-stone-700 leading-snug">
                <span className="font-bold text-stone-900">{product.name}</span>, {product.timesPulled} of{' '}
                {DAYS_COVERED} days. {pullPattern(product.timesPulled)}
              </p>
            ))}
            <button
              type="button"
              onClick={onReviewWeek}
              className="w-full mt-1 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold active:scale-[0.98]"
            >
              Review This week before planning tomorrow’s bake
            </button>
          </div>

          <p className="text-xs text-stone-500 pt-1">
            Need to change any choice? Use the Undo buttons below.
          </p>
        </section>
      )}

      {/* Decided Items Section: shows items that have settled out of the way */}
      {decidedItems.length > 0 && (
        <section id="decided-items-section" className="pt-3 border-t border-stone-200 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Decided Items ({decidedItems.length})
            </h3>
            <span className="text-[11px] text-stone-400">
              Tap Undo to return to shelf
            </span>
          </div>

          <div className="space-y-2">
            {decidedItems.map((item) => (
              <DecidedItemRow key={item.id} item={item} onUndo={onUndo} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
