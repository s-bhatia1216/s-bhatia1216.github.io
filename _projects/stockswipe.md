---
layout: page
title: "StockSwipe"
description: "Swipe-to-invest stock discovery with Claude-powered analysis"
importance: 2
category: hackathon builds
---

**Mar 2026** &nbsp;|&nbsp; AI@Princeton x Trade[XYZ] Hackathon &nbsp;|&nbsp; _React, Vite, Node.js, Anthropic SDK, Yahoo Finance, Finnhub_

With Yash Thakkar

<p>
  <a class="btn btn-sm z-depth-0" role="button" href="https://github.com/s-bhatia1216/StockSwipe" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Code</a>
  <a class="btn btn-sm z-depth-0" role="button" href="https://youtube.com/shorts/up3gJdMNWNM" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-youtube"></i> Walkthrough</a>
</p>

{% include figure.liquid loading="eager" path="assets/img/projects/stockswipe/title_card.jpg" title="StockSwipe" class="img-fluid rounded z-depth-1" %}

Investing apps are built for people who already know what to buy. StockSwipe is built for everyone else: a mobile-first app that turns stock discovery into a Tinder-style deck. Swipe right to invest, swipe left to skip, and flip any card to see live AI analysis and real news before you decide.

## Walkthrough

<div class="d-flex justify-content-center mt-3">
  <iframe src="https://www.youtube.com/embed/up3gJdMNWNM" title="StockSwipe walkthrough" style="width: 315px; max-width: 100%; aspect-ratio: 9 / 16; border: 0" class="rounded z-depth-1" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
</div>

## What it does

<div class="row mt-3">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/stockswipe/card_front.jpg" title="Stock card" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/stockswipe/card_back_ai.jpg" title="Card back with AI analysis" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/stockswipe/ask_claude_news.jpg" title="Ask Claude and live news" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  A card's front with live price and chart, its back with key numbers and the bull case, and an answer from Claude above the latest news on the stock.
</div>

- **Discover.** Each card shows a live price and an interactive chart from 1 day to 5 years. Dragging shows a live BUY or SKIP overlay, and the deck quietly learns from your swipes, reordering upcoming stocks by the sectors and risk styles you lean toward.
- **Flip for the story.** The back of each card has the company's thesis, a bull and bear case, a one-line "Why this stock?" hook written by Claude, live headlines from Finnhub, and a search bar to ask Claude anything about the stock.
- **Reels.** A vertical, short-video feed of stock explainers from YouTube. Tap the stock on any reel to buy it.
- **Portfolio.** Holdings with live prices; swipe a holding right to buy more or left to sell, plus a diversification breakdown, streaks, and badges.
- **AI insights.** Claude Sonnet grades the whole portfolio and explains its strengths, risks, and recommendations, with a Risk Radar showing concentration, volatility, and correlation.
- **Friends.** A friends feed, a leaderboard, and head-to-head return comparisons, with community comments on every stock.

<div class="row mt-3">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/stockswipe/ai_insights.jpg" title="AI portfolio insights" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/stockswipe/friends_head_to_head.jpg" title="Friends head-to-head" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: Claude's portfolio grade, sector allocation, and Risk Radar. Right: a head-to-head comparison with a friend.
</div>

## How it's built

A React and Vite front end with Framer Motion for the swipe physics and custom canvas-rendered charts, backed by an Express server that proxies market data from Yahoo Finance (cached by time range, with a fallback when live data is unavailable), company news from Finnhub, and the Anthropic API. Claude Haiku writes the fast per-stock hooks and answers; Claude Sonnet does the deeper portfolio analysis. It installs to a phone's home screen as a progressive web app.

## My role

Yash and I built StockSwipe together. I built the smart deck ordering, the "Why this stock?" hook, the Ask Claude search bar, the AI Insights tab, and the Risk Radar, and set the app up to install on phones. Yash built the friends feed and leaderboard, the diversification breakdown, streaks, badges, and sound effects, the YouTube reels, and the live chart data on the front page.
