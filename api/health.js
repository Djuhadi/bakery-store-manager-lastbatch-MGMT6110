/**
 * Health check endpoint for upstream weather service (data.gov.sg).
 * Reports upstream connectivity, HTTP status, and keyConfigured status.
 */
export default async function handler(req, res) {
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

    // This service needs no credential, so keyConfigured is true by definition;
    // documented in comment as required by the assignment brief.
    return send(upstreamRes.ok ? 200 : upstreamRes.status, {
      ok: upstreamRes.ok,
      upstreamStatus: upstreamRes.status,
      keyConfigured: true,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    return send(503, {
      ok: false,
      upstreamStatus: null,
      // This service needs no credential, so keyConfigured is true by definition;
      // documented in comment as required by the assignment brief.
      keyConfigured: true,
      error: "Can't reach the weather service",
      checkedAt: new Date().toISOString(),
    });
  }
}
