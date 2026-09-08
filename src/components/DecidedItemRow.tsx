import React from 'react';
import { BakeryItem } from '../types';
import { Undo2 } from 'lucide-react';

interface DecidedItemRowProps {
  item: BakeryItem;
  onUndo: (itemId: string) => void;
}

export const DecidedItemRow: React.FC<DecidedItemRowProps> = ({ item, onUndo }) => {
  const getDecisionBadge = () => {
    switch (item.decision) {
      case '20_off':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            20% off · ${(item.fullPrice * 0.8).toFixed(2)}
          </span>
        );
      case '50_off':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
            50% off · ${(item.fullPrice * 0.5).toFixed(2)}
          </span>
        );
      case 'pull':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            Pulled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={`decided-row-${item.id}`}
      className="flex items-center justify-between gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-stone-800 text-sm truncate">
            {item.name}
          </span>
          <span className="text-xs text-stone-500 font-medium shrink-0">
            ({item.quantityLeft} left)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getDecisionBadge()}
          <span className="text-[11px] text-stone-400">
            Baked {item.bakedAt}
          </span>
        </div>
      </div>

      <button
        id={`btn-undo-${item.id}`}
        type="button"
        onClick={() => onUndo(item.id)}
        aria-label={`Undo decision for ${item.name}`}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white hover:bg-stone-100 active:bg-stone-200 border border-stone-300 text-stone-700 text-xs font-bold shadow-2xs transition-all active:scale-95"
      >
        <Undo2 className="w-3.5 h-3.5 text-stone-500" />
        <span>Undo</span>
      </button>
    </div>
  );
};
