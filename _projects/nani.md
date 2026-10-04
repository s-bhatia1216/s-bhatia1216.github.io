---
layout: page
title: "NANI: AI Medicine Companion"
description: "Built at HackPrinceton Fall 2025: IoT medication adherence for elderly patients"
importance: 1
category: hackathon builds
---

**Nov 2025** &nbsp;|&nbsp; HackPrinceton Fall 2025 &nbsp;|&nbsp; _Raspberry Pi, Python, FastAPI, Node.js, Swift, OpenAI_

With Yash Thakkar

<p>
  <a class="btn btn-sm z-depth-0" role="button" href="https://github.com/s-bhatia1216/NANI" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Code</a>
</p>

<div class="row">
  <div class="col-sm-8">
    <p>
      "Nani" means grandmother in Hindi. We built NANI for someone like Maya: 75, living on her own, and juggling pills for thyroid, blood pressure, diabetes, and cholesterol at different times of day, some with food and some without. Her family worries whether she remembered, whether she took the right one, and whether she's feeling okay.
    </p>
    <p>
      NANI watches for the pill being taken instead of asking her to log it, answers her questions out loud in English or Hindi, and keeps her care circle of family and doctors in the loop. The goal was to protect her independence and dignity while giving everyone peace of mind.
    </p>
  </div>
  <div class="col-sm-4">
    {% include figure.liquid loading="eager" path="assets/img/projects/nani/nani_logo.jpg" title="NANI logo" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

## How it works

NANI is a full-stack IoT system with four parts that talk to each other:

- **Pill detection (Raspberry Pi).** An infrared break-beam sensor sits across the medication container. Taking a pill breaks the beam, which the Pi reads on a GPIO pin, debounced so a stray flicker doesn't count as a dose. A small FastAPI service runs the sensor, posts each event to the cloud, and exposes health and start/stop endpoints, and it runs as a system service so it comes back up on its own after a reboot.
- **Event log (Google Sheets).** Every beam event lands in a shared Google Sheet through an Apps Script webhook, with a timestamp, event type, and device ID, giving caregivers a running record of doses that doesn't depend on the app.
- **Voice assistant (Node.js and OpenAI).** Maya taps the microphone and asks something like "What's my next medication?" The backend transcribes her with Whisper, answers with GPT-4o-mini playing a warm, patient caretaker who keeps answers short and acknowledges feelings first, and speaks the reply back with text-to-speech, in English or Hindi.
- **The app (Swift, iOS).** A home screen with her next dose, a medication list with dosage and instructions, the voice assistant, and a Care Circle where family can see her activity and message her. When the beam fires, the app updates the dose time automatically.

## My role

I was the project manager and systems engineer. I built the hardware side: wiring the IR beam to the Raspberry Pi, writing the beam-watching code and the FastAPI service that runs it, and setting up the Google Sheets logging pipeline. I also owned integration and testing, making sure a broken beam on the Pi showed up as a logged dose in the app reliably enough to demo live, and wrote the hardware setup guide and system documentation. Yash led the iOS app and the voice AI, including the bilingual interface, the OpenAI integration, and Care Circle messaging.

## What's next

- **Smarter adherence.** Learn each person's routine to predict missed doses before they happen and time reminders around their day.
- **More devices.** Pull in blood pressure monitors and glucose meters, which the assistant already asks about.
- **More languages.** Punjabi, Gujarati, Mandarin, and Spanish, so more grandparents can use it in the language they think in.
