/*
  Ascent mode switch. Loaded (deferred) on every page and kept tiny.

  - Renders the mode switch, a REMOVE BEFORE FLIGHT tag drawn in SVG, as a
    real switch (role="switch", aria-checked, native button keyboard handling),
    top right below the navbar, with a handwritten note on a first visit.
  - Remembers the choice in localStorage ("ascent-mode"). ?mode=creative or
    ?mode=professional overrides it, so a resume can link straight in.
  - Imports ascent.js, and with it everything creative, only the first time
    creative mode turns on. Professional mode never downloads any of it.
*/
(() => {
  const me = document.currentScript;
  const BASE = (me && me.dataset.base) || "";
  const V = (me && me.dataset.v) || "";
  const KEY = "ascent-mode";
  const html = document.documentElement;

  const store = {
    get() {
      try {
        return localStorage.getItem(KEY);
      } catch (e) {
        return null;
      }
    },
    set(v) {
      try {
        localStorage.setItem(KEY, v);
      } catch (e) {}
    },
  };

  const param = new URLSearchParams(location.search).get("mode");
  if (param === "creative" || param === "professional") store.set(param);
  let creative = (param || store.get()) === "creative";

  // The switch is a REMOVE BEFORE FLIGHT tag, the red streamer pinned to an
  // aircraft or rocket on the ground. Pulling it (creative mode) slides the pin
  // out and swings the tag loose; the label underneath names the current mode.
  const PRO = me.dataset.labelPro || "Professional";
  const CRE = me.dataset.labelCre || "Creative";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "ascent-switch";
  btn.setAttribute("role", "switch");
  btn.setAttribute("aria-label", `${CRE} mode`);
  btn.setAttribute("aria-checked", "false");
  btn.innerHTML =
    '<svg viewBox="0 0 216 52" aria-hidden="true" focusable="false">' +
    '<rect class="as-socket" x="200" y="18" width="14" height="16" rx="3"/>' +
    '<g class="as-pin"><rect x="176" y="23" width="32" height="6" rx="3"/><circle cx="176" cy="26" r="7"/></g>' +
    '<g class="as-tag">' +
    '<rect class="as-cloth" x="4" y="6" width="160" height="40" rx="2.5"/>' +
    '<rect class="as-stitch" x="8.5" y="10.5" width="151" height="31" rx="1.5"/>' +
    '<text class="as-words" x="16" y="30.5" textLength="136" lengthAdjust="spacingAndGlyphs">REMOVE BEFORE FLIGHT</text>' +
    '<circle class="as-grommet" cx="166" cy="26" r="5.5"/>' +
    "</g>" +
    "</svg>" +
    '<span class="ascent-switch-state"></span>';
  const state = btn.querySelector(".ascent-switch-state");
  const show = (on) => {
    btn.setAttribute("aria-checked", String(on));
    state.textContent = on ? CRE : PRO;
  };
  show(false);
  document.body.append(btn);

  // Sit just below the theme's fixed navbar, whatever its height.
  const place = () => {
    const nav = document.getElementById("navbar");
    const r = nav && getComputedStyle(nav).position === "fixed" ? nav.getBoundingClientRect() : null;
    const top = `${Math.round((r ? r.bottom : 0) + 10)}px`;
    btn.style.setProperty("--ascent-switch-top", top);
    if (hint) hint.style.setProperty("--ascent-switch-top", top);
  };
  addEventListener("resize", place, { passive: true });

  // First visit only: a handwritten note under the tag.
  const HINT = "ascent-hint-seen";
  let hint = null;
  let seen = true;
  try {
    seen = localStorage.getItem(HINT) === "1";
  } catch (e) {}
  if (!seen) {
    hint = document.createElement("p");
    hint.className = "ascent-switch-hint";
    hint.setAttribute("aria-hidden", "true");
    hint.textContent = "pull it for the creative version";
    document.body.append(hint);
  }
  place();
  const dismissHint = () => {
    if (!hint) return;
    hint.remove();
    hint = null;
    try {
      localStorage.setItem(HINT, "1");
    } catch (e) {}
  };

  let mod = null;
  const load = () => (mod ||= import(`${BASE}/assets/ascent/ascent.js?v=${V}`));

  // Mode changes run one at a time, so fast double clicks can't interleave.
  let queue = Promise.resolve();
  const apply = (on, animate) =>
    (queue = queue.then(async () => {
      show(on);
      try {
        if (on) await (await load()).enter({ base: BASE, v: V, animate });
        else if (mod) await (await mod).exit({ animate });
      } catch (e) {
        // If creative mode fails to load, stay on the professional site.
        creative = false;
        show(false);
      }
      html.classList.remove("ascent-boot");
    }));

  btn.addEventListener("click", () => {
    dismissHint();
    creative = !creative;
    store.set(creative ? "creative" : "professional");
    apply(creative, true);
  });

  if (creative) apply(true, false);
  else html.classList.remove("ascent-boot");
  // Never leave the page hidden, even if loading stalls.
  setTimeout(() => html.classList.remove("ascent-boot"), 6000);
})();
