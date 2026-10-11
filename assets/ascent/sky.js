/*
  Ascent sky engine.

  Scrolling is the climb. Each section has an altitude and a sky color for that
  altitude (warm pad dawn, daytime blue, stratospheric blue, mesospheric violet,
  black above the Kármán line). As the reader scrolls, the view's background
  blends between the colors of the section they're in and the next one.

  Contrast is enforced, not hoped for: for every blended sky color the engine
  picks ink or starlight text, whichever reads better, and if even that falls
  short of WCAG AA (4.5 : 1) it nudges the sky lighter or darker until it passes.
  The accent (launch flame) gets the same check at 3 : 1 for graphics.

  Above the Kármán line, a static starfield fades in. It is drawn once; nothing
  in it moves.

  Output is a handful of CSS custom properties on the view (--sky, --text,
  --text-soft, --rule, --accent) plus an altitude readout.
*/

const INK = "#14172a";
const STARLIGHT = "#eef0f7";
const FLAME_DARK_SKY = "#ff7a3d"; // on night sky
const FLAME_LIGHT_SKY = "#b23a0b"; // deeper flame for dawn and day skies

// ---- color math ---------------------------------------------------------
const hex = (h) => h.match(/\w\w/g).map((x) => parseInt(x, 16));
const toHex = (c) => "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => {
  const A = hex(a);
  const B = hex(b);
  return toHex(A.map((v, i) => v + (B[i] - v) * t));
};
export function luminance(h) {
  const [r, g, b] = hex(h).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// Pick text for a sky, and adjust the sky if AA isn't met.
export function palette(sky) {
  let bg = sky;
  let text = contrast(bg, INK) >= contrast(bg, STARLIGHT) ? INK : STARLIGHT;
  for (let i = 0; i < 20 && contrast(bg, text) < 4.6; i++) bg = mix(bg, text === INK ? "#ffffff" : "#000000", 0.05);
  const dark = text === STARLIGHT;
  let soft = mix(text, bg, 0.22);
  while (contrast(soft, bg) < 4.5) soft = mix(soft, text, 0.25);
  // Flame accent: whichever shade reads better on this sky; if neither clears
  // 3 : 1 (the mid-blue stratosphere), accents fall back to the text color.
  const flame = [FLAME_LIGHT_SKY, FLAME_DARK_SKY].sort((a, b) => contrast(b, bg) - contrast(a, bg))[0];
  const accent = contrast(flame, bg) >= 3 ? flame : text;
  return { bg, text, soft, accent, dark, rule: mix(text, bg, 0.72) };
}

// ---- engine ---------------------------------------------------------------
export function createSky(root, sections, onAltitude) {
  // sections: [{ el, color, mid?, km, label }], in page order.
  let tops = [];
  let ticking = false;
  let last = "";
  const stars = makeStarfield(root);

  const measure = () => {
    const base = root.getBoundingClientRect().top - root.scrollTop;
    tops = sections.map((s) => s.el.getBoundingClientRect().top - base);
    update();
  };

  function update() {
    ticking = false;
    const probe = root.scrollTop + root.clientHeight * 0.4;
    let i = 0;
    while (i < tops.length - 1 && probe >= tops[i + 1]) i++;
    const next = Math.min(i + 1, sections.length - 1);
    const span = Math.max(1, (tops[next] ?? tops[i] + 1) - tops[i]);
    const t = next === i ? 0 : Math.max(0, Math.min(1, (probe - tops[i]) / span));
    // A section may name a mid color (the pad's rose dawn), so the blend from
    // warm to blue passes through pink instead of muddy grey.
    const mid = sections[i].mid;
    const sky = mid ? (t < 0.5 ? mix(sections[i].color, mid, t * 2) : mix(mid, sections[next].color, t * 2 - 1)) : mix(sections[i].color, sections[next].color, t);
    if (sky !== last) {
      last = sky;
      const p = palette(sky);
      const st = root.style;
      st.setProperty("--sky", p.bg);
      st.setProperty("--text", p.text);
      st.setProperty("--text-soft", p.soft);
      st.setProperty("--rule", p.rule);
      st.setProperty("--accent", p.accent);
      root.classList.toggle("is-night", p.dark);
      // Stars appear as the sky darkens past the mesosphere.
      const L = luminance(p.bg);
      stars.style.opacity = String(Math.max(0, Math.min(1, (0.06 - L) / 0.055)));
    }
    const km = sections[i].km + (sections[next].km - sections[i].km) * t;
    onAltitude?.(km, sections[t > 0.5 ? next : i]);
  }

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  root.addEventListener("scroll", onScroll, { passive: true });
  const ro = new ResizeObserver(measure);
  ro.observe(root);
  sections.forEach((s) => ro.observe(s.el));
  measure();

  return {
    destroy() {
      root.removeEventListener("scroll", onScroll);
      ro.disconnect();
      stars.remove();
    },
  };
}

// A fixed starfield drawn once at device resolution. Seeded, so it is the same
// sky on every visit.
function makeStarfield(root) {
  const c = document.createElement("canvas");
  c.className = "ascent-stars";
  c.setAttribute("aria-hidden", "true");
  c.style.opacity = "0";
  root.prepend(c);
  const draw = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    let seed = 1216;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const n = Math.round((w * h) / 3200);
    for (let k = 0; k < n; k++) {
      const r = rand() < 0.94 ? 0.5 + rand() * 0.6 : 1.1 + rand() * 0.7;
      ctx.globalAlpha = 0.35 + rand() * 0.6;
      ctx.fillStyle = rand() < 0.12 ? "#ffd9b8" : "#eef0f7";
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  draw();
  let rt = 0;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(draw, 200);
  });
  return c;
}
