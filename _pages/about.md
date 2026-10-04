---
layout: about
title: about
permalink: /
subtitle: <a href='https://mae.princeton.edu/'>Mechanical & Aerospace Engineering</a> at <a href='https://www.princeton.edu/'>Princeton University</a>. Minors in <a href='https://www.cs.princeton.edu/'>Computer Science</a> and <a href='https://robo.princeton.edu'>Robotics</a>.

profile:
  align: right
  image: sonal_profile.jpg
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>Princeton, NJ</p>
    <p>School & Research: <a href="mailto:sb7264@princeton.edu">sb7264@princeton.edu</a></p>
    <p>Everything Else: <a href="mailto:sbhatia1216@gmail.com">sbhatia1216@gmail.com</a></p>

selected_papers: true # lists entries marked selected={true} in _bibliography/papers.bib
social: true # includes social icons at the bottom of the page

announcements:
  enabled: false # rendered in the page body instead, so the heading can read "updates"
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
---

I'm a Mechanical & Aerospace Engineering undergraduate at Princeton University (B.S.E. expected January 2027), minoring in Computer Science and Robotics. My work sits at the intersection of control theory, machine learning, and hardware: getting robots and learned controllers to behave safely in uncertain, chaotic systems, and making the models behind them run fast on real silicon.

This fall I joined [Prof. Radhika Nagpal](https://www.radhikanagpal.org/)'s [Self-Organizing Swarms & Robotics (SSR) Lab](https://ssr.princeton.edu/), where I'm building the ZeroG flight-approved version of the Tumblenauts, a swarm of tiny microgravity inspection robots, and developing vision-based collision safety for them. I'm also working with [Prof. Ryne Beeson](https://mae.princeton.edu/people/faculty/beeson)'s [Beeson Group](https://beeson.princeton.edu/) on physics-informed neural networks for initializing tropical cyclone forecasts.

In industry, I've spent two internships at Apple on AI performance: profiling ML inference on next-generation Apple Silicon in Cupertino, and building an on-device 3D generative pipeline and model quantization toolkit in Beaverton. Before that I built C++ graphics software at Johns Hopkins APL, Bayesian models at Estée Lauder, and CubeSat orbit designs for an ESA-reviewed mission at EMTech Space in Athens.

On the research side, my senior thesis with Prof. Beeson built an imitation-learning framework for particle-filter control in chaotic systems, cutting error by 77% on Lorenz-63 and scaling to Lorenz-96 without architectural changes.

I also love teaching. I've been a course assistant for Princeton's Linear Systems and Intro to Computer Science courses, supporting 250+ students across three semesters, and I taught build workshops as co-president of the Princeton Rocketry Club. More on my [teaching]({{ '/teaching/' | relative_url }}) page.

Outside of that: rockets, hackathons, and building computers from scratch.

<h2><a href="{{ '/news/' | relative_url }}" style="color: inherit">updates</a></h2>
{% include news.liquid limit=true %}
