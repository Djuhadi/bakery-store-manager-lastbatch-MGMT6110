import React from 'react';
import { BakeryItem, DecisionType } from '../types';
import { Clock, AlertCircle, Trash2 } from 'lucide-react';
import { PRICE_GIVEN_UP } from '../week';

interface ClosingItemCardProps {
  item: BakeryItem;
  onDecide: (itemId: string, decision: DecisionType) => void;
  isUrgent: boolean;
}

export const ClosingItemCard: React.FC<ClosingItemCardProps> = ({
  item,
  onDecide,
  isUrgent,
}) => {
  const price20 = (item.fullPrice * 0.8).toFixed(2);
  const price50 = (item.fullPrice * 0.5).toFixed(2);
  const fullPriceFormatted = item.fullPrice.toFixed(2);

  // Loss against full price on every unit left, worked out as This week's Loss is
  const lossFor = (decision: DecisionType) =>
    (item.quantityLeft * item.fullPrice * PRICE_GIVEN_UP[decision]).toFixed(2);
  const leftLabel = item.quantityLeft === 1 ? 'the 1 left' : `all ${item.quantityLeft} left`;

  return (
    <article
      id={`closing-item-${item.id}`}
      className={`rounded-xl bg-white border shadow-sm p-4 transition-all duration-200 ${
        isUrgent
          ? 'border-amber-300 ring-1 ring-amber-200/80 bg-amber-50/20'
          : 'border-stone-200'
      }`}
    >
      {/* Top Meta: bake time first and never wrapped, category secondary */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 shrink-0">
          <Clock className="w-4 h-4 text-stone-500" />
          <span className="text-sm font-bold text-stone-900 whitespace-nowrap">Baked {item.bakedAt}</span>
          {isUrgent && (
            <span className="flex items-center gap-0.5 text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[11px] font-bold">
              <AlertCircle className="w-3 h-3" />
              Oldest
            </span>
          )}
        </div>

        <span className="text-[11px] font-medium text-stone-500 text-right leading-tight">
          {item.category}
        </span>
      </div>

      {/* Main Item Info: Name, Quantity, Full Price */}
      <div className="flex items-baseline justify-between gap-3 mb-3.5">
        <div>
          <h2 className="text-lg font-bold text-stone-900 leading-snug">
            {item.name}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Full price: <span className="font-semibold text-stone-700">${fullPriceFormatted}</span>
          </p>
        </div>

        {/* Big Quantity Left badge for fast shelf scanning */}
        <div className="text-right shrink-0">
          <div className="inline-flex flex-col items-center justify-center bg-stone-900 text-amber-300 px-3 py-1.5 rounded-lg">
            <span className="text-xl font-extrabold leading-none tracking-tight">
              {item.quantityLeft}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-300 mt-0.5">
              Left
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: 3 large thumb-friendly buttons (min 48px height) */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-150">
        {/* 20% off */}
        <button
          id={`btn-20-off-${item.id}`}
          type="button"
          onClick={() => onDecide(item.id, '20_off')}
          aria-label={`Mark ${item.name} as 20% off`}
          className="flex flex-col items-center justify-center min-h-[52px] py-2 px-1 rounded-lg bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border-2 border-amber-500 text-amber-950 font-bold transition-transform active:scale-[0.97]"
        >
          <span className="text-sm font-extrabold leading-tight">20% off</span>
          <span className="text-[11px] font-medium text-amber-900 leading-none mt-0.5">
            ${price20} each
          </span>
        </button>

        {/* 50% off */}
        <button
          id={`btn-50-off-${item.id}`}
          type="button"
          onClick={() => onDecide(item.id, '50_off')}
          aria-label={`Mark ${item.name} as 50% off`}
          className="flex flex-col items-center justify-center min-h-[52px] py-2 px-1 rounded-lg bg-orange-50 hover:bg-orange-100 active:bg-orange-200 border-2 border-orange-500 text-orange-950 font-bold transition-transform active:scale-[0.97]"
        >
          <span className="text-sm font-extrabold leading-tight">50% off</span>
          <span className="text-[11px] font-medium text-orange-900 leading-none mt-0.5">
            ${price50} each
          </span>
        </button>

        {/* Pull: set apart from the two markdowns by a divider and an outline style,
            but still full size and one tap */}
        <div className="pl-2 border-l border-stone-200">
          <button
            id={`btn-pull-${item.id}`}
            type="button"
            onClick={() => onDecide(item.id, 'pull')}
            aria-label={`Mark ${item.name} as Pull`}
            className="w-full flex flex-col items-center justify-center min-h-[52px] py-2 px-1 rounded-lg bg-white hover:bg-rose-50 active:bg-rose-100 border-2 border-rose-300 text-rose-950 font-bold transition-transform active:scale-[0.97]"
          >
            <span className="text-sm font-extrabold leading-tight text-rose-700">Pull</span>
            <span className="flex items-center gap-0.5 text-[11px] font-medium text-rose-800 leading-none mt-0.5">
              <Trash2 className="w-3 h-3" aria-hidden="true" />
              Discard
            </span>
          </button>
        </div>
      </div>

      {/* What each choice gives up against full price, for every unit left */}
      <p id={`loss-line-${item.id}`} className="text-[11px] text-stone-500 leading-snug mt-2">
        {/* Each option stays on one line, so a wrap never splits a label from its amount */}
        Loss on {leftLabel}:{' '}
        <span className="whitespace-nowrap">
          20% off <span className="font-semibold text-stone-700">${lossFor('20_off')}</span>
        </span>{' '}
        ·{' '}
        <span className="whitespace-nowrap">
          50% off <span className="font-semibold text-stone-700">${lossFor('50_off')}</span>
        </span>{' '}
        ·{' '}
        <span className="whitespace-nowrap">
          Pull <span className="font-semibold text-stone-700">${lossFor('pull')}</span>
        </span>
      </p>
    </article>
  );
};
