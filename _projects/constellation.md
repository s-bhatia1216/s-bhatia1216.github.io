---
layout: page
title: "Constellation Analyzer"
description: "Browser-based LEO constellation simulator for a 1 GW space data center"
importance: 1
category: space
---

**May 2026** &nbsp;|&nbsp; MAE 426 (Rocket and Air-Breathing Propulsion Technology) &nbsp;|&nbsp; _Three.js, JavaScript, orbital mechanics_

With Hriday Unadkat, Sawooly Li, Tasman Moskowitz, and Evan Callas

<p>
  <a class="btn btn-sm z-depth-0" role="button" href="{{ '/assets/tools/constellation-analyzer.html' | relative_url }}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-up-right-from-square"></i> Open full screen</a>
  <a class="btn btn-sm z-depth-0" role="button" href="https://github.com/s-bhatia1216/constellation-analyzer" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Code</a>
</p>

Could you power a data center from orbit? AI is driving demand for compute faster than the ground can supply power, cooling water, and land, while space offers free sunlight and a vacuum to dump heat into. Our five-person team for MAE 426 ran a feasibility study of a **1 GW data center in space**, covering everything from the GPUs and thermal design to solar power, launch, communications, and servicing. I led the team.

The orbital architecture was my part of the study, and I built this interactive simulator, end to end, to explore it. It renders the whole constellation in 3D in real time and recomputes the orbital mechanics as you drag the sliders.

## Try it

<div class="mt-3">
  <iframe src="{{ '/assets/tools/constellation-analyzer.html' | relative_url }}" title="Constellation Analyzer" style="width: 100%; height: 620px; border: 0" class="rounded z-depth-1" loading="lazy"></iframe>
</div>
<div class="caption">
  The live simulator. Drag to rotate, scroll to zoom, adjust the sliders on the left, or load a preset on the right. It works best on a laptop or desktop; on a phone, use "Open full screen".
</div>

## The feasibility study

**Many small satellites, not one giant station.** A 1 GW data center makes about 1.2 GW of waste heat, and in space the only way to get rid of heat is to radiate it. One monolithic station would need more than 22 million square meters of radiator, roughly 3,000 football fields, and would be too big for any rocket, a single point of failure, and a 20 Tbps communications bottleneck. Splitting it into about 20,000 satellites brings the radiator down to around 300 m² each, small enough to fit a Starship fairing at about 50 satellites per launch, with each satellite downlinking its own share of the data.

{% include figure.liquid path="assets/img/projects/constellation/monolith_vs_constellation.jpg" title="One monolithic data center vs. a distributed constellation" class="img-fluid rounded z-depth-1" %}

<div class="caption">
  Why we chose a constellation: one giant structure fails on radiator size, launch, reliability, and bandwidth; 20,000 smaller nodes solve all four.
</div>

**Radiation picks the orbit.** Hitting 1 GW takes about 1.42 million H100-class GPUs. Radiation-hardened chips lag commercial GPUs by roughly 15 years in performance, so the design has to fly commercial silicon, and its 4 nm transistors are among the most radiation-sensitive ever made. That rules out anything inside the Van Allen belts or out at GEO. At 550 km, below the inner belt, the yearly radiation dose is low enough for commercial hardware to last about 5 to 7 years, and drag naturally clears dead satellites. GEO was rejected for 100 to 1,000 times the radiation dose and about a quarter second of round-trip latency.

<div class="row mt-3">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/constellation/why_leo_550km.jpg" title="Why LEO at 550 km" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/constellation/why_not_radhard_gpu.jpg" title="Why not use a radiation-hardened GPU" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: radiation exposure by altitude, and why 550 km is the only viable shell for commercial chips. Right: radiation-hardened processors trail commercial GPUs by about 15 years in capability.
</div>

**Computing across 20,000 nodes.** I also designed how the constellation works as one data center. A ground scheduler splits each job into sub-tasks and uplinks them to satellites as they pass overhead; satellites trade intermediate results over optical inter-satellite links (about 0.3 ms between neighbors); each satellite downlinks its results at 1 Gbps through a global ground network such as NASA's Near Earth Network; and if a satellite fails or drops into eclipse, its work moves to a neighbor.

**The verdict.** With the rest of the team's analysis (a three-node thermal model, ammonia-loop cooling with honeycomb radiators, origami-folded solar arrays generating 93 kW per satellite, launch on Starship in about 400 flights for roughly $6.8 billion, and a servicing plan for failed satellites), our conclusion was that a 1 GW space data center is physically feasible with the right architecture. The physics works and the technology largely exists or is maturing; cost is the binding constraint.

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

## My role

I led the team and owned the orbit feasibility trade study, the GPU and data center engineering, the distributed systems architecture, the case for a constellation over a single spacecraft, and the interfaces between subsystems. I built the Constellation Analyzer myself. Hriday led the thermal analysis, Tasman the radiator and cooling design and launch, Sawooly communications and risk, and Evan power and the origami solar arrays.
