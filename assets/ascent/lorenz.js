/*
  Ascent research figure: the Lorenz-63 attractor as one fine SVG line.

  The trajectory is integrated once in the browser (RK4, σ = 10, ρ = 28,
  β = 8/3) and projected onto the x-z plane, the classic butterfly. The first
  time the figure scrolls into view the line draws itself over about seven
  seconds, then stays still. Under prefers-reduced-motion it is simply drawn.
*/

const NS = "http://www.w3.org/2000/svg";

function trajectory(steps = 9000, dt = 0.006) {
  const f = ([x, y, z]) => [10 * (y - x), x * (28 - z) - y, x * y - (8 / 3) * z];
  let s = [1, 1, 1];
  const pts = [];
  for (let i = 0; i < steps + 400; i++) {
    const k1 = f(s);
    const k2 = f(s.map((v, j) => v + (dt / 2) * k1[j]));
    const k3 = f(s.map((v, j) => v + (dt / 2) * k2[j]));
    const k4 = f(s.map((v, j) => v + dt * k3[j]));
    s = s.map((v, j) => v + (dt / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    if (i >= 400 && i % 2 === 0) pts.push([s[0], s[2]]); // skip the transient
  }
  return pts;
}

export function lorenzFigure() {
  const fig = document.createElement("figure");
  fig.className = "lz-figure";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 600 460");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "The Lorenz-63 attractor: a single trajectory looping around two lobes, like butterfly wings.");

  // Map x in [-22, 22] and z in [2, 52] onto the plate, z up.
  const pts = trajectory();
  const X = (x) => 300 + x * 12.2;
  const Y = (z) => 440 - (z - 2) * 8.4;
  let d = `M${X(pts[0][0]).toFixed(1)} ${Y(pts[0][1]).toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) d += `L${X(pts[i][0]).toFixed(1)} ${Y(pts[i][1]).toFixed(1)}`;

  // Plate furniture: axes with a few ticks.
  const axes = document.createElementNS(NS, "g");
  axes.setAttribute("class", "lz-axes");
  axes.setAttribute("aria-hidden", "true");
  axes.innerHTML =
    '<line x1="30" y1="440" x2="570" y2="440"/><line x1="300" y1="446" x2="300" y2="20"/>' +
    [-20, -10, 10, 20].map((x) => `<line x1="${X(x)}" y1="440" x2="${X(x)}" y2="446"/>`).join("") +
    [10, 20, 30, 40, 50].map((z) => `<line x1="294" y1="${Y(z)}" x2="300" y2="${Y(z)}"/>`).join("") +
    '<text x="566" y="432" text-anchor="end">x</text><text x="308" y="28">z</text>';
  svg.append(axes);

  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", d);
  path.setAttribute("class", "lz-line");
  svg.append(path);

  const end = pts[pts.length - 1];
  const dot = document.createElementNS(NS, "circle");
  dot.setAttribute("cx", X(end[0]).toFixed(1));
  dot.setAttribute("cy", Y(end[1]).toFixed(1));
  dot.setAttribute("r", "4");
  dot.setAttribute("class", "lz-dot");
  svg.append(dot);

  fig.append(svg);
  const cap = document.createElement("figcaption");
  cap.textContent = "Fig. 1. Lorenz-63 (σ = 10, ρ = 28, β = 8/3), the chaotic system my thesis tracks. Two nearby starting points end up on different wings.";
  fig.append(cap);

  // Draw once on first view.
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    fig.classList.add("is-drawn");
  } else {
    requestAnimationFrame(() => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          io.disconnect();
          path.style.transition = "stroke-dashoffset 7s cubic-bezier(.4,.1,.3,1)";
          path.style.strokeDashoffset = "0";
          setTimeout(() => fig.classList.add("is-drawn"), 6800);
        },
        { threshold: 0.35 },
      );
      io.observe(fig);
    });
  }
  return fig;
}
