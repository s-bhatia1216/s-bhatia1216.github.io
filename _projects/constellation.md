---
layout: page
title: "Constellation Analyzer"
description: "Browser-based LEO constellation simulator for a 1 GW space data center"
importance: 1
category: space
---

**May 2026** &nbsp;|&nbsp; MAE 426 (Rocket and Air-Breathing Propulsion Technology) &nbsp;|&nbsp; _Three.js, JavaScript, orbital mechanics_

<p>
  <a class="btn btn-sm z-depth-0" role="button" href="{{ '/assets/tools/constellation-analyzer.html' | relative_url }}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-up-right-from-square"></i> Open full screen</a>
  <a class="btn btn-sm z-depth-0" role="button" href="https://github.com/s-bhatia1216/constellation-analyzer" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Code</a>
</p>

Could you power a data center from orbit? Our MAE 426 project asked what it would take to run a **1 GW data center in space**, powered entirely by sunlight. At roughly 50 kW per satellite, that means about 20,000 satellites, and the hard part is no longer the power math but the orbital architecture: how many orbital planes, at what altitude and inclination, and how evenly spread.

I built this interactive simulator to explore that design space. It renders the whole constellation in 3D in real time and recomputes the orbital mechanics as you drag the sliders.

## Try it

<div class="mt-3">
  <iframe src="{{ '/assets/tools/constellation-analyzer.html' | relative_url }}" title="Constellation Analyzer" style="width: 100%; height: 620px; border: 0" class="rounded z-depth-1" loading="lazy"></iframe>
</div>
<div class="caption">
  The live simulator. Drag to rotate, scroll to zoom, adjust the sliders on the left, or load a preset on the right. It works best on a laptop or desktop; on a phone, use "Open full screen".
</div>

## What you can explore

- **Constellation size.** The number of orbital planes and satellites per plane. Total satellites and total system power update as you go.
- **Orbit shape.** Altitude (200 to 2,000 km), inclination (0° equatorial to 90° polar), and the phase offset between neighboring planes.
- **Plane spacing.** Uniform spacing, a staggered Walker pattern (standard for communications constellations), or a polar layout that concentrates coverage at high latitudes.
- **Presets.** Our 1 GW baseline next to real-world reference points: Starlink Gen1, a OneWeb-like near-polar shell, full polar coverage, and a dense very-low-Earth-orbit shell.

For every configuration it computes the orbital period (Kepler's third law), orbital speed (the vis-viva equation), each satellite's coverage cone and ground footprint, the estimated share of Earth covered, and the longest gap in coverage. Everything runs in the browser, in a single HTML file with no build step.

## Our baseline design

<div class="row mt-3">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/constellation/baseline_1gw.jpg" title="1 GW baseline: 20,000 satellites" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/constellation/polar_preset.jpg" title="Polar coverage preset" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: our 1 GW baseline, 200 planes of 100 satellites at 550 km and 53°. Right: a polar constellation (180 planes of 10 at 700 km and 90°) for comparison.
</div>

| Parameter | Value |
| --- | --- |
| Total satellites | 20,000 (200 planes × 100 per plane) |
| Altitude and inclination | 550 km, 53° |
| Power per satellite | 50 kW |
| Total system power | 1.0 GW |
| Orbital period | about 95 minutes |
| Orbital speed | about 7.6 km/s |

We chose the same 550 km, 53° shell as Starlink's first generation, a proven commercial architecture. At that altitude, atmospheric drag pulls dead satellites down within about five years, which limits debris without needing active deorbit systems.

## Design tradeoffs

- **Altitude vs. launch cost.** Higher orbits give each satellite a bigger footprint, so you need fewer of them, but every kilogram costs more to launch and latency goes up.
- **Inclination vs. where coverage lands.** 53° covers the populated latitudes where data centers and users are. 90° covers the whole globe, including the poles, but spends a lot of capacity over oceans and empty regions.
- **Planes vs. satellites per plane.** More planes smooth out coverage east to west; more satellites per plane fill gaps north to south. Their product sets both the satellite count and the power budget.
- **Walker vs. uniform spacing.** Uniform spacing is the easiest to launch one plane at a time; a Walker pattern covers more evenly but makes the launch sequence more complex.
