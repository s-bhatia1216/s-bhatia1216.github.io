---
layout: page
title: "Autonomous Obstacle-Avoiding Drone"
description: "A CrazyFlie that sees, dodges, and lands on its own"
importance: 2
category: robotics
---

**Sep – Dec 2024** &nbsp;|&nbsp; _Python, OpenCV, CrazyFlie, Kalman Filter_

- Built a fully autonomous CrazyFlie drone for MAE 345 (Robotics) with real-time HSV obstacle detection, contour-based avoidance, and closed-loop waypoint following via an onboard Kalman filter. Selected by Prof. Nagpal as a reference implementation for future cohorts.
- Designed dual-range HSV masking to detect red obstacles under varying lighting, contour-based proximity zones at three threat levels, and a separate blue-channel bounding-box tracker for target acquisition and proportional approach.
- Engineered the full decision loop: a pre-flight lateral sweep to pick the least-obstructed lane, stateful boundary tracking to prevent feedback oscillation, and a vision-based landing controller.
