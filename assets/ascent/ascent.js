/*
  Ascent: creative mode entry point (ES module).

  switch.js imports this the first time creative mode turns on. It owns the
  crossfade between modes:
    enter() builds a full-screen view (#ascent-root) over the professional page,
      loads fonts, styles, and content.json, fades the view in, and makes the
      page underneath inert so keyboard and screen-reader focus stay in the view.
    exit() fades the view out and gives the page back exactly as it was.
  The professional page's DOM is never edited, only covered, so leaving creative
  mode restores it byte for byte.

  sky.js turns scrolling into the climb (sky color, contrast, starfield, and the
  altimeter); chart.js draws the star chart at 0 km.
*/

let root = null;
let sky = null;
let content = null;
let inerted = [];
let prevFocus = null;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FADE_MS = 450;

function once(base, v) {
  // Fonts and styles load once, only in creative mode.
  if (!document.querySelector("link[data-ascent-fonts]")) {
    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Spectral:ital,wght@0,400;0,500;1,400&family=Martian+Mono:wght@400;500&display=swap";
    fonts.dataset.ascentFonts = "";
    document.head.append(fonts);
  }
  if (!document.querySelector("link[data-ascent-css]")) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${base}/assets/ascent/ascent.css?v=${v}`;
    css.dataset.ascentCss = "";
    document.head.append(css);
    return new Promise((res) => {
      css.onload = res;
      css.onerror = res;
    });
  }
}

export async function getContent(base, v) {
  if (!content) {
    const r = await fetch(`${base}/assets/ascent/content.json?v=${v}`);
    if (!r.ok) throw new Error(`content.json ${r.status}`);
    content = await r.json();
  }
  return content;
}

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

// Sky color and altitude (km) at the top of each section, pad to downlink.
const SKY = {
  pad: ["#fbcd9e", 0, "#f4c6c4"],
  projects: ["#a8cef0", 12],
  research: ["#3f7fc4", 50],
  people: ["#3a2e79", 85],
  catalog: ["#140f2e", 100],
  curiosities: ["#05060c", 400],
  contact: ["#05060c", 400],
};

// The view: a slim header (name, section links, altimeter) and one section per
// altitude. Milestone 3 fills the pad with the star chart; the other sections
// are still placeholders that say what will live there.
function render(c) {
  const frag = document.createDocumentFragment();

  const head = el("header", "ascent-head");
  const home = el("a", "ascent-home", c.intro.name);
  home.href = "#ascent-pad";
  const nav = el("nav", "ascent-nav");
  nav.setAttribute("aria-label", "Creative mode sections");
  for (const s of c.sections) {
    if (s.id === "pad") continue;
    const a = el("a", null, s.title);
    a.href = `#ascent-${s.id}`;
    nav.append(a);
  }
  const alt = el("p", "ascent-altimeter");
  alt.setAttribute("aria-hidden", "true");
  head.append(home, nav, alt);
  frag.append(head);

  const main = el("main", "ascent-main");
  main.id = "ascent-main";
  const counts = {
    projects: `${c.projects.length} projects as flight notebook entries.`,
    research: `${c.research.length} research entries and a Lorenz attractor that draws itself.`,
    people: `${c.patches.length} mission patches and a ${c.flightlog.length}-entry flight log.`,
    catalog: `${c.research.length + c.honors.length} catalog objects.`,
    curiosities: "Questions I'm chasing, and a small orbit toy.",
    contact: "Addresses and the resume PDF.",
  };
  const bands = [];
  for (const s of c.sections) {
    const band = el("section", `ascent-band ascent-band-${s.id}`);
    band.id = `ascent-${s.id}`;
    band.setAttribute("aria-labelledby", `ascent-h-${s.id}`);
    const label = el("p", "ascent-alt", `${s.altitude} · ${s.layer}`);
    if (s.id === "pad") {
      const hero = el("div", "ascent-hero");
      const hd = el("h1", "ascent-name", c.intro.name);
      hd.id = "ascent-h-pad";
      hero.append(label, hd, el("p", "ascent-lede", c.intro.line), el("p", "ascent-thesis", c.intro.thesis));
      band.append(hero);
      const chartHost = el("div", "ascent-chart-host");
      band.append(chartHost);
      band.append(el("p", "ascent-cue", "Scroll to climb"));
      bands.push({ id: s.id, el: band, chartHost });
    } else {
      const hd = el("h2", "ascent-h", s.title);
      hd.id = `ascent-h-${s.id}`;
      band.append(label, hd, el("p", "ascent-p", counts[s.id] || ""));
      bands.push({ id: s.id, el: band });
    }
    main.append(band);
  }
  frag.append(main);
  return { frag, bands, alt };
}

function setInert(on) {
  if (on) {
    inerted = [...document.body.children].filter((n) => n !== root && !n.classList.contains("ascent-switch") && !n.inert);
    inerted.forEach((n) => (n.inert = true));
  } else {
    inerted.forEach((n) => (n.inert = false));
    inerted = [];
  }
}

export async function enter({ base = "", v = "", animate = true } = {}) {
  // Sibling modules are imported with the same version stamp, so a deploy
  // never pairs a fresh ascent.js with a stale cached sky.js or chart.js.
  const [, c, { createSky }, { mountChart }] = await Promise.all([
    once(base, v),
    getContent(base, v),
    import(`./sky.js?v=${v}`),
    import(`./chart.js?v=${v}`),
  ]);
  if (!root) {
    root = el("div", "ascent-root");
    root.id = "ascent-root";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Creative mode");
    root.tabIndex = -1;
    const { frag, bands, alt } = render(c);
    root.append(frag);
    document.body.append(root);
    mountChart(bands[0].chartHost, c);
    sky = createSky(
      root,
      bands.map((b) => ({ el: b.el, color: SKY[b.id][0], mid: SKY[b.id][2], km: SKY[b.id][1], label: c.sections.find((s) => s.id === b.id) })),
      (km, s) => {
        alt.textContent = `ALT ${km < 1 ? km.toFixed(1) : Math.round(km)} km · ${s.label.layer}`;
      },
    );
    // In-page links scroll the view, not the page underneath.
    root.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#ascent-"]');
      if (!a) return;
      const t = root.querySelector(a.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
    });
  }
  root.hidden = false;
  prevFocus = document.activeElement;
  document.documentElement.classList.add("ascent-on");
  setInert(true);
  const fade = animate && !reducedMotion();
  root.classList.toggle("ascent-fade", fade);
  void root.offsetWidth; // start the transition from opacity 0
  root.classList.add("is-in");
  if (fade) await new Promise((r) => setTimeout(r, FADE_MS));
  if (animate) root.focus({ preventScroll: true });
}

export async function exit({ animate = true } = {}) {
  if (!root) return;
  const fade = animate && !reducedMotion();
  root.classList.toggle("ascent-fade", fade);
  root.classList.remove("is-in");
  if (fade) await new Promise((r) => setTimeout(r, FADE_MS));
  root.hidden = true;
  setInert(false);
  document.documentElement.classList.remove("ascent-on");
  if (!document.documentElement.className) document.documentElement.removeAttribute("class");
  if (prevFocus && prevFocus.isConnected && prevFocus !== document.body) prevFocus.focus({ preventScroll: true });
}
