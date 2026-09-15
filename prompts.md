# PROMPTS.md — LastBatch

**Student:** Isabella Karunia Djuhadi · **Course:** MGMT6110 · **Problem Set 1 and 2**  
**User sentence:** A bakery store manager opens this screen at 5 PM, an hour before closing, to decide which unsold items to mark down and which to pull, and knows it worked when every item on the list has a decision and the list is empty.  
**Live link:** https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/

---

## Prompt 1 — the master prompt

```
ROLE: You are a senior front-end developer building a React web app.

GOAL: Build the front end of LastBatch, a web product for bakery store
 managers at a small chain of neighbourhood bakeries — around 40 managers,
 each running one shop, each on their phone while standing on the shop floor.
 Screens:
 1) "Closing list". The manager's job here is to walk the shelves at 5 PM,
    an hour before closing, and decide what happens to every item that has
    not sold. It shows every unsold item still on the shelf today. For each
    item: the item name, its category, the time it was baked, how many are
    left, and the full price. Items baked longest ago appear first, because
    those are the most urgent. The manager taps one of three buttons on each
    item — "20% off", "50% off", or "Pull" — and that item is then marked as
    decided and visibly settles out of the way. A counter at the top always
    shows how many items are still undecided. When every item has been
    decided, the list is replaced by a message saying the closing list is
    done. There is a way to undo a decision on an item.
 2) "This week". The manager's job here is to see what was thrown away over
    the last seven days and work out what to bake less of. It shows one row
    per day for the last seven days, with how many items were marked down,
    how many were pulled, and the money lost that day. Below that, a short
    list of the products pulled most often this week, worst first, with the
    number of times each was pulled. This screen is read-only — no buttons
    that change anything.

OUTPUT: A running app. Keep every invented value in ONE data file of its own,
 with at least 12 items across at least 4 categories, so the screen looks
 real. One component per screen or section. Readable on a phone at arm's
 length, with tap targets big enough for a thumb. Move between the two
 screens without reloading the page. When you are done, list the files you
 created and what each one holds.

GUARDRAILS: Screens and invented data only. Do NOT call the Gemini API or any
 other model. Do NOT import @google/genai, do NOT create a Gemini client, and
 do NOT add any API key handling anywhere including vite.config.ts. Do NOT
 call any outside service or fetch from any URL. No database, no login, no
 user accounts, no analytics. No features I did not list — no settings page,
 no search box, no dark mode toggle, and no navigation beyond moving between
 the two screens above. No real company's name, logo, or trademark; no real
 bakery brand. Invented names and numbers only, nothing confidential.

CONTEXT: Individual Problem Set 1 for MGMT 6110 Human-AI Collaboration at SMU.
 Built in Google AI Studio, shared as a link, and opened on a phone by
 classmates in Week 3. I am not a programmer: when you make a choice I did
 not specify, say so in one line rather than burying it.
```

**What came back:** Eight files, both screens, 14 items across 4 categories, preview loaded in about two minutes. It also added a shop identity, a progress bar, a second counter, a toast on every decision and a whole colour scheme I never asked for — and it computed the discounted price on each button, which I had not thought to specify and which is better than what I asked for.

**What I changed next and why:** Nothing yet — I checked the preview against my numbered Goal list first. All twelve items passed, so the next prompt came from something that was never on my list: the day labels on screen 2 were wrong.

---

## Prompt 2 — the date labels were wrong

```
On the "This week" screen, the top row is labelled "Sunday (Yesterday)" but
yesterday was Monday 7 September. Relabel the seven days so they are the seven
days ending yesterday, and remove the "(Yesterday)" wording so the labels do
not go stale when someone opens this on a different day. Change nothing else.
```

**What came back:** Correct — Monday Sep 7 back to Tuesday Sep 1, every weekday matching its date, "(Yesterday)" gone.

**What I changed next and why:** Comparing before and after, the numbers had not moved and only the labels changed so I cannot tell whether it fixed the date logic or renamed six rows. I moved on to checking the numbers themselves, and that arithmetic is what found the next problem: 77 pulls a week in a 14-product shop means almost everything is binned daily, which contradicts my own closing list where most items get marked down.

---

## Prompt 3 — the two screens described different bakeries

```
On the "This week" screen, the daily pulled counts are too high for this shop —
they imply almost every product is binned every day, which contradicts the
closing list where most items get marked down. Reduce each day's pulled count
to between 1 and 4. Update the header totals and the "Bake Less of These" list
so they stay consistent with the new daily numbers. Change nothing else.
```

**What came back:** Daily pulls now 1–4. I re-added them myself rather than trusting the summary: the seven days sum to 18 pulls and $215.00, which matches the header totals exactly.

**What I changed next and why:** Nothing — the two screens now describe the same shop. Pushing it was a separate problem: the live site kept showing the old numbers until I opened `src/data.ts` in the repository and saw the source had not changed either, so the push, not the deploy, was what had failed.

---

## Prompt 4 — Adding the Forecast Back End
```
ROLE: You are a senior full-stack developer working in my existing project, a Vite +
TypeScript app called LastBatch. Do not rewrite what is already there; add to it.

GOAL: My Closing List screen currently gives the manager no information about the hour
ahead. Add a closing-hour conditions strip at the top of that screen, fed by the
Singapore two-hour rain forecast for the area City, fetched through a serverless
function of my own.
  1) api/forecast.js — calls
     https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast
     finds the entry in data.items[0].forecasts whose area matches "City", and returns
     only { area, forecast, validPeriod, fetchedAt }. Nothing else.
  2) api/health.js — reports whether the upstream answered, including the HTTP status
     it returned, and a keyConfigured field. This service needs no credential, so
     keyConfigured is true by definition; say so in a comment rather than removing the
     field, because my brief asks for it.
  3) On the Closing List screen, show the forecast in a strip above the item list, and
     decide what the manager sees in each of four cases. Use exactly these sentences:
       loading:     "Checking the next two hours over City…"
       empty:       "No forecast published for City right now. Decide markdowns from
                     the shelf as usual."
       refused:     "The weather service refused our request — no traffic guidance this
                     hour. The list below still works."
       unreachable: "Can't reach the weather service — no traffic guidance this hour.
                     The list below still works."
     In all four cases the item list below must remain fully interactive. The markdown
     and pull actions must never be blocked or disabled by the state of the forecast.

OUTPUT: Both functions at api/ in the PROJECT ROOT, siblings of package.json, never
  inside src/. Plain .js, not .ts.
  This project uses express. Register the same two routes in the existing server file
  as well, so the preview can answer them. If there is no server file, say so plainly
  rather than inventing one.
  Return validPeriod as the human-readable valid_period.text string, and display it
  next to the forecast so the manager can see which two hours it covers.
  AFTER the fetch, check response.ok before reading the body. A refusal often has an
  empty body, so calling .json() on it throws and my function dies with a 500 instead
  of telling me what happened. On a non-2xx reply, return the upstream status and a
  one-line reason in your own JSON.
  If the area is not found in the response, that is the EMPTY case, not an error:
  return 200 with forecast set to null, so my screen can tell it apart from a failure.
  Cache with Cache-Control: s-maxage=900, stale-while-revalidate=1800. The source
  republishes every half hour and this host allows only six calls per ten seconds from
  one address, shared across everyone on my campus network.
  In the footer, credit data.gov.sg in the form its licence asks for.

GUARDRAILS: Never create a variable whose name starts with VITE_. Never call
  data.gov.sg from browser code; the page talks only to /api/forecast. No new npm
  packages. No database, no login. Leave the Closing List and This Week screens working
  exactly as they are, including the undo behaviour and the completion state.

CONTEXT: Deployed on Vercel from GitHub. A real response from the endpoint, called by
  hand just now, looks like this:

{"code":0,"data":{
  "area_metadata":[
    {"name":"City","label_location":{"latitude":1.292,"longitude":103.844}}
  ],
  "items":[{
    "update_timestamp":"2026-09-15T04:06:46+08:00",
    "timestamp":"2026-09-15T04:00:00+08:00",
    "valid_period":{
      "start":"2026-09-15T04:00:00+08:00",
      "end":"2026-09-15T06:00:00+08:00",
      "text":"4.00 am to 6.00 am"
    },
    "forecasts":[
      {"area":"Ang Mo Kio","forecast":"Partly Cloudy (Night)"},
      {"area":"City","forecast":"Partly Cloudy (Night)"},
      {"area":"Tampines","forecast":"Partly Cloudy (Night)"}
    ]
  }]
},"errorMsg":""}
```

**What came back:** Both functions at api/ in the project root, plus a new WeatherStrip component above the item list. Real data on screen within a minute: CITY · Partly Cloudy (Night) · 4.00 am to 6.00 am. The four states were implemented with my exact sentences. It told me plainly that there was no server file to register routes in and configured Vite dev middleware instead, rather than inventing one — which is what I had asked for, but I noticed I only asked because I had been warned to.

It also added a fifth state I never specified. On success the strip read "Fair conditions: steady closing foot traffic expected for evening markdowns", and on rain, "Rain forecast: evening walk-in foot traffic likely slower. Consider 50% markdowns earlier." I had specified loading, empty, refused and unreachable. I never said what the strip says when it works, so the agent decided — and what it decided was a claim my product cannot support. It turned a 4 a.m. "Partly Cloudy (Night)" reading into a statement about evening foot traffic, and in the rain case into a specific pricing instruction. Weather-to-footfall is a judgement about my user's business. It arrived looking like formatting.

**What I changed next and why:** I deleted the getTrafficGuidance function and the element that rendered it, by hand rather than by prompt. The strip now shows the area, the forecast and the valid period, and stops. The manager reads the sky and makes the call, which is their job. I kept the weather icon, because matching an icon to a weather word is presentation, not a claim.

---

## Hand edits after Prompt 4 — where I stopped prompting

Four changes I made directly in the editor rather than by asking. Three of them were cases where the code looked correct and was not.

1. **forecast.js, the unreachable status: 503 → 502.** The agent returned 503 when the fetch threw. But line 32 also passes the upstream's own status straight through, so if data.gov.sg ever answered 503, my function would return 503 for two different situations — provider refused us, and provider unreachable. Those are two of my four required sentences, and the screen would not have been able to tell them apart.

2. **WeatherStrip.tsx, how the state is chosen.** It inferred from a range: 400–499 means refused, anything else unreachable. I replaced it with an explicit check for 502, the code my own function returns when the fetch throws. The old version would have called a real 503 from data.gov.sg "unreachable", which is wrong — they answered, they refused.

3. **WeatherStrip.tsx, deleted the invented guidance** (see Prompt 4 above).

4. **WeatherStrip.tsx, `body?.upstreamStatus || res.status` → `res.status`.** This one worked, but by coincidence. On the unreachable path my function sends upstreamStatus: null, and `||` skips null, falling through to res.status, which happened to also be 502. Two separate things being 502 made it look correct. If
   either had changed, it would have failed silently. I read my own status directly instead.

None of these produced an error. All four would have passed a casual look at the screen.

---

## Prompt 5 — Header subtext

```
In the Closing List header, under "LastBatch · Shop #14 · Mill & Elm", add one line
of subtext in a smaller, muted style: "Decide markdowns on unsold stock before closing."
Change nothing else — no layout changes, no other copy, and leave the tab bar,
the counter and the item list exactly as they are.
```

**What came back:** One line added to Header.tsx at 11px in muted stone-400, nothing else touched, as asked.

**What I changed next and why:** Nothing. I sent this prompt because I had assessed my own front end against the criterion "can a stranger tell within a few seconds what this is for" and failed it: the header said "LastBatch · Shop #14 · Mill & Elm" and nothing explained the job. The fix took one prompt. The finding was the useful part, not the fix.

---

## Prompt 6 — Area picker

```
ROLE: Senior full-stack developer in my existing LastBatch project. Add to what is
there; do not rewrite it.

GOAL: api/forecast.js currently hardcodes the area "City". Let the manager choose which
of the 47 forecast areas their shop sits in.
  1) api/forecast.js should accept an optional ?area= query parameter, defaulting to
     "City" when absent. Match it case-insensitively against data.items[0].forecasts.
     Also return the full list of area names from data.area_metadata as an "areas"
     array, so the screen does not need a second call.
  2) In the weather strip, add a small dropdown listing those area names, defaulting
     to City. Changing it refetches /api/forecast?area=<chosen>.
  3) Remember the choice in localStorage so the manager sets it once, not every
     closing shift.

OUTPUT: If the chosen area is not found in the response, that is still the EMPTY case:
  return 200 with forecast null, and the screen shows "No forecast published for
  [area] right now. Decide markdowns from the shelf as usual." with the area name
  substituted. The dropdown must stay usable in every state, including when the
  forecast failed, so the manager can try a different area.
  Keep the existing Cache-Control header. Cache per area, not globally.

GUARDRAILS: Do not add any sentence interpreting the weather or recommending a
  markdown. Show the area, the forecast and the valid period only. No new npm packages.
  Leave the item list, the counter, the undo behaviour and the This Week screen exactly
  as they are.
```

**What came back:** ?area= parameter with City as the default, case-insensitive matching, the 47 area names returned in the same response so the screen needs no second call, and the choice remembered in localStorage. Empty state substitutes the chosen area name into the sentence. The dropdown stays usable in every state.

**What I changed next and why:** Nothing by hand. This prompt carried an explicit guardrail — "Do not add any sentence interpreting the weather or recommending a markdown" — written because of what happened in Prompt 4. This time no interpretive copy appeared. The guardrail was the whole difference between the two prompts.

I also sent this prompt for a product reason rather than a technical one: the function had hardcoded "City", so a manager whose shop is in Tampines was being shown a forecast for somewhere else. The screen was making a claim it could not fully support.



