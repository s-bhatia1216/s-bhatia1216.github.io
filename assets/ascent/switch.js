/*
  Ascent mode switch. Loaded (deferred) on every page and kept tiny.

  - Renders the Professional / Creative pill as a real switch (role="switch",
    aria-checked, native button keyboard handling).
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

  // The pill: two labels and a sliding thumb behind the active one.
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "ascent-switch";
  btn.setAttribute("role", "switch");
  btn.setAttribute("aria-label", "Creative mode");
  btn.setAttribute("aria-checked", "false");
  const label = (side, text) => {
    const s = document.createElement("span");
    s.className = "ascent-switch-opt";
    s.dataset.side = side;
    s.textContent = text;
    return s;
  };
  const thumb = document.createElement("span");
  thumb.className = "ascent-switch-thumb";
  thumb.setAttribute("aria-hidden", "true");
  btn.append(thumb, label("pro", me.dataset.labelPro || "Professional"), label("cre", me.dataset.labelCre || "Creative"));
  document.body.append(btn);

  let mod = null;
  const load = () => (mod ||= import(`${BASE}/assets/ascent/ascent.js?v=${V}`));

  // Mode changes run one at a time, so fast double clicks can't interleave.
  let queue = Promise.resolve();
  const apply = (on, animate) =>
    (queue = queue.then(async () => {
      btn.setAttribute("aria-checked", String(on));
      try {
        if (on) await (await load()).enter({ base: BASE, v: V, animate });
        else if (mod) await (await mod).exit({ animate });
      } catch (e) {
        // If creative mode fails to load, stay on the professional site.
        creative = false;
        btn.setAttribute("aria-checked", "false");
      }
      html.classList.remove("ascent-boot");
    }));

  btn.addEventListener("click", () => {
    creative = !creative;
    store.set(creative ? "creative" : "professional");
    apply(creative, true);
  });

  if (creative) apply(true, false);
  else html.classList.remove("ascent-boot");
  // Never leave the page hidden, even if loading stalls.
  setTimeout(() => html.classList.remove("ascent-boot"), 6000);
})();
