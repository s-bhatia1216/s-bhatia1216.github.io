---
layout: about
title: about
permalink: /
subtitle: Mechanical & Aerospace Engineering at <a href='https://www.princeton.edu/'>Princeton University</a>. Minors in Computer Science and Robotics.

profile:
  align: right
  image: sonal_profile.jpg
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>Princeton, NJ</p>

selected_papers: true # lists entries marked selected={true} in _bibliography/papers.bib
social: true # includes social icons at the bottom of the page

announcements:
  enabled: false # rendered in the page body instead, so the heading can read "updates"
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
---

I'm a senior at Princeton studying Mechanical & Aerospace Engineering, with minors in Computer Science and Robotics. I work at the intersection of control theory, machine learning, and hardware, and I'm drawn to problems that refuse to stay inside one discipline: a filtering problem that turns out to be a learning problem, or a model that only matters once it runs fast on real silicon.

At my core, I'm a problem-solver who likes being deployed where the work actually happens. I want to sit close to the people and systems with the problem, find the constraint that really matters, whether that's a latency target, a power budget, or a robot tumbling with no gravity to lean on, and then build whatever it takes to get past it, from the math to the code to the hardware.

Right now I'm building microgravity inspection robots in Prof. Radhika Nagpal's lab and working on physics-informed neural networks with Prof. Ryne Beeson. Before that, I spent two internships at Apple on AI performance. More in my [CV]({{ '/cv/' | relative_url }}).

<h2><a href="{{ '/news/' | relative_url }}" style="color: inherit">updates</a></h2>
{% include news.liquid limit=true %}
