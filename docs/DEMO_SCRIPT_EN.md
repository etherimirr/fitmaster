# FitMaster · English Demo Script (~5 min)

> Use this as a teleprompter. Bold = what you say. Italic = what you do.

---

## Pre-Demo Setup (do this 5 min before you start)

1. Cmd+R refresh `fitness-app.html` in browser
2. Click **🌐 EN** at bottom-left → UI switches to English
3. Open AI Assistant → confirm your OpenAI key is filled in
4. (Optional) Tell AI in chat: "From now on always respond in English"
5. Make sure you're on **Me** user (not Demo) so it's clean

---

## Opening (30 sec)

> **"This is FitMaster — a single-file, fully offline fitness app I built to track training, diet, body composition, and overall health. It runs entirely in the browser, all data stays local, and there's an AI coach that can read your data and write entries on your behalf."**

*Show the Daily Check-in page (homepage).*

---

## Demo 1 — AI Check-in via Natural Language (90 sec)

> **"Instead of filling out forms, I just describe my day in plain English."**

*Type into the check-in box:*

```
Did push day today: bench press 40kg×8 four sets, dumbbell press 12kg×10 three sets, lateral raises 6kg×12 three sets. Lunch was chicken breast 200g and brown rice 150g. Drank 2L of water. Energy 8/10, slight soreness in left shoulder.
```

*Click **✨ AI Parse & Write Data**.*

> **"Watch what happens — the AI parses every data point and writes it into the right module."**

*Wait for AI response. Point to:*
- Today's calorie counter ticks up
- Workout count goes 0 → 1
- Today's logged items card shows Push Day, lunch entries, water, journal
- Inline AI feedback shows what was written

> **"Notice the calorie target is dynamic — it's BMR plus daily-life multiplier plus today's actual workout burn calculated by MET, minus my recomp deficit, with female cycle adjustment if I had it enabled."**

*Click "Today's calorie target breakdown" disclosure to show the formula.*

---

## Demo 2 — Photo + Vision (45 sec)

> **"AI also reads photos."**

*Click 📷 → upload a meal photo (or your scale or a workout app screenshot)*

> **"I'll just upload this meal photo without typing anything."**

*Click **AI Parse & Write**.*

> **"AI estimates the macros and logs each item separately."**

*Show the food entries appearing in today's logged items.*

---

## Demo 3 — Modular Architecture, AI Controls UI (60 sec)

> **"The app is fully modular. Thirteen pages on the left, all toggleable."**

*Type into check-in:*
```
Hide the Achievements and Calculators pages, I don't need them. Then add a custom tracker called Meditation, icon meditating person, unit minutes, daily goal 15.
```

*Click **AI Parse & Write**.*

> **"In one prompt I told the AI to change the navigation AND create a new metric tracker."**

*Point to:*
- Achievements & Calculators disappear from sidebar
- Main page now shows a new "Custom Trackers" card with Meditation 0/15

```
I just meditated for 20 minutes
```

*Submit.*

> **"And it logs the value. The progress bar fills, badge shows 'Done'."**

---

## Demo 4 — User Switching with 60-day Demo Data (60 sec)

> **"To show you what 2 months of usage looks like..."**

*Click user switcher at top-left → click **+ Demo Data** → confirm.*

> **"This generates 60 days of realistic simulated data based on my profile — 5 workouts a week, progressive overload, recomp diet, body composition tracking."**

*Wait 1-2 sec. Click around:*
- **Progress** page → show 12-week frequency chart, PR table
- **Body Data** page → show weight curve and BF% trending down
- **Achievements** (re-enable if hidden) → show unlocked badges
- **Reports** → "This Month" shows comprehensive summary

> **"Body weight stayed roughly flat — that's expected for recomp. But body fat dropped from 24% to 21.5%, and PRs went up across the board. That's the recomp signal."**

*Click user switcher → switch back to **Me**.*

---

## Demo 5 — Calorie Target Sophistication (30 sec)

*Go to **Profile** page.*

> **"Calorie targets aren't static. They use Mifflin-St Jeor or Katch-McArdle if body fat is known. Daily-life activity multiplier separately from training. Female menstrual cycle phase adjusts BMR by up to 7.5% in luteal phase. Today's actual workout burn is computed from logged exercises using MET values."**

*Show the Profile page with the cycle tracker.*

---

## Closing (15 sec)

> **"Everything runs offline. Data is in browser localStorage — no servers, no accounts, no telemetry. Source is on GitHub, MIT license, single HTML file. iPhone version is in development on the mobile-ios branch using Capacitor."**

> **"Thanks. Questions?"**

---

## Backup Talking Points (if asked)

- **Why not React?** — Single file, zero dependencies, double-clickable, runs in any browser, easy to fork
- **Privacy?** — Nothing leaves your machine except AI calls (and those go directly to your own API key)
- **Cost?** — Free to use; AI runs on user's own API key (~$3-10/month for normal use)
- **iPhone?** — Phase 1 of Capacitor wrapper done in mobile-ios branch
- **Multi-language?** — Click 🌐 to switch CN/EN, exercise names, food DB, AI prompts all localized

## Backup Demo Prompts (English)

```
Yesterday I did pull day - lat pulldown 30kg×10 four sets, seated row 25kg×10 four sets, face pulls 10kg×15 three sets
```

```
Add a tracker for cold showers, 🥶, unit times, daily goal 1
```

```
I want to delete today's water entry
```

```
What should I focus on this week to make my back muscles more visible?
```

```
Switch the language to Chinese
```

```
Make today a rest day, delete the workout I just logged
```

## If AI Breaks During Demo

1. Show inline error card (it explains itself)
2. Say: "Let me show you the manual flow" → click 🍱 Diet → use the form to add a food entry
3. Say: "Even without AI, every module works manually"

## If You Run Out of Time

Skip Demo 2 (photos) — it's the most failure-prone (depends on the photo quality and AI's interpretation).
