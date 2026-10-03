---
layout: page
title: "NANI: AI Medicine Companion"
description: "Built at HackPrinceton Fall 2025: IoT medication adherence for elderly patients"
importance: 1
category: apps
---

**Nov 2025** &nbsp;|&nbsp; _Raspberry Pi, Python, FastAPI, Node.js, Swift, OpenAI_

- Built a full-stack IoT medication adherence system ("NANI", grandmother in Hindi) spanning passive IR beam hardware, a bilingual voice-first assistant, a cloud data pipeline, and a family-facing iOS app, built at HackPrinceton Fall 2025.
- Engineered the Raspberry Pi IR beam sensing stack end to end (circuit, Python/FastAPI firmware, Node.js REST integration) with 98% signal-detection accuracy and sub-150 ms event-to-cloud latency.
- Integrated Whisper speech-to-text, GPT-4o-mini health Q&A, and OpenAI TTS for an English/Hindi voice assistant accessible to non-English-speaking patients.
- Built a hardware-to-cloud pipeline with retry logic and local buffering, plus real-time Care Circle push notifications for family caregivers in the Swift app.
