---
layout: page
title: "Pedestrian Detection Benchmark"
description: "HOG+SVM vs. Faster R-CNN vs. DETR vs. YOLO+SAM2 on hard negatives"
importance: 1
category: ml
---

**Nov to Dec 2025** &nbsp;|&nbsp; COS 429 (Computer Vision) final project &nbsp;|&nbsp; _PyTorch, torchvision, OpenCV, Hugging Face, Ultralytics_

With Yash Thakkar

<p>
  <a class="btn btn-sm z-depth-0" role="button" href="{{ '/assets/pdf/projects/pedestrian_detection_report.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-file-pdf"></i> Final report</a>
  <a class="btn btn-sm z-depth-0" role="button" href="{{ '/assets/img/projects/pedestrian/poster.jpg' | relative_url }}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-image"></i> Poster</a>
  <a class="btn btn-sm z-depth-0" role="button" href="https://github.com/s-bhatia1216/pedestrian-detection" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Code</a>
</p>

A home robot that mistakes a mannequin for a person will start tracking it, estimating its pose, and trying to interact with it, over and over. In robotics and surveillance, a false "person" detection isn't just a wrong label; it triggers expensive downstream work and erodes trust in the system. We asked how well different generations of vision models avoid that mistake.

We benchmarked four detection paradigms on **PnPLO** (Person and Person-Like Objects), a dataset built to be confusing on purpose: real people mixed with statues, mannequins, and other human-shaped objects (944 training, 160 validation, and 235 test images). Instead of judging the models on accuracy alone, we focused on **robustness**: how often a person-like object gets called a person.

{% include figure.liquid loading="eager" path="assets/img/projects/pedestrian/poster.jpg" title="Project poster" class="img-fluid rounded z-depth-1" %}

<div class="caption">
  Our poster for the COS 429 poster session. Open the poster link above for the full-resolution version.
</div>

## The four models

All four share one data pipeline (the same parsing, splits, and binary person versus person-like labels), so differences in the results come from the models, not the preprocessing.

- **HOG + linear SVM (classical).** Hand-crafted histograms of edge orientations, as in Dalal and Triggs, fed to a linear SVM. We grid-searched the HOG parameters on the validation set and used it as an interpretable baseline.
- **Faster R-CNN (two-stage CNN).** A ResNet-50 FPN backbone pretrained on large-scale data, with a region proposal network and a new classification head fine-tuned on PnPLO.
- **DETR (transformer).** Treats detection as set prediction with global self-attention and Hungarian matching, with no anchor boxes or non-maximum suppression. We fine-tuned the pretrained ResNet-50 DETR from Hugging Face.
- **YOLO + SAM2 (segmentation-first).** A fine-tuned YOLOv11-nano detector proposes boxes, and each box prompts SAM2 for a pixel-precise mask. Separating "what is it" from "where exactly is it" makes it easy to see where errors come from.

## Results

| Model | Type | F1 score | False positive rate (lower is better) | mAP@0.5 |
| --- | --- | --- | --- | --- |
| HOG + SVM | Classifier | 0.748 | 0.306 | 0.790 |
| Faster R-CNN | Detector | **0.873** | 0.124 | 0.701 |
| DETR | Detector | 0.604 | 0.063 | 0.491 |
| YOLO + SAM2 | Detector | 0.773 | **0.051** | **0.848** |

<div class="caption">
  Results on the PnPLO test set. The false positive rate is the fraction of person-like objects labeled as people.
</div>

- **HOG + SVM** called almost a third of mannequins and statues people. It only sees edge patterns, so anything with a human silhouette looks human to it.
- **Faster R-CNN** had the best balance of precision and recall. Of its 39 false positives at the chosen threshold, only one was a labeled person-like object; the rest came from background clutter.
- **DETR** had the lowest mAP, struggling to match every object in crowded scenes like rows of mannequins, but one of the lowest false positive rates. When it was unsure, it tended to say "nothing here" rather than guess "person".
- **YOLO + SAM2** had the lowest false positive rate and the highest mAP. Most of its mistakes were "ghost" detections on empty background, not mannequins or statues called people.

The histograms of each model's predicted "person" probability show the same story. Where the two colors overlap, the model can't tell people and person-like objects apart.

<div class="row mt-3">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/pedestrian/hist_hog.jpg" title="HOG + SVM probabilities" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/pedestrian/hist_faster_rcnn.jpg" title="Faster R-CNN probabilities" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="row mt-3">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/pedestrian/hist_yolo_sam2.jpg" title="YOLO + SAM2 probabilities" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/pedestrian/hist_detr.jpg" title="DETR probabilities" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Predicted "person" probabilities on the test set for HOG + SVM (top left), Faster R-CNN (top right), YOLO + SAM2 (bottom left), and DETR (bottom right). HOG's two classes overlap heavily, while Faster R-CNN and DETR push them furthest apart.
</div>

## What the models see

<div class="row mt-3">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/pedestrian/sam2_person_cow.jpg" title="SAM2: person next to cows" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/pedestrian/sam2_mannequins.jpg" title="SAM2: dressed mannequins" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  YOLO + SAM2 getting it right: a clean mask on the one real person in a field, and dressed mannequins correctly labeled person-like.
</div>

<div class="row mt-3">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/pedestrian/sam2_running_mannequin.jpg" title="SAM2: running mannequin" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/pedestrian/detr_people_statues.jpg" title="DETR: people among statues" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: a mannequin in a running pose fools the detector into calling it a person, and SAM2 faithfully segments the mistake. Right: in a sculpture gallery, DETR correctly labels the two women as people and the large statue as person-like, but still calls a couple of the smaller statues in the background people (green boxes are ground truth, red are predictions).
</div>

## Takeaways

Robustness to look-alikes doesn't simply come with a bigger or newer model; it comes from the architecture's built-in assumptions. Edge-based features confuse shape with identity. Region-based CNNs filter background well but can still be fooled by realistic textures. Global attention makes DETR cautious rather than wrong. A segmentation-first pipeline draws near-perfect boundaries, but it can only be as right as the detector that prompts it.

## Limitations and next steps

- **No background class.** PnPLO has no explicit background annotations, so the detectors had to learn "nothing here" implicitly, which likely inflated false positives.
- **Limited compute.** We trained on a Google Colab student account, so Faster R-CNN and DETR got only a handful of epochs (7 and 25) and probably hadn't fully converged.
- **Next:** a systematic look at missed people (by pose, occlusion, and scale), a larger and augmented dataset, and per-class confidence thresholds tuned for deployment.

Wrangling the data took the most time: annotations arrived in several formats (Pascal VOC XML, COCO, and JSON), and each framework expected its own input sizes and normalization, so we wrote custom conversion scripts to keep a single, consistent evaluation across all four models.
