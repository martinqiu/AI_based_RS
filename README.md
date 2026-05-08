# AI-Based Recommender System Simulator

`AI_based_RS` is a classroom simulator for showing how conversational memory can feed a product recommender inside a generic AI assistant interface.

The app is intentionally dependency-free: it uses plain HTML, CSS, and JavaScript, so it can be opened directly or served with any simple static server.

## API Key Safety

This simulator does not require an OpenAI API key. Do not put API keys in `index.html`, `app.js`, or any other committed file.

If a later version adds a real API integration, keep keys in an untracked local environment file such as `.env`. The `.gitignore` is configured to exclude `.env`, `.env.*`, and common secret/key files.

## What It Demonstrates

- A generic AI assistant conversation, similar in structure to ChatGPT or Gemini
- No left sidebar, topic selector, or hidden scenario context for the AI
- Concise, non-promotional AI replies
- A right sidebar that shows eligible promotion candidates ranked by relevance score
- A two-stage recommender:
  - Stage 1: product candidate eligibility
  - Stage 2: relevance scoring and ranking
- A manually adjustable ad threshold
- A minimum three-round delay before any ad can appear
- Sponsored messages inserted from the AI side only after both trigger conditions are met

## Candidate Eligibility

The product catalog is the universe of possible promoted products. A product does not appear in the right sidebar just because it exists in the catalog.

A product becomes an eligible candidate only when the conversation or extracted memory signals match the product through at least one meaningful connection:

- direct keyword or tag match
- category match
- inferred need match
- budget or preference fit
- instructor-defined catalog metadata

Generic sentiment or urgency alone is not enough to make an unrelated product a candidate. For example, an Air Fryer appears only when the conversation connects to cooking, kitchen tools, meal prep, quick meals, or healthy food.

## Ad Trigger Rule

An ad appears only when both conditions are true:

1. The top-ranked eligible product has a score greater than or equal to the current threshold.
2. The conversation has completed at least three full back-and-forth rounds.

One round means one user message followed by one AI response.

If a product reaches the threshold before three rounds, the sidebar marks it as score-ready but blocked by the round gate.

## Run Locally

Open `index.html` directly in a browser, or serve the folder locally:

```powershell
cd F:\Github\AI_based_RS
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Suggested Classroom Tests

1. Ask a general question with no product-relevant topic. No candidates should appear.
2. Ask about cooking or meal prep. Air Fryer may appear because it has a meaningful topic or need match.
3. Lower the threshold and discuss a product-relevant topic for fewer than three rounds. The candidate should be blocked from advertising.
4. Continue to three rounds. If the top product score is above the threshold, a sponsored AI-side message should appear.

## GitHub Setup

This folder is initialized as a normal local repository and is ready to push to GitHub as `AI_based_RS`.

Typical first push:

```powershell
cd F:\Github\AI_based_RS
git remote add origin https://github.com/YOUR-USERNAME/AI_based_RS.git
git branch -M main
git push -u origin main
```
