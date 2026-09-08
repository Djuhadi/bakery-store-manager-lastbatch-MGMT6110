# REFLECTION.md — LastBatch
 **Student:** Isabella Karunia Djuhadi · **Course:** MGMT6110 · **Problem Set 1**  

--- 
## 1. Who are your users, and what changes for them?

The user of LastBatch is a bakery store manager working the closing shift at a small chain of around forty neighbourhood shops. This is an internal user whose existing work is being augmented: the manager is responsible for the fresh-food markdown and waste decision at the end of each trading day. At around 5 PM the manager currently walks the shelves and decides from memory whether each unsold item should be discounted by 20%, discounted by 50%, or pulled, and there is no record of those decisions or their cost.

LastBatch replaces that memory-based walk with a structured closing list ordered by bake time, in which the manager makes one of three decisions per item and an undecided counter shows when the job is complete. The second screen turns those decisions into a seven-day view of markdowns, pulls and money lost, giving the manager an input for deciding what to bake less of. The product therefore does not replace the manager's judgment; it structures and records it.

## 2. Augmented capacity and constrained capacity

AI significantly increased my capacity because I am not a programmer. My main contribution was defining the business problem, user, workflow and constraints, while Google AI Studio translated that specification into a working React application with two screens. This allowed me to spend more time evaluating whether the product made sense than building the interface.

At the same time, AI exposed a limitation in my ability to specify and inspect technical systems. My master prompt explicitly prohibited Gemini API calls, ```google/genai```, API-key handling and outside services. However, the generated repository still contained an ```.env.example``` with ```GEMINI_API_KEY``` documentation and a Gemini dependency, even though the application makes no model calls. This was only found when the repository was searched beyond the application code, and I have since removed both. It showed me that a guardrail is only as strong as my understanding of what needs to be guarded: as a non-programmer, I can state what I do not want, but I may not know every technical place where an unwanted capability can appear.

## 3. In the loop, on the loop, out of the loop: where was your judgment actually needed?

I was primarily in the loop, since AI generated the implementation but I decided whether the output matched the product and whether its data made business sense.

One judgment moment was the date problem on the "This week" screen, which showed "Sunday (Yesterday) · Sep 6" even though yesterday was Monday, 7 September. I asked AI to relabel the seven days ending yesterday and remove the relative "Yesterday" wording so the interface would not become stale. This was not simply a coding correction: I recognised that a technically valid label could still be wrong for the actual user.

The more important moment came from the numbers. The weekly screen implied 77 pulls across seven days for a shop of only 14 products, while the closing list suggested most items would be marked down rather than pulled. I asked AI to reduce daily pulls to 1–4 and update the totals and "Bake Less of These" list consistently, and the revised figures were then re-added and confirmed as 18 pulls and $215.00. By contrast, I was technically in the loop but contributed little when I first checked the preview against my numbered requirements: the individual screens appeared to work, so I accepted the output too quickly. Approving whether features exist is different from judging whether the whole system is coherent.

Looking forward, the markdown decision itself must stay in the loop, as it is low in volume, the person deciding stands in front of the product, and the cost of an error falls on the customer and the shop's margin. The "Bake Less of These" ranking could sit out of the loop, since it is arithmetic over decisions already made, it is reversible, and nobody is harmed by a wrong ordering. Before accepting that I would want two things measured: that the ranking reconciles automatically to the daily rows each time, because the version I was given did not, and that a manager who disagrees can open those rows immediately.

## 4. What did it build that you never sketched?

The first version added several elements never part of my specification: a shop identity, progress bar, second counter, toast notifications and a colour scheme. It also calculated the discounted price for each markdown button, which I had not requested but considered useful, since a manager needs the actual price when making a shelf decision.

More importantly, the build exposed something I had never specified: that the two screens had to describe the same shop and the same underlying reality. The weekly data was inconsistent with the closing list, producing an implausibly high number of pulls. This was not an extra feature added by AI but a gap in my own requirements that AI did not know to protect against. I noticed it after checking the deployed application, and I could have caught it earlier by writing cross-screen acceptance criteria rather than screen-by-screen requirements, such as requiring the weekly totals to reconcile with the underlying closing decisions.

## 5. Learning pointers for the organisational context

First, organisations should treat human verification as part of AI-assisted development rather than a final formality. My 77-pull example shows that an output can be technically valid but operationally unreasonable, and someone who understands the business context still needs to challenge it.

Second, organisations should make scope and acceptance criteria explicit before asking AI to build. AI added several unrequested interface elements, and my specification never stated that the two screens had to reconcile.

Third, organisations should require source-level verification rather than preview-level verification. The live preview looked correct while the repository still held unnecessary Gemini configuration, and later the deployed site kept showing old numbers because the updated source had not actually reached the repository. Checking the source files was therefore part of verifying the product, not technical housekeeping.
