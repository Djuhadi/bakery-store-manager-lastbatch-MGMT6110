import React, { useEffect, useState } from 'react';
import { ForecastResponse } from '../types';
import { CloudRain, CloudSun, Cloud, Sun, CloudLightning, Loader2, Info } from 'lucide-react';

const STORAGE_KEY = 'lastbatch_forecast_area';

const DEFAULT_AREAS = [
  'City',
  'Ang Mo Kio',
  'Bedok',
  'Bishan',
  'Boon Lay',
  'Bukit Batok',
  'Bukit Merah',
  'Bukit Panjang',
  'Bukit Timah',
  'Central Water Catchment',
  'Changi',
  'Choa Chu Kang',
  'Clementi',
  'Geylang',
  'Hougang',
  'Jalan Bahar',
  'Jurong East',
  'Jurong Island',
  'Jurong West',
  'Kallang',
  'Lim Chu Kang',
  'Mandai',
  'Marine Parade',
  'Novena',
  'Pasir Ris',
  'Paya Lebar',
  'Pioneer',
  'Pulau Tekong',
  'Pulau Ubin',
  'Punggol',
  'Queenstown',
  'Seletar',
  'Sembawang',
  'Sengkang',
  'Sentosa',
  'Serangoon',
  'Southern Islands',
  'Sungei Kadut',
  'Tampines',
  'Tanglin',
  'Tengah',
  'Toa Payoh',
  'Tuas',
  'Western Islands',
  'Western Water Catchment',
  'Woodlands',
  'Yishun',
];

type ForecastState =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'refused' }
  | { status: 'unreachable' }
  | { status: 'success'; data: ForecastResponse };

export const WeatherStrip: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || 'City';
    }
    return 'City';
  });

  const [availableAreas, setAvailableAreas] = useState<string[]>(DEFAULT_AREAS);
  const [state, setState] = useState<ForecastState>({ status: 'loading' });

  useEffect(() => {
    let isMounted = true;
    setState({ status: 'loading' });

    async function fetchForecast() {
      try {
        const queryParam = encodeURIComponent(selectedArea);
        const res = await fetch(`/api/forecast?area=${queryParam}`);

        // Check response status
        if (!res.ok) {
          const upstreamStatus = res.status;

          // 502 is returned when the fetch threw and data.gov.sg could not be reached.
          // Anything else means the provider answered and refused.
          if (upstreamStatus === 502) {
            if (isMounted) setState({ status: 'unreachable' });
          } else {
            if (isMounted) setState({ status: 'refused' });
          }
          return;
        }

        const data: ForecastResponse = await res.json();

        // Update available area list if returned from backend area_metadata
        if (data?.areas && Array.isArray(data.areas) && data.areas.length > 0) {
          if (isMounted) {
            setAvailableAreas(data.areas);
          }
        }

        // If the area was not found in response, forecast is null: EMPTY case
        if (!data || !data.forecast) {
          if (isMounted) setState({ status: 'empty' });
          return;
        }

        if (isMounted) {
          setState({ status: 'success', data });
        }
      } catch {
        // Network failure, DNS issue, or abort
        if (isMounted) {
          setState({ status: 'unreachable' });
        }
      }
    }

    fetchForecast();

    return () => {
      isMounted = false;
    };
  }, [selectedArea]);

  const handleAreaChange = (newArea: string) => {
    setSelectedArea(newArea);
    try {
      localStorage.setItem(STORAGE_KEY, newArea);
    } catch {
      // safe fallback if storage is restricted
    }
  };

  const getWeatherIcon = (forecast: string) => {
    const text = forecast.toLowerCase();
    if (text.includes('thunder') || text.includes('storm')) {
      return <CloudLightning className="w-8 h-8 text-amber-600 shrink-0" />;
    }
    if (text.includes('rain') || text.includes('shower')) {
      return <CloudRain className="w-8 h-8 text-blue-600 shrink-0" />;
    }
    if (text.includes('cloud')) {
      return <CloudSun className="w-8 h-8 text-stone-600 shrink-0" />;
    }
    if (text.includes('fair') || text.includes('clear')) {
      return <Sun className="w-8 h-8 text-amber-500 shrink-0" />;
    }
    return <Cloud className="w-8 h-8 text-stone-500 shrink-0" />;
  };

  // Ensure currently selected area is in the dropdown even if not in default list
  const displayAreas = availableAreas.includes(selectedArea)
    ? availableAreas
    : [selectedArea, ...availableAreas];

  return (
    <div
      id="closing-weather-strip"
      className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-2xs transition-all space-y-2.5"
    >
      {/* Area selector dropdown: remains usable in every state */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <label
            htmlFor="forecast-area-select"
            className="text-xs font-bold uppercase tracking-wider text-stone-500 shrink-0"
          >
            Area:
          </label>
          <select
            id="forecast-area-select"
            value={selectedArea}
            onChange={(e) => handleAreaChange(e.target.value)}
            className="bg-stone-100 hover:bg-stone-200/80 border border-stone-300 text-stone-800 text-xs font-semibold rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer max-w-[190px] truncate"
          >
            {displayAreas.map((areaName) => (
              <option key={areaName} value={areaName}>
                {areaName}
              </option>
            ))}
          </select>
        </div>

        {/* Valid period text string displayed next to the forecast */}
        {state.status === 'success' && state.data.validPeriod && (
          <span className="shrink-0 text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
            {state.data.validPeriod}
          </span>
        )}
      </div>

      {/* 1. Loading State */}
      {state.status === 'loading' && (
        <div className="flex items-center gap-3 text-stone-600 py-1">
          <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
          <p className="text-xs font-medium text-stone-700">
            Checking the next two hours over {selectedArea}…
          </p>
        </div>
      )}

      {/* 2. Empty State */}
      {state.status === 'empty' && (
        <div className="flex items-start gap-3 text-stone-600 py-0.5">
          <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-700 leading-relaxed">
            No forecast published for {selectedArea} right now. Decide markdowns from the shelf as usual.
          </p>
        </div>
      )}

      {/* 3. Refused State */}
      {state.status === 'refused' && (
        <div className="flex items-start gap-3 text-stone-600 py-0.5">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-700 leading-relaxed">
            The weather service refused our request — no traffic guidance this hour. The list below still works.
          </p>
        </div>
      )}

      {/* 4. Unreachable State */}
      {state.status === 'unreachable' && (
        <div className="flex items-start gap-3 text-stone-600 py-0.5">
          <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-700 leading-relaxed">
            Can't reach the weather service — no traffic guidance this hour. The list below still works.
          </p>
        </div>
      )}

      {/* 5. Success State */}
      {state.status === 'success' && (
        <div className="flex items-center gap-3 pt-0.5">
          {getWeatherIcon(state.data.forecast!)}
          <div className="min-w-0">
            <span className="text-base font-black text-stone-900 leading-tight">
              {state.data.forecast}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

