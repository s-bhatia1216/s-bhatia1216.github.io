---
layout: page
title: "RISC-V Processor Simulator"
description: "Functional and cycle-accurate pipelined RV64I simulator with caches"
importance: 1
category: systems
---

**Sep – Dec 2025** &nbsp;|&nbsp; _C++, RV64I, Pipeline Architecture, Cache Simulation_

- Built a functional simulator executing the full RV64I ISA across explicit stages (fetch, decode, operand collection, next-PC resolution, ALU, address generation, memory access, write-back), validated with 25+ handwritten assembly tests.
- Extended it into a cycle-accurate 5-stage pipeline (IF/ID/EX/MEM/WB) with EX→ID and MEM→ID forwarding to resolve data hazards without unnecessary stalls.
- Implemented load-use and load-branch hazard detection with bubble insertion, plus branch hazard stall logic.
- Designed configurable split I- and D-caches (size, block size, associativity with LRU, miss latency) with cycle-accurate stall propagation and exception redirection to a hardware handler.
