import React, { useEffect, useState } from 'react';
import { ForecastResponse } from '../types';
import { CloudRain, CloudSun, Cloud, Sun, CloudLightning, Loader2, Info } from 'lucide-react';

type ForecastState =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'refused' }
  | { status: 'unreachable' }
  | { status: 'success'; data: ForecastResponse };

export const WeatherStrip: React.FC = () => {
  const [state, setState] = useState<ForecastState>({ status: 'loading' });

  useEffect(() => {
    let isMounted = true;

    async function fetchForecast() {
      try {
        const res = await fetch('/api/forecast');

        // Check response status
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const upstreamStatus = res.status;

        // 502 is the code our own function returns when the fetch threw and
        // data.gov.sg could not be reached at all. Anything else means the
        // provider answered and refused.
        if (upstreamStatus === 502) {
          if (isMounted) setState({ status: 'unreachable' });
        } else {
          if (isMounted) setState({ status: 'refused' });
        }
          return;
        }

        const data: ForecastResponse = await res.json();

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
  }, []);

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


  return (
    <div
      id="closing-weather-strip"
      className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-2xs transition-all"
    >
      {/* 1. Loading State */}
      {state.status === 'loading' && (
        <div className="flex items-center gap-3 text-stone-600 py-1">
          <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
          <p className="text-xs font-medium text-stone-700">
            Checking the next two hours over City…
          </p>
        </div>
      )}

      {/* 2. Empty State */}
      {state.status === 'empty' && (
        <div className="flex items-start gap-3 text-stone-600 py-0.5">
          <Info className="w-5 h-5 text-stone-400 shrink-0" />
          <p className="text-xs text-stone-700 leading-relaxed">
            No forecast published for City right now. Decide markdowns from the shelf as usual.
          </p>
        </div>
      )}

      {/* 3. Refused State */}
      {state.status === 'refused' && (
        <div className="flex items-start gap-3 text-stone-600 py-0.5">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs text-stone-700 leading-relaxed">
            The weather service refused our request — no traffic guidance this hour. The list below still works.
          </p>
        </div>
      )}

      {/* 4. Unreachable State */}
      {state.status === 'unreachable' && (
        <div className="flex items-start gap-3 text-stone-600 py-0.5">
          <Info className="w-5 h-5 text-stone-400 shrink-0" />
          <p className="text-xs text-stone-700 leading-relaxed">
            Can't reach the weather service — no traffic guidance this hour. The list below still works.
          </p>
        </div>
      )}

      {/* 5. Success State */}
      {state.status === 'success' && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {getWeatherIcon(state.data.forecast!)}
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {state.data.area}
                </span>
                <span className="text-base font-black text-stone-900">
                  {state.data.forecast}
                </span>
              </div>
            </div>
          </div>

          {/* Valid period text string displayed next to the forecast */}
          {state.data.validPeriod && (
            <span className="shrink-0 text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
              {state.data.validPeriod}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
