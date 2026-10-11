/*
  Ascent orbit toy: drag from the spacecraft to set its velocity and let go.

  Two-body gravity around a scaled Earth, integrated with velocity Verlet. While
  you drag, the predicted path is drawn; when you let go, the craft flies it.
  The readout classifies the result from orbital energy: an orbit (with real
  periapsis and apoapsis altitudes in km), a suborbital arc that falls back,
  or an escape trajectory.

  Keyboard and screen readers get the same toy through two sliders (launch
  speed and flight path angle) and a Launch button. Under reduced motion the
  path is drawn but the craft doesn't fly.
*/

const EARTH_KM = 6371;
const MU = 398600; // km^3/s^2

export function orbitToy() {
  const wrap = document.createElement("div");
  wrap.className = "orbit";
  wrap.innerHTML = `
    <canvas class="orbit-canvas" role="img" aria-label="Orbit toy. A spacecraft beside Earth; drag from it to set its velocity."></canvas>
    <div class="orbit-controls">
      <label>Launch speed <output data-o="speed"></output>
        <input type="range" data-o="v" min="0.4" max="1.6" step="0.01" value="1.12">
      </label>
      <label>Flight path angle <output data-o="angle"></output>
        <input type="range" data-o="a" min="-40" max="40" step="1" value="0">
      </label>
      <button type="button" class="orbit-launch">Launch</button>
      <p class="orbit-readout" aria-live="polite"></p>
    </div>`;
  const canvas = wrap.querySelector("canvas");
  const vIn = wrap.querySelector('[data-o="v"]');
  const aIn = wrap.querySelector('[data-o="a"]');
  const outSpeed = wrap.querySelector('[data-o="speed"]');
  const outAngle = wrap.querySelector('[data-o="angle"]');
  const readout = wrap.querySelector(".orbit-readout");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0;
  let H = 0;
  let ctx = null;
  let R = 26; // Earth radius in px
  let kmPerPx = EARTH_KM / R;
  let r0 = 0; // start radius, px
  let GM = 0; // px^3/s^2
  let vc = 0; // circular speed at r0, px/s
  let path = [];
  let fate = "";
  let flight = null;
  let raf = 0;

  const colors = () => {
    const cs = getComputedStyle(wrap);
    return { text: cs.getPropertyValue("--text").trim() || "#eef0f7", accent: cs.getPropertyValue("--accent").trim() || "#ff7a3d" };
  };

  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.max(18, Math.min(W, H) * 0.075);
    kmPerPx = EARTH_KM / R;
    r0 = R * 1.9; // about 5,700 km altitude: high enough to see the orbit shape
    vc = 60;
    GM = vc * vc * r0;
    predict();
  }

  const center = () => [W * 0.42, H / 2];
  const start = () => {
    const [cx, cy] = center();
    return [cx, cy - r0];
  };
  // Velocity from the sliders: a multiple of circular speed, tilted by the flight path angle.
  const velocity = () => {
    const v = vc * +vIn.value;
    const a = (+aIn.value * Math.PI) / 180;
    return [v * Math.cos(a), -v * Math.sin(a)];
  };

  function simulate(steps = 5200, dt = 1 / 90) {
    const [cx, cy] = center();
    let [x, y] = start();
    let [vx, vy] = velocity();
    const pts = [[x, y]];
    const acc = (px, py) => {
      const dx = cx - px;
      const dy = cy - py;
      const r = Math.hypot(dx, dy);
      const k = GM / (r * r * r);
      return [dx * k, dy * k];
    };
    let [ax, ay] = acc(x, y);
    let swept = 0;
    let last = Math.atan2(y - cy, x - cx);
    for (let i = 0; i < steps; i++) {
      x += vx * dt + 0.5 * ax * dt * dt;
      y += vy * dt + 0.5 * ay * dt * dt;
      const [nx, ny] = acc(x, y);
      vx += 0.5 * (ax + nx) * dt;
      vy += 0.5 * (ay + ny) * dt;
      ax = nx;
      ay = ny;
      pts.push([x, y]);
      const r = Math.hypot(x - cx, y - cy);
      if (r < R) return { pts, end: "crash" };
      if (r > Math.max(W, H) * 1.4) return { pts, end: "escape" };
      const ang = Math.atan2(y - cy, x - cx);
      let d = ang - last;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      swept += d;
      last = ang;
      if (Math.abs(swept) > 2 * Math.PI + 0.05) return { pts, end: "orbit" };
    }
    return { pts, end: "orbit" };
  }

  function classify() {
    const [vx, vy] = velocity();
    const v2 = vx * vx + vy * vy;
    const E = v2 / 2 - GM / r0;
    const toKmS = Math.sqrt(MU / (r0 * kmPerPx)) / vc;
    const speed = Math.sqrt(v2) * toKmS;
    outSpeed.textContent = `${speed.toFixed(2)} km/s`;
    outAngle.textContent = `${aIn.value}°`;
    if (E >= 0) return `Escape trajectory at ${speed.toFixed(2)} km/s. It leaves Earth for good.`;
    const a = -GM / (2 * E);
    const h = r0 * vx; // specific angular momentum about Earth (start is straight above center)
    const e = Math.sqrt(Math.max(0, 1 + (2 * E * h * h) / (GM * GM)));
    const rp = a * (1 - e);
    const ra = a * (1 + e);
    const alt = (r) => Math.round(r * kmPerPx - EARTH_KM).toLocaleString();
    if (rp < R) return `Suborbital. At ${speed.toFixed(2)} km/s it falls back and hits the atmosphere.`;
    return `Orbit. Periapsis ${alt(rp)} km, apoapsis ${alt(ra)} km, eccentricity ${e.toFixed(2)}.`;
  }

  function predict() {
    const s = simulate();
    path = s.pts;
    fate = classify();
    readout.textContent = fate;
    if (!flight) draw();
  }

  function draw(craftIndex = 0, dragTo = null) {
    if (!ctx) return;
    const { text, accent } = colors();
    const [cx, cy] = center();
    ctx.clearRect(0, 0, W, H);
    // Earth and a thin atmosphere.
    ctx.fillStyle = "#3f7fc4";
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(168, 206, 240, 0.5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, R + 3, 0, Math.PI * 2);
    ctx.stroke();
    // Predicted path.
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = text;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    path.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    // Flown trail.
    if (craftIndex > 0) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= craftIndex; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, path[i][0], path[i][1]);
      ctx.stroke();
    }
    // Velocity arrow while dragging.
    const [sx, sy] = start();
    if (dragTo) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(dragTo[0], dragTo[1]);
      ctx.stroke();
    }
    const [px, py] = path[Math.min(craftIndex, path.length - 1)];
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = text;
    ctx.font = "10px 'Martian Mono', ui-monospace, monospace";
    ctx.fillText("drag from me", sx + 10, sy - 10);
  }

  function launch() {
    cancelAnimationFrame(raf);
    predict();
    if (reduce) return;
    let i = 0;
    flight = true;
    const step = () => {
      i = Math.min(path.length - 1, i + 4);
      draw(i);
      if (i < path.length - 1 && !document.hidden) raf = requestAnimationFrame(step);
      else flight = null;
    };
    raf = requestAnimationFrame(step);
  }

  // Pointer: drag from the craft to set velocity (arrow length = speed).
  let dragging = false;
  canvas.addEventListener("pointerdown", (e) => {
    const r = canvas.getBoundingClientRect();
    const [sx, sy] = start();
    if (Math.hypot(e.clientX - r.left - sx, e.clientY - r.top - sy) > 40) return;
    dragging = true;
    flight = null;
    cancelAnimationFrame(raf);
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const r = canvas.getBoundingClientRect();
    const [sx, sy] = start();
    const dx = e.clientX - r.left - sx;
    const dy = e.clientY - r.top - sy;
    const mult = Math.min(1.6, Math.max(0.4, Math.hypot(dx, dy) / 70));
    const ang = Math.max(-40, Math.min(40, Math.round((Math.atan2(-dy, Math.max(1, dx)) * 180) / Math.PI)));
    vIn.value = mult.toFixed(2);
    aIn.value = String(ang);
    predict();
    draw(0, [e.clientX - r.left, e.clientY - r.top]);
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    launch();
  };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);

  vIn.addEventListener("input", predict);
  aIn.addEventListener("input", predict);
  wrap.querySelector(".orbit-launch").addEventListener("click", launch);

  new ResizeObserver(size).observe(canvas);
  // Colors follow the sky, which changes as the reader climbs: repaint on arrival.
  new IntersectionObserver((e) => {
    if (e[0].isIntersecting && !flight) draw();
  }).observe(canvas);
  return wrap;
}
