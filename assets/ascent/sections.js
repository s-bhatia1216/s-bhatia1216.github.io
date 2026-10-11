/*
  Ascent sections above the pad, one renderer per altitude:

    12 km   Flight notebook   every project as a notebook entry (Objective,
                              Approach, Result, For people), filterable by
                              domain, plus the systems pipeline
    50 km   Research          the thesis and junior papers as entries, with the
                              Lorenz figure that draws itself once
    85 km   Crews and patches embroidered patches with short stories and a flight
                              log, on archival paper
    100 km  Star catalog      publications and honors as catalog tiles that
                              expand in place
    400 km  Curiosities       questions I'm chasing (placeholders stay hidden)
                              and the orbit toy
    Downlink Contact          addresses, links, and the resume PDF

  Everything is plain, semantic HTML built from content.json; the only
  graphics are the Lorenz SVG, the patches, and the orbit canvas.
*/

// Figure builders (Lorenz, patches, orbit toy, pipeline) are passed in by
// ascent.js, which imports every module with the same version stamp.
let lorenzFigure, patchSVG, orbitToy, pipelineFigure;

const isTodo = (s) => !s || /^\s*TODO/i.test(String(s));

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function link(href, text, cls) {
  const a = el("a", cls, text);
  a.href = href;
  if (/\.pdf$/i.test(href) || /^https?:/.test(href)) {
    a.target = "_blank";
    a.rel = "noopener";
  }
  return a;
}
const intro = (text) => el("p", "ascent-p", text);

// ---- 12 km: flight notebook ------------------------------------------------
function notebook(host, c, domainName) {
  host.append(intro("Every project as a notebook entry: what I set out to do, how, what happened, and who it is for. Filter by domain to see how they connect."));

  const SHOWN = 6;
  const filters = el("div", "nb-filters");
  filters.setAttribute("role", "group");
  filters.setAttribute("aria-label", "Filter entries by domain");
  const chips = [{ id: "all", name: "All" }, ...c.domains].map((d) => {
    const b = el("button", "nb-chip", d.name);
    b.type = "button";
    b.dataset.domain = d.id;
    b.setAttribute("aria-pressed", String(d.id === "all"));
    filters.append(b);
    return b;
  });

  const sheet = el("div", "nb-sheet");
  const log = el("ol", "nb-log");
  const entries = c.projects.map((p, i) => {
    const li = el("li", "nb-entry");
    li.dataset.domains = (p.domains || []).join(" ");
    const meta = el("div", "nb-meta");
    meta.append(el("span", "nb-no", `Entry ${String(i + 1).padStart(2, "0")}`), el("span", null, String(p.year || "")));
    const tags = el("span", "nb-tags");
    (p.domains || []).forEach((d) => tags.append(el("span", "nb-tag", domainName(d))));
    meta.append(tags);
    const body = el("div", "nb-body");
    body.append(el("h3", "nb-title", p.title));
    const dl = el("dl", "nb-fields");
    for (const [k, label] of [
      ["objective", "Objective"],
      ["approach", "Approach"],
      ["result", "Result"],
      ["human", "For people"],
    ]) {
      if (isTodo(p[k])) continue;
      dl.append(el("dt", null, label), el("dd", k === "human" ? "nb-human" : null, p[k]));
    }
    body.append(dl, link(p.url, "Open the full project", "nb-link"));
    li.append(meta, body);
    log.append(li);
    return li;
  });
  sheet.append(log);

  const more = el("button", "nb-more");
  more.type = "button";
  more.setAttribute("aria-expanded", "false");
  let expanded = false;
  let active = "all";
  const apply = () => {
    let shown = 0;
    entries.forEach((li) => {
      const match = active === "all" || li.dataset.domains.split(" ").includes(active);
      const visible = match && (expanded || active !== "all" || shown < SHOWN);
      if (match && visible) shown++;
      li.hidden = !visible;
    });
    more.hidden = active !== "all";
    more.textContent = expanded ? "Show fewer entries" : `Show all ${entries.length} entries`;
    more.setAttribute("aria-expanded", String(expanded));
  };
  chips.forEach((b) =>
    b.addEventListener("click", () => {
      active = b.dataset.domain;
      chips.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      apply();
    }),
  );
  more.addEventListener("click", () => {
    expanded = !expanded;
    apply();
  });
  apply();
  host.append(filters, sheet, more);

  if (c.pipeline?.length) {
    const sys = el("div", "nb-systems");
    sys.append(el("h3", "ascent-h3", "Systems work, one cycle at a time"), pipelineFigure(c.pipeline));
    host.append(sys);
  }
}

// ---- 50 km: research --------------------------------------------------------
function research(host, c, domainName) {
  host.append(intro("Learning to steer particle filters through chaotic systems, under Prof. Ryne Beeson."));
  const grid = el("div", "rs-grid");
  grid.append(lorenzFigure());

  const thesis = c.research.find((r) => r.id === "thesis");
  const side = el("div", "rs-side");
  if (thesis) {
    const card = el("article", "nb-card rs-thesis");
    card.append(el("p", "nb-kicker", `${thesis.kind} · ${thesis.when} · ${thesis.pages} pages`), el("h3", "nb-title", thesis.title));
    const dl = el("dl", "nb-fields");
    for (const [k, label] of [
      ["objective", "Objective"],
      ["approach", "Approach"],
      ["result", "Result"],
      ["human", "For people"],
    ])
      if (!isTodo(thesis[k])) dl.append(el("dt", null, label), el("dd", k === "human" ? "nb-human" : null, thesis[k]));
    card.append(dl);
    if (thesis.pdf) card.append(link(c.baseurl + thesis.pdf, "Read the thesis (PDF)", "nb-link"));
    side.append(card);
  }
  grid.append(side);
  host.append(grid);

  const more = el("div", "rs-more");
  const papers = el("ul", "rs-list");
  for (const r of c.research.filter((x) => x.id !== "thesis")) {
    const li = el("li");
    li.append(el("p", "nb-kicker", `${r.kind} · ${r.when} · ${r.pages} pages`), el("p", "rs-title", r.title));
    if (!isTodo(r.result)) li.append(el("p", "rs-note", r.result));
    papers.append(li);
  }
  const now = el("ul", "rs-list");
  for (const w of c.current || []) {
    const li = el("li");
    li.append(el("p", "rs-title", w.name), el("p", "rs-note", w.detail));
    now.append(li);
  }
  const col = (title, list) => {
    const d = el("div");
    d.append(el("h3", "ascent-h3", title), list);
    return d;
  };
  more.append(col("Junior independent work", papers), col("In progress", now));
  host.append(more, link(`${c.baseurl}/research/`, "All research on the professional site", "nb-link"));
}

// ---- 85 km: crews and patches -------------------------------------------------
function people(host, c) {
  host.append(intro("The teams I've led, organized, and taught, each with a patch of its own."));
  const paper = el("div", "pp-paper");
  const grid = el("div", "pp-grid");
  for (const p of c.patches) {
    const art = el("article", "pp-crew");
    const patch = el("div", "pp-patch");
    patch.innerHTML = patchSVG(p);
    const text = el("div", "pp-text");
    text.append(el("p", "pp-type", `${p.role} · ${p.when}`), el("h3", "pp-name", p.name), el("p", "pp-story", p.story));
    if (p.link) text.append(link(c.baseurl + p.link, "More", "nb-link"));
    art.append(patch, text);
    grid.append(art);
  }
  paper.append(grid);

  const logWrap = el("div", "pp-logwrap");
  logWrap.append(el("h3", "pp-type pp-loghead", "Flight log"));
  const log = el("ol", "pp-log");
  // Most recent first; ascent.yml keeps the log in time order.
  for (const f of [...c.flightlog].reverse()) {
    const li = el("li");
    li.append(el("span", "pp-when", f.when));
    const t = el("div");
    t.append(el("p", "pp-role", `${f.org}, ${f.role}`), el("p", "pp-note", f.note));
    li.append(t);
    log.append(li);
  }
  logWrap.append(log);
  paper.append(logWrap);
  host.append(paper);
}

// ---- 100 km: star catalog -------------------------------------------------------
function catalog(host, c) {
  host.append(intro("Publications and honors, cataloged like the stars that just came out. Open any entry for details."));
  const items = [
    ...c.research.map((r, i) => ({
      des: `SB ${String(r.when).slice(-4)}-P${i + 1}`,
      year: String(r.when).slice(-4),
      name: r.title,
      kind: r.kind,
      lines: [`Advisor: ${r.advisor}`, `${r.pages} pages`, isTodo(r.result) ? "" : r.result].filter(Boolean),
      href: r.pdf ? c.baseurl + r.pdf : null,
    })),
    ...c.honors.map((h, i) => ({
      des: `SB ${h.when}-H${i + 1}`,
      year: String(h.when),
      name: h.name,
      kind: "Honor",
      lines: [h.detail].filter(Boolean),
    })),
  ];
  const grid = el("ul", "ct-grid");
  items.forEach((it, i) => {
    const li = el("li", "ct-tile");
    const btn = el("button", "ct-btn");
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    const id = `ct-detail-${i}`;
    btn.setAttribute("aria-controls", id);
    btn.append(el("span", "ct-des", it.des), el("span", "ct-name", it.name), el("span", "ct-kind", `${it.kind} · ${it.year}`));
    const detail = el("div", "ct-detail");
    detail.id = id;
    detail.hidden = true;
    it.lines.forEach((l) => detail.append(el("p", null, l)));
    if (it.href) detail.append(link(it.href, "Read the PDF", "nb-link"));
    if (!detail.childNodes.length) detail.append(el("p", null, it.kind));
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      detail.hidden = !open;
      li.classList.toggle("is-open", open);
    });
    li.append(btn, detail);
    grid.append(li);
  });
  host.append(grid);
}

// ---- 400 km: curiosities ------------------------------------------------------------
function curiosities(host, c) {
  const qs = (c.curiosities || []).filter((q) => !isTodo(q.question));
  host.append(intro(c.offduty || ""));
  if (qs.length) {
    const list = el("ol", "cu-list");
    for (const q of qs) {
      const li = el("li");
      li.append(el("p", "cu-q", q.question));
      if (!isTodo(q.note)) li.append(el("p", "cu-note", q.note));
      list.append(li);
    }
    host.append(el("h3", "ascent-h3", "Questions I'm chasing"), list);
  }
  const toy = el("div", "cu-toy");
  toy.append(el("h3", "ascent-h3", "Put something in orbit"), el("p", "cu-note", "Drag from the spacecraft to set its speed and direction, then let go. Too slow and it falls back; fast enough and it escapes."), orbitToy());
  host.append(toy);
}

// ---- Downlink: contact ---------------------------------------------------------------
function contact(host, c) {
  host.append(intro("Mission complete. Say hello on whichever channel suits you."));
  const grid = el("div", "dl-grid");
  const mail = el("div", "dl-col");
  for (const e of c.contact.emails) {
    const p = el("p", "dl-item");
    p.append(el("span", "nb-kicker", e.label), link(`mailto:${e.address}`, e.address, "dl-addr"));
    mail.append(p);
  }
  const links = el("div", "dl-col");
  for (const l of c.contact.links) {
    const p = el("p", "dl-item");
    p.append(el("span", "nb-kicker", l.label), link(l.url, l.url.replace(/^https?:\/\/(www\.)?/, ""), "dl-addr"));
    links.append(p);
  }
  const res = el("div", "dl-col");
  const a = link(c.baseurl + c.contact.resume, "Download my resume (PDF)", "dl-resume");
  a.setAttribute("download", "");
  res.append(a, el("p", "dl-back", "Pull the tag at the top to return to the professional site."));
  grid.append(mail, links, res);
  host.append(grid);
}

const RENDER = { projects: notebook, research, people, catalog, curiosities, contact };

export function mountSections(bands, c, figures) {
  ({ lorenzFigure, patchSVG, orbitToy, pipelineFigure } = figures);
  const domainName = (id) => c.domains.find((d) => d.id === id)?.name || id;
  for (const b of bands) {
    if (!RENDER[b.id] || !b.body) continue;
    RENDER[b.id](b.body, c, domainName);
  }
}
