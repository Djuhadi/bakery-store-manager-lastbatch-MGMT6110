# PROMPTS.md — LastBatch

**Student:** Isabella Karunia Djuhadi · **Course:** MGMT 6110 · **Problem Set 1**  
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
