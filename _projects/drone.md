---
layout: page
title: "Autonomous Obstacle-Avoiding Drone"
description: "A CrazyFlie that sees, dodges, and lands on its own"
importance: 2
category: robotics
---

**Sep to Dec 2024** &nbsp;|&nbsp; MAE 345 (Robotics) final project &nbsp;|&nbsp; _Python, OpenCV, CrazyFlie, Kalman Filter_

With Hriday Unadkat, Eshaan Govil, and Richard Zhou

The final challenge in Prof. Radhika Nagpal's robotics course: a palm-sized CrazyFlie quadrotor takes off from a start box, flies through a netted arena full of red foam pillars it has never seen before, finds a blue book on a table at the far end, and lands in front of it. No remote control and no map. The only inputs are the drone's onboard state estimate and a small camera.

After our final demo, Prof. Nagpal asked our team to share our code with her and the TAs so future classes would have an example of a strategy that worked, because our runs had been so robust and consistent.

{% include figure.liquid loading="eager" path="assets/img/projects/drone/team_demo_day.jpg" title="Team photo after the final demo" class="img-fluid rounded z-depth-1" %}

<div class="caption">
  Our team with Prof. Nagpal in the flight arena after the final demo, holding the target book and the drone.
</div>

## Demo runs

Three full autonomous runs from demo day, each through a different pillar layout.

<div class="row mt-3">
  <div class="col-sm-4 mt-3 mt-md-0">
    <video src="{{ '/assets/video/projects/drone/run1.mp4' | relative_url }}" poster="{{ '/assets/video/projects/drone/run1_poster.jpg' | relative_url }}" class="img-fluid rounded z-depth-1" controls muted playsinline preload="none" title="Demo run 1"></video>
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    <video src="{{ '/assets/video/projects/drone/run2.mp4' | relative_url }}" poster="{{ '/assets/video/projects/drone/run2_poster.jpg' | relative_url }}" class="img-fluid rounded z-depth-1" controls muted playsinline preload="none" title="Demo run 2"></video>
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    <video src="{{ '/assets/video/projects/drone/run3.mp4' | relative_url }}" poster="{{ '/assets/video/projects/drone/run3_poster.jpg' | relative_url }}" class="img-fluid rounded z-depth-1" controls muted playsinline preload="none" title="Demo run 3"></video>
  </div>
</div>
<div class="caption">
  Runs 1 to 3 on demo day (December 2024). The drone starts in the white box in the foreground and finishes at the blue book.
</div>

## How it works

The drone runs a simple, deliberate loop: look, decide, take one small step, repeat. It flies with the CrazyFlie's built-in PID controller and Kalman filter state estimate, holds 0.8 m altitude, and we send it position setpoints in small increments so every decision gets a fresh camera frame.

- **Pick the best lane before moving.** Right after takeoff the drone hovers and looks straight ahead, then sidesteps 0.5 m right and 0.5 m left, measuring the total area of red in each view. It starts its run from whichever of the three lanes has the least red, so it has fewer pillars to deal with from the start.
- **See the pillars.** Each frame is converted to HSV and masked with two red hue ranges (red wraps around both ends of the hue circle), then the largest red contour is measured. Its area acts as a rough depth estimate from a single camera, sorting the nearest pillar into threat levels at 5,000, 10,000, and 23,000 pixels.
- **Dodge without oscillating.** When a pillar crosses the closest threat level, the drone sidesteps about 7 cm instead of moving forward; otherwise it advances about 20 cm. It dodges right by default, and the arena's side nets are treated as walls at plus or minus 1.1 m. A global direction flag flips when the drone hits one of those walls, so it commits to dodging the other way instead of bouncing back and forth between a pillar and the net.
- **Find the book and land.** Past the last row of pillars (about 3.5 m in), the drone re-centers and switches to looking for blue. A gain-scheduled proportional controller keeps the book's bounding box centered in the frame, with gains chosen so every correction stays within a few centimeters, and the drone creeps forward using the box's share of the frame as a depth cue. Once the book fills 4% of the image, it stops and descends.

## What made it reliable

- **Small steps over clever planning.** Moving in short, fixed increments and re-checking the camera every step meant a single bad frame could never send the drone into a pillar.
- **Tuned on the real arena.** The threat thresholds, HSV ranges, and stopping distance were all tuned through test flights in the actual arena and its lighting.
- **A pre-flight checklist.** Our best runs came on batteries above 4.2 V, so we charged between runs, only flew on full batteries, and followed the same start-up sequence every time.
