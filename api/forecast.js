/**
 * Serverless function for Singapore 2-hour weather forecast.
 * Upstream: data.gov.sg
 * Cache-Control: s-maxage=900, stale-while-revalidate=1800 (15 min cache, 30 min stale)
 * Accepts optional ?area= query parameter (defaults to "City").
 * Returns { area, forecast, validPeriod, fetchedAt, areas }.
 */
export default async function handler(req, res) {
  // Set required caching headers for shared campus network rate limits. Cached per area URL.
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
  res.setHeader('Content-Type', 'application/json');

  const send = (statusCode, payload) => {
    if (typeof res.status === 'function') {
      res.status(statusCode);
    } else {
      res.statusCode = statusCode;
    }
    if (typeof res.json === 'function') {
      res.json(payload);
    } else {
      res.end(JSON.stringify(payload));
    }
  };

  // Parse optional ?area= query parameter, defaulting to "City" when absent
  let requestedArea = 'City';
  if (req.query && req.query.area) {
    requestedArea = req.query.area;
  } else if (req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      const param = parsedUrl.searchParams.get('area');
      if (param && param.trim()) {
        requestedArea = param.trim();
      }
    } catch {
      // ignore URL parse errors and fall back to default
    }
  }

  try {
    const upstreamRes = await fetch(
      'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast'
    );

    // AFTER the fetch, check response.ok before reading the body.
    // A refusal often has an empty body, so calling .json() on non-2xx throws.
    if (!upstreamRes.ok) {
      return send(upstreamRes.status, {
        error: 'Upstream weather service returned a non-2xx status',
        upstreamStatus: upstreamRes.status,
      });
    }

    const data = await upstreamRes.json();
    const item = data?.data?.items?.[0];
    const validPeriod = item?.valid_period?.text || '';

    // Extract full list of area names from data.area_metadata
    const areas = (data?.data?.area_metadata || [])
      .map((a) => a.name)
      .filter(Boolean);

    // Match requested area case-insensitively against data.items[0].forecasts
    const targetAreaTrimmed = requestedArea.trim().toLowerCase();
    const matchedForecast = item?.forecasts?.find(
      (f) => f.area && f.area.trim().toLowerCase() === targetAreaTrimmed
    );

    const fetchedAt = new Date().toISOString();

    // If the chosen area is not found in the response, that is still the EMPTY case:
    // return 200 with forecast null, so the screen can tell it apart from a failure.
    if (!matchedForecast) {
      return send(200, {
        area: requestedArea,
        forecast: null,
        validPeriod,
        fetchedAt,
        areas,
      });
    }

    // Returns { area, forecast, validPeriod, fetchedAt, areas }
    return send(200, {
      area: matchedForecast.area,
      forecast: matchedForecast.forecast,
      validPeriod,
      fetchedAt,
      areas,
    });
  } catch (err) {
    return send(502, {
      error: "Can't reach the weather service",
      upstreamStatus: null,
      details: err.message,
    });
  }
}

