# PROMPTS.md — LastBatch

**Student:** Isabella Karunia Djuhadi · **Course:** MGMT6110 · **Problem Set 1-4**  
**User sentence:** A bakery store manager opens this screen at 5 PM, an hour before closing, to decide which unsold items to mark down and which to pull, and knows it worked when every item on the list has a decision and the list is empty.  
**Live link:** https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/

---

# Problem Set 1 — Front-end prototype
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

# Problem Set 2 — Forecast back end
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

---

# Problem Set 3 — Disqus and Microsoft Clarity

For this problem set I worked in a Claude chat (claude.ai) rather than my usual coding agent. I set up the Disqus and Clarity accounts myself, and Claude wrote the code, which I pasted into GitHub's web editor.

## Prompt 7 — Disqus comment board

**What I asked:** Add a Disqus comment section to the bottom of the main page only (the Closing list), using my shortname `lastbatch`, with page.url set to my live address
and a fixed page.identifier so every comment lands in one thread. Because the Closing list and This week tabs switch without reloading, the embed must load once and use
DISQUS.reset when the Closing list mounts again.

**What came back:** A new `src/components/DisqusComments.tsx` that loads the Disqus Universal Code once, sets page.url and page.identifier ("home"), calls DISQUS.reset on
remount, and shows one line inviting feedback. Two lines in `App.tsx` place it under the Closing list, above the footer.

**What I changed next and why:** The script downloaded, but the comment box never appeared. The browser console showed "parseColor received unparseable color: oklch(...)". My app uses Tailwind CSS v4, which writes colours in oklch, and the Disqus embed cannot parse them when it reads the page's colours. The fix was to set hex colours (#1c1917 text, #fafaf9 background) directly on the #disqus_thread container. After that, the board loaded and I posted my own comment.

## Prompt 8 — Microsoft Clarity and the privacy notice

**What I asked:** Add my Clarity tracking code to the head of `index.html` so it runs only on my live Vercel address, and add a footer notice naming Clarity and Disqus with
links to the Microsoft Privacy Statement, the Disqus privacy policy and the Disqus data sharing settings.

**What came back:** The Clarity snippet (project ID unchanged) wrapped in a check on window.location.hostname, and a footer paragraph with the notice and three links, placed
under the existing data.gov.sg licence line.

**What I changed next and why:** Nothing in the code. When I pasted the footer into GitHub's web editor, three `<a` lines were silently dropped; I added them back before committing. I tested both services in an incognito window because my ad blocker hid them in my normal browser. Clarity recorded live sessions the same day.

---

# Problem Set 4 — Revising from my group's heuristic evaluation

For the revision I used Claude Code in the Claude desktop app as my coding agent. It worked in a copy of this repository on my laptop, built and tested each repair locally at phone width, committed each repair on its own, and pushed it to GitHub only after I said "yes, push". My self-evaluation in `predictions.md` was done without the agent.

**How each repair was made**

1. I sent the agent the "argue against my repair" prompt from Step 5, with the finding in its six lines, the evidence behind it and the repair I proposed.
2. The agent argued against the repair and stopped, without writing code.
3. I chose the repair in one line. For most repairs I chose "mix, help me improve it for maximum result", which left the design of the mix to the agent. Each section below says what it built, and where that goes beyond its own smallest alternative.
4. The agent built the repair, tested it locally, committed it with the finding, heuristic, severity and initials in the message, and pushed it. It then checked the live address.

**Other help from the agent, for honesty**

The agent also drafted my readings and severity ratings for the blind arbiter before I ran them in ChatGPT temporary chats, rebuilt my four-way table from my groupmates' comments, and drafted my Disqus replies, which I checked before posting. The ten arbiter exchanges are below, before the repairs, and the arbiter's ratings are also in my four-way table.

**My own check on my phone**

On Monday 28 September I walked every repair on my phone (Samsung A55, Chrome), first in an Incognito window and then in a normal window, following one checklist, and every step behaved as described. I left a few decisions saved in the normal window, so that on Tuesday I can check repair 12.

**The repairs, in the order of the table in Step 5**

| # | Finding | Heuristic | Severity used | Raised by | Commit |
|---|---|---|---|---|---|
| 1 | This week showed 1 to 7 September, not tonight | 1 | 3 | CCH, MML | `91dcfa1` |
| 2 | The weather panel did not help the decision | 2 | 2 | me (predictions.md), CCH, MML | `d8f32f9` |
| 3 | "DISC." read as discarded | 4 | 2 (arbiter) | MML | `2b45f45` |
| 4 | A refresh wiped every decision | 3 | 2 (arbiter) | CCH | `f13d3ae` |
| 5 | Pull as prominent as the markdowns | 5 | 2 (arbiter) | AK | `9e129cf` |
| 6 | No money shown for each choice | 2 | 2 (arbiter) | AK | `474e3d9` |
| 7 | No suggestion for tomorrow's bake | 7 | 2 (arbiter) | AK, and my Finding 3 | `5b8b9f3` |
| 8 | No explanation of the three buttons | 10 | 2 | me (predictions.md) | `01aae3c` |
| 9 | Bake time less prominent than the category | 8 | 1 (arbiter) | AK | `289bbe3` |
| 10 | "5:00 PM Walk" looked like a button | 8 | 1 (arbiter) | MML | `8ec8a9e` |
| 11 | 47 forecast areas, including places with no shop | 2 | 1 (arbiter) | MML | `2322470` |
| 12 | This week's earlier days were still sample numbers | 1 | 3 | CCH, MML | `6ef7c89` |

AK's Finding 4 (API information shown to the manager) led to no separate change: I could not find any such information on screen, and I have asked AK in my reply whether he meant the weather panel, which repair 2 addresses.

## Blind arbiter: all ten exchanges

Row 4 of my four-way table was empty, so no finding had to go to the arbiter under the rule, except any row-2 finding I was tempted to rate 0 (the API finding). I chose to take all ten row-2 findings. Each prompt went into its own new ChatGPT temporary chat, so no verdict could influence the next. A random draw decided whether my reading was Reviewer A or B. I drafted my readings and ratings with Claude before running the arbiter; the arbiter did not see who wrote either side.

| Arbiter | Finding | My reading | Arbiter's rating |
|---|---|---|---|
| 1 | This Week shows 1 to 7 September | B | 3 |
| 2 | Refreshing wipes every decision | B | 2 |
| 3 | "DISC." reads as discarded | B | 2 |
| 4 | Pull as prominent as the markdowns | B | 2 |
| 5 | Money given up is not shown | B | 2 |
| 6 | No recommendation for tomorrow's bake | A | 2 |
| 7 | Bake time less prominent than category | A | 1 |
| 8 | "5:00 PM Walk" looks like a button but does nothing | A | 1 |
| 9 | 47 forecast areas in the list | A | 1 |
| 10 | API information shown to the manager | A | no rating (not the same problem) |

Arbiter 10 compared my literal reading of AK's Finding 4, that no API information appears on screen, with his. Reading his finding again later, I think he may have meant the weather panel, the part of the app built on the data.gov.sg API; I have asked him in my reply.

### Arbiter 1: This Week shows 1 to 7 September (my reading was B)

**What I sent:**

```text
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bakery store manager doing
the end-of-day closing walk, and helps them decide, for each unsold item, whether to
mark it down 20%, mark it down 50%, or pull it.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
- Where: The live app, on the This week tab, at the "Daily breakdown (last 7 days)" list.
- What they did, what they saw: On Saturday 26 September, I pulled Traditional Baguette
  on the Closing list, then opened This week. The heading said "Last 7 days overview",
  but the most recent day listed was Monday, Sep 7, and the oldest was Tuesday, Sep 1.
  The baguette I had just pulled did not appear anywhere.
- Which heuristic: 1, Visibility of System Status.
- Screen or system: System. The page does not have this week's figures or today's
  decisions to work with, so the screen cannot show them without first being given
  that data.
- Severity, and why: 3, damage to the product's standing. The tab exists to guide
  tomorrow's bake quantities, and a manager who notices the dates are three weeks old
  will stop trusting the "Bake less of these" advice.
- The repair: This week shows the seven days up to today, includes the decisions made
  on the Closing list, and says when the figures were last updated.

REVIEWER B:
- Where: The live app, on the This week tab, at the "Last 7 days overview" and the
  Daily breakdown list.
- What they did, what they saw: On Monday 28 September, I pressed Pull on one item on
  the Closing list, then opened This week. The overview is headed "Last 7 days
  overview", and the Daily breakdown lists Monday Sep 7 down to Tuesday Sep 1. The item
  I had just pulled is not counted anywhere on the tab, and nothing says when the
  figures were last updated.
- Which heuristic: 1, Visibility of System Status.
- Screen or system: System. The weekly figures do not change when decisions are made
  on the Closing list, so the screen has no recent figures to show.
- Severity, and why: 3, damage to the product's standing. Everyone who opens This week
  meets it, and a manager who notices the dates are three weeks old has no reason to
  trust the "Bake less of these" list.
- The repair: This week shows the seven days up to today, includes tonight's decisions,
  and says which dates the figures cover.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 2 out of 3
- Severities that reviewers other than A and B gave this problem: 3

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**ChatGPT's answer:**

**1. Same problem?**

Yes. A and B describe the same underlying usability problem: the “This week” view presents stale weekly data as though it were current, does not incorporate recent Closing decisions, and does not state the data’s freshness/coverage.

The different test dates and exact stale date ranges do not make these different problems; they are two observations of the same system-level failure.

**2. The four severity factors**

| Factor | What the evidence shows | What it cannot show |
|---|---|---|
| How often it happens | The problem was independently raised by 2 of 3 reviewers. Both A and B encountered it when using the relevant workflow. | It does not establish how often real bakery managers encounter it in normal use, or whether it occurs on every visit. |
| What it costs when it happens | The affected information is specifically used to guide future bake quantities. Both A and B identify loss of trust in the resulting “Bake less of these” advice as the consequence. | There is no observed evidence of an actual wrong bake, waste, lost sales, or other measurable business consequence. |
| Whether people can learn around it | The screen gives no freshness/update indication, so the evidence provides no obvious in-product workaround. | We do not have evidence that managers actually fail to develop a workaround—for example, checking another source or simply ignoring the tab. |
| Whether it damages the product’s standing disproportionately | This is the strongest severity evidence: all three reviewers rated the problem 3, and A/B independently identified loss of trust in a core decision-support feature. | The reviewers' judgments do not demonstrate the magnitude of the reputational/trust damage among actual users. There is no user or business-impact evidence showing that the damage rises to catastrophe level. |

**3. Severity supported by the evidence**

Severity: 3 — Major usability problem.

The deciding factor is damage to the product’s standing. The problem affects a feature whose purpose is to provide decision-support, yet it presents information that is visibly several weeks old without identifying that fact. All three reviewers independently place the problem at severity 3, while the two independent reports establish that it is reproducible rather than an isolated observation.

The evidence does not support severity 4: there is no observation showing that the stale information causes an unavoidable, catastrophic consequence or makes release untenable.

**4. One observation that would change the rating**

Observation: A real manager uses the stale “Bake less of these” advice to make the next day's bake decision and consequently makes a materially harmful decision without realizing that the underlying data is stale.

This would be quick to collect: give a manager the current prototype in a short task-based session, have them perform the closing workflow and use This week to decide the next day's quantities, and observe both the decision and whether they notice the data-date mismatch.

That observation would provide the missing evidence about actual cost, rather than inferred loss of trust, and could move the severity upward if the consequence were substantial.

### Arbiter 2: Refreshing wipes every decision (my reading was B)

**What I sent:**

```text
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bakery store manager doing
the end-of-day closing walk, and helps them decide, for each unsold item, whether to
mark it down 20%, mark it down 50%, or pull it.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
- Where: The live app, on the Closing list tab, at the "0 of 14 decided" progress
  counter.
- What they did, what they saw: I pressed "20% off" on Country Sourdough Batard and
  "Pull" on Traditional Baguette, and the counter showed "2 of 14 decided". I refreshed
  the page. The counter went back to "0 of 14 decided" and both items were back on the
  list, with no warning. The Area shown before the refresh, Tampines, was still
  selected.
- Which heuristic: 3, User Control and Freedom.
- Screen or system: Screen. The page already remembers the chosen Area after a
  refresh, so it can keep the decisions the same way.
- Severity, and why: 3, what it costs when it happens. A manager partway through the
  shelf walk loses every decision made so far and has to redo the whole walk.
- The repair: Decisions made during a shelf walk are still there after the page is
  refreshed or reopened, until the manager finishes or clears the walk.

REVIEWER B:
- Where: The live app, on the Closing list tab, at the progress counter and the item
  list.
- What they did, what they saw: I pressed 20% off on one item and Pull on another, and
  the counter showed "2 of 14 decided". I refreshed the page. The counter went back to
  "0 of 14 decided", both items were back on the list, and no message appeared. The
  area I had chosen was still selected.
- Which heuristic: 3, User Control and Freedom.
- Screen or system: Screen. The page already keeps the chosen area after a refresh, so
  it can keep the decisions the same way.
- Severity, and why: 3, what it costs when it happens. It does not happen on every walk,
  but when the page reloads, for example after switching apps on a phone, every
  decision made so far is lost with no warning and the walk starts again.
- The repair: Decisions made during a shelf walk survive a refresh or a reopened page,
  until the manager finishes or clears the walk.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 1 out of 3
- Severities that reviewers other than A and B gave this problem: NONE

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**ChatGPT's answer:**

**1. Same problem?**

Yes. A and B describe the same usability problem: decisions made during an in-progress closing walk are lost after a refresh/reopen, while the selected Area persists and no warning is given.

The difference is only in how they describe the circumstance: A emphasizes a refresh; B gives switching apps on a phone as an example of how a reload might occur.

**2. Four factors**

| Factor | What the evidence shows | What it cannot show |
|---|---|---|
| How often it happens | The loss is reproducible when the page is refreshed. Only 1 of 3 reviewers independently raised it, however. | It does not establish how often real managers encounter refreshes/reopens during actual closing walks. Reviewer detection is not the same as user occurrence. |
| What it costs | When it occurs, decisions already made in the walk are lost and the items return to the list. That can require the manager to redo work. | There is no observation of an actual manager losing work, how much time it costs, or whether managers commonly have enough decisions accumulated for the impact to be substantial. |
| Whether users can learn around it | There is no warning or indication that decisions are temporary. | Nothing establishes whether managers would notice the behavior, develop a workaround, or reliably avoid refreshing/reopening. |
| Whether it damages the product's standing out of proportion | No evidence directly addresses this factor. | We cannot infer reputational/business impact from the described interaction alone. There are no complaints, abandonment data, or comparable evidence. |

**3. Severity supported by the evidence**

Severity 2 (minor usability problem) is the strongest rating the evidence supports.

The demonstrated behavior is genuinely a usability problem, so 0 or 1 is not supported. And the potential cost when it happens is substantial, which makes the reviewers' concern about impact credible.

But 3 is not adequately established. A severity-3 judgment requires more than showing that the consequence can be costly. The evidence does not establish how frequently reloads/reopens actually occur during closing walks, nor how often they result in meaningful lost work. The fact that only one of three independent reviewers raised the issue is some evidence against treating it as clearly prevalent, but it is not a measurement of real-world frequency.

The deciding factor is frequency evidence: the impact is demonstrated, but the frequency of exposure in actual use is unknown.

**4. One observation that would change the rating**

The most useful observation would be:

How many real closing walks experience a refresh/reopen after at least one decision has been made, and how often does that cause decisions to be lost?

This could be collected quickly through a small observational test—for example, observe 10–20 managers' closing walks (or instrument a test build for the same number of walks) and record each reload/reopen and whether it occurs after decisions have been made.

If lost decisions occur regularly, that would provide the missing frequency evidence and could justify 3. If reloads/reopens after decisions are extremely rare, the evidence would remain more consistent with 2.

### Arbiter 3: "DISC." reads as discarded (my reading was B)

**What I sent:**

```text
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bakery store manager doing
the end-of-day closing walk, and helps them decide, for each unsold item, whether to
mark it down 20%, mark it down 50%, or pull it.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
- Where: The live app, the "This week" tab, the DISC. column in the Daily Breakdown.
- What they did, what they saw: On the Closing list, the red Pull button has "Discard"
  under it, so to me "discard" means throw away. When I switched to This week, each day
  had a "DISC." box, for example Sunday showed DISC. 22. My first thought was that 22
  items were thrown away that day. Then I added up the DISC. column and it came to 117,
  which matches "Marked down" at the top. So DISC. actually means discounted, and the
  thrown-away count is the PULL box beside it.
- Which heuristic: 4, Consistency and Standards.
- Screen or system: Screen. The same short word points to two different actions on two
  tabs.
- Severity, and why: 3. The cost is high. This tab exists to help decide tomorrow's
  bake. A manager who reads DISC. 22 as 22 items binned could cut the bake far more
  than needed and run out the next day.
- The repair: Each action is called by one name everywhere in the app, and nothing on
  the weekly screen can be read as the opposite of what it means.

REVIEWER B:
- Where: The live app, the This week tab, the DISC. box on each day of the Daily
  breakdown.
- What they did, what they saw: On the Closing list, the Pull button says "Discard"
  under it. On This week, each day has a DISC. box and a PULL box, for example Sunday
  Sep 6 shows DISC. 22 and PULL 4. The DISC. boxes add up to 117, the same as "Marked
  down" at the top of the tab, so DISC. stands for discounted. Nothing on the tab says
  what DISC. stands for.
  Lower on the same tab, the "Bake less of these" list says "units discarded" for
  items that were pulled.
- Which heuristic: 4, Consistency and Standards.
- Screen or system: Screen. The labels are text on the screen, and the page already has
  everything it needs to name them in full.
- Severity, and why: 2, whether the person can learn around it. A manager can misread
  DISC. the first time, but the totals at the top show what it means, and once they
  have worked it out they are unlikely to misread it again.
- The repair: Each action has one name everywhere in the app, and no label on This week
  can be read as its opposite.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 1 out of 3
- Severities that reviewers other than A and B gave this problem: NONE

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**ChatGPT's answer:**

**1. Same problem?**

Yes. A and B describe the same usability problem: the abbreviation “DISC.” on the This week screen is ambiguous because “Discard” refers to the Pull action elsewhere, while “DISC.” actually represents discounted items. Their observations differ in emphasis, not in the underlying problem.

**2. The four factors**

| Factor | What the evidence shows | What it cannot show |
|---|---|---|
| How often it happens | The problem was independently identified by 1 of 3 reviewers. | It does not establish how often real bakery managers encounter or misinterpret it. The reviewer sample is too small. |
| What it costs when it does | A identifies a plausible high-cost consequence: interpreting 22 discounted items as discarded could affect the next day's bake. | No evidence shows that a manager actually made that mistake, changed a bake decision, or suffered a resulting business cost. The claimed consequence remains hypothetical. |
| Whether people can learn around it | B found a concrete on-screen way to resolve the ambiguity: the DISC. totals match “Marked down,” while PULL corresponds to discarded items. | It does not establish that all users notice or use those clues, nor that they will reliably remember the distinction later. |
| Whether it damages the product's standing out of proportion | Nothing in the evidence establishes an unusually disproportionate impact on the product as a whole. | There is no evidence about broader trust, adoption, reputation, or whether this ambiguity undermines the product beyond the particular task. |

**3. Severity supported by the evidence**

Severity 2 — minor usability problem.

The deciding factor is what the evidence establishes about the consequence and learnability. There is evidence of genuine ambiguity and a plausible way to resolve it, but no observed consequential error supporting A's severity-3 claim.

The 1-in-3 independent detection rate establishes that the problem is real enough to warrant attention, but it does not establish that it is frequent or costly enough for a major-severity rating. Conversely, B's observation that the totals disambiguate the label is direct evidence of a recovery path.

So the evidence supports 2, not a compromise between 2 and 3: the record lacks evidence necessary to justify the major-cost assumption behind 3.

**4. One observation that would change the rating**

An observed manager independently interprets “DISC. 22” as 22 discarded items and consequently changes the next day's bake decision in response.

Collect it quickly with a small task test: show several managers the This week screen without explaining “DISC.”, ask what the Sunday numbers mean and what they would use them for, and observe whether anyone makes a consequential bake decision based on the mistaken interpretation.

That single observation would directly establish the currently missing link between ambiguity → actual consequential error, and could justify moving the severity to 3.

### Arbiter 4: Pull as prominent as the markdowns (my reading was B)

**What I sent:**

```text
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bakery store manager doing
the end-of-day closing walk, and helps them decide, for each unsold item, whether to
mark it down 20%, mark it down 50%, or pull it.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
- Where: The live app, product decision screen, 20% / 50% / Pull action area.
- What they did, what they saw: During the closing walk, I reviewed freshly baked items
  that had not sold by the end of the day. The 20% markdown, 50% markdown, and Pull
  actions were presented at a similar visual level. For same-day baked goods, markdowns
  are normal end-of-day selling decisions, while Pull is usually a lower-frequency,
  last-resort action. Giving all three actions similar visual weight increases the risk
  of accidentally selecting Pull.
- Which heuristic: 5, Error Prevention.
- Screen or system: Screen. The issue is primarily caused by the visual hierarchy and
  placement of the decision controls rather than the underlying system logic.
- Severity, and why: 3, major usability problem. Pull has a substantially different
  consequence from a markdown. During a fast closing walk, an accidental Pull could
  remove an otherwise sellable product from sale.
- The repair: Pull should have less visual prominence. It could be a smaller button, a
  secondary action, or be visually separated from the 20% and 50% markdown options. A
  lightweight confirmation could also be used before completing a Pull.

REVIEWER B:
- Where: The live app, on the Closing list tab, at the 20% off, 50% off and Pull buttons
  on each item card.
- What they did, what they saw: On every card, Pull sits beside the two markdown buttons
  at the same size, in red, with "Discard" under it. I pressed Pull on one item. The
  item left the list at once, with no confirmation. A bar appeared with an Undo button,
  and the item was listed under Decided items with its own Undo button. Pressing Undo
  put it back on the list.
- Which heuristic: 5, Error Prevention.
- Screen or system: Screen. Size, placement and any confirmation are all decided on the
  screen.
- Severity, and why: 2, what it costs when it happens. A Pull pressed by mistake is shown
  at once in a bar with Undo, and stays in the Decided items list with its own Undo,
  so it takes one tap to reverse.
- The repair: Pull is harder to press by mistake than the two markdowns.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 1 out of 3
- Severities that reviewers other than A and B gave this problem: NONE

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**ChatGPT's answer:**

**1. Same problem?**

Yes. Both reviewers describe the same underlying usability problem: the Pull/Discard action is presented alongside the two markdown actions in a way that can permit an unintended Pull.

Their observations differ in emphasis—A assesses the risk created by the control design, while B tests the consequences and reversibility of that risk—but they are evaluating the same Error Prevention issue.

**2. Four severity factors**

| Factor | What the evidence shows | What it cannot show |
|---|---|---|
| How often it happens | Only 1 of 3 reviewers independently raised the problem. That establishes that the concern was independently noticed, but not how often users actually make accidental Pulls. | We have no observed error rate, frequency during real closing walks, or evidence that the similar button treatment actually causes mistakes. |
| What it costs when it happens | B actually pressed Pull and found that the item was removed immediately, but it could be restored with one Undo tap, both in the transient bar and in Decided items. That makes the demonstrated consequence readily reversible. | We don't know whether users reliably notice the Undo, whether recovery ever gets missed, or whether a mistaken Pull has downstream consequences before it is reversed. |
| Whether users can learn around it | The presence of Undo provides a recovery mechanism. B demonstrated that recovery works. | We don't know whether users understand/notice the mechanism, or whether repeated users learn to avoid accidental Pulls. |
| Whether it damages the product's standing disproportionately | Nothing in the evidence establishes a disproportionate reputational or product-level effect. | We have no evidence about manager trust, operational losses, customer impact, or whether an erroneous Pull is especially damaging relative to other errors in the workflow. |

**3. Severity supported by the evidence**

Severity 2 — minor usability problem.

The deciding factor is what it costs when the error occurs. B provides direct evidence that the potentially consequential action is immediately reversible with one tap. That substantially weakens the case for severity 3.

The evidence does not support severity 3 merely from the fact that Pull has a more consequential meaning than a markdown. A identifies a plausible error-prevention risk, but there is no evidence showing that accidental Pulls actually occur frequently or that they cause substantial unrecoverable harm.

The frequency evidence is also thin: 1/3 reviewers noticed the problem, while none of the other reviewers independently rated it as a problem. That does not prove the problem is rare among actual users; it simply gives us no basis for claiming high frequency.

**4. One observation that would change the rating**

The most useful observation would be:

During a realistic closing walk, observe whether managers accidentally select Pull and fail to notice or recover from it.

This can be collected quickly with a short usability test using several managers and a representative closing list, recording every accidental Pull and whether the participant notices the change and successfully uses Undo without prompting.

If accidental Pulls are observed repeatedly, particularly when participants fail to recover, that would supply the missing evidence about frequency and consequence and could justify raising the severity to 3. If they are not observed and participants readily notice and reverse them, the severity-2 assessment would be strengthened.

### Arbiter 5: Money given up is not shown (my reading was B)

**What I sent:**

```text
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bakery store manager doing
the end-of-day closing walk, and helps them decide, for each unsold item, whether to
mark it down 20%, mark it down 50%, or pull it.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
- Where: The live app, product decision screen, 20% / 50% / Pull recommendation area.
- What they did, what they saw: When deciding between a 20% and 50% markdown, I could
  see the discount percentage but not the direct financial consequence of each choice.
  Near closing time, the percentage itself is relatively abstract. A store manager is
  more likely to care about the practical question: "How much revenue or margin am I
  giving up if I choose this option?"
- Which heuristic: 2, Match Between the System and the Real World.
- Screen or system: System. The system expresses the decision mainly as a discount
  percentage rather than in financial terms that are directly meaningful to the manager.
- Severity, and why: 3, major usability problem. Financial impact is an important input
  to a markdown decision. Without it, the manager has to mentally calculate or estimate
  the consequences of each option.
- The repair: Each option should show its estimated financial impact directly, for
  example "20% off: estimated margin reduction $8", "50% off: estimated margin
  reduction $20", "Pull: estimated revenue forgone $40", so the manager can compare the
  business consequences of each decision immediately.

REVIEWER B:
- Where: The live app, on the Closing list tab, at the 20% off, 50% off and Pull buttons
  on each item card.
- What they did, what they saw: On the Country Sourdough Batard card (full price $8.50,
  4 left), the buttons read "20% off $6.80", "50% off $4.25" and "Pull Discard". Each
  markdown button shows the new price for one item. The total money given up across
  the 4 left, or lost by pulling them, is not shown anywhere on the card.
- Which heuristic: 2, Match Between the System and the Real World.
- Screen or system: Screen. The card already has the full price, the new prices and the
  number left, so it could show the totals without anything new from the back end.
- Severity, and why: 2, what it costs when it happens. Each button already shows the new
  price for one item, so the total for the few items left is a quick sum, and not
  seeing it does not stop or mislead the decision.
- The repair: At the moment of choosing, the manager can see how much money each choice
  gives up for the items left.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 1 out of 3
- Severities that reviewers other than A and B gave this problem: NONE

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**ChatGPT's answer:**

**1. Same problem?**

Yes, substantially the same problem.

Both identify the same underlying usability issue: the decision UI does not present the financial consequence of each markdown/pull choice in a directly usable form.

The scope differs slightly:

A emphasizes the financial meaning of the choices, particularly margin/revenue consequences.

B emphasizes the aggregate dollar consequence for the remaining units, noting that per-item prices are already visible.

Those are different manifestations/repair details of the same underlying problem, so I would not split them into separate findings.

**2. The four factors**

| Factor | What the evidence shows | What it cannot show |
|---|---|---|
| Frequency | Only 1 of 3 reviewers independently raised it. That establishes that it was noticed by a minority of reviewers. | It does not establish how often this occurs in real closing work. Three reviewers are too few to estimate real-world frequency. |
| Cost when it happens | The manager currently has to derive the aggregate financial consequence from information already displayed. A says this creates mental calculation; B says the calculation is quick. Both establish some extra cognitive work. | There is no observed evidence of how much time this takes, whether it causes calculation errors, or whether it actually leads to worse markdown decisions or financial loss. |
| Ability to learn around it | The visible per-item prices and quantity mean a manager can potentially compensate by doing the arithmetic mentally. | There is no evidence about whether managers reliably do so, whether they remember to, or whether experienced users develop an effective workaround. |
| Disproportionate damage to the product's standing | Nothing in the evidence demonstrates damage beyond this particular decision friction. | There is no evidence that this issue undermines trust, causes consequential business mistakes, or makes the product unacceptable to its users. |

**3. Severity supported by the evidence**

Severity 2 — minor usability problem.

The deciding factor is the demonstrated cost when it happens, combined with the absence of evidence of consequential harm.

There is a real usability cost: the manager does not get the aggregate financial consequence at the point of choice and may have to calculate it. But the evidence does not establish A's claim that this rises to a major problem. In particular:

only 1 of 3 reviewers independently noticed it;

the necessary inputs are already on the card;

there is no observed decision error, delay, or financial loss;

there is no evidence that users cannot learn or work around it.

That makes 3 unsupported by the available evidence, rather than something to average with B's 2.

**4. One observation that would change the rating**

The most decisive observation would be:

A real manager makes a materially worse or substantially slower markdown decision because the aggregate financial consequences are not shown.

This could be collected quickly by watching 5–8 managers perform a few representative closing decisions, without giving them the totals. Record whether they calculate the consequences, how long the choice takes, and whether they choose differently or incorrectly compared with the financially appropriate choice.

If that observation repeatedly occurred, it would provide the missing evidence that the cost is consequential enough to support severity 3.

### Arbiter 6: No recommendation for tomorrow's bake (my reading was A)

**What I sent:**

```text
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bakery store manager doing
the end-of-day closing walk, and helps them decide, for each unsold item, whether to
mark it down 20%, mark it down 50%, or pull it.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
- Where: The live app, on the Closing list tab, at the "Closing list is done" card that
  appears once every item has been decided.
- What they did, what they saw: I decided all 14 items. The list was replaced by a card
  headed "Closing list is done", saying every unsold shelf item has been decided for
  today's closing, with two counts: items marked down and items pulled. It said nothing
  about tomorrow's bake. The separate This week tab has a "Bake less of these" list of
  the products pulled most often, but it does not say how much less to bake.
- Which heuristic: 7, Flexibility and Efficiency of Use.
- Screen or system: System. Turning past closing decisions into a suggestion for
  tomorrow needs history and a rule that the card is not given.
- Severity, and why: 2, what it costs when it happens. The closing decision is complete
  without it. The manager plans tomorrow's bake by hand, as they would without the
  app, so time is lost but no decision goes wrong.
- The repair: After the closing walk, the manager can see what the recent pattern
  suggests for tomorrow's bake of each product, without working it out by hand.

REVIEWER B:
- Where: The live app, Summary / Closing Report after completing the closing walk.
- What they did, what they saw: After completing the closing walk, I could review the
  day's leftover items and actions, but the system did not fully use historical data to
  identify recurring operational problems. For example, if the same product repeatedly
  requires a 50% markdown, the manager still has to identify that pattern manually and
  decide whether tomorrow's production quantity should be reduced.
- Which heuristic: 7, Flexibility and Efficiency of Use.
- Screen or system: System. The issue goes beyond the summary screen itself because the
  system is not using the data it already collects to make future closing and
  production decisions more efficient.
- Severity, and why: 3, major usability problem. The app already captures closing
  inventory and markdown data. Without turning that information into actionable
  recommendations, managers still have to manually identify recurring production
  problems, limiting the system's long-term usefulness.
- The repair: The Closing Summary should include a Recommendations for Tomorrow section
  based on historical patterns, for example "Chocolate Croissant: consider reducing
  tomorrow's batch by 4 to 6 units." It should not assume that low sales mean poor
  product quality; it should identify the pattern and suggest factors for the manager
  to investigate.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 1 out of 3
- Severities that reviewers other than A and B gave this problem: NONE

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**ChatGPT's answer:**

**1. Same problem?**

Yes. A and B describe the same underlying system problem: the app records closing outcomes but does not turn historical closing patterns into actionable guidance for future production decisions.

Their framing differs—A focuses on the missing tomorrow-bake suggestion immediately after closing; B emphasizes recurring patterns and the Closing Report—but the underlying usability problem and heuristic are the same.

**2. Evidence for the four severity factors**

| Factor | What the evidence shows | What it cannot show |
|---|---|---|
| How often it happens | The problem was raised independently by 1 of 3 reviewers, so it is not unique to one reviewer's report. | It does not establish how often the problem occurs in real use, how many products are affected, or how many closing days produce a useful pattern. |
| What it costs when it happens | Both accounts indicate that the manager must do some analysis/planning manually. A specifically reports that the closing decision itself is complete and that no decision goes wrong. | There is no measured time cost, production waste, financial cost, or evidence that the omission causes incorrect decisions. B's assertion that it limits long-term usefulness is not enough to quantify severity. |
| Whether users can learn around it | There is strong evidence that a workaround exists: the manager can plan tomorrow's bake manually, and the app's historical information can be inspected. | We do not know how difficult or time-consuming that workaround is, whether managers consistently discover it, or whether it becomes impractical with larger histories. |
| Whether it damages the product's standing out of proportion | Nothing in the evidence establishes such disproportionate damage. The feature remains usable for the immediate closing task. | We cannot infer its effect on overall product value, user satisfaction, adoption, or whether this missing capability undermines the product's central purpose. |

**3. Severity supported by the evidence**

Severity 2 — minor usability problem.

The deciding factor is what it costs when it happens. The evidence establishes extra manual work, but does not establish a consequential operational error or a sufficiently large cost to justify a major-problem rating.

The evidence also supports a workaround, which further weighs against severity 3. B's proposed example—reducing tomorrow's batch by 4–6 units—is a plausible repair, but it is not evidence that failing to provide such a recommendation actually causes a major problem.

The independent-reviewer count does not justify raising the severity: 1 of 3 indicates the issue is observable, but does not establish high frequency in real-world use.

**4. One observation that would change the rating**

The rating would change if we observed a manager encountering a recurring markdown/pull pattern and, because the app failed to surface it, spending substantial additional effort or making a materially costly production decision.

A quick way to collect it would be to observe several managers' existing closing workflows—or replay their last few closing days with them—and record one concrete instance of the missing recommendation causing measurable extra work or a consequential production mistake. If that observation showed a substantial recurring cost, severity 3 would become supportable.

### Arbiter 7: Bake time less prominent than category (my reading was A)

**What I sent:**

```text
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bakery store manager doing
the end-of-day closing walk, and helps them decide, for each unsold item, whether to
mark it down 20%, mark it down 50%, or pull it.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
- Where: The live app, on the Closing list tab, at the top line of each item card.
- What they did, what they saw: Each card shows the category in a grey tag at the top
  left, such as "HEARTH & SOURDOUGH", and "Baked 5:15 AM" with a clock icon at the top
  right, in text of about the same size. The item baked longest ago also has an
  "Oldest" tag beside its bake time, and the list is headed "Urgent First · Longest
  baked on shelf".
- Which heuristic: 8, Aesthetic and Minimalist Design.
- Screen or system: Screen. The page already has the bake time; only how prominently it
  is shown would change.
- Severity, and why: 1, how often it costs anything. The bake time is on the same line
  as the category, the oldest item is tagged "Oldest", and the list is already sorted
  by bake time, so the manager rarely needs to look for it.
- The repair: The bake time stands out more than the category on each card.

REVIEWER B:
- Where: The live app, Closing Walk product card / product information area.
- What they did, what they saw: While deciding whether an item should be marked down or
  kept on sale, I noticed that product category receives relatively prominent
  presentation, while bake time does not receive the same level of visual priority. In
  an end-of-day bakery context, when an item was baked directly affects freshness and
  remaining selling time, making it more relevant to the closing decision than its
  category in many cases.
- Which heuristic: 8, Aesthetic and Minimalist Design.
- Screen or system: Screen. The information hierarchy does not fully reflect the
  importance of each piece of information to the closing task.
- Severity, and why: 2, minor usability problem. The manager can still complete the
  task, but additional attention is required to find the information that is most
  relevant to the decision.
- The repair: Bake time should receive greater visual priority, while product category
  should become secondary information, for example "Baked 2:30 PM · 8 remaining · 40 min
  to close", with the category in a smaller, secondary position.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 1 out of 3
- Severities that reviewers other than A and B gave this problem: NONE

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**ChatGPT's answer:**

**1. Same problem?**

Yes. A and B describe the same underlying usability problem: the visual hierarchy gives product category more prominence than bake time, even though bake time is important to the closing decision.

They differ mainly in severity and in how much practical impact they infer from that hierarchy.

**2. The four factors**

| Factor | What the evidence shows | What it cannot show |
|---|---|---|
| Frequency | The supplied evidence indicates limited independent support: it reports 1 out of 3 reviewers raising the problem independently. However, that figure is internally unclear because both A and B are described as raising it. | It cannot reliably establish how often managers actually encounter difficulty finding or using bake time. Reviewer counts are not the same as task frequency. |
| Cost when it happens | There is a plausible task cost: bake time is relevant to deciding whether to mark down or pull an item, and B reports needing additional attention. | No observed error, wrong markdown/pull decision, delay, or measurable extra effort is documented. We therefore cannot establish a substantial task cost. |
| Can the user learn around it? | Yes, according to the evidence. The bake time is present, the oldest item is explicitly tagged, and the list is sorted by bake time. Those mechanisms give the manager ways to compensate for the weaker visual emphasis. | We cannot establish whether those workarounds remain effective under realistic closing pressure or for managers unfamiliar with the interface. |
| Disproportionate damage to the product's standing | Nothing in the evidence indicates reputational damage, loss of trust, or a failure disproportionate to the underlying issue. | We cannot rule out such effects without observing real users or collecting feedback; they simply aren't evidenced here. |

**3. Severity supported by the evidence**

Severity 1 — cosmetic problem only.

The deciding factor is learnability/workaround, reinforced by the absence of demonstrated task cost. The information is available, the list is already ordered by bake time, and the oldest item is explicitly identified. Neither reviewer provides evidence that the hierarchy causes a wrong decision or a meaningful delay.

That makes 2 plausible as a hypothesis if the additional attention B describes turns out to be substantial, but the current evidence does not support elevating it to 2. Nor should the mere fact that bake time is task-relevant be treated as evidence of a major usability impact.

**4. One observation that would change the rating**

Observation: A manager, while performing the closing task, takes materially longer or makes a different markdown/pull decision because they fail to notice or correctly use the bake time.

A quick way to collect it: give 3–5 bakery managers several realistic closing cards and unobtrusively record time-to-decision and any cases where they initially overlook or misinterpret bake time. If that happens repeatedly, especially when the category is visually competing with it, the evidence would support moving the severity to 2.

### Arbiter 8: "5:00 PM Walk" looks like a button but does nothing (my reading was A)

**What I sent:**

```text
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bakery store manager doing
the end-of-day closing walk, and helps them decide, for each unsold item, whether to
mark it down 20%, mark it down 50%, or pull it.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
- Where: The live app, in the header at the top of both tabs, at the "5:00 PM Walk"
  label in the top right corner.
- What they did, what they saw: The label sits in a box with a border, like a button. I
  tapped it and nothing happened. The same time appears on the orange card below it as
  "5:00 PM Shelf Walk".
- Which heuristic: 8, Aesthetic and Minimalist Design.
- Screen or system: Screen. Whether the label looks tappable is decided on the screen
  alone.
- Severity, and why: 1, whether the person can learn around it. It costs one wasted
  tap, and after that tap the manager knows it is only a label.
- The repair: Anything that looks like a button does something when tapped, and a
  label that does nothing does not look like a button.

REVIEWER B:
- Where: The live app, the "5:00 PM Walk" button in the top right corner of the header.
- What they did, what they saw: "The header and the orange card both say '5:00 PM
  Shelf Walk' ... I also tapped the '5:00 PM Walk' button in the corner and nothing
  happened." This was one sentence inside a larger finding that was mainly about the
  weather card.
- Which heuristic: 8, Aesthetic and Minimalist Design (given to the larger finding).
- Screen or system: Both (given to the larger finding).
- Severity, and why: 2, given to the larger finding as a whole: "It happens on every
  visit, but people can learn to scroll past it." This observation was not rated on its
  own.
- The repair: Not stated separately for this observation.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 1 out of 3
- Severities that reviewers other than A and B gave this problem: NONE

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**ChatGPT's answer:**

**1. Same problem?**

Yes. Both reviewers describe the same underlying issue: the “5:00 PM Walk” label looks like a button but has no action when tapped.

B embedded that observation in a larger finding and therefore did not rate it independently, but that does not make it a different usability problem. The heuristic assignment is also consistent.

**2. What the evidence shows**

| Factor | What the evidence shows | What it cannot show |
|---|---|---|
| How often it happens | The element is present on both tabs, so the affordance is encountered repeatedly. B says the larger finding happens “on every visit,” but that statement was not specific to this observation. | We do not have a reliable rate for how often managers actually tap it. The independent-reviewer count is only 1/3, which is not a usage frequency. |
| Cost when it happens | A directly observed one wasted tap. No further consequence is documented. | We cannot establish that it causes workflow errors, lost time beyond that tap, incorrect markdown decisions, or other business impact. |
| Can users learn around it? | A observed that after one unsuccessful tap, the manager knows it is a label. B says people can learn to scroll past it, though this was stated for the larger finding. Together, this is some evidence that the problem is learnable around. | We do not know whether people actually remember this across visits or whether they repeatedly try the apparent button. |
| Disproportionate damage to the product's standing | Nothing in the evidence indicates damage beyond a minor affordance inconsistency. | There is no evidence about user trust, perceived quality, accessibility impact, or whether the misleading control undermines the app disproportionately. |

The 1-of-3 independent-reviewer count provides some evidence that the issue is noticeable, but it does not establish user frequency or severity. There are also no other reviewer severity ratings to corroborate a higher impact.

**3. Severity supported by the evidence**

Severity: 1 — Cosmetic problem only.

The deciding factor is learnability/workaround: the evidence supports a single wasted interaction followed by an obvious workaround—treating the element as a label and moving on.

The evidence does not support severity 2 merely because B gave the larger finding a 2. That rating was explicitly not an independent rating of this observation, so using it as corroboration would overstate the evidence.

Likewise, the evidence is too thin to justify 3 or 4: there is no demonstrated consequential error, substantial cost, or inability to work around the problem.

**4. One observation that would change the rating**

The most useful observation would be:

A manager repeatedly tries to activate “5:00 PM Walk” on subsequent visits, or hesitates/confuses the workflow because they expect the apparent button to perform an action.

This could be collected quickly by watching 3–5 managers perform the closing walk without explaining what the label does, recording whether they tap it, whether they try again on a later visit, and whether the failed interaction causes hesitation or workflow disruption.

If repeated behavior or meaningful workflow cost appeared, the learn-around and cost factors would change, providing evidence for reconsidering severity 1.

### Arbiter 9: 47 forecast areas in the list (my reading was A)

**What I sent:**

```text
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bakery store manager doing
the end-of-day closing walk, and helps them decide, for each unsold item, whether to
mark it down 20%, mark it down 50%, or pull it.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
- Where: The live app, on the Closing list tab, at the Area dropdown in the weather card.
- What they did, what they saw: I opened the Area dropdown. It lists 47 forecast areas
  in alphabetical order, including Central Water Catchment, Jurong Island, Pulau Tekong
  and Western Islands. I chose an area and refreshed the page, and the area I had
  chosen was still selected.
- Which heuristic: 2, Match Between the System and the Real World.
- Screen or system: System. The list is the weather provider's set of forecast areas.
- Severity, and why: 1, whether the person can learn around it. The manager picks the
  area once, and the choice is remembered on later visits.
- The repair: The manager sees the forecast for the shop's own area without having to
  choose from forecast zones.

REVIEWER B:
- Where: The live app, Closing list, the Area dropdown in the weather card.
- What they did, what they saw: The header says the shop is "Shop #14 · Mill & Elm",
  yet I still had to pick my area from a list of 47 places. The list includes Central
  Water Catchment, Jurong Island, Pulau Tekong and Western Islands, where nobody runs a
  bakery.
- Which heuristic: 2, Match Between the System and the Real World.
- Screen or system: System. The list is the weather provider's forecast areas, not
  places a shop manager would think in, and the app already knows which shop this is.
- Severity, and why: 1. It's mostly cosmetic. A manager picks their area once and moves
  on, but it does make the app feel less like it was built for their shop.
- The repair: The area is set from the shop's own location, and the manager never has
  to choose between forecast zones.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 1 out of 3
- Severities that reviewers other than A and B gave this problem: NONE

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**ChatGPT's answer:**

**1. Same problem?**

Yes. A and B describe the same underlying usability problem:

The app requires the manager to select a weather forecast area from a provider-oriented list, even though the app already knows which shop the manager is operating.

Their observations differ in emphasis, but not in the problem being rated. Both identify the same location, heuristic, system boundary, and proposed repair.

**2. Four severity factors**

| Factor | What the evidence shows | What it cannot show |
|---|---|---|
| Frequency | This was observed by 2 of the 2 reviewers who raised it, and the independent evidence says 1 of 3 reviewers raised the problem. | It cannot establish how often managers encounter the problem in actual use, or how many managers find it troublesome. The reviewer counts are especially thin. |
| Cost when it happens | The manager has to choose an area from 47 entries, including provider-specific areas that are not intuitive shop locations. This adds some interaction and cognitive effort. | There is no evidence of meaningful time loss, errors, incorrect weather decisions, or business impact. |
| Ability to learn/work around it | A manager can apparently select an area once, and A reports that the selection persists after refresh. That supports a straightforward workaround. | We do not know whether managers reliably understand which area to choose, whether they choose the right one, or whether the remembered choice persists across the situations that matter. |
| Disproportionate damage to the product's standing | B reports that the mismatch makes the app feel less tailored to the shop. That is plausible evidence of a perception issue. | There is no independent evidence showing substantial loss of trust, adoption, perceived quality, or other disproportionate damage. |

**3. Severity supported by the evidence**

Severity 1 — cosmetic problem only.

The deciding factor is cost when it happens, together with the demonstrated workaround: the evidence shows an unnecessary selection step and some mismatch with the user's mental model, but no demonstrated consequential error or material operational cost. The persistent selection makes the problem particularly easy to work around.

The evidence does not justify severity 2 or higher because nothing supplied demonstrates a meaningful impact beyond friction and product polish.

The evidence is also too thin to treat the 1-of-3 independent-reviewer count as evidence that the problem is rare in the real user population. It is useful corroboration that the issue is not universally noticed, but it is not a usage-frequency measurement.

**4. One observation that would change the rating**

Observation: A manager, during an actual closing walk, selects the wrong forecast area (or is unable to confidently identify the correct one) and consequently receives materially inappropriate weather information for the shop.

That would establish a concrete consequence rather than merely an aesthetic or interaction mismatch and could move the rating upward.

Quick collection: Give 5–10 bakery managers the live Closing-list task without explaining the intended area. Record whether each can identify the appropriate area, how long it takes, and whether anyone selects the wrong one. This could be observed in a short moderated usability test.

### Arbiter 10: API information shown to the manager (my reading was A)

**What I sent:**

```text
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bakery store manager doing
the end-of-day closing walk, and helps them decide, for each unsold item, whether to
mark it down 20%, mark it down 50%, or pull it.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
- Where: The live app, both tabs, including the footer at the bottom of the page.
- What they did, what they saw: I went through both tabs looking for anything about an
  API. No API name, address, status code or technical setting appears on either tab.
  The only technical wording is in the small footer: "Contains information from 2-Hour
  Weather Forecast accessed via data.gov.sg, made available under the terms of the
  Singapore Open Data Licence version 1.0", which is the attribution the data licence
  asks for, followed by a privacy notice about Microsoft Clarity and Disqus.
  The app also has a technical address, /api/health, that returns a status report,
  but nothing on either tab links to it, so a manager would see it only by typing that
  address in.
- Which heuristic: 8, Aesthetic and Minimalist Design.
- Screen or system: Screen. Anything shown to the manager is decided on the screen.
- Severity, and why: 0, how often it happens. A manager never meets it: no API
  information appears on either tab, and the footer line is the attribution the data
  licence asks for, placed below everything the manager uses.
- The repair: Nothing on the manager's screens is technical wording the manager has no
  use for.

REVIEWER B:
- Where: The live app, API-related entry or information area.
- What they did, what they saw: While using the application as a bakery store manager
  performing a closing walk, I encountered API-related functionality or information but
  could not identify how it helped me decide whether an item should receive a 20%
  markdown, 50% markdown, or be pulled. An API is more relevant to system integration
  or developers than to the manager's daily closing task.
- Which heuristic: 8, Aesthetic and Minimalist Design.
- Screen or system: System. This is an information architecture issue in which a
  non-core feature is exposed to the primary user.
- Severity, and why: 1, cosmetic problem. The API does not prevent the manager from
  completing the closing walk, but it introduces unnecessary information and cognitive
  load.
- The repair: Remove or de-emphasize the API from the manager's main workflow. If it is
  required for POS, inventory, or other integrations, it should be placed under Admin,
  Integrations, or Developer Settings instead of the core closing interface.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 1 out of 3
- Severities that reviewers other than A and B gave this problem: NONE

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**ChatGPT's answer:**

They do not describe the same problem, so the comparison should stop there.

Reviewer A describes an alleged absence of a usability problem: no API information is exposed in the manager-facing screens. The only technical wording is required data attribution in the footer, and /api/health is not linked.

Reviewer B describes an actual exposure problem: the manager encountered API-related functionality or information in the application and found it irrelevant to the closing task.

Those are materially different findings. In fact, on the evidence provided, A's observation directly contradicts the factual premise of B's observation. There is no controlled evidence establishing that B's API-related functionality exists in the manager-facing experience.

Therefore, the four-factor severity analysis cannot validly be performed as a comparison of one problem, and assigning a severity from these two accounts would require inventing or resolving an unsupported factual premise.

---

## Repair 1: This week shows the last seven days and tonight's decisions

Finding: CCH #1 and MML #2, heuristic 1 (Visibility of System Status), severity 3 from both, arbiter 3. Coding agent: Claude Code, working in a copy of this repository.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, on the This week tab, at the "Daily breakdown (last 7 days)" list.
  What they did, what they saw: On Saturday 26 September, I pulled Traditional Baguette
  on the Closing list, then opened This week. The heading said "Last 7 days overview",
  but the most recent day listed was Monday, Sep 7, and the oldest was Tuesday, Sep 1.
  The baguette I had just pulled did not appear anywhere.
  Which heuristic: 1, Visibility of System Status.
  Screen or system: System. The page does not have this week's figures or today's
  decisions to work with, so the screen cannot show them without first being given
  that data.
  Severity, and why: 3, damage to the product's standing. The tab exists to guide
  tomorrow's bake quantities, and a manager who notices the dates are three weeks old
  will stop trusting the "Bake less of these" advice.
  The repair: This week shows the seven days up to today, includes the decisions made
  on the Closing list, and says when the figures were last updated.
- The evidence behind it: Raised independently by 2 of my 3 groupmates (CCH and MML),
  both at severity 3. The blind arbiter also rated it 3.
- The repair I propose: This week shows the seven days up to today, includes tonight's
  decisions from the Closing list, and says which dates the figures cover and when
  they were last updated.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

1. **It solves the finding, but only if you're honest about the numbers.** This isn't a change you'd already planned: nothing in `predictions.md` covers it, and your own This Week finding was about "how much less to bake." The danger is in "shows the seven days up to today." Your app has no database. The seven days are a fixed list in `src/data.ts`, and nothing stores past closings. If you only change the dates, the invented numbers will look current. That's worse than today: at the moment the old dates at least warned CCH and MML that something was off. Relabelling the dates alone would fix the problem of looking old, not the problem that the figures aren't real.

2. **Most of this repair belongs to the screen, even though CCH and MML both said system.** Tonight's decisions are already in the page's memory, and `App.tsx` never passes them to the This Week screen. The phone knows today's date, so shifting the dates needs nothing from the back end. Only real history for past days would be a system repair, and it needs a place to store each night's closing. So the repair can make "includes tonight" true on the screen, but it cannot make "the seven days up to today" true for the earlier days, and the screen has to say so.

3. **It could break heuristic 4, Consistency and Standards.** Once tonight's real row sits beside six invented rows, the totals mix real and made-up numbers, "Bake less of these" ignores tonight, and the done card counts items while the sample rows look like units. It also makes CCH #2 more visible: refresh, and tonight's row drops back to zero.

4. **The smallest alternative:** a "Tonight (so far)" row built from the decisions already in memory, updating with Undo; six sample days dated back from today; one plain line saying tonight is live and earlier days are sample history; "last decision at [time]" on tonight's row only; say "units"; leave "Bake less of these" alone but mark it as sample history. Renaming the heading "Sample week" alone would make the screen honest but still leave tonight out.

5. **How to check it:** in a fresh Incognito window on a phone, open This week before deciding (Tonight shows 0, six dated rows, the sample-history line visible). Press 20% off on Country Sourdough Batard and Pull on Traditional Baguette. This week should show 4 units marked down, 6 pulled, $32.30 lost, with the time of the last decision, and the totals should rise by the same amounts. Undo the baguette: pulled 0, loss $6.80. A refresh resetting Tonight is expected until CCH #2 is fixed. Check Disqus and `/api/health`. The next morning, every date should have moved on by one day.

### My decision

"Mix, help me improve it for maximum result." I chose a mix of my repair and the agent's point 4, and asked the agent to design it. The agent proposed, and built:

> This week shows the seven days up to today: a live "Tonight" row built from the Closing list, plus six earlier days of sample history dated from today. It says which dates it covers, marks tonight as live with the time of the last decision, and folds tonight's decisions into the totals and the "Bake less of these" ranking.

Where this differs from the agent's point 4: tonight's pulls also go into "Bake less of these", instead of leaving the ranking as sample data only, so the tab cannot disagree with itself (the agent's point 3).

### What was built and how it was checked

Commit `91dcfa1`: `Show the last seven days and tonight's decisions on This week (H1, sev 3, raised by CCH and MML)`. Changed `src/App.tsx`, `src/components/ThisWeekScreen.tsx`, `src/data.ts`, `src/types.ts` and a new `src/week.ts`. The agent built it and checked it in a local copy at phone size before pushing: Tonight showed 0 before any decision; 4 · 6 · $32.30 after 20% off on the Batard and Pull on the Baguette, with the totals rising by the same amounts and the Baguette entering the ranking; 4 · 0 · $6.80 after Undo. `/api/health` returned `ok: true`, and the Disqus box and privacy notice were still on the page.

Checked again on the live address after the push.

---

## Repair 2: the weather panel says what tonight's forecast means for the walk

Finding: my own Finding 1 in predictions.md, also raised by CCH #3 and MML #3, heuristic 2 (Match Between the System and the Real World), severity 2 from all three of us. Not taken to the arbiter, because the ratings matched. The repair line was already in my predictions.md before any comment. Coding agent: Claude Code.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, on the Closing list tab, at the weather panel beside the Area
  menu.
  What they did, what they saw: I read the weather panel, which said "Partly Cloudy
  (Day)", then changed the Area from City to Queenstown and read it again. The panel
  only repeated the forecast in the weather service's words, and did not help me make a
  markdown decision. For example, if heavy rain were forecast, a manager would expect
  fewer customers and might choose a deeper discount, but nothing on the screen made
  that link, and the 20% off, 50% off and Pull choices on every item stayed exactly
  the same.
  Which heuristic: 2, Match Between the System and the Real World.
  Screen or system: System. Turning a forecast into what it means for tonight's
  customers needs a judgement the page does not have, such as a rule or a model's
  reading of the forecast, so the screen cannot do it on its own.
  Severity, and why: 2, how often it happens. Every manager sees the weather panel at
  the top of every shelf walk, and each time it shows data they have to translate
  themselves before it can help them decide.
  The repair: The weather panel supports the markdown decision in the manager's own
  terms, for example saying that heavy rain is forecast and fewer customers are likely
  tonight.
- The evidence behind it: Raised independently by 2 of my 3 groupmates (CCH and MML),
  both at severity 2. It was also Finding 1 in my own predictions.md, at severity 2,
  committed before any comment. MML added that the forecast shown is for the time the
  page is opened, not for the 5 PM walk. Not taken to the arbiter, because all three
  ratings were the same.
- The repair I propose: The screen explains what role the forecast plays in the
  closing decision and how a manager should interpret it as one additional input,
  without automatically making the markdown decision for them, and it makes clear
  which time window the forecast covers.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

1. **It mostly solves the problem I already believed I had, not the one CCH described.** My repair is my own line from predictions.md. CCH says the panel never connects tonight's forecast to the decision. My repair adds a general explanation of what the panel is for, which would read the same on a dry evening and a stormy one, so on a rainy day CCH's complaint would still be true. My repair is really help text, heuristic 10, the heuristic I predicted as my worst, whose prediction broke: I may be bending the finding to fit my prediction. MML's timing point is half real: at the real walk time the two-hour window is the closing window, but a manager who checks at 3 PM gets a window that ends before the walk.

2. **The screen can do more than CCH thinks, but my repair is in the right half for the wrong reason.** The page already sorts the forecast text into thunder, rain, cloud and fair to pick an icon, and the same sort could pick a sentence, with no back end. The window check can use the phone's clock. The part that is genuinely a system question is a claim: "rain means fewer walk-ins" is a judgement about my bakery's business, and in Problem Set 2 I deleted exactly this ("Consider 50% markdowns earlier") because the product cannot support it. What has changed is that 2 of 3 users asked for it. A middle way keeps the principle: phrase the line as something to consider, never an instruction.

3. **It could break heuristic 8, Aesthetic and Minimalist Design, which is MML's own heuristic.** MML's main complaint was that the weather card already pushes the first item down on a phone. A general explanation paragraph makes the card taller on every visit. Also, the refused and unreachable messages still say "no traffic guidance this hour", promising guidance removed in Problem Set 2.

4. **The smallest alternative:** one short line under the forecast, specific to the forecast. When rain, showers or thunder are forecast: "Rain in this window can keep walk-ins away. Weigh it when choosing between 20% and 50%." Otherwise no extra line, so the card stays short. If the phone's clock is outside roughly 4 to 7 PM: "This is the forecast for now, not for the 5:00 PM walk." Change "no traffic guidance this hour" in the two error messages. No back end change, no model, no new packages, and the manager still makes every decision.

5. **How to check it:** open the Closing list outside the walk hours and see the timing line, then again during them and see it gone. Change the Area until one forecasts rain and see the rain line appear, and disappear on a dry area; if no area has rain, say that the rain line could not be verified live and check it on a rainy afternoon or ask CCH or MML. On a dry forecast, compare the card with the before screenshot. Check the list still works, Disqus loads and /api/health returns ok: true.

### My decision

"Mix, help me improve it for maximum result." The agent designed the mix, and built:

> The weather panel adds one line under the forecast. When rain, showers or thunder are forecast: "LastBatch tip: rain in this window can keep walk-ins away. Weigh it when choosing between 20% and 50%." Otherwise: "No rain expected. Decide from the shelf as usual." Outside 3 to 6 PM it also says "This forecast is for right now, not for the 5:00 PM walk." The two error messages stop promising "traffic guidance".

Where the mix differs from the agent's point 4: the rain line is labelled "LastBatch tip:", so the app's suggestion is kept apart from the official forecast. It is the same pattern I praised in MML's product. The dry case keeps one short line from my own repair ("Decide from the shelf as usual", matching the wording of the existing empty state), sized to fit on one line beside the icon. The window runs from 3:00 to 6:00 PM, because a two-hour forecast overlaps the 5:00 PM walk (until the 6:00 PM closing) only when it is fetched in that time.

### What was built and how it was checked

Commit `d8f32f9`: `Say what tonight's forecast means for the walk, and when it is not for the walk (H2, sev 2, raised by CCH and MML; planned in predictions.md)`. Changed `src/components/WeatherStrip.tsx` only. The agent checked it in a local copy at phone size:

- The first dry wording ("No rain in this window. Decide from the shelf as usual.") wrapped to two lines and made the card 23px taller. It was shortened to "No rain expected. Decide from the shelf as usual.", which fits on one line: the card is 117px tall during the walk, against 110px before.
- On the real forecast (every area "Cloudy" at 6.50 am), the dry line and the "not for the 5:00 PM walk" note appeared.
- The rain line could not be checked on real data, because no area forecast rain at the time. It was checked by feeding the page a pretend "Thundery Showers" forecast.
- The window rule was checked at its edges: note shown at 2:59 PM and 6:00 PM, no note at 3:00, 4:30 and 5:59 PM.
- The item list still worked, the Disqus box and privacy notice were unchanged, and /api/health was not touched.

Checked again on the live address after the push. The rain line appears only when rain, showers or thunder are forecast, and I have not yet seen it on real data.

---

## Repair 3: This week calls each action by one name

Finding: MML #1, heuristic 4 (Consistency and Standards), severity 3 from MML, 2 from me, arbiter 2. Coding agent: Claude Code.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, the "This week" tab, the DISC. column in the Daily Breakdown.
  What they did, what they saw: On the Closing list, the red Pull button has "Discard"
  under it, so to me "discard" means throw away. When I switched to This week, each day
  had a "DISC." box, for example Sunday showed DISC. 22. My first thought was that 22
  items were thrown away that day. Then I added up the DISC. column and it came to 117,
  which matches "Marked down" at the top. So DISC. actually means discounted, and the
  thrown-away count is the PULL box beside it.
  Which heuristic: 4, Consistency and Standards.
  Screen or system: Screen. The same short word points to two different actions on two
  tabs.
  Severity, and why: 3. The cost is high. This tab exists to help decide tomorrow's
  bake. A manager who reads DISC. 22 as 22 items binned could cut the bake far more
  than needed and run out the next day.
  The repair: Each action is called by one name everywhere in the app, and nothing on
  the weekly screen can be read as the opposite of what it means.
- The evidence behind it: Raised by 1 of my 3 groupmates (MML), at severity 3. I rated
  it 2. The blind arbiter rated it 2, deciding on learnability: the totals at the top
  show what DISC. means. When I checked, the "Bake less of these" list on the same tab
  says "units discarded" for items that were pulled.
- The repair I propose: On This week, the DISC. label is replaced by one that cannot be
  read as "discarded", using the same words as the totals above it ("Marked down" and
  "Pulled").

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

Before arguing, the agent listed every word the app uses for the two actions. Markdowns: "20% off", "50% off", "Marked Down", "Disc.", "markdowns". Pulls: "Pull", "Discard", "Pulled", "Pulled / Discard", "units discarded", "pulled this wk", and the This Week heading "What was thrown away".

1. **It fixes the label MML tripped on, but not her repair line.** This is MML's problem, not one I had planned for. But MML asked that each action be called by one name everywhere and that nothing on the weekly screen can be read as the opposite. Renaming DISC. alone leaves the heading "What was thrown away" directly above "Marked down 106", which invites the same misreading for the whole tab, and "units discarded" in the ranking, a third word for pulls. So my repair fixes MML's one example, not the pattern she described.

2. **Screen, and my repair is in the right half.** No strong doubt: every word involved is text on the screen, and the numbers underneath are already correct.

3. **Following MML's line literally could break heuristic 2 on the Closing list.** "One name everywhere" taken literally removes "Discard" from under the Pull button, but "Pull" is shop jargon and "Discard" tells a new manager it means throw away, which is the gap in my own Finding 2. There is also a layout risk under heuristic 8: "MARKED DOWN" in the narrow DISC. box would wrap or widen the boxes and squeeze long day names like "Wednesday" on a phone.

4. **The smallest alternative:** on This week only, "Disc." becomes "Marked down" on two short lines, as it already wraps in the totals card; the row box "Pull" becomes "Pulled"; "units discarded" becomes "units pulled"; and the heading becomes "What was marked down or pulled". "Discard" stays under the Pull button on purpose, and my reply to MML should say so. Not included: the done card counts items while This week counts units, which nobody raised, so it belongs in Q4 as next.

5. **How to check it:** on a phone, use Find in page on This week for "disc" and "thrown", which should find nothing; each row should read Marked down and Pulled, with "Wednesday" still on one line; the Marked down boxes should add up to the total at the top; the ranking should say "units pulled"; and the Pull button on the Closing list should still say "Discard".

### My decision

"Mix, help me improve it for maximum result." The agent built its point 4 in full, and added one thing: measuring the new labels at phone width before committing, to rule out the layout risk in its point 3.

> This week uses one word for each action, "Marked down" and "Pulled": "Disc." becomes "Marked down", the row box "Pull" becomes "Pulled", "units discarded" becomes "units pulled", and the heading "What was thrown away" becomes "What was marked down or pulled". "Discard" stays under the Pull button on the Closing list, where it explains what Pull means.

### What was built and how it was checked

Commit `2b45f45`: `Call markdowns "Marked down" and pulls "Pulled" everywhere on This week (H4, sev 2, raised by MML)`. Changed `src/components/ThisWeekScreen.tsx` only. The agent checked it in a local copy at 360px, a small Android width:

- The risk in point 3 turned out to be real. With "MARKED DOWN" on one line, the day names were cut off ("Saturda", "Sunday", and the LIVE badge on Tonight). On two lines it was better but "Wednesday" and the LIVE badge still needed 87 and 98px against 76px available. The spacing between the boxes, the width of the Loss column and the gap beside the day name were tightened to recover the space, after which every day name fitted.
- Find in page found no "disc" or "thrown" on This week, the Marked down boxes added up to the total (102), the ranking read "5 units pulled", and the Pull button on the Closing list still read "Pull / Discard".

Checked again on the live address after the push.

---

## Repair 4: tonight's decisions survive a refresh, with a way to start over

Finding: CCH #2, heuristic 3 (User Control and Freedom), severity 3 from CCH and from me, arbiter 2. Coding agent: Claude Code.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, on the Closing list tab, at the "0 of 14 decided" progress
  counter.
  What they did, what they saw: I pressed "20% off" on Country Sourdough Batard and
  "Pull" on Traditional Baguette, and the counter showed "2 of 14 decided". I refreshed
  the page. The counter went back to "0 of 14 decided" and both items were back on the
  list, with no warning. The Area shown before the refresh, Tampines, was still
  selected.
  Which heuristic: 3, User Control and Freedom.
  Screen or system: Screen. The page already remembers the chosen Area after a
  refresh, so it can keep the decisions the same way.
  Severity, and why: 3, what it costs when it happens. A manager partway through the
  shelf walk loses every decision made so far and has to redo the whole walk.
  The repair: Decisions made during a shelf walk are still there after the page is
  refreshed or reopened, until the manager finishes or clears the walk.
- The evidence behind it: Raised by 1 of my 3 groupmates (CCH), at severity 3. I also
  rated it 3. The blind arbiter rated it 2, because nothing shows how often a page
  reloads during a real closing walk. Since my repair to This week, a refresh also
  resets tonight's live row there.
- The repair I propose: Tonight's decisions are kept on this device after a refresh or
  when the page is reopened, including on the This week tab, and the Closing list
  starts fresh on the next day.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

1. **It solves CCH's finding, which is genuinely his, but drops half of his repair line.** CCH wrote that decisions stay "until the manager finishes or clears the walk". My version only resets "on the next day", and the app had no way to clear a walk, so a manager who wanted to start over would have to press Undo up to 14 times. My repair solves "refresh loses everything" and creates "nothing can reset it".
2. **Screen, and my repair is in the right half.** No strong doubt: the page already keeps the Area choice in the browser on this device, and decisions can be kept the same way. The honest limit is "on this device": a walk started on the phone and finished on a tablet would still be lost, and fixing that needs a server store nobody asked for.
3. **It could break heuristic 1, Visibility of System Status.** Decisions would come back silently, so someone opening the app later the same day would see "5 of 14 decided" with nothing to say they came from earlier. That would happen to my own groupmates when they walk the revision on the phone they tested with. The Undo bar would also not come back after a refresh, which is acceptable because each item in Decided items keeps its own Undo.
4. **The smallest alternative:** save each decision and its time on this device under today's date, including undo, and restore them only if the date is today; when anything was restored, say "Restored from earlier tonight on this device" on the progress card; add "Start over", which asks once before clearing the walk; wrap every save and read in the same safety check the Area already uses; do not save the Undo bar.
5. **How to check it:** use a normal window, not only Incognito, which wipes saved data when it closes. Press 20% off on the Batard and Pull on the Baguette, refresh, and see 2 of 14 with the restored line and This week still at 4 · 6 · $32.30; close and reopen; undo and refresh; Start over and refresh; the next morning the list should open at 0 of 14; check the Area, Disqus and /api/health.

### My decision

"Mix, help me improve it for maximum result." The agent built:

> Tonight's decisions are saved on this device and restored after a refresh or reopen, on both tabs, and the walk starts fresh the next day. When decisions are restored, the progress card says "Restored from earlier tonight on this device", and a "Start over" button clears the walk after one confirming tap. If the phone blocks storage, the app works as before, just without saving.

Where this goes beyond the agent's point 4: before anything has been restored, the line reads "Saved on this device", so a manager sees from the first decision that the walk will not be lost; and the confirmation is two taps on the card ("Clear all N decisions" or "Cancel") rather than a pop-up.

### What was built and how it was checked

Commit `f13d3ae`: `Keep tonight's decisions after a refresh, with a way to start over (H3, sev 2, raised by CCH)`. Changed `src/App.tsx` and `src/components/ClosingListScreen.tsx`, and added `src/savedWalk.ts`. Checked locally at phone size: "Saved on this device" after the first decision; 2 of 14 and "Restored from earlier tonight" after a refresh, with This week still at 4 · 6 · $32.30 and the same last-decision time; undo then refresh left 1 of 14; Cancel cleared nothing and "Clear all 1 decision" left 0 of 14, still 0 after a refresh; a walk saved on the previous date opened at 0 of 14; unreadable saved data still opened the app normally; Area, Disqus, privacy notice and /api/health unchanged. Checked again on the live address after the push.

---

## Repair 5: Undo stays in view after any decision, and Pull is set apart

Finding: AK #1, heuristic 5 (Error Prevention), severity 3 from AK, 2 from me, arbiter 2. Coding agent: Claude Code.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, product decision screen, 20% / 50% / Pull action area.
  What they did, what they saw: During the closing walk, I reviewed freshly baked items
  that had not sold by the end of the day. The 20% markdown, 50% markdown, and Pull
  actions were presented at a similar visual level. For same-day baked goods, markdowns
  are normal end-of-day selling decisions, while Pull is usually a lower-frequency,
  last-resort action. Giving all three actions similar visual weight increases the risk
  of accidentally selecting Pull.
  Which heuristic: 5, Error Prevention.
  Screen or system: Screen. The issue is primarily caused by the visual hierarchy and
  placement of the decision controls rather than the underlying system logic.
  Severity, and why: 3, major usability problem. Pull has a substantially different
  consequence from a markdown. During a fast closing walk, an accidental Pull could
  remove an otherwise sellable product from sale.
  The repair: Pull should have less visual prominence. It could be a smaller button, a
  secondary action, or be visually separated from the 20% and 50% markdown options. A
  lightweight confirmation could also be used before completing a Pull.
- The evidence behind it: Raised by 1 of my 3 groupmates (AK), at severity 3. I rated
  it 2. The blind arbiter rated it 2, deciding on cost: a mistaken Pull is one tap to
  reverse, from the Undo bar or from Decided items. CCH and MML both named the Undo as
  the thing that works best in the product.
- The repair I propose: Pull looks clearly different from the two markdowns and is
  harder to press by mistake, while a deliberate Pull still takes one tap and can
  still be undone.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

Before arguing, the agent repeated the finding on the live address at phone size: it scrolled to the 5th card and pressed Pull. The item disappeared, the Undo bar was 768px above the view and the item's Undo in Decided items was 2,381px below it, so neither was on screen.

1. **It is AK's problem, and my repair leans on a promise that is not true for most of the list.** AK's finding has two halves: a mistaken Pull is likely, and it is costly. My repair handles the first and assumes Undo covers the second ("can still be undone"), but Undo is one tap away only for the top card. The reading the agent had written for my side of the blind arbiter said a mistaken Pull "takes one tap to reverse", and the arbiter's 2 rested on exactly that, so the arbiter judged evidence that overstated how easy recovery is, and AK's 3 may have been closer.
2. **Screen, and my repair is in the right half.** No doubt: the look of the buttons, any confirmation and where Undo appears are all decided on the screen.
3. **It could break heuristic 7, Flexibility and Efficiency of Use, and quietly push the manager's decision.** A smaller Pull or a confirmation slows every deliberate Pull, confirmations stop working once people learn to tap through them, and AK's view that Pull is a "last-resort action" is an assumption about my bakery: for bread baked twelve hours earlier, pulling may be the normal choice.
4. **The smallest alternative:** pin the Undo bar to the bottom of the screen after any decision, naming the item; set Pull apart from the two markdowns by a small gap and a different style, full size and one tap, with no confirmation; add room at the bottom of the page so the pinned bar never covers the last card, Disqus or the footer.
5. **How to check it:** scroll to the 5th card and press Pull, and the Undo bar should appear at the bottom of the screen naming it; press Undo and the item should return to its place; do the same with 20% off; Pull should be one tap, full size and set apart; at the very bottom of the page nothing should be hidden under the bar.

### My decision

"Mix, help me improve it for maximum result." The agent built:

> After any decision, the Undo bar is pinned to the bottom of the screen, wherever you are on the list, and names what happened in the app's own words: "Pulled Cheddar Chive Buttermilk Scone", or "Marked down Country Sourdough Batard · 20% off". The Pull button is set apart from the two markdowns by a divider and an outline style with a small bin icon, still full size and one tap, with no confirmation. The page gains room at the bottom so the bar never covers anything.

Where this goes beyond the agent's point 4: the bar uses the words "Pulled" and "Marked down" from repair 3, and it is announced to screen readers.

### What was built and how it was checked

Commit `9e129cf`: `Keep Undo in view after any decision, and set Pull apart from the markdowns (H5, sev 2, raised by AK)`. Changed `src/App.tsx`, `src/components/ClosingListScreen.tsx` and `src/components/ClosingItemCard.tsx`. Checked locally at phone size: pressing Pull on the 5th card while scrolled showed "Pulled Cheddar Chive Buttermilk Scone · Undo" at the bottom of the screen; Undo put the scone back in 5th place; a markdown partway down showed "Marked down Ham & Gruyère Croissant · 20% off"; the bar did not appear on This week; a refresh still restored the walk. At the bottom of the page the footer text first ended only 4px above the bar, so the room under the footer was increased until it ended 20px above. The same Pull test on the live address after the push showed the bar on screen.

---

## Repair 6: each card shows what each choice loses on all units left

Finding: AK #2, heuristic 2 (Match Between the System and the Real World), severity 3 from AK, 2 from me, arbiter 2. Coding agent: Claude Code.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, product decision screen, 20% / 50% / Pull recommendation area.
  What they did, what they saw: When deciding between a 20% and 50% markdown, I could
  see the discount percentage but not the direct financial consequence of each choice.
  Near closing time, the percentage itself is relatively abstract. A store manager is
  more likely to care about the practical question: "How much revenue or margin am I
  giving up if I choose this option?"
  Which heuristic: 2, Match Between the System and the Real World.
  Screen or system: System. The system expresses the decision mainly as a discount
  percentage rather than in financial terms that are directly meaningful to the
  manager.
  Severity, and why: 3, major usability problem. Financial impact is an important input
  to a markdown decision. Without it, the manager has to mentally calculate or estimate
  the consequences of each option.
  The repair: Each option should show its estimated financial impact directly, for
  example "20% off: estimated margin reduction $8", "50% off: estimated margin
  reduction $20", "Pull: estimated revenue forgone $40", so the manager can compare the
  business consequences of each decision immediately.
- The evidence behind it: Raised by 1 of my 3 groupmates (AK), at severity 3. I rated
  it 2. The blind arbiter rated it 2, deciding on cost: the card already shows the new
  price for one item and the number left, so the total is a quick sum.
- The repair I propose: At the moment of choosing, the manager can see how much money
  each choice gives up for the items left.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

Before arguing, the agent checked the data: the app knows only each item's full price and how many are left, and has no cost price anywhere.

1. **It is AK's problem, but part of what AK asked for cannot be shown honestly.** My repair answers AK's real complaint, that a percentage is abstract. But margin needs the cost of making each item, which the app does not have, so any margin figure would be invented, the confidently wrong number the assignment warns about. AK's "revenue forgone" for Pull also prices the items at full price, which by closing time they already did not sell at.
2. **The screen can do my repair, even though AK said system.** Full price, units left and the discount are on the card, so money given up against full price is arithmetic the page can do. Only AK's margin version belongs to the system, because it needs cost data.
3. **It could break heuristic 8, Aesthetic and Minimalist Design.** A third line on each button would make 42 buttons busier and 14 cards taller on a phone. Money given up also always makes 20% look cheapest and Pull most expensive, whether or not 20% will sell tonight, so it must stay a plain fact, not a recommendation.
4. **The smallest alternative:** one line per card under the three buttons, "All 4 left: 20% off loses $6.80 · 50% off $17.00 · Pull $34.00", worked out exactly as This week's Loss is, so the card previews what the week will record; keep the new price for one item on each button for the price tag; no margin.
5. **How to check it:** the Batard should read $6.80 · $17.00 · $34.00 and the Baguette $5.10 · $12.75 · $25.50; after 20% off on the Batard, Tonight's Loss on This week should be $6.80, and after Pull on the Baguette $32.30; at phone width the line should take at most two lines.

### My decision

"Mix, help me improve it for maximum result." The agent built:

> Under the three buttons, each card has one line, "Loss on all 4 left: 20% off $6.80 · 50% off $17.00 · Pull $34.00", using the same word ("Loss") and the same calculation as Tonight's Loss on This week. The new price on each markdown button now reads "$6.80 each". No margin, because the app has no cost data.

Where this goes beyond the agent's point 4: on the Batard card, 20% off makes the new price $6.80 each and the total loss on all 4 is also $6.80, so the buttons now say "each" to keep the two numbers apart; and the card uses the same code as This week, so the two figures cannot drift apart.

### What was built and how it was checked

Commit `474e3d9`: `Show what each choice loses on all units left (H2, sev 2, raised by AK)`. Changed `src/components/ClosingItemCard.tsx` and `src/week.ts`. Checked locally: the Batard read $6.80 · $17.00 · $34.00 and the Baguette $5.10 · $12.75 · $25.50; Tonight's Loss matched at $6.80 and then $32.30. At 360px the line first split "Pull" from "$34.00" across two lines, so each option was kept together on one line; it now wraps only between options, at most two lines. Checked again on the live address after the push.

---

## Repair 7: This week says what each product's pull pattern suggests, without a bake quantity

Finding: AK #5, heuristic 7 (Flexibility and Efficiency of Use), severity 3 from AK, 2 from me, arbiter 2. It is also close to Finding 3 in my own predictions.md ("This Week says bake less, but not how much less", severity 2), so this repair was partly planned before any comment. Coding agent: Claude Code.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, Summary / Closing Report after completing the closing walk.
  What they did, what they saw: After completing the closing walk, I could review the
  day's leftover items and actions, but the system did not fully use historical data to
  identify recurring operational problems. For example, if the same product repeatedly
  requires a 50% markdown, the manager still has to identify that pattern manually and
  decide whether tomorrow's production quantity should be reduced.
  Which heuristic: 7, Flexibility and Efficiency of Use.
  Screen or system: System. The issue goes beyond the summary screen itself because the
  system is not using the data it already collects to make future closing and
  production decisions more efficient.
  Severity, and why: 3, major usability problem. The app already captures closing
  inventory and markdown data. Without turning that information into actionable
  recommendations, managers still have to manually identify recurring production
  problems, limiting the system's long-term usefulness.
  The repair: The Closing Summary should include a Recommendations for Tomorrow section
  based on historical patterns, for example "Chocolate Croissant: consider reducing
  tomorrow's batch by 4 to 6 units." It should not assume that low sales mean poor
  product quality; it should identify the pattern and suggest factors for the manager
  to investigate.
- The evidence behind it: Raised by 1 of my 3 groupmates (AK), at severity 3. I rated
  it 2. The blind arbiter rated it 2, deciding on cost: the closing decision is complete
  without it. It is also close to Finding 3 in my own predictions.md, at severity 2:
  "The This Week screen says to bake less, but not how much less", whose repair line
  was: "For each product on the 'Bake less of these' list, the manager can quickly
  understand what the week's pull pattern suggests for the next bake quantity, without
  having to calculate or infer the adjustment themselves."
- The repair I propose: After the closing walk and on This week, the manager can see
  what the week's pull pattern suggests for tomorrow's bake of each product, without
  working it out by hand, and without the app claiming more than the numbers show.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

Before arguing, the agent listed what the app knows: for each product, only how many times and how many units were pulled (sample numbers plus tonight); no markdown history per product, no bake quantities, no sales and no record of anything selling out.

1. **It is partly a problem I already believed I had, and I must say so.** My proposed wording is almost my own Finding 3's repair line, which is the trap in section E of crediting a comment for a change I had already planned. AK's finding is on the Closing summary, not This week, and about products that repeatedly need a 50% markdown, which the app keeps no history of, so AK's own example cannot be answered from my data. My repair answers my finding more than AK's.
2. **The honest part is screen; the part AK wants is system, from data I do not have.** A pull rate is already on the page. "Reduce tomorrow's batch by 4 to 6 units" needs how many were baked, how many sold and whether it ran out, none of which exists in the app. My guardrail "without claiming more than the numbers show", taken seriously, rules out a quantity.
3. **It could break heuristic 5, Error Prevention, by steering the manager into a new mistake.** A suggestion built only on pulls sees waste but never shortage, so it can only ever say "bake less". That is the confirmation method from section C, counting only the cells that agree with the belief. MML warned about that cost in her Finding 1: a manager could "cut the bake far more than needed and run out the next day". And because the history is sample data, a confident instruction on the Closing list would be built on invented numbers.
4. **The smallest alternative:** on This week's list, one plain line per product ("Pulled on 4 of 7 days · 5 units"); under the heading, "This counts what was pulled, not what sold out. Check sell-outs before you cut a bake."; on the done card, the top two products with the same line and a button, "Review This week before planning tomorrow's bake"; no "reduce by N units" anywhere, and say why in my reply to AK.
5. **How to check it:** every product in the list shows its line and the sell-out note is under the heading; after Pull on the Batard it moves up from 2 of 7 days to 3 of 7; after deciding all 14 the done card shows the top two and the button opens This week; no screen tells the manager how many to bake.

### My decision

"Mix, help me improve it for maximum result." My repair asks for what the pattern suggests, and AK's own repair says the app should "identify the pattern and suggest factors for the manager to investigate", so the agent built a suggestion about the pattern, never a quantity:

> On This week, each product in the ranking gets one line on what its pattern suggests: pulled on 4 or more of 7 days, "Pulled most days. Consider baking less, if it never sold out this week."; on 2 or 3 days, "Pulled some days. Watch it before changing the bake."; once, "Pulled once. No pattern yet." Under the heading: "This counts what was pulled, not what sold out. Check sell-outs before you cut a bake." The done card shows the two products pulled most and a "Review This week before planning tomorrow's bake" button. No "bake N fewer" anywhere.

Where this goes beyond the agent's point 4: the label "Bake Less of These" becomes "Candidates to Bake Less", because the old label told the manager to bake less of everything listed, even items pulled once; and "4× pulled this wk" becomes "4 of 7 days pulled", to match the dates the tab now covers. The per-product line from point 4 was left out, because the units and days were already on each row.

### What was built and how it was checked

Commit `5b8b9f3`: `Say what each product's pull pattern suggests, without a bake quantity (H7, sev 2, raised by AK; planned in predictions.md as my Finding 3)`. Changed `src/App.tsx`, `src/components/ClosingListScreen.tsx`, `src/components/ThisWeekScreen.tsx` and `src/week.ts`. Checked locally: every product showed its pattern line; after Pull on the Batard it moved from #5 to #2 (3 of 7 days, 6 units); after all 14 were decided the done card showed the top two and its button opened This week at the top; a search of both screens found no instruction with a number to bake. The test also showed "1 units pulled" on the Lemon slice, which was corrected to "1 unit pulled". Checked again on the live address after the push.

---

## Repair 8: the three buttons are explained on a manager's first visit

Finding: my own Finding 2 in predictions.md, heuristic 10 (Help and Documentation), severity 2 from me. No groupmate raised it, so this is a third-row repair from my own evaluation. Coding agent: Claude Code.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, on the Closing List screen, at the 20% off, 50% off, and Pull
  buttons on each item card.
  What I did, what I saw: I used the closing list as if I were a manager using
  LastBatch for the first time. I could see the three buttons on every item, but
  nothing on the screen explained when a manager should choose 20%, 50%, or Pull.
  Which heuristic: 10, Help and Documentation.
  Screen or system: Screen. The page already knows the three actions and each item's
  details, so guidance on what each action means can be added to the interface
  without anything new from the back end.
  Severity, and why: 2, driven by whether the person can learn around it. An
  experienced manager may already understand the markdown rules, but a first-time or
  occasional manager may hesitate or rely on knowledge from outside the app.
  The repair: A manager can see, at the moment of choosing, a short explanation of
  what each action means and when it would normally be appropriate.
- The evidence behind it: This is Finding 2 in my own predictions.md, committed before
  any comment. None of my 3 groupmates raised it, and my prediction that they would
  broke. AK wrote that the 20% / 50% choice is "simple, easy to understand, and
  suitable for quick mobile use". Not taken to the arbiter, because only I rated it.
- The repair I propose: A manager can see, at the moment of choosing, a short
  explanation of what each action means and when it would normally be appropriate.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

1. **This is purely a problem I already believed I had, and the evidence points the other way.** None of my 3 groupmates raised it, my prediction that they would broke, AK praised the three-button choice as "simple, easy to understand", and CCH and MML used 20% off and Pull fluently. Fixing it after the prediction broke is where confirmation bias could hide: repairing the app so that my prediction looks right after all. Since I logged it, repairs 5 and 6 have also added "Discard" with a bin icon, the loss line and "each", so much of what each action means is already on screen.
2. **"What it means" is screen and mostly done; "when it would normally be appropriate" has no source.** When to choose 50% over 20% depends on the bakery's own markdown policy, which does not exist anywhere in the app, so any rule written on the screen would be invented, the kind of claim I deleted from the weather panel in Problem Set 2.
3. **It could break heuristic 8, Aesthetic and Minimalist Design, and hurt heuristic 7 for regular managers.** An explanation on every card repeats the same text 14 times, and a manager needs it once, on the first walk, but would pay for it on every walk after.
4. **The smallest alternative:** one help box above the list, open on a manager's first visit, closed with Hide and remembered on the device, reopened by a small "What do the buttons mean?" link, saying only what the app knows to be true and that the shop's own markdown rules decide which to choose. Or build nothing and explain why in Q2.
5. **How to check it:** in a new Incognito window the box is open; Hide closes it and it stays closed after a refresh; the link reopens it; nothing in it says when to choose 20% over 50%; the cards are no taller.

### My decision

"A first-visit help box." I chose the agent's point 4.

### What was built and how it was checked

Commit `01aae3c`: `Explain the three buttons on a manager's first visit (H10, sev 2, my own Finding 2 in predictions.md, not raised by groupmates)`. Changed `src/components/ClosingListScreen.tsx`. The box says: "20% off / 50% off: sell it tonight at the lower price shown on the button. The line under the buttons shows what each choice loses on all units left." "Pull: take it off the shelf and discard it. Nothing is recovered." "Items are listed oldest bake first. Your shop's own markdown rules decide which you choose, and every choice can be undone." Checked locally: open on a first visit; Hide closed it and it stayed closed after a refresh; "What do the buttons mean?" reopened it; no wording about when to choose; the cards unchanged; Disqus and /api/health unaffected. Checked again on the live address after the push.

---

## Repair 9: each card leads with its bake time, on one line

Finding: AK #3, heuristic 8 (Aesthetic and Minimalist Design), severity 2 from AK, 1 from me, arbiter 1. Coding agent: Claude Code.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, Closing Walk product card / product information area.
  What they did, what they saw: While deciding whether an item should be marked down or
  kept on sale, I noticed that product category receives relatively prominent
  presentation, while bake time does not receive the same level of visual priority. In
  an end-of-day bakery context, when an item was baked directly affects freshness and
  remaining selling time, making it more relevant to the closing decision than its
  category in many cases.
  Which heuristic: 8, Aesthetic and Minimalist Design.
  Screen or system: Screen. The information hierarchy does not fully reflect the
  importance of each piece of information to the closing task.
  Severity, and why: 2, minor usability problem. The manager can still complete the
  task, but additional attention is required to find the information that is most
  relevant to the decision.
  The repair: Bake time should receive greater visual priority, while product category
  should become secondary information, for example "Baked 2:30 PM · 8 remaining · 40
  min to close", with the category in a smaller, secondary position.
- The evidence behind it: Raised by 1 of my 3 groupmates (AK), at severity 2. I rated
  it 1. The blind arbiter rated it 1, deciding on learnability: the list is already
  sorted by bake time and the oldest item is tagged "Oldest".
- The repair I propose: The bake time stands out more than the category on each card.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

1. **It solves AK's point, but the real problem on a phone is sharper than AK or I described.** The sort order and the "Oldest" tag already carry bake time, so the gain is small. What nobody wrote down is that at phone width the bake time wraps and splits ("Baked 5:15" on one line, "AM" on the next) while the category pill wraps beside it. The repair should say the bake time is on one line.
2. **Screen, and my repair is in the right half.** No doubt: it is how two pieces of information already on the card are laid out.
3. **It could break heuristic 6, Recognition rather than Recall, if the category is demoted too far.** The category is likely how a manager finds the item on the shelf, so it must stay visible. AK's example also adds "8 remaining", which is already the LEFT badge, and "40 min to close", the same number on all 14 cards.
4. **The smallest alternative:** swap the visual weight in the top row, with the bake time bolder, slightly larger and never wrapping, and the category as plain small grey text without its pill; add nothing, and say why in my reply to AK.
5. **How to check it:** on every card "Baked 5:15 AM" is on one line and easier to spot than the category; the category is still visible; the Oldest tag is beside the bake time; the cards are no taller.

### My decision

"Mix, help me improve it for maximum result." The agent built its point 4, and also moved the bake time to the left, where the eye starts reading:

> On each card, "Baked 5:15 AM" (and the Oldest tag) becomes the first, bolder item in the top row, and never wraps. The category loses its pill and becomes small grey text on the right, still visible. Nothing is added.

### What was built and how it was checked

Commit `289bbe3`: `Lead each card with its bake time, on one line (H8, sev 1, raised by AK)`. Changed `src/components/ClosingItemCard.tsx`. Measured at 360px against the live version before the change: cards with the bake time split across two lines went from 1 to 0; the bake time went from 12px semibold to 14px bold; every card became 2 to 10px shorter; the category stayed visible and the Oldest tag stayed beside the time. Checked again on the live address after the push.

---

## Repair 10: the header's "5:00 PM walk" label no longer looks like a button

Finding: MML #3 (one sentence inside her Finding 3), heuristic 8 (Aesthetic and Minimalist Design), severity 2 for her whole Finding 3, 1 from me, arbiter 1. Coding agent: Claude Code.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, the "5:00 PM Walk" button in the top right corner of the header.
  What they did, what they saw: "The header and the orange card both say '5:00 PM
  Shelf Walk' ... I also tapped the '5:00 PM Walk' button in the corner and nothing
  happened." This was one sentence inside a larger finding that was mainly about the
  weather card.
  Which heuristic: 8, Aesthetic and Minimalist Design (given to the larger finding).
  Screen or system: Both (given to the larger finding).
  Severity, and why: 2, given to the larger finding as a whole: "It happens on every
  visit, but people can learn to scroll past it." This observation was not rated on its
  own.
  The repair: Not stated separately for this observation.
- The evidence behind it: Raised by 1 of my 3 groupmates (MML), inside her Finding 3.
  I rated it 1. The blind arbiter rated it 1, deciding on learnability: it costs one
  wasted tap, and after that the manager knows it is only a label.
- The repair I propose: Anything that looks like a button does something when tapped,
  and a label that does nothing does not look like a button.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

1. **It solves MML's observation, but my wording is much wider than the finding.** MML raised one label. "Anything that looks like a button does something when tapped", taken literally, asks me to audit every pill and badge in the app, which nobody raised, and changes that do not trace to a finding are what the rubric penalises. Keep this commit to the one label, and put a wider audit in Q4 as next.
2. **Screen, and my repair is in the right half.** No doubt: it is how the label is styled. MML's "Both" was for the weather part of her finding.
3. **The restyle itself breaks nothing the agent could find, so it said so plainly.** The risk is in the tempting alternatives: making the label do something adds a hidden feature nobody asked for, and deleting it removes the only mention of the walk time on This week. Restyling it as plain text also improves heuristic 4, because the only boxed things left in the header would be the tabs, which really are buttons.
4. **The smallest alternative:** keep the words and drop the box, as plain small grey text with a clock icon in the same style as "Shop #14 · Mill & Elm".
5. **How to check it:** on both tabs the label is plain text with no box, border or background; tapping it does nothing and nothing suggests it would; the tabs still look like buttons; the header is no taller and does not wrap.

### My decision

"Mix, help me improve it for maximum result." The agent built its point 4, and also checked the whole app for other boxed labels that do nothing and reported them without changing them, to keep this commit to MML's finding:

> The header's "5:00 PM Walk" box becomes plain grey text with a clock icon, "5:00 PM walk", in the same style as "Shop #14 · Mill & Elm". The only boxed things left in the header are the two tabs.

### What was built and how it was checked

Commit `8ec8a9e`: `Stop the header's "5:00 PM walk" label looking like a button (H8, sev 1, raised by MML)`. Changed `src/components/Header.tsx`. Checked at 360px: no background, border or button behaviour, on one line on both tabs; the header 12px shorter (156 to 144px). The check found three other boxed labels that do nothing when tapped: the weather time pill, the LIVE badge, and the Marked down and Pulled boxes on This week. Nobody raised them, so they were left as they are, for Q4. The commit message first named heuristic 4; it was corrected to 8, to match my four-way table, before it was pushed. Checked again on the live address after the push.

---

## Repair 11: the area list offers only places a shop could be

Finding: MML #4, heuristic 2 (Match Between the System and the Real World), severity 1 from MML and from me, arbiter 1. Coding agent: Claude Code.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, Closing list, the Area dropdown in the weather card.
  What they did, what they saw: The header says the shop is "Shop #14 · Mill & Elm",
  yet I still had to pick my area from a list of 47 places. The list includes Central
  Water Catchment, Jurong Island, Pulau Tekong and Western Islands, where nobody runs a
  bakery.
  Which heuristic: 2, Match Between the System and the Real World.
  Screen or system: System. The list is the weather provider's forecast areas, not
  places a shop manager would think in, and the app already knows which shop this is.
  Severity, and why: 1. It's mostly cosmetic. A manager picks their area once and moves
  on, but it does make the app feel less like it was built for their shop.
  The repair: The area is set from the shop's own location, and the manager never has
  to choose between forecast zones.
- The evidence behind it: Raised by 1 of my 3 groupmates (MML), at severity 1. I rated
  it 1. The blind arbiter rated it 1, deciding on cost and learnability: the manager
  picks the area once and the choice is remembered on later visits.
- The repair I propose: The manager sees the forecast for the shop's own area without
  having to choose from forecast zones.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

1. **My repair cannot be made true honestly, because the app does not know where the shop is.** "Shop #14 · Mill & Elm" is only a name typed into the header, not a place in Singapore, and there is no address or area anywhere in the app. Seeing the shop's own area without choosing would mean inventing a location, wrong for any real manager elsewhere, and it would remove the one thing that makes the forecast right now: the manager's own remembered choice.
2. **It is system, as MML said, but for a different reason.** The 47 names come from data.gov.sg, and the shop's location would come from setting up each shop, which does not exist yet. On the screen I can only change how the choice is offered.
3. **Detecting the area would break heuristic 3, User Control and Freedom, and my privacy guardrail.** Knowing the area without asking means the phone's location: a permission prompt, a new kind of personal data and a change to the privacy notice. A manager covering another branch, or on an area boundary, could no longer pick the right area.
4. **The smallest alternative:** remove the six areas where no shop can be (Central and Western Water Catchment, Jurong Island, Pulau Tekong, Southern and Western Islands), leaving 41; keep Pulau Ubin and Sentosa, where people live and trade; rename "Area:" to "Shop area:"; keep remembering the choice; filter on the screen so /api/forecast and /api/health stay untouched; and explain in my reply to MML why the choice stays.
5. **How to check it:** 41 areas with none of the six; the label reads "Shop area:" without wrapping; choose Tampines, refresh, still Tampines and the forecast loads; no location prompt; /api/health returns ok: true.

### My decision

"Mix, help me improve it for maximum result." The agent built its point 4, plus a line for first-time managers:

> The area list drops the six places where no shop can be (47 to 41), and the label reads "Shop area:". The first time a manager opens the app, before they have ever picked an area, one line says "Showing City. Set your shop's area once, and it's remembered on this device." After they pick, the line disappears. No location detection, no privacy change, and /api/forecast is untouched.

### What was built and how it was checked

Commit `2322470`: `Offer only places a shop could be, and say the area is set once (H2, sev 1, raised by MML)`. Changed `src/components/WeatherStrip.tsx`. Checked at 360px as a first-time visitor: 41 areas, none of the six, Pulau Ubin, Sentosa and Tampines kept; "SHOP AREA:" on one line, with long names such as "Choa Chu Kang" fitting; the first-visit line showing, then gone after choosing and after a refresh; Tampines kept after a refresh with the forecast loaded; no location prompt; /api/health ok. Checked again on the live address after the push.

---

## Repair 12: each night's walk is kept, so This week fills with real days

Finding: CCH #1 and MML #2 again, heuristic 1 (Visibility of System Status), severity 3 from both, arbiter 3. This is a second repair for the same finding as repair 1. Coding agent: Claude Code.

After repair 1, I asked the agent whether the dates on This week were live and up to date. It ran the tab's logic for today, tomorrow and next Monday and showed that the dates and Tonight were live, but the six earlier days were sample numbers that slide along with the dates, so tomorrow "yesterday" would show the sample figures, not what I actually decided tonight. The agent also corrected its own argument from repair 1, that real history needed a database: repair 4 now saves the walk on the device, so each night could be kept by date.

### My prompt: argue against the repair

```text
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/
- Who the product is for, and what it does for them: LastBatch is for a bakery store
  manager doing the end-of-day closing walk. It helps them decide, for each unsold
  item, whether to mark it down 20%, mark it down 50%, or pull it.
- The finding, in its six lines:
  Where: The live app, on the This week tab, at the "Daily breakdown (last 7 days)" list.
  What they did, what they saw: On Saturday 26 September, I pulled Traditional Baguette
  on the Closing list, then opened This week. The heading said "Last 7 days overview",
  but the most recent day listed was Monday, Sep 7, and the oldest was Tuesday, Sep 1.
  The baguette I had just pulled did not appear anywhere.
  Which heuristic: 1, Visibility of System Status.
  Screen or system: System. The page does not have this week's figures or today's
  decisions to work with, so the screen cannot show them without first being given
  that data.
  Severity, and why: 3, damage to the product's standing. The tab exists to guide
  tomorrow's bake quantities, and a manager who notices the dates are three weeks old
  will stop trusting the "Bake less of these" advice.
  The repair: This week shows the seven days up to today, includes the decisions made
  on the Closing list, and says when the figures were last updated.
- The evidence behind it: Raised independently by 2 of my 3 groupmates (CCH and MML),
  both at severity 3. The blind arbiter also rated it 3. My first repair (commit
  91dcfa1) added a live Tonight row and dated six sample days back from today. But the
  six earlier days are still sample numbers that slide with the dates, and tonight's
  real decisions are gone the next day: tomorrow, "yesterday" shows the sample figures,
  not what I actually decided.
- The repair I propose: Each night's decisions are kept on this device by date, so
  real past nights replace the sample rows in This week as they build up, and every
  row says whether it is real or sample.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

### The agent's arguments

Before arguing, the agent checked the tab's numbers: the six sample days added up to 15 units pulled, but the sample "Candidates to Bake Less" ranking added up to 17, two separate invented lists that had never had to agree.

1. **It finishes CCH's and MML's finding, but nobody will see it work this week.** It changes anything only after the app has been used on more than one day on the same phone, so today every earlier row is still sample, and my groupmates and my professor, on their own phones, will mostly see sample rows. It can only be fully verified tomorrow, and Q4 must say so.
2. **The screen can do this on the device, as repair 4 does; a shared history would be system.** A history shared between phones and staff would need a server. My wording already says "on this device", which is the honest limit.
3. **It could break heuristic 4, Consistency and Standards, through the ranking.** The daily rows would become real one by one, but the ranking is a separate sample list with no per-day detail, so real nights added on top would count more than 7 days and could produce "8 of 7 days pulled". Mixing real and sample rows also needs a tag on each sample row, or the last few will look real (heuristic 1).
4. **The smallest alternative:** save each night's decisions by date, keeping the last 7 days, with Start over still clearing tonight only; give each sample day its own list of which products were pulled, adding up to its Pulled count, and build the ranking from the same 7 rows, so a real night replaces a sample one everywhere at once and the ranking matches the Pulled total; tag each sample row, and make the banner say how many earlier days are real.
5. **How to check it:** today every earlier row says sample, the banner says none are real, and the ranking's units match the Pulled total; tonight make some decisions; tomorrow the Closing list starts at 0 of 14, "Monday Sep 28" shows those numbers with no sample tag, the banner says 1 of the 6 earlier days is real, and the ranking includes Monday's pulls; Start over tonight clears tonight only.

### My decision

"Mix, help me improve it for maximum result." The agent built its point 4, with every row saying where its numbers come from, not only the sample ones:

> Each night's decisions are kept on this device by date, for 7 days. On This week, every earlier row is either a real night (its date line says "your walk") or a sample one ("sample"), and Tonight stays Live. The banner counts how many earlier days are real. The ranking and the done card are built from the same 7 rows, so real nights replace sample ones everywhere at once, and the ranking's units match the Pulled total. Start over clears only tonight.

The tags go on the date line, not beside the day name, so they cannot squeeze "Wednesday" as the labels in repair 3 nearly did.

### What was built and how it was checked

Commit `6ef7c89`: `Keep each night's walk so This week fills with real days (H1, sev 3, raised by CCH and MML)`. Changed `src/types.ts`, `src/data.ts`, `src/savedWalk.ts`, `src/week.ts` and `src/components/ThisWeekScreen.tsx`.

- Building the ranking by Closing list item also fixed a second mismatch: the sample ranking called it "Rosemary Olive Focaccia" while the list says "Rosemary Olive Focaccia Square", so a pull tonight would have created a second entry.
- To make the sample numbers add up, two sample figures were adjusted (Ham & Gruyère Croissant 5 to 4 units, the focaccia 4 to 3).
- The tab's logic was run for today, tonight and tomorrow: today the ranking's units matched the Pulled total (15 and 15); a focaccia pulled tonight joined its existing entry; tomorrow "Monday Sep 28" became a real row and the ranking still matched the Pulled total.
- Testing the real sequence in the browser caught a bug in the first version: opening the page saved tonight's empty walk straight away and overwrote a walk saved the day before, so the history never received it. The save now moves the previous night into the history before overwriting it. Re-tested with a walk saved on "Sep 27": "Sunday Sep 27 · your walk" showed 4 · 6 · $32.30, the banner said "1 of the 6 earlier days is from your own walks on this device", and the ranking matched the Pulled total (19 and 19). Tonight's decisions added on top, and Start over cleared tonight only.
- At 360px the LIVE badge on Tonight was 2px too wide for its row, and its padding was trimmed until every day name fitted.
- On the live address after the push: every earlier row said "sample", the banner said the earlier days are sample history, the ranking matched the Pulled total (15 and 15) with one focaccia entry, and /api/health was ok.

Still to check, on Tuesday 29 September: that the walk I left on my phone on Monday 28 September shows on This week as "Monday Sep 28 · your walk".
