---
layout: page
title: "GPU Acceleration of Shap-E on Apple Silicon"
description: "PR to OpenAI's Shap-E: 4+ hours → under 4 minutes"
importance: 2
category: systems
---

**Mar – Jul 2025** &nbsp;|&nbsp; _Python, PyTorch MPS, Metal Performance Shaders_

- Filed a pull request to OpenAI's Shap-E repository enabling native GPU acceleration on Apple Silicon, reducing image-to-3D inference from 4+ hours to under 4 minutes.
- Rewrote low-level tensor indexing logic for GPU-parallel execution without breaking CUDA or CPU compatibility.
- Validated functional parity across CUDA and MPS by analyzing 3D mesh outputs from 25+ diffusion sampling runs, confirming no regression in generation quality.
