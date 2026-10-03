---
layout: page
title: "Pedestrian Detection Benchmark"
description: "HOG+SVM vs. Faster R-CNN vs. DETR vs. YOLO+SAM2 on hard negatives"
importance: 1
category: ml
---

**Nov – Dec 2025** &nbsp;|&nbsp; _PyTorch, torchvision, OpenCV_

- Ran a controlled architecture-level comparison of four pedestrian detection paradigms on the PnPLO (Person vs. Person-Like Objects) dataset for COS 429 (Computer Vision).
- Built a unified evaluation pipeline for precision, recall, F1, mAP, false-positive breakdowns, PR curves, and confusion matrices, focused on robustness to statues, mannequins, and other hard negatives.
- Analyzed accuracy, inference speed, and false-positive tradeoffs across classical, two-stage, transformer, and segment-anything architectures in a full written report.
