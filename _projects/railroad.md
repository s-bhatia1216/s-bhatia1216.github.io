---
layout: page
title: "Mt. Rainier Railroad Control System"
description: "A closed-loop railroad safety system run by a 6502 computer built from scratch"
importance: 1
category: robotics
---

**Feb to May 2026** &nbsp;|&nbsp; MAE 412 (Microprocessors) capstone &nbsp;|&nbsp; _6502 Assembly, Arduino C++, Python_

With Hriday Unadkat and Sanjana Venkatesh

<p>
  <a class="btn btn-sm z-depth-0" role="button" href="{{ '/assets/pdf/projects/mt_rainier_railroad_report.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-file-pdf"></i> Final report</a>
  <a class="btn btn-sm z-depth-0" role="button" href="https://github.com/s-bhatia1216/mt-rainier-railroad" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Code</a>
  <a class="btn btn-sm z-depth-0" role="button" href="https://drive.google.com/drive/folders/1Hlhi2RCAXbysZo0wJm9Yh_kucfr4i3bJ?usp=sharing" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-video"></i> More demo videos</a>
</p>

The Mount Rainier Scenic Railroad, a heritage steam line in Washington, only reopened in 2023 after a long closure caused in part by heavy rain that brought trees down across the track; crews had to clear and inspect it by hand before service could resume. We built a scaled model of that problem: a two-loop railroad that detects a fallen tree on its own, cuts power to the threatened section, and brings the train back once the track is clear, with no human in the loop.

<div class="row mt-3">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/railroad/layout_physical.jpg" title="Physical track layout" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/railroad/tree_obstacle.jpg" title="3D-printed tree obstacle" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: the finished board, built on Atlas flex track with four motorized turnouts. Right: one of the servo-driven 3D-printed trees that falls across the track.
</div>

## Demo

<div class="d-flex justify-content-center mt-3">
  <iframe src="https://www.youtube.com/embed/El7ZdperGxM" title="Demo: Simulating the Mount Rainier Scenic Railroad" style="width: 315px; max-width: 100%; aspect-ratio: 9 / 16; border: 0" class="rounded z-depth-1" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
</div>
<div class="caption">
  A tree falls, its ToF sensor trips, and that track segment loses power until the tree lifts again.
</div>

## How it works

The track has three loops (default, inner, and outer) joined by four motorized turnouts, with a hazard zone on the inner and outer loops. Each hazard zone has a VL53L0X time-of-flight sensor watching the track and a tree on a servo that drops onto it at random intervals.

- **Sense.** Both ToF sensors share one I2C bus. Their shutdown lines are held low at startup so each one can be brought up and given its own address (0x30 and 0x31). Every 500 ms the firmware reads both in continuous mode; a reading at or below 170 mm (outer) or 120 mm (inner) means a tree is on the track.
- **Decide and act.** A tripped zone immediately drops its track-power relay, which stops any train in that section. The track is wired with insulated rail joiners at each hazard zone so power can be cut one segment at a time. If both zones are blocked, both segments go dead and the system stays in that safe state until a tree lifts.
- **Recover.** Power only comes back when the sensor itself reads the track as clear again, so restarting is validated by sensing rather than by a timer.
- **Route.** The turnouts cycle through three routing patterns (outer loop for 60 s, inner loop for 30 s, back to default for 30 s). Each turnout is thrown by a trickle-charge circuit, where a capacitor and relay let low-power logic signals fire the turnout solenoid, and the four throws are staggered 5 ms apart to avoid a current spike. The capacitor needs time to recharge between throws, which is why the patterns change slowly.

<div class="row mt-3">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/railroad/layout_anyrail.jpg" title="Track plan in AnyRail" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/railroad/tof_sensor_mount.jpg" title="ToF sensor mount" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: the track plan we designed in AnyRail (outer loop in orange, inner loop in teal, exit in green). Right: a VL53L0X sensor on its protoboard and 3D-printed mount.
</div>

## The computer: a 6502 built from scratch

The supervisory computer is a hand-wired 8-bit machine on a vector board, functionally equivalent to the 1976 Apple 1. A Synertek SY6502 talks over a shared 16-bit address bus and 8-bit data bus to an 8 kB 28C64B EEPROM (firmware), 2 kB of 6116 static RAM, a 6522 VIA for parallel I/O, and a 6551 ACIA for serial. A GAL16V8 does all of the address decoding, so the memory map could be changed by reprogramming one chip, which mattered a lot while debugging. Firmware is written in 6502 assembly, assembled with vasm, and burned to the EEPROM with a device programmer.

The 6502 handles supervision: it shows train barcode readings from the test stand on two TIL displays and talks to the neighboring track segments over the course-wide serial network. All the timing-critical work (sensor reads, servo PWM, relays, and turnouts) runs on an Arduino ATmega328P co-processor. Splitting the system this way is what made it possible to integrate everything inside a semester.

<div class="row mt-3">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/railroad/vector_board.jpg" title="Hand-wired 6502 vector board" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/railroad/trickle_charge_schematic.jpg" title="Trickle-charge turnout circuit" class="img-fluid rounded z-depth-1" %}
    {% include figure.liquid path="assets/img/projects/railroad/tof_schematic.jpg" title="ToF sensor wiring" class="img-fluid rounded z-depth-1 mt-3" %}
  </div>
</div>
<div class="caption">
  Left: the hand-wired 6502 computer. Right: the trickle-charge circuit that throws each turnout, and the wiring from the edge connector to the two ToF sensors.
</div>

## Design iterations

- **Ultrasonic to time-of-flight.** We started with ultrasonic range finders and switched to ToF after looking at beam width and noise; the narrow beam was far more reliable in a cluttered track environment.
- **Four loops down to two.** The first layout copied the real railroad's main loop plus three side loops, but it couldn't meet the minimum curve radius on our board, so we kept the character (multiple routes and a reroutable hazard zone) with fewer loops.
- **One mechanism, not two.** Early designs used separate mechanisms to drop and remove the tree; a single servo now does both, which cut parts and made the tree land in the same spot every time so the sensor thresholds could be tuned.

## What I'd do differently

- **Strain relief.** On demo day a wire on the vector board's edge connector worked loose, likely because of how the board was mounted. A better mount and sturdier solder joints would have prevented it.
- **Route by position, not by clock.** Because the turnouts run on a fixed schedule, the train could be on the outer loop when the switches went to the inner-loop pattern, and derail. Hall-effect sensors in the track would let the switches follow the train, and also reroute it around a fallen tree instead of just stopping it.
- **Next steps.** Camera-based obstacle detection, coordinating multiple trains, and predicting hazards rather than only reacting to them.

My parts of the project were the vector board computer, track layout, firmware, and wiring, along with co-writing the report. The full design, schematics, and firmware walkthrough are in the [final report]({{ '/assets/pdf/projects/mt_rainier_railroad_report.pdf' | relative_url }}).
