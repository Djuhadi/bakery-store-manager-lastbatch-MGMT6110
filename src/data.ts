import { BakeryItem, SampleDayRecord } from './types';

/**
 * All initial invented values for LastBatch bakery closing and weekly waste.
 * Contains 14 items across 4 categories sorted by bake time (earliest baked first).
 */

export const INITIAL_CLOSING_ITEMS: BakeryItem[] = [
  {
    id: 'item-1',
    name: 'Country Sourdough Batard',
    category: 'Hearth & Sourdough',
    bakedAt: '5:15 AM',
    bakeMinutes: 315, // 5 * 60 + 15
    quantityLeft: 4,
    fullPrice: 8.50,
  },
  {
    id: 'item-2',
    name: 'Traditional Baguette',
    category: 'Hearth & Sourdough',
    bakedAt: '5:30 AM',
    bakeMinutes: 330,
    quantityLeft: 6,
    fullPrice: 4.25,
  },
  {
    id: 'item-3',
    name: 'Almond Frangipane Croissant',
    category: 'Pastries & Viennoiserie',
    bakedAt: '5:45 AM',
    bakeMinutes: 345,
    quantityLeft: 3,
    fullPrice: 5.75,
  },
  {
    id: 'item-4',
    name: 'Cardamom Morning Bun',
    category: 'Pastries & Viennoiserie',
    bakedAt: '6:00 AM',
    bakeMinutes: 360,
    quantityLeft: 5,
    fullPrice: 4.75,
  },
  {
    id: 'item-5',
    name: 'Cheddar Chive Buttermilk Scone',
    category: 'Savory & Lunch',
    bakedAt: '6:15 AM',
    bakeMinutes: 375,
    quantityLeft: 7,
    fullPrice: 4.50,
  },
  {
    id: 'item-6',
    name: 'Seeded Rye Loaf',
    category: 'Hearth & Sourdough',
    bakedAt: '6:45 AM',
    bakeMinutes: 405,
    quantityLeft: 2,
    fullPrice: 9.00,
  },
  {
    id: 'item-7',
    name: 'Ham & Gruyère Croissant',
    category: 'Savory & Lunch',
    bakedAt: '7:15 AM',
    bakeMinutes: 435,
    quantityLeft: 4,
    fullPrice: 6.95,
  },
  {
    id: 'item-8',
    name: 'Valrhona Chocolate Babka Slice',
    category: 'Sweets & Cakes',
    bakedAt: '7:45 AM',
    bakeMinutes: 465,
    quantityLeft: 5,
    fullPrice: 5.25,
  },
  {
    id: 'item-9',
    name: 'Pain au Chocolat',
    category: 'Pastries & Viennoiserie',
    bakedAt: '8:30 AM',
    bakeMinutes: 510,
    quantityLeft: 6,
    fullPrice: 4.95,
  },
  {
    id: 'item-10',
    name: 'Spinach & Feta Danish',
    category: 'Savory & Lunch',
    bakedAt: '9:15 AM',
    bakeMinutes: 555,
    quantityLeft: 3,
    fullPrice: 5.50,
  },
  {
    id: 'item-11',
    name: 'Rosemary Olive Focaccia Square',
    category: 'Hearth & Sourdough',
    bakedAt: '10:00 AM',
    bakeMinutes: 600,
    quantityLeft: 8,
    fullPrice: 5.00,
  },
  {
    id: 'item-12',
    name: 'Lemon Poppyseed Loaf Slice',
    category: 'Sweets & Cakes',
    bakedAt: '10:45 AM',
    bakeMinutes: 645,
    quantityLeft: 4,
    fullPrice: 4.25,
  },
  {
    id: 'item-13',
    name: 'Salted Caramel Pecan Tart',
    category: 'Sweets & Cakes',
    bakedAt: '11:30 AM',
    bakeMinutes: 690,
    quantityLeft: 2,
    fullPrice: 6.50,
  },
  {
    id: 'item-14',
    name: 'Blueberry Streusel Muffin',
    category: 'Sweets & Cakes',
    bakedAt: '12:15 PM',
    bakeMinutes: 735,
    quantityLeft: 5,
    fullPrice: 3.95,
  },
];

/**
 * Invented history for the six days before today, most recent first.
 * This week adds tonight's live row on top, dates every row from today's date,
 * and uses a walk saved on this device in place of a sample day when there is one.
 * Each day's pulls add up to its pulledCount, so the ranking built from these
 * rows agrees with the daily totals.
 */
export const SAMPLE_PAST_SIX_DAYS: SampleDayRecord[] = [
  {
    id: 'day-1',
    markedDownCount: 18,
    pulledCount: 2,
    moneyLost: 28.50,
    pulls: [
      { itemId: 'item-7', units: 1 }, // Ham & Gruyère Croissant
      { itemId: 'item-11', units: 1 }, // Rosemary Olive Focaccia Square
    ],
  },
  {
    id: 'day-2',
    markedDownCount: 22,
    pulledCount: 4,
    moneyLost: 42.00,
    pulls: [
      { itemId: 'item-7', units: 1 },
      { itemId: 'item-3', units: 1 }, // Almond Frangipane Croissant
      { itemId: 'item-10', units: 1 }, // Spinach & Feta Danish
      { itemId: 'item-1', units: 1 }, // Country Sourdough Batard
    ],
  },
  {
    id: 'day-3',
    markedDownCount: 19,
    pulledCount: 3,
    moneyLost: 34.50,
    pulls: [
      { itemId: 'item-7', units: 1 },
      { itemId: 'item-11', units: 1 },
      { itemId: 'item-3', units: 1 },
    ],
  },
  {
    id: 'day-4',
    markedDownCount: 14,
    pulledCount: 3,
    moneyLost: 31.00,
    pulls: [
      { itemId: 'item-7', units: 1 },
      { itemId: 'item-10', units: 1 },
      { itemId: 'item-12', units: 1 }, // Lemon Poppyseed Loaf Slice
    ],
  },
  {
    id: 'day-5',
    markedDownCount: 16,
    pulledCount: 2,
    moneyLost: 26.50,
    pulls: [
      { itemId: 'item-11', units: 1 },
      { itemId: 'item-3', units: 1 },
    ],
  },
  {
    id: 'day-6',
    markedDownCount: 13,
    pulledCount: 1,
    moneyLost: 19.80,
    pulls: [{ itemId: 'item-1', units: 1 }],
  },
];

