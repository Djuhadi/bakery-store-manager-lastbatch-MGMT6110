import React, { useState } from 'react';
import { BakeryItem, DecisionType } from './types';
import { INITIAL_CLOSING_ITEMS, LAST_SEVEN_DAYS_WASTE, MOST_PULLED_PRODUCTS } from './data';
import { Header } from './components/Header';
import { ClosingListScreen } from './components/ClosingListScreen';
import { ThisWeekScreen } from './components/ThisWeekScreen';

export default function App() {
  const [items, setItems] = useState<BakeryItem[]>(INITIAL_CLOSING_ITEMS);
  const [activeScreen, setActiveScreen] = useState<'closing' | 'weekly'>('closing');
  const [lastActionItem, setLastActionItem] = useState<BakeryItem | null>(null);

  // Handle a manager's decision on a shelf item
  const handleDecide = (itemId: string, decision: DecisionType) => {
    setItems((prevItems) => {
      const target = prevItems.find((i) => i.id === itemId);
      if (target) {
        setLastActionItem({
          ...target,
          decision,
          decidedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
      return prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              decision,
              decidedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : item
      );
    });
  };

  // Undo a decision on an item
  const handleUndo = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, decision: undefined, decidedAt: undefined }
          : item
      )
    );
    if (lastActionItem?.id === itemId) {
      setLastActionItem(null);
    }
  };

  // Undecided items count
  const undecidedCount = items.filter((item) => !item.decision).length;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex justify-center antialiased">
      {/* Mobile container centered on screen */}
      <div className="w-full max-w-md bg-stone-50 min-h-screen flex flex-col shadow-lg border-x border-stone-200">
        {/* Persistent top header with screen tabs */}
        <Header
          activeScreen={activeScreen}
          onSelectScreen={setActiveScreen}
          undecidedCount={undecidedCount}
        />

        {/* Screen 1: Closing list */}
        {activeScreen === 'closing' && (
          <main className="flex-1">
            <ClosingListScreen
              items={items}
              onDecide={handleDecide}
              onUndo={handleUndo}
              lastActionItem={lastActionItem}
            />
          </main>
        )}

        {/* Screen 2: This week */}
        {activeScreen === 'weekly' && (
          <main className="flex-1">
            <ThisWeekScreen
              records={LAST_SEVEN_DAYS_WASTE}
              mostPulled={MOST_PULLED_PRODUCTS}
            />
          </main>
        )}
      </div>
    </div>
  );
}
