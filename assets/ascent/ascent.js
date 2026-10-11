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

  Milestone 2: the view is a placeholder that proves the wiring (content loads,
  altitude sections listed). The sky, star chart, and sections arrive next.
*/

let root = null;
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
const isTodo = (s) => !s || /^TODO/i.test(String(s));

// Placeholder view: one band per altitude, with what will live there.
function render(c) {
  const main = el("main", "ascent-main");
  main.id = "ascent-main";
  const counts = {
    projects: `${c.projects.length} projects as flight notebook entries`,
    research: `${c.research.length} research entries and the Lorenz figure`,
    people: `${c.patches.length} mission patches and a ${c.flightlog.length}-entry flight log`,
    catalog: `${c.research.length + c.honors.length} catalog objects`,
    curiosities: `${c.curiosities.filter((q) => !isTodo(q.question)).length} questions so far, plus the orbit toy`,
    contact: `${c.contact.emails.length} addresses and the resume PDF`,
  };
  for (const s of c.sections) {
    const band = el("section", `ascent-band ascent-band-${s.id}`);
    band.setAttribute("aria-labelledby", `ascent-h-${s.id}`);
    band.append(el("p", "ascent-alt", `${s.altitude} · ${s.layer}`));
    const hd = el(s.id === "pad" ? "h1" : "h2", "ascent-h", s.id === "pad" ? c.intro.name : s.title);
    hd.id = `ascent-h-${s.id}`;
    band.append(hd);
    band.append(el("p", "ascent-p", s.id === "pad" ? `${c.intro.line} ${c.intro.thesis}` : counts[s.id] || ""));
    main.append(band);
  }
  return main;
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
  const [, c] = await Promise.all([once(base, v), getContent(base, v)]);
  if (!root) {
    root = el("div", "ascent-root");
    root.id = "ascent-root";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Creative mode");
    root.tabIndex = -1;
    root.append(render(c));
    document.body.append(root);
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
