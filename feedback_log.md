# feedback_log.md

Isabella Karunia Djuhadi, Group 3

| Groupmate (initials) | Their live address | Link to my comment | Posted on | Findings |
|---|---|---|---|---|
| AK | https://pantrypilot-phi.vercel.app/ | http://disq.us/p/36r0y16 | Sat 26 Sep, 11.26 PM | 3 |
| CCH | https://singapore-bus-arrivals-mgmt6110.vercel.app/ | http://disq.us/p/36r0zi7 | Sat 26 Sep, 11.26 PM | 4 |
| MML | https://skylah-disqus-clarity-nu.vercel.app/ | [full text below] | Sun 27 Sep, 1:47 AM | 3 |

## My comment on MML's board (link unavailable)
Heuristic evaluation by Isabella Karunia Djuhadi, Group 3
Tested on Windows Chrome and Android Chrome, Sunday 27 Sep 2026, 1:00 AM

Finding 1
Where: https://skylah-disqus-clari... — Forecast tab, "2-Hour Forecast" card ("Updated: 12:56 am SGT · Valid: 12.30 am to 2.30 am SGT")

What I did, what I saw: I opened the app at about 12:59 am and left it open while I switched areas and tabs. The app asked its server for the forecast once, when the page loaded, and never again. There is no refresh button anywhere on the screen, and nothing changed when I came back to the Forecast tab. The card says the forecast is only valid until 2.30 am, but nothing tells the user when that has passed. Anyone who keeps the tab open, which Android Chrome does by default, will see an old forecast, with its "Thunderstorm precaution" or "Cloudy skies" tip, presented as current.

Which heuristic: #1 — Visibility of system status
Screen or system: System. The forecast is fetched once per page load, with no update on a timer or when the user returns, even though NEA publishes a new 2-hour forecast about every half hour.

Severity, and why: 3 — damages trust out of proportion. The whole product is a short-range forecast. One day of acting on an expired "partly cloudy" and getting caught in a storm is enough for a commuter to stop trusting it.

The repair: The forecast on screen is always the latest one available. If it can't be updated, the user can clearly see that it's out of date, and can ask for a fresh one without reloading the page.

Finding 2
Where: https://skylah-disqus-clari... — "Select forecast area" dropdown and quick-switch buttons, on every visit

What I did, what I saw: I chose Jurong West, which showed "Thundery Showers" and "Consider postponing outdoor plans." I reloaded the page and it was back on City, showing "Partly Cloudy (Night)" and "Cloudy skies ahead." The app does not remember the area, and it has no option to use my location. At the time, all of the west (Boon Lay, Bukit Batok, Choa Chu Kang, Clementi, Jurong East, Jurong West) had thunderstorms, while City looked fine. A Jurong West resident who opens the app and glances at the first forecast gets the wrong weather for where they are.

Which heuristic: #7 — Flexibility and efficiency of use
Screen or system: Screen. The app has no memory of the user's usual area and no shortcut to it, so every visit starts from the same default.

Severity, and why: 3 — how often it happens, and what it costs. It hits every visit by anyone outside the City area. Regular users have to re-pick their area every time, and a hurried user who doesn't will read a forecast that can be completely wrong for them.

The repair: The app opens on the user's own area, whether remembered from last time or from their location, and it's always obvious which area the forecast on screen belongs to.

Finding 3
Where: https://skylah-disqus-clari... — the browser / phone Back button, from the "All Areas" or "Feedback" tabs

What I did, what I saw: I arrived from a Google search, chose Jurong West, then tapped "All Areas" at the bottom. I pressed Back, expecting to return to the Forecast tab. It took me straight out of SkyLah to the Google page. The address stays the same on all three tabs, so the browser has nothing to go back to inside the app. When I returned, my Jurong West choice was gone and it had reset to City.

Which heuristic: #3 — User control and freedom
Screen or system: Screen. The bottom tabs look like separate pages but aren't treated as steps the user can go back through, so the standard way back becomes a way out.

Severity, and why: 2 — how often it happens. Pressing or swiping Back is a habit on Android, especially after using bottom tabs. Each slip costs little, just reopening the app and re-picking the area, but it happens easily and adds to the problem in Finding 2.

The repair: Going back from a tab returns the user to the previous tab inside the app, and leaving and returning keeps the area they had chosen.

What works, and should stay as it is: The "Based on" line under each tip. For example: "Based on: Thundery Showers · Jurong West (12.30 am to 2.30 am SGT)" with "Suggestion by SkyLah; forecast from http://data.gov.sg ." It separates the app's own friendly advice from the official NEA forecast and shows exactly which area and time window it used. That makes the playful tips easy to trust and easy to check.
