---
layout: page
title: "NeuroBoost"
description: "A smartwatch concept that estimates cognitive state from wrist biosensors"
importance: 3
category: ml
---

**Mar to May 2024** &nbsp;|&nbsp; PSY 409 (Cyborg Psychology) product design &nbsp;|&nbsp; _ML system design, UI/UX wireframing, wearable hardware_

With Alecia Barbieri, Ammon Love, Heidi Temple, Ian Fridman, Isa Kessinger, and Kazuki Tojo

<p>
  <a class="btn btn-sm z-depth-0" role="button" href="{{ '/assets/pdf/projects/neuroboost_paper.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-file-pdf"></i> Final paper</a>
</p>

Brain activity is usually measured with EEG: a cap of electrodes on the scalp that nobody wears to work. But research has shown that signals you can pick up at the wrist, especially skin conductance (EDA), correlate with what an EEG would show. NeuroBoost is our design for a smartwatch that takes advantage of that: it pairs EDA with the ECG, PPG, and accelerometer sensors found in today's watches, uses machine learning to project EEG-like estimates of a user's cognitive state, and turns them into everyday suggestions for managing stress and focus.

It was a semester-long product design project for a seminar on cyborg psychology, pitched to the class as a startup. The team built a 3D-printed prototype and a full circuit board design, designed the machine learning approach and the app, and planned the clinical trials needed to validate it.

## How it works

{% include figure.liquid loading="eager" path="assets/img/projects/neuroboost/tech_interface.jpg" title="NeuroBoost technological interface" class="img-fluid rounded z-depth-1" %}

<div class="caption">
  The technological interface I designed: the watch's sensors feed machine learning models that project EEG-like readings, which are refined into patterns and surfaced in the app and website. Daily user input closes the loop.
</div>

- **Sense.** The watch carries four sensor types: EDA (skin conductance, from two electrodes about 4 cm apart, one under the watch body and one in the strap), ECG, PPG (heart rate and blood oxygen), and an accelerometer.
- **Model.** A combination of convolutional and recurrent neural networks. The CNN extracts features from the sensor streams and projects them into an EEG-like representation; the RNN models how those signals change over time and adapts its predictions to each user.
- **Personalize.** Each day the user logs their activities and how they feel. That feedback refines the model, so predictions become more personal over time.
- **Act.** The app and website show cognitive and stress trends and offer concrete suggestions, like a break, a breathing exercise, or a change in study strategy.

## The app and website

I designed the wireframes for the two places users would see their data. The website gives the in-depth view: detailed charts of cognitive states over time, paired with explanations of what the data means. The mobile app is built for quick check-ins during the day, with a daily summary and timely tips, like what to do when you're stressed before a presentation.

<div class="row mt-3">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/neuroboost/wireframe_website.jpg" title="Website dashboard wireframe" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/neuroboost/wireframe_mobile.jpg" title="Mobile app wireframe" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Wireframes for the website dashboard (left) and mobile app (right), each showing "Today's Insights" with trends and personalized suggestions.
</div>

## The hardware

Kazuki led the watch's CAD design over two 3D-printed iterations, slimming the body around a 40 x 35 mm board. Alecia designed the printed circuit board, extending an open-source smartwatch design with a front-end amplifier for biometric signals, a PPG/ECG sensor, an interface for the EDA electrodes, and the extra power management they needed, and routed the board from scratch. Isa worked with both of them to integrate the sensors.

<div class="row mt-3">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/neuroboost/watch_front.jpg" title="Watch prototype, front" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/neuroboost/watch_back.jpg" title="Watch prototype, back with EDA electrodes" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/neuroboost/watch_pcb_inside.jpg" title="Watch with circuit board inside" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  The final watch design: front, back (with the EDA electrodes), and the circuit board seated inside the body.
</div>

## Validating it

Claiming that a watch can stand in for an EEG needs serious evidence, so the team (led by Ian) designed a study to collect it. 1,000 participants would each attend two sessions: one wearing NeuroBoost alongside EEG and eye tracking, and one in an fMRI scanner. In each session they would complete tasks chosen to engage different brain regions: watching a movie, a scene recognition test, free recall, an emotional autobiographical interview, timed arithmetic under pressure, and multitasking through an inbox. Lining up the wrist signals with the brain data from these tasks would provide the training data for the models and the evidence for (or against) the correlation.

## What I'd be careful about

- **The core assumption needs proof.** Everything rests on wrist signals tracking brain activity closely enough to be useful for each individual user. Published correlations are encouraging, but the projected EEG may not be accurate enough, and a real EEG would still give more detail.
- **Sensor placement.** Some studies suggest EDA reads better from the fingers or feet than the wrist, which points toward add-on sensors like a ring.
- **Privacy.** Data about someone's mental state is especially sensitive, so encryption, consent, and user control over sharing were built into the software plan from the start.

## My role

I designed the overall technological interface, researched and selected the machine learning approach, designed the app and website wireframes, and planned the usability and model validation testing. For the paper, I also wrote the abstract, objectives, software development, software results, and discussion sections, and co-wrote the conclusion. Teammates led the CAD prototype, circuit board, sensor integration, experimental trials, market analysis, and the pitch infomercial.
