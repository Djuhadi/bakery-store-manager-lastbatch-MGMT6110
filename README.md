# LastBatch

A closing-time markdown tool for bakery store managers.

**Student:** Isabella Karunia Djuhadi  
**Course:** MGMT6110 · Human-AI Collaboration · AY2026/27 August Term  
**Assignment:** Problem Set 1 — Build the front end of your product  
**Live app:** https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/

---

## The user

> A **bakery store manager** opens this screen at **5 PM, an hour before closing**, to **decide which unsold items to mark down and which to pull**, and knows it worked when **every item on the list has a decision and the list is empty**.

**Kind of user:** Internal (B) — a user whose existing work the product augments. Managers are given this tool by the chain; they did not choose it and cannot leave it.

**Business function augmented:** Store operations, specifically the fresh-food markdown and waste decision made at the end of every trading day.

**Who owns that step today:** Whoever is running the closing shift. The decision is currently made from memory during a walk around the shelves, with no record of what was decided or what it cost. LastBatch replaces that walk with a list, and turns the decisions into a record that did not previously exist.

---

## The screens

**1 · Closing list.** Every unsold item still on the shelf, oldest-baked first. Each item shows its category, bake time, quantity remaining and full price, with three actions: mark down 20%, mark down 50%, or pull. A counter tracks how many items are still undecided, decisions can be undone, and the list is replaced by a completion state once every item has been decided.

**2 · This week.** Read-only. Markdowns, pulls and money lost for each of the last seven days, plus a ranked list of the products pulled most often — the input to tomorrow's bake quantities.

---

## Submission files
- **[`PROMPTS.md`](PROMPTS.md)** — every prompt sent, in order, with what came back and what changed next and why.
- **[`REFLECTION.md`](REFLECTION.md)** — the five reflection questions, answered about this build.
