# assessment.md — Last Batch

**Student:** Isabella Karunia Djuhadi · **Course:** MGMT6110 · **Problem Set 2**

LastBatch is a closing-time markdown tool for bakery store managers. The user I carried over from Problem Set 1 is a bakery store manager working at one of around forty neighbourhood shops. At around 5 PM, an hour before closing, the manager walks the shelves and decides which unsold items should receive a 20% discount, a 50% discount, or be pulled. The front end structures that decision as a closing list, while the second screen records the week's markdowns, pulls and money lost.

Problem Set 2 added something that the first version could not do: use a real source instead of relying entirely on invented data. I chose the Singapore two-hour rain forecast because the closing decision happens shortly before closing and the next two hours are directly relevant to that moment. The weather is an additional input to the manager's decision, not a replacement for the manager's judgement.

---

## Part 1 — Criteria for a good front end

### F1. A stranger knows what this is for before reading anything

**Why it matters to my user.** Managers are given this tool by the chain rather than choosing it themselves. They are also using it during a busy closing shift, so the purpose of the screen should be clear immediately. If the manager has to be trained before understanding what the screen is for, the product has already created friction.

**How someone else can check.** Open the live URL on a phone and look at it for four seconds without scrolling. Then explain what the product is for.

**Met.**

**Evidence.** I initially failed this criterion myself. The header only said "LastBatch · Shop #14 · Mill & Elm", which identified the shop but did not explain the job. While writing these criteria, I realised that a first-time user could not know what LastBatch was for from the header alone. I then used Prompt 5 to add the line "Decide markdowns on unsold stock before closing." This was a small change, but it came from testing the product against the user rather than against the code.

---

### F2. The one job is reachable without instruction

**Why it matters to my user.** The main job is to give every unsold item a decision before closing. The manager should not have to work out how to record that decision or remember what has already been handled.

**How someone else can check.** Without being told how the screen works, mark one item down and pull another. Then undo one of the decisions.

**Met.**

**Evidence.** Each item has three clearly labelled actions: 20% off, 50% off and Pull, with the resulting price shown. The counter records how many of the 14 items have been decided, and an undo bar appears after a decision. During my unreachable-state test, I marked Traditional Baguette down by 20%. The counter moved from 1 to 2 of 14, the progress bar advanced, and the undo bar appeared with the message "Decided Traditional Baguette as 20% off". The front end continued to work even when the weather service was unavailable.

---

### F3. Every claim on the screen is one the product can support

**Why it matters to my user.** The manager is making a decision about real stock and money. If a quantity, bake time or price is wrong, the resulting markdown decision can also be wrong.

**How someone else can check.** Take a number or factual claim from the Closing List or This Week screen and ask where it came from. It should be traceable either to a real source or to the shop's own system.

**Not met.**

**Evidence.** The item list, quantities, bake times and full prices are still invented data from Problem Set 1. The seven days of history and money-lost totals on the This Week screen are also still invented. I checked whether these claims could be sourced from the public provider I used for this problem set, but they cannot. They are the bakery's own operational data and would require a point-of-sale or inventory integration. I therefore left them in place because the product would not make sense without an item list, but I am not claiming that they are real data.

What I changed in this problem set was the part I could actually source: the weather information used as an additional input to the closing decision.

---

### F4. The screen works on the device it is actually used on

**Why it matters to my user.** The manager is standing on the shop floor rather than sitting at a desk. The product therefore needs to work on a phone, where the manager can move between the screen and the shelves.

**How someone else can check.** Open the live URL on a phone. Confirm that the tab bar, counter, weather strip, area dropdown and three decision buttons are readable and usable without zooming or horizontal scrolling.

**Partly met.**

**Evidence.** The interface is designed around the phone workflow, with the closing list, weather strip, area selector and decision controls kept within the main mobile layout. However, I did not perform a sufficiently systematic phone test across different screen sizes before submission. I therefore do not want to mark this as fully met based only on the browser preview. This is one of the areas where I would do more testing before treating the product as production-ready.

---

### F5. The most likely mistake has a way back

**Why it matters to my user.** The manager is making repeated decisions quickly, and the three actions are close together. Choosing 50% off instead of 20% off, or pulling an item by mistake, is easy to imagine and has a direct financial consequence.

**How someone else can check.** Make a decision on an item and then try to reverse it without refreshing the page or searching through the interface.

**Met.**

**Evidence.** An undo bar appears immediately after a decision and identifies both the item and the action taken. During my unreachable-state test, the bar read "Decided Traditional Baguette as 20% off · Undo". This also confirmed that undo remains available when the weather back end fails, so the new back end does not interfere with an important front-end recovery path.

---

## Part 2 — Criteria for a good back end

### B1. The screen says four different things, not one

**Why it matters to my user.** A real external service can be successful, empty, refused or unreachable. These situations require different responses. A manager needs to know whether there is simply no forecast, whether the service refused the request, or whether the service cannot be reached.

**How someone else can check.** Load the screen normally, request an area with no forecast, and deliberately make the upstream unreachable. Confirm that the screen gives different messages rather than showing the same blank state or spinner.

**Partly met.**

**Evidence.** The four states are implemented separately. Loading shows "Checking the next two hours over City…". An empty result shows "No forecast published for City right now. Decide markdowns from the shelf as usual." An unreachable service shows "Can't reach the weather service — no traffic guidance this hour. The list below still works." I tested loading, empty and unreachable. For the empty case, `/api/forecast?area=Narnia` returned a 200 response with no forecast, and the screen substituted the requested area into the empty message. For unreachable, I temporarily changed the upstream hostname to an invalid domain and confirmed the correct message appeared.

The refused state is implemented, but I could not trigger a genuine refusal because the data.gov.sg endpoint I chose is public and keyless. I therefore consider the fourth state reasoned and implemented but not fully tested.

---

### B2. Somebody who is not me can tell whether the service is up

**Why it matters to my user.** When the weather strip does not work, someone needs to distinguish between a problem with the product and a problem with the upstream service. This is useful both for the manager and for someone helping maintain the product.

**How someone else can check.** Open `/api/health` on the live URL and confirm that it returns a simple response showing whether the upstream service answered, its HTTP status and whether a credential is configured, without exposing a credential itself.

**Partly met.**

**Evidence.** The health endpoint is live at `/api/health` and returns the upstream status, `keyConfigured` and a timestamp. Because the selected data source is keyless, there is no secret being exposed. The browser does not call data.gov.sg directly; it calls my own `/api/forecast` route, which performs the upstream request.

I marked this partly met because the endpoint is not discoverable from the product itself. A classmate following the problem-set instructions can find it, but an ordinary store manager would not know that `/api/health` exists. I considered adding a separate service-status screen, but decided that it was outside the main closing workflow and did not add it.

---

### B3. The credential is unreachable from the page and absent from the repository

**Why it matters to my user.** A credential leak would create a security problem beyond the product itself. The safest implementation is one where the browser never has access to the credential.

**How someone else can check.** Search the repository and its history for credentials, then inspect the browser network requests to confirm that the page calls only my own `/api/` routes.

**Met, by removing the need for a credential.**

**Evidence.** I deliberately selected a keyless public data source, so there is no credential in the repository, Vercel environment or browser. `/api/health` reports `keyConfigured: true` by definition because this provider does not require a key. The browser calls `/api/forecast`, while the upstream request happens inside the server-side function.

This is different from proving that I can securely manage a real secret. I avoided the credential problem rather than demonstrating the full secret-management workflow. Given the available provider, I considered that the safer design decision for this problem set.

---

### B4. The product asks the source no more often than the source changes

**Why it matters to my user.** The two-hour forecast is updated roughly every half hour, while the data.gov.sg service also has request limits. Fetching the source every time the page renders would be unnecessary and could make the product less reliable.

**How someone else can check.** Inspect the `Cache-Control` response header from `/api/forecast` and compare the cache duration with the source's update rhythm.

**Met for the forecast; partly met for the health check.**

**Evidence.** `forecast.js` uses `s-maxage=900, stale-while-revalidate=1800`, meaning the forecast is treated as fresh for fifteen minutes and can remain available as stale data for another thirty minutes. The cache is also applied per area, so changing the area does not incorrectly reuse another area's forecast.

I did not add equivalent caching to `health.js`. That endpoint is intended to check the current service state, so live requests make sense for its purpose. However, writing this criterion made me realise that repeated health checks can still contribute to the upstream request limit. I had not considered that before writing the criterion, so I am treating the forecast as met but the overall criterion as only partly met.

---

### B5. A failure produces a sentence the manager can act on, and never blocks the job

**Why it matters to my user.** The weather forecast is an additional input, not the purpose of LastBatch. If the weather service fails, the manager must still be able to decide what to do with the unsold stock.

**How someone else can check.** Break the forecast service and then try to mark down an item, pull an item and undo the decision.

**Met.**

**Evidence.** When I deliberately broke the upstream hostname, the weather strip displayed the unreachable message while the closing list remained interactive. I marked Traditional Baguette down by 20%, the counter advanced to 2 of 14, and the undo bar appeared. The area dropdown also remained usable.

I explicitly included this requirement in the back-end prompt instead of assuming that the agent would understand it. I then tested the broken state rather than only checking that the normal forecast worked.

---

## Part 3 — The six questions

### Q1. Where did the agent make me faster, and by how much?

The biggest time saving came from building the serverless functions. `forecast.js` and `health.js` came back as working functions within minutes, including the API call, response checking, error handling and cache headers. As someone who had not previously written a serverless function, I would have needed to spend a large part of the evening learning how the request, response and deployment structure worked before I could have produced the same result manually.

The time saved was therefore not simply typing time. The agent allowed me to move quickly through technical implementation that I could not have produced confidently from scratch. I used that time for the parts I could contribute more meaningfully to: checking the real API response, testing the different failure states, deciding what the manager should see, and checking whether the new weather input actually belonged in the product.

The opposite was also true for small changes. The four manual edits recorded in `prompts.md` were quicker to make directly than to explain in another prompt. This showed me that AI was most useful when the task involved technical production I could not easily do myself, while very small and precise changes were sometimes faster to handle directly.

---

### Q2. Where did it cost me time, and whose fault was that?

The biggest time loss came from the GitHub push rather than from the back-end code itself. The sync panel reported that GitHub and Google AI Studio were in sync, but the repository did not actually contain the expected changes. I initially trusted the status message and spent time refreshing, checking the repository and checking whether the deployment was broken before realising that the destination itself was the thing I needed to verify.

This was not mainly a failure of the agent's reasoning. It was a failure in my verification process. I treated a system saying that something was complete as evidence that it was complete.

The lesson is similar to what happened with the generated weather guidance: I should verify the actual result rather than trusting either the tool's explanation or my first impression. Checking the repository directly was more reliable than the sync message, just as reading the weather sentence as the manager was more reliable than accepting it because it sounded reasonable.

---

### Q3. Did it ever hand me something that looked right and was not?

Yes. The clearest example was the successful weather state.

In my first back-end prompt, I explicitly specified the messages for loading, empty, refused and unreachable states. I did not specify what the screen should say when the forecast was successfully returned. The agent filled that gap by adding sentences such as "Fair conditions: steady closing foot traffic expected for evening markdowns" and "Rain forecast: evening walk-in foot traffic likely slower. Consider 50% markdowns earlier."

The sentences sounded useful and fitted the product. I initially accepted them because they read naturally and appeared to turn the weather data into something actionable. I did not immediately question where the business conclusion came from.

I later realised that the actual API response only gave me an area, a forecast phrase and a valid period. It did not contain information about bakery foot traffic or evidence that rain should lead to a particular markdown. The agent had turned a weather observation into a business prediction and then into a pricing recommendation.

I found the problem by stopping to read the screen as the manager rather than as the person who built it. I deleted the guidance and the function that produced it by hand.

This took me longer to notice than a normal coding error would have, because nothing was broken technically. The output was plausible. That was the important part of the failure: it showed me that an AI-generated product decision can be more difficult to catch when it sounds good.

---

### Q4. What did I have to know in order to supervise it?

To catch the mistake in Q3, I needed to know what the actual data source provided. I had opened the data.gov.sg endpoint myself before asking the agent to build the back end, so I knew that the response contained a forecast phrase, an area and a valid period. There was nothing in the response about customer traffic, bakery sales or recommended markdown percentages.

That knowledge allowed me to distinguish between something the API actually said and something the agent inferred.

I also needed to understand the timing of the data. The response I initially inspected contained a forecast such as "Partly Cloudy (Night)" with a 4 AM valid period. That made me question whether the wording was actually appropriate for a manager making a decision at 5 PM. The forecast text was not a licence to make a separate prediction about evening customers.

A third example was the distinction between HTTP 502 and 503. I realised that returning 503 for an unreachable upstream could make it difficult for my front end to distinguish an unreachable service from a provider that had actually responded with a 503. I changed that path to 502 and made the front end explicitly check for 502.

There are also things I still do not know well enough to supervise confidently. For example, the weather icon is selected by pattern-matching forecast phrases. I do not know the complete set of forecast phrases used by the provider, so I cannot confidently rule out a phrase that would fall through to the wrong icon. That is a limitation in my current technical knowledge and something I would need to investigate before treating the product as production-ready.

---

### Q5. Which decisions did I keep, and should I have kept more or fewer?

The main decisions that stayed with me were decisions about the product rather than the code. I decided that LastBatch is for a closing-shift bakery manager making markdown decisions. I decided that the two-hour weather forecast was relevant because it matches the period immediately after the manager's closing-time decision. I decided to use the Singapore public data source rather than introduce a separate global weather service, and I decided that the weather should remain advisory rather than tell the manager what markdown to apply.

I also decided what should happen when the weather source fails: the manager should still be able to work through the closing list. The fifteen-minute fresh cache and thirty-minute stale period were also deliberate choices based on the source's update rhythm.

Later, I decided that the manager should be able to choose the forecast area instead of always receiving the weather for City. The original hardcoded area made the feature less useful because a manager should see the conditions relevant to their own shop.

I did, however, keep some technical decisions for longer than I needed to. Four edits were ultimately made by hand: changing 503 to 502 for the unreachable case, making the front-end check explicitly for 502, deleting the invented weather-to-footfall guidance, and simplifying the use of the response status in the unreachable path. These were mostly production-level corrections rather than important product decisions. In hindsight, I could have asked the agent to make some of them, provided I had already understood the desired result.

The more important issue was a decision I did not realise I was making. The agent decided what the successful weather state should say because I had not specified it. That is the decision that never reached my list. My Prompt 6 later added an explicit guardrail: **"Do not add any sentence interpreting the weather or recommending a markdown."** Nothing interpretive appeared after that. The difference was not better coding; it was that I had finally recognised the product decision and kept it on my side of the boundary.

---

### Q6. What does this mean for a team of thirty?

The main lesson I would carry to a larger team is that AI-assisted development needs a review of what the product says, not only whether the code works. My weather example did not create an error, but it introduced a business claim that nobody had explicitly decided to make. On a team of thirty, the person who writes the prompt may not be the person who sees the final output, so this kind of decision could easily pass through the system unnoticed.

I would therefore require a review step where someone checks the actual user-facing product against the intended user, job and sources before release. I would also keep decisions about what the product claims, recommends and says in failure states with a human rather than letting the agent settle them implicitly. The implementation of those decisions can be handed to the agent, but the decisions themselves should remain traceable to a person or a verified source.

I would also require teams to check the destination rather than relying only on the AI tool's status message. In my own project, the GitHub sync message, the generated weather sentence and several pieces of code all looked reasonable until I checked what was actually there. For a larger organisation, I would want every important user-facing claim to have an identifiable source or owner. The biggest risk is not only that an agent produces something wrong; it is that it produces something plausible that nobody realised had become a decision.
