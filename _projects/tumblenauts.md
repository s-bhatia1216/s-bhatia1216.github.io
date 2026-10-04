---
layout: page
title: "Vision-Based Collision Safety for the Tumblenauts Swarm"
description: "Keeping a swarm of tiny, randomly tumbling space-inspection robots from colliding"
importance: 0
category: robotics
---

**Aug 2026 to present** &nbsp;|&nbsp; Self-Organizing Swarms & Robotics Lab, Princeton &nbsp;|&nbsp; _Computer vision, 3D tracking, safety filters_

I joined the Tumblenauts project, led by PhD candidate Sneha Ramshanker in Prof. Radhika Nagpal's lab, after the original Tumblenauts paper was published. I'm building the ZeroG flight-approved version of the robots, and this collision-safety work, still in progress, is also my ECE 532 final project.

<p>
  <a class="btn btn-sm z-depth-0" role="button" href="https://doi.org/10.1007/978-3-032-26123-6_20" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-book-open"></i> Original Tumblenauts paper (ANTS'26)</a>
  <a class="btn btn-sm z-depth-0" role="button" href="{{ '/assets/img/projects/tumblenauts/ants26_poster.jpg' | relative_url }}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-image"></i> Poster</a>
</p>

## The Tumblenauts

The Tumblenauts are a swarm of small robots designed to inspect pressurized habitats like the International Space Station. Instead of navigating precisely, they move the way bacteria do: each robot runs in a straight line with a small thruster, then uses flywheels to tumble into a random new direction. That run-and-tumble motion lets them get away with very simple hardware. At 8 by 10 cm with only three actuators, they are among the smallest and simplest robots built for microgravity, and as a swarm they can map a space or track down anomalies like leaks.

<div class="row mt-3">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/tumblenauts/fleet_apriltags.jpg" title="Tumblenauts fleet with AprilTags" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/tumblenauts/ants26_poster.jpg" title="Tumblenauts ANTS'26 poster" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: part of the fleet, each robot wearing AprilTags so cameras can identify it. Right: the Tumblenauts poster (Ramshanker, Bhatia, Alhafnawi, Guffer, and Nagpal), which links to the original ANTS'26 paper by the lab.
</div>

My main role is building the ZeroG flight-approved version of the Tumblenauts: a fleet of 6 to 10 robots that will fly on a ZeroG parabolic flight in November 2026 and be tested in real microgravity inside a 2 by 2 meter netted area aboard the aircraft.

## The problem: random motion in a tight space

Random tumbling keeps the robots simple, but it also makes each robot's future path uncertain, and that's a real collision risk when several of them share a cramped space. Today the robots are built to be collision resistant: a 3D-printed waffle-cylinder shell protects the electronics inside. My goal is to make the next generation collision avoidant, using vision to see a collision coming and step in before it happens.

## What I've built: a camera-based 3D tracker

I've built most of the perception pipeline. Five synchronized, static cameras surround the lab's 2 by 2 meter netted arena and identify each robot by its AprilTags as it floats in the air, and I fuse their views into 3D tracks for every robot. Over an 8.5-minute session, each robot was visible to at least one camera 81 to 88% of the time, with blind spots of up to 1.7 seconds.

## What's next: a safety filter

The tracks become the foundation for control, in three steps:

- **Model the motion.** Fit a run-and-tumble motion model, including the robots coasting, directly from the tracked data.
- **Simulate it.** Build a simulator from that model, with models of both the arena cameras and the robots' own onboard cameras.
- **Add a safety filter.** Design filters that leave the robots' normal inspection behavior alone and step in only when a collision is close to becoming unavoidable. I'm comparing two approaches: control barrier functions, and reachability analysis that treats the random tumble as an adversary.

The filters can cut or scale a robot's thrust, force a tumble, or change how often its thruster fires, and I'm writing firmware so each robot can receive those commands over its ESP-NOW radio for near-collision tests in the arena. After the ZeroG flight, I'll refit the model on real microgravity footage and test whether a filter tuned on Earth stays safe in zero gravity.

## Questions I'm working on

- Can I put a meaningful bound on the 3D tracking error, including during blind spots, and widen the safety margins to match?
- A coasting robot can't brake. With only thrust, tumble, and firing-rate controls, which kind of safety filter works better?
- How much do the motion model and the safe regions change between the arena and real microgravity?
- How much do onboard cameras, alone or combined with the arena cameras, reduce collisions?
- With three or more robots close together, can the safety constraints conflict so that no safe move exists? And how much inspection coverage does each filter give up for the collisions it prevents?
