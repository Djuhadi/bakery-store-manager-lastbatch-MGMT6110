import React from 'react';

interface HeaderProps {
  activeScreen: 'closing' | 'weekly';
  onSelectScreen: (screen: 'closing' | 'weekly') => void;
  undecidedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onSelectScreen,
  undecidedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 shadow-md border-b border-stone-800">
      <div className="max-w-md mx-auto px-4 pt-3 pb-2">
        {/* Top row: Brand & Context */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-bold tracking-tight text-amber-400 font-serif">
              LastBatch
            </h1>
            <span className="text-xs font-medium text-stone-400">
              Shop #14 · Mill & Elm
            </span>
          </div>
          <div className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-800 text-stone-300 border border-stone-700">
            5:00 PM Walk
          </div>
        </div>

        {/* Navigation tabs: large tap targets for thumb navigation */}
        <nav className="grid grid-cols-2 gap-1.5 p-1 bg-stone-800/90 rounded-lg border border-stone-700/60">
          <button
            id="tab-closing-list"
            type="button"
            onClick={() => onSelectScreen('closing')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-semibold transition-all duration-150 active:scale-[0.98] ${
              activeScreen === 'closing'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-700/50'
            }`}
          >
            <span>Closing list</span>
            {undecidedCount > 0 ? (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                  activeScreen === 'closing'
                    ? 'bg-stone-950 text-amber-300'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {undecidedCount}
              </span>
            ) : (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 font-medium">
                Done
              </span>
            )}
          </button>

          <button
            id="tab-this-week"
            type="button"
            onClick={() => onSelectScreen('weekly')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-semibold transition-all duration-150 active:scale-[0.98] ${
              activeScreen === 'weekly'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-700/50'
            }`}
          >
            <span>This week</span>
            <span className="text-xs text-stone-400 font-normal">7-day</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
