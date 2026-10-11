/*
  Ascent mode switch. Loaded (deferred) on every page and kept tiny.

  - Renders the mode switch, a guarded cockpit toggle drawn in SVG, as a real
    switch (role="switch", aria-checked, native button keyboard handling), with
    a handwritten "lift the guard" tag on a visitor's first visit.
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

  // The switch is a cockpit toggle under a red safety guard. Turning creative
  // mode on flips the guard open, throws the toggle, and lights the lamp. The
  // label underneath names the current mode.
  const PRO = me.dataset.labelPro || "Professional";
  const CRE = me.dataset.labelCre || "Creative";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "ascent-switch";
  btn.setAttribute("role", "switch");
  btn.setAttribute("aria-label", `${CRE} mode`);
  btn.setAttribute("aria-checked", "false");
  btn.innerHTML =
    '<svg viewBox="0 0 86 110" aria-hidden="true" focusable="false">' +
    '<rect class="as-plate" x="8" y="10" width="70" height="92" rx="6"/>' +
    '<circle class="as-screw" cx="16" cy="18" r="2.4"/><circle class="as-screw" cx="70" cy="18" r="2.4"/>' +
    '<circle class="as-screw" cx="16" cy="94" r="2.4"/><circle class="as-screw" cx="70" cy="94" r="2.4"/>' +
    '<circle class="as-lamp" cx="43" cy="92" r="5"/>' +
    '<circle class="as-base" cx="43" cy="64" r="9"/>' +
    '<g class="as-bat"><rect x="39.5" y="34" width="7" height="31" rx="3.5"/></g>' +
    '<g class="as-guard"><rect x="22" y="28" width="42" height="50" rx="5"/><line x1="30" y1="36" x2="56" y2="36"/></g>' +
    "</svg>" +
    '<span class="ascent-switch-state"></span>';
  const state = btn.querySelector(".ascent-switch-state");
  const show = (on) => {
    btn.setAttribute("aria-checked", String(on));
    state.textContent = on ? CRE : PRO;
  };
  show(false);
  document.body.append(btn);

  // First visit only: a handwritten tag pointing at the switch.
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
    hint.textContent = "lift the guard";
    document.body.append(hint);
  }
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
