---
layout: page
title: "Mt. Rainier Railroad Control System"
description: "A closed-loop railroad safety system run by a 6502 computer built from scratch"
importance: 1
category: robotics
---

**Feb – May 2026** &nbsp;|&nbsp; _6502 Assembly, Arduino C++, Python_

- Designed and built a closed-loop autonomous railroad safety system for the MAE 412 (Microprocessors) capstone, modeling the Mount Rainier Scenic Railroad's fallen-tree hazard on a two-loop Atlas flex-track layout.
- Assembled a custom 6502-based vector-board computer from scratch as the supervisory brain, analogous to the 1976 Apple 1 and programmed in 6502 assembly; it coordinates an Arduino ATmega328P co-processor over serial and delegates all timing-sensitive I/O to it.
- Programmed the Arduino's real-time sense-decide-actuate loop: dual VL53L0X ToF sensors over I2C detect fallen obstacles every 500 ms, a relay cuts track power on obstruction, two servo-driven 3D-printed trees deploy at random, and four motorized turnouts switch through a trickle-charge circuit.
- Designed all mounts and tree obstacles in Fusion 360, printed them on BambuLab printers, and validated fail-safe behavior (both tracks de-energized when both hazard zones are obstructed) across repeated demonstration runs.
