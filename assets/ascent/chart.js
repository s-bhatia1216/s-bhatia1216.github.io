/*
  Ascent star chart: the hero at 0 km.

  Seven bright stars are the seven domains. Every project (and the senior
  thesis) is a smaller body, placed between the domains it draws on and tied to
  them by hand-drawn lines, so the chart shows one connected identity instead of
  separate lists.

  - Hover or focus a body to trace its lines; hover a domain to light everything
    that draws on it. Click (or Enter) opens a notebook card beside the chart.
  - Keyboard: Tab enters the chart, arrow keys move to the nearest star in that
    direction, Enter or Space opens it, Escape clears.
  - Layout is computed once from a fixed seed, so the chart is identical on
    every visit. The only motion is a slow twinkle on the domain stars, which
    is off under prefers-reduced-motion.
  - Below 720px the chart gives way to a stacked list with domain tags that
    opens the same card.
*/

const NS = "http://www.w3.org/2000/svg";
const W = 1000;
const H = 640;

function svg(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.append(n);
  return n;
}
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function seeded(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

// ---- layout ---------------------------------------------------------------
function layout(domains, bodies) {
  const rand = seeded(1216);
  const cx = W / 2;
  const cy = H / 2 + 6;
  const pos = {};
  domains.forEach((d, i) => {
    const a = -Math.PI / 2 + (i / domains.length) * Math.PI * 2 + (rand() - 0.5) * 0.22;
    const k = 0.94 + rand() * 0.1;
    pos[d.id] = { x: cx + Math.cos(a) * 395 * k, y: cy + Math.sin(a) * 235 * k };
  });

  // Each body starts at the center of its domains, pulled inward a little.
  const pts = bodies.map((b) => {
    const ds = b.domains.filter((id) => pos[id]);
    const mx = ds.reduce((s, id) => s + pos[id].x, 0) / ds.length;
    const my = ds.reduce((s, id) => s + pos[id].y, 0) / ds.length;
    const pull = ds.length === 1 ? 0.34 : 0.12;
    const tx = mx + (cx - mx) * pull + (rand() - 0.5) * 30;
    const ty = my + (cy - my) * pull + (rand() - 0.5) * 30;
    return { b, x: tx, y: ty, tx, ty };
  });

  // Relax: springs toward each target, repulsion between bodies and from stars.
  const stars = Object.values(pos);
  for (let it = 0; it < 360; it++) {
    for (const p of pts) {
      let fx = (p.tx - p.x) * 0.04;
      let fy = (p.ty - p.y) * 0.04;
      for (const q of pts) {
        if (q === p) continue;
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d = Math.hypot(dx, dy) || 0.01;
        if (d < 74) {
          fx += (dx / d) * (74 - d) * 0.22;
          fy += (dy / d) * (74 - d) * 0.22;
        }
      }
      for (const s of stars) {
        const dx = p.x - s.x;
        const dy = p.y - s.y;
        const d = Math.hypot(dx, dy) || 0.01;
        if (d < 92) {
          fx += (dx / d) * (92 - d) * 0.3;
          fy += (dy / d) * (92 - d) * 0.3;
        }
      }
      p.x = Math.max(60, Math.min(W - 60, p.x + fx));
      p.y = Math.max(50, Math.min(H - 50, p.y + fy));
    }
  }
  return { pos, pts };
}

// A slightly bowed line, like one drawn by hand with a straightedge that slipped.
function bowed(a, b, rand) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const off = (rand() - 0.5) * Math.min(26, len * 0.12);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${(mx - (dy / len) * off).toFixed(1)} ${(my + (dx / len) * off).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

// Four-point star glyph, the way stars are drawn on a hand-made chart.
function sparkle(x, y, r) {
  const t = r * 0.18;
  return `M${x} ${y - r} L${x + t} ${y - t} L${x + r} ${y} L${x + t} ${y + t} L${x} ${y + r} L${x - t} ${y + t} L${x - r} ${y} L${x - t} ${y - t} Z`;
}

// ---- notebook card ----------------------------------------------------------
export function notebookCard(body, domainName, { compact = false } = {}) {
  const card = el("article", "nb-card");
  const meta = [body.kind || "Project", body.year || body.when, (body.domains || []).map(domainName).join(" + ")].filter(Boolean).join(" · ");
  card.append(el("p", "nb-kicker", meta));
  card.append(el(compact ? "h4" : "h3", "nb-title", body.title));
  const dl = el("dl", "nb-fields");
  for (const [k, label] of [
    ["objective", "Objective"],
    ["approach", "Approach"],
    ["result", "Result"],
    ["human", "For people"],
  ]) {
    if (!body[k]) continue;
    dl.append(el("dt", null, label));
    const dd = el("dd", k === "human" ? "nb-human" : null, body[k]);
    dl.append(dd);
  }
  card.append(dl);
  if (body.url) {
    const a = el("a", "nb-link", body.kind === "Senior thesis" ? "Read the thesis" : "Open the full project");
    a.href = body.url;
    if (body.url.endsWith(".pdf")) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    card.append(a);
  }
  return card;
}

// ---- mount ------------------------------------------------------------------
export function mountChart(host, c) {
  const domains = c.domains;
  const domainName = (id) => domains.find((d) => d.id === id)?.name || id;
  const thesis = c.research.find((r) => r.id === "thesis");
  const bodies = [
    ...(thesis ? [{ ...thesis, kind: "Senior thesis", year: 2026, url: c.baseurl + thesis.pdf }] : []),
    ...c.projects.filter((p) => p.domains && p.domains.length),
  ];
  const { pos, pts } = layout(domains, bodies);
  const rand = seeded(42);

  const wrap = el("div", "chart");
  const fig = el("figure", "chart-plate");
  const s = svg("svg", {
    viewBox: `0 0 ${W} ${H}`,
    role: "group",
    "aria-label": "Star chart. Seven domains are the bright stars; each smaller body is a project linked to the domains it draws on. Use the arrow keys to move between stars and Enter to open one.",
  });
  fig.append(s);

  // Plate furniture: border ticks, faint celestial grid, corner labels.
  const grid = svg("g", { class: "chart-grid", "aria-hidden": "true" }, s);
  const clip = svg("clipPath", { id: "chart-clip" }, svg("defs", {}, s));
  svg("rect", { x: 8, y: 8, width: W - 16, height: H - 16 }, clip);
  const sky = svg("g", { "clip-path": "url(#chart-clip)" }, grid);
  svg("rect", { x: 8, y: 8, width: W - 16, height: H - 16, class: "chart-frame" }, grid);
  for (let x = 8; x <= W - 8; x += 25) {
    const long = (x - 8) % 100 === 0;
    svg("line", { x1: x, y1: 8, x2: x, y2: 8 + (long ? 10 : 5) }, grid);
    svg("line", { x1: x, y1: H - 8, x2: x, y2: H - 8 - (long ? 10 : 5) }, grid);
  }
  for (let y = 8; y <= H - 8; y += 25) {
    const long = (y - 8) % 100 === 0;
    svg("line", { x1: 8, y1: y, x2: 8 + (long ? 10 : 5), y2: y }, grid);
    svg("line", { x1: W - 8, y1: y, x2: W - 8 - (long ? 10 : 5), y2: y }, grid);
  }
  for (const k of [0.45, 0.8, 1.15]) svg("ellipse", { cx: W / 2, cy: H / 2 + 6, rx: 395 * k, ry: 235 * k, class: "chart-dec" }, sky);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    svg("line", { x1: W / 2, y1: H / 2 + 6, x2: W / 2 + Math.cos(a) * 520, y2: H / 2 + 6 + Math.sin(a) * 340, class: "chart-ra" }, sky);
  }
  const corner = (x, y, text, anchor) => {
    const t = svg("text", { x, y, class: "chart-corner", "text-anchor": anchor }, grid);
    t.textContent = text;
  };
  corner(28, 36, "PLATE I · ONE TRAJECTORY", "start");
  corner(W - 28, H - 24, "S. BHATIA · PRINCETON · 2026", "end");

  // Lines first, so stars sit on top of them.
  const linkG = svg("g", { class: "chart-links", "aria-hidden": "true" }, s);
  const links = [];
  for (const p of pts) {
    for (const id of p.b.domains) {
      if (!pos[id]) continue;
      const path = svg("path", { d: bowed(p, pos[id], rand), class: "chart-link" }, linkG);
      links.push({ path, body: p.b.id, domain: id });
    }
  }

  const nodes = [];
  const addNode = (g, kind, id, x, y, label) => {
    g.setAttribute("tabindex", "-1");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", label);
    g.classList.add("chart-node", `chart-${kind}`);
    nodes.push({ g, kind, id, x, y });
  };

  const domG = svg("g", { class: "chart-domains" }, s);
  domains.forEach((d, i) => {
    const p = pos[d.id];
    const g = svg("g", { transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})` }, domG);
    svg("circle", { r: 22, class: "chart-hit" }, g);
    svg("path", { d: sparkle(0, 0, 15), class: "chart-glint", style: `animation-delay:${(-i * 1.37).toFixed(2)}s` }, g);
    svg("circle", { r: 4.5, class: "chart-core" }, g);
    const below = p.y > H / 2 + 6;
    const t = svg("text", { y: below ? 34 : -26, "text-anchor": "middle", class: "chart-dlabel" }, g);
    t.textContent = d.name.toUpperCase();
    const count = bodies.filter((b) => b.domains.includes(d.id)).length;
    addNode(g, "domain", d.id, p.x, p.y, `${d.name}: ${count} linked ${count === 1 ? "body" : "bodies"}`);
  });

  const bodyG = svg("g", { class: "chart-bodies" }, s);
  for (const p of pts) {
    const g = svg("g", { transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})` }, bodyG);
    svg("circle", { r: 14, class: "chart-hit" }, g);
    svg("circle", { r: p.b.kind === "Senior thesis" ? 9 : 7, class: "chart-ring" }, g);
    svg("circle", { r: p.b.kind === "Senior thesis" ? 4.6 : 3.6, class: "chart-dot" }, g);
    addNode(g, "body", p.b.id, p.x, p.y, `${p.b.title}. Draws on ${p.b.domains.map(domainName).join(", ")}.`);
  }

  // Floating label for the body under the pointer or focus.
  const tag = svg("g", { class: "chart-tag", "aria-hidden": "true" }, s);
  const tagBg = svg("rect", { rx: 3, height: 26 }, tag);
  const tagText = svg("text", { y: 17 }, tag);

  const card = el("div", "chart-card");
  card.setAttribute("aria-live", "polite");
  const intro = () => {
    card.replaceChildren();
    card.append(el("p", "nb-kicker", "Reading the chart"));
    card.append(el("p", "chart-howto", `${domains.length} bright stars are the domains I work across. The ${bodies.length} smaller bodies are projects and research, tied to every domain they draw on. Point at one to trace its lines, or open it for the notebook entry.`));
  };
  intro();

  // Mobile fallback: a stacked list with domain tags.
  const list = el("ol", "chart-list");
  for (const b of bodies) {
    const li = el("li");
    const btn = el("button", "chart-list-btn");
    btn.type = "button";
    btn.append(el("span", "chart-list-title", b.title));
    const tags = el("span", "chart-list-tags");
    b.domains.forEach((id) => tags.append(el("span", "chart-tag-pill", domainName(id))));
    btn.append(tags);
    btn.addEventListener("click", () => {
      select("body", b.id);
      card.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    li.append(btn);
    list.append(li);
  }

  wrap.append(fig, card, list);
  host.append(wrap);

  // ---- highlight + select -----------------------------------------------
  let hovered = null;
  let selected = null;
  function light(target) {
    const t = target || selected;
    s.classList.toggle("is-tracing", !!t);
    const litBodies = new Set();
    const litDomains = new Set();
    if (t?.kind === "body") {
      litBodies.add(t.id);
      bodies.find((b) => b.id === t.id).domains.forEach((d) => litDomains.add(d));
    } else if (t?.kind === "domain") {
      litDomains.add(t.id);
      bodies.filter((b) => b.domains.includes(t.id)).forEach((b) => litBodies.add(b.id));
    }
    for (const l of links) l.path.classList.toggle("is-lit", litBodies.has(l.body) && litDomains.has(l.domain));
    for (const n of nodes) n.g.classList.toggle("is-lit", n.kind === "body" ? litBodies.has(n.id) : litDomains.has(n.id));
    for (const n of nodes) n.g.classList.toggle("is-selected", !!selected && n.kind === selected.kind && n.id === selected.id);
    // Label the traced body.
    if (t?.kind === "body") {
      const n = nodes.find((x) => x.kind === "body" && x.id === t.id);
      tagText.textContent = bodies.find((b) => b.id === t.id).title;
      const tw = Math.min(tagText.getComputedTextLength() + 20, W - 24);
      const x = Math.max(12, Math.min(W - tw - 12, n.x - tw / 2));
      const y = n.y > 80 ? n.y - 44 : n.y + 18;
      tag.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      tagBg.setAttribute("width", tw.toFixed(1));
      tagText.setAttribute("x", "10");
      tag.classList.add("is-on");
    } else tag.classList.remove("is-on");
  }

  function select(kind, id) {
    selected = { kind, id };
    card.replaceChildren();
    if (kind === "body") {
      card.append(notebookCard(bodies.find((b) => b.id === id), domainName));
    } else {
      const d = domains.find((x) => x.id === id);
      card.append(el("p", "nb-kicker", "Domain"));
      card.append(el("h3", "nb-title", d.name));
      const ul = el("ul", "chart-domain-list");
      for (const b of bodies.filter((x) => x.domains.includes(id))) {
        const li = el("li");
        const btn = el("button", "chart-domain-btn", b.title);
        btn.type = "button";
        btn.addEventListener("click", () => {
          select("body", b.id);
          focusNode(nodes.find((n) => n.kind === "body" && n.id === b.id), false);
        });
        li.append(btn);
        ul.append(li);
      }
      card.append(ul);
    }
    light(hovered);
  }

  // ---- pointer ----------------------------------------------------------------
  for (const n of nodes) {
    n.g.addEventListener("pointerenter", () => {
      hovered = n;
      light(n);
    });
    n.g.addEventListener("pointerleave", () => {
      hovered = null;
      light(null);
    });
    n.g.addEventListener("click", () => {
      focusNode(n, false);
      select(n.kind, n.id);
    });
    n.g.addEventListener("focus", () => {
      hovered = n;
      light(n);
    });
    n.g.addEventListener("blur", () => {
      hovered = null;
      light(null);
    });
  }

  // ---- keyboard: one tab stop, arrows move by direction -------------------
  let current = nodes.find((n) => n.kind === "domain");
  current.g.setAttribute("tabindex", "0");
  function focusNode(n, doFocus = true) {
    if (!n) return;
    current.g.setAttribute("tabindex", "-1");
    current = n;
    n.g.setAttribute("tabindex", "0");
    if (doFocus) n.g.focus();
  }
  const DIRS = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
  s.addEventListener("keydown", (e) => {
    const dir = DIRS[e.key];
    if (dir) {
      e.preventDefault();
      let best = null;
      let bestScore = Infinity;
      for (const n of nodes) {
        if (n === current) continue;
        const dx = n.x - current.x;
        const dy = n.y - current.y;
        const along = dx * dir[0] + dy * dir[1];
        if (along <= 4) continue;
        const across = Math.abs(dx * dir[1] - dy * dir[0]);
        const score = along + across * 2.2;
        if (score < bestScore) {
          bestScore = score;
          best = n;
        }
      }
      focusNode(best);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(current.kind, current.id);
    } else if (e.key === "Escape") {
      selected = null;
      intro();
      light(hovered);
    }
  });
}
