import React from 'react';
import { DayWasteRecord, PulledProductRanking } from '../types';
import { TrendingDown, Calendar, AlertOctagon } from 'lucide-react';

interface ThisWeekScreenProps {
  records: DayWasteRecord[];
  mostPulled: PulledProductRanking[];
}

export const ThisWeekScreen: React.FC<ThisWeekScreenProps> = ({
  records,
  mostPulled,
}) => {
  // Aggregate 7-day totals for fast manager scanning
  const totalMarkedDown = records.reduce((sum, r) => sum + r.markedDownCount, 0);
  const totalPulled = records.reduce((sum, r) => sum + r.pulledCount, 0);
  const totalMoneyLost = records.reduce((sum, r) => sum + r.moneyLost, 0);

  return (
    <div className="pb-16 pt-3 px-4 max-w-md mx-auto space-y-5">
      {/* Screen Header & 7-day Summary */}
      <section id="weekly-overview-banner" className="bg-stone-900 text-stone-100 rounded-xl p-4 border border-stone-800 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last 7 Days Overview</span>
          </div>
          <span className="text-xs text-stone-400">Read-only review</span>
        </div>

        <h2 className="text-xl font-extrabold text-white leading-tight">
          What was thrown away
        </h2>
        <p className="text-xs text-stone-300 mt-1">
          Review daily markdowns and pulls to calibrate tomorrow’s bake quantities.
        </p>

        {/* 3 Metric cards */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-800">
          <div className="bg-stone-800/80 rounded-lg p-2.5 text-center">
            <span className="block text-[11px] font-semibold text-stone-400 uppercase">
              Marked Down
            </span>
            <span className="block text-lg font-black text-amber-300 mt-0.5">
              {totalMarkedDown}
            </span>
          </div>

          <div className="bg-stone-800/80 rounded-lg p-2.5 text-center">
            <span className="block text-[11px] font-semibold text-stone-400 uppercase">
              Pulled
            </span>
            <span className="block text-lg font-black text-rose-400 mt-0.5">
              {totalPulled}
            </span>
          </div>

          <div className="bg-stone-800/80 rounded-lg p-2.5 text-center">
            <span className="block text-[11px] font-semibold text-stone-400 uppercase">
              Money Lost
            </span>
            <span className="block text-lg font-black text-white mt-0.5">
              ${totalMoneyLost.toFixed(0)}
            </span>
          </div>
        </div>
      </section>

      {/* Section 1: 7-Day History Table (One row per day for the last 7 days) */}
      <section id="seven-day-records-section" className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wide">
            Daily Breakdown (Last 7 Days)
          </h3>
          <span className="text-xs text-stone-500">Most recent first</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs divide-y divide-stone-150 overflow-hidden">
          {records.map((record) => (
            <div
              key={record.id}
              id={`waste-day-${record.id}`}
              className="p-3.5 flex items-center justify-between gap-3 text-stone-900"
            >
              <div className="min-w-0">
                <div className="font-bold text-base text-stone-900 leading-snug">
                  {record.dayLabel}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {record.dateStr}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-right">
                <div className="text-center px-2 py-1 bg-amber-50 rounded border border-amber-200">
                  <span className="block text-[10px] font-bold uppercase text-amber-800">
                    Disc.
                  </span>
                  <span className="block text-sm font-extrabold text-amber-900">
                    {record.markedDownCount}
                  </span>
                </div>

                <div className="text-center px-2 py-1 bg-rose-50 rounded border border-rose-200">
                  <span className="block text-[10px] font-bold uppercase text-rose-800">
                    Pull
                  </span>
                  <span className="block text-sm font-extrabold text-rose-900">
                    {record.pulledCount}
                  </span>
                </div>

                <div className="w-18 text-right">
                  <span className="block text-[10px] font-bold uppercase text-stone-400">
                    Loss
                  </span>
                  <span className="block text-sm font-black text-stone-900">
                    ${record.moneyLost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Products pulled most often this week (worst first) */}
      <section id="most-pulled-products-section" className="space-y-2.5 pt-2">
        <div className="px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-rose-700">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Bake Less of These</span>
          </div>
          <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
            Products Pulled Most Often (Worst First)
          </h3>
          <p className="text-xs text-stone-500">
            Ranked by total times pulled from shelves this week.
          </p>
        </div>

        <div className="space-y-2">
          {mostPulled.map((product, idx) => {
            const rankNumber = idx + 1;
            const isTopWaste = rankNumber <= 2;

            return (
              <div
                key={product.id}
                id={`ranked-product-${product.id}`}
                className={`p-3.5 rounded-xl border bg-white shadow-2xs flex items-center justify-between gap-3 ${
                  isTopWaste
                    ? 'border-rose-300 ring-1 ring-rose-200/70 bg-rose-50/15'
                    : 'border-stone-200'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Rank badge */}
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      isTopWaste
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    #{rankNumber}
                  </span>

                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-stone-900 truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-stone-500">
                        {product.category}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="text-[11px] font-bold text-rose-700">
                        {product.unitsPulled} units discarded
                      </span>
                    </div>
                  </div>
                </div>

                {/* Times pulled stat */}
                <div className="text-right shrink-0">
                  <div className="inline-flex flex-col items-end">
                    <span className="text-base font-black text-rose-700 tabular-nums">
                      {product.timesPulled}×
                    </span>
                    <span className="text-[10px] uppercase font-bold text-stone-500">
                      pulled this wk
                    </span>
                    <span className="text-[11px] font-semibold text-stone-700 mt-0.5">
                      -${product.estimatedLoss.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
