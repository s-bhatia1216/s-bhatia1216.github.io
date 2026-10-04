---
layout: page
title: "MATRIX Heliophysics Mission"
description: "Project manager for an 8-spacecraft MIDEX-class constellation design"
importance: 2
category: space
---

**Jan to May 2026** &nbsp;|&nbsp; MAE 342 (Space System Design) &nbsp;|&nbsp; _Systems engineering, mission operations, flight software_

Project manager for the 16-person Magnetotail Systems Laboratory team

<p>
  <a class="btn btn-sm z-depth-0" role="button" href="{{ '/assets/pdf/projects/matrix_fdr_slides.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-person-chalkboard"></i> Final Design Review slides</a>
  <a class="btn btn-sm z-depth-0" role="button" href="{{ '/assets/pdf/projects/matrix_fdr_report.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-file-pdf"></i> Final Design Report</a>
</p>

<div class="row">
  <div class="col-sm-8">
    <p>
      When the solar wind stretches Earth's magnetic field into a long tail on the night side, energy builds up there and is released in fast, short-lived jets of plasma called <strong>Bursty Bulk Flows</strong>. They slow down and dump their energy in the <em>transition region</em>, about 6 to 12 Earth radii behind the planet, and that energy drives the geomagnetic storms that can disrupt GPS, communications satellites, and radio on the ground. NASA's current fleet barely covers this region.
    </p>
    <p>
      MATRIX (the MAgnetotail Transition Region In-situ eXplorer) is our full design for a NASA MIDEX-class mission to fill that gap, built to a $350M cost cap. Over a semester our 16-person team took it from requirements through a Final Design Review, which we also presented to engineers at the Johns Hopkins Applied Physics Laboratory.
    </p>
  </div>
  <div class="col-sm-4">
    {% include figure.liquid loading="eager" path="assets/img/projects/matrix/mission_patch.jpg" title="MATRIX mission patch" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

## The mission

- **Eight identical spacecraft in three groups.** Groups of 2, 4, and 2 satellites fly orbits with apogees at 7, 9, and 12 Earth radii, spaced so the constellation measures the transition region continuously and at multiple points at once.
- **Spin-stabilized at 15 rpm.** Each spacecraft is a hexagonal prism with solar panels on one face that always points at the Sun. The spin, combined with the instruments' fields of view, lets every spacecraft survey the magnetotail continuously.
- **Three science instruments.** A boom-mounted magnetometer, an electrostatic analyzer, and an energetic particle detector measure the magnetic field and plasma, with a high-rate burst mode for capturing flows as they happen.
- **Autonomous operations.** Each spacecraft collects science around its whole orbit, downlinks during a one-hour window around perigee, and stores more than a month of data onboard in case a pass is missed, switching between operating modes on its own.
- **Launch and lifetime.** The whole constellation launches together in February 2033 and operates for at least six years before a controlled deorbit.

{% include figure.liquid path="assets/img/projects/matrix/conops_science.jpg" title="Concept of operations: nominal science" class="img-fluid rounded z-depth-1" %}

<div class="caption">
  Concept of operations during nominal science, with the three orbit groups threading the magnetotail.
</div>

{% include figure.liquid path="assets/img/projects/matrix/spacecraft_structure.jpg" title="Spacecraft structural design" class="img-fluid rounded z-depth-1" %}

<div class="caption">
  The spacecraft: a hexagonal, spin-stabilized bus around a load-bearing central thrust tube, with an articulating magnetometer boom and hydrazine propulsion.
</div>

## Leading the team

As project manager I coordinated sixteen people across eight subsystems (guidance and navigation, attitude control, structures, thermal, propulsion and launch, power, communications and data handling, and operations and payload). I ran the weekly cross-subsystem meetings, built and maintained the Gantt chart and task tracker from the first team report onward, tracked owners against the schedule, and kept the mission's mass, power, data, and cost margins reconciled so the design stayed consistent as every subsystem iterated. When subsystems' requirements collided, I worked through the conflicts with the teams involved and documented how each was resolved.

I also built the mission's **cost budget**. A bottom-up rollup across all subsystems showed every one within its allocation, and identified operations and payload as the binding cost driver at just 5.78% margin, which is where the team focused its cost discipline.

{% include figure.liquid path="assets/img/projects/matrix/cost_compliance.jpg" title="Cost budget compliance" class="img-fluid rounded z-depth-1" %}

## Operations: from pre-launch to disposal

I designed the operations framework for the entire mission: fourteen phases spanning twelve years, from integration and test through launch, deployment, commissioning, six years of science, and end-of-life disposal.

<div class="row mt-3">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/matrix/mission_phases.jpg" title="Mission operational phases" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/matrix/prelaunch_timeline.jpg" title="Pre-launch timeline" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: the fourteen mission phases from 2026 to 2038. Right: the pre-launch schedule, back-planned from the February 2033 launch window.
</div>

I also defined every spacecraft operating mode (startup, commissioning, nominal science, eclipse, maneuver, safe, and end of life) with step-by-step procedures for what triggers each one, what the spacecraft does, and how it recovers.

{% include figure.liquid path="assets/img/projects/matrix/spacecraft_modes.jpg" title="Spacecraft modes and procedures" class="img-fluid rounded z-depth-1" %}

## Flight software and integration

On the communications and data handling side, I led the flight software and its integration with every subsystem. I ran the trade study between NASA's Core Flight System (cFS), RTEMS, and VxWorks. All three offer a real-time scheduler, but only cFS comes with an inter-application messaging bus, health monitoring, and telemetry routing already flight-proven on more than 40 missions, so we selected it and mapped its core services onto MATRIX's functions. I also verified that every subsystem's hardware could talk to the flight computer over its RS-422 interfaces, and mapped how the flight software moves between modes.

<div class="row mt-3">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/matrix/flight_computer_dataflow.jpg" title="Flight computer and subsystem data flow" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/matrix/flight_computer_modes.jpg" title="Flight computer modes" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: how every subsystem connects through the flight computer down to the ground. Right: the flight computer's modes and the transitions between them.
</div>

The rest of the design, from the orbit and attitude control to structures, thermal, propulsion, and power, was led by my teammates in the Magnetotail Systems Laboratory.
