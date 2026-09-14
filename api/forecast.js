/**
 * Serverless function for Singapore 2-hour weather forecast for "City" area.
 * Upstream: data.gov.sg
 * Cache-Control: s-maxage=900, stale-while-revalidate=1800 (15 min cache, 30 min stale)
 */
export default async function handler(req, res) {
  // Set required caching headers for shared campus network rate limits
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
    const cityForecast = item?.forecasts?.find(
      (f) => f.area && f.area.trim().toLowerCase() === 'city'
    );

    const fetchedAt = new Date().toISOString();

    // If the area is not found in the response, that is the EMPTY case, not an error:
    // return 200 with forecast set to null, so the screen can tell it apart from a failure.
    if (!cityForecast) {
      return send(200, {
        area: 'City',
        forecast: null,
        validPeriod,
        fetchedAt,
      });
    }

    // Returns only { area, forecast, validPeriod, fetchedAt }. Nothing else.
    return send(200, {
      area: cityForecast.area,
      forecast: cityForecast.forecast,
      validPeriod,
      fetchedAt,
    });
  } catch (err) {
    return send(502, {
      error: "Can't reach the weather service",
      upstreamStatus: null,
      details: err.message,
    });
  }
}
