/*
  Ascent pipeline: systems and hardware work as a 5-stage instruction pipeline.

  Each instruction is a real piece of work (performance work at Apple, the
  RISC-V simulator, the hand-built 6502 computer), issued through IF / ID / EX /
  MEM / WB cycle by cycle like the pipeline in my simulator. A load-use hazard
  inserts a bubble (··); a forwarded operand is marked ⤷. It's a real table,
  so it reads fine with no motion at all.

  Calm by default: it opens on the finished schedule. Play steps through the
  cycles once and stops; Step advances one cycle. It only ticks while on
  screen and while the tab is visible.
*/

const STAGES = ["IF", "ID", "EX", "MEM", "WB"];

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

// When each instruction is in each stage, including the bubble.
function schedule(prog) {
  let issue = 0;
  return prog.map((ins) => {
    const cells = {};
    if (ins.stall) {
      cells[issue] = "IF";
      cells[issue + 1] = "··";
      STAGES.slice(1).forEach((st, k) => (cells[issue + 2 + k] = st));
      issue += 2;
    } else {
      STAGES.forEach((st, k) => (cells[issue + k] = st));
      issue += 1;
    }
    return { ins, cells };
  });
}

export function pipelineFigure(prog) {
  const rows = schedule(prog);
  const cycles = Math.max(...rows.map((r) => Math.max(...Object.keys(r.cells).map(Number)))) + 1;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fig = el("figure", "pipe");
  const bar = el("div", "pipe-bar");
  const play = el("button", "pipe-btn", "Play");
  play.type = "button";
  play.setAttribute("aria-pressed", "false");
  const step = el("button", "pipe-btn", "Step one cycle");
  step.type = "button";
  const clock = el("span", "pipe-clock");
  bar.append(play, step, clock);

  const table = el("table", "pipe-table");
  const head = el("tr");
  head.append(el("th", null, "Instruction"));
  for (let c = 0; c < cycles; c++) head.append(el("th", null, `C${c + 1}`));
  head.querySelectorAll("th").forEach((th) => th.setAttribute("scope", "col"));
  const thead = el("thead");
  thead.append(head);
  table.append(thead);
  const tbody = el("tbody");
  for (const { ins, cells } of rows) {
    const tr = el("tr");
    const th = el("th", "pipe-ins");
    th.setAttribute("scope", "row");
    th.append(el("code", null, `${ins.op.padEnd(5)}${ins.args}`), el("span", "pipe-note", ins.note));
    tr.append(th);
    for (let c = 0; c < cycles; c++) {
      const st = cells[c] || "";
      const td = el("td", st ? `pipe-st${st === "··" ? " is-bubble" : ""}` : null, ins.fwd && st === "EX" ? "⤷EX" : st);
      td.dataset.c = String(c);
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  const scroller = el("div", "pipe-scroll");
  scroller.setAttribute("tabindex", "0");
  scroller.setAttribute("aria-label", "Pipeline table, scrolls sideways");
  scroller.append(table);

  const cap = el("figcaption", null, "Systems and hardware work, issued through a classic 5-stage pipeline. ·· is a load-use bubble; ⤷ marks a forwarded operand.");
  fig.append(bar, scroller, cap);

  let cycle = cycles - 1;
  let playing = false;
  let onScreen = false;
  let timer = 0;
  const cells = [...table.querySelectorAll("td")];
  const paint = () => {
    for (const td of cells) {
      const c = +td.dataset.c;
      td.classList.toggle("is-future", c > cycle);
      td.classList.toggle("is-now", c === cycle && td.classList.contains("pipe-st"));
    }
    clock.textContent = `Cycle ${cycle + 1} of ${cycles} · CPI ${(cycles / prog.length).toFixed(2)}`;
  };
  const setPlaying = (on) => {
    playing = on;
    play.setAttribute("aria-pressed", String(on));
    play.textContent = on ? "Pause" : "Play";
  };
  const run = () => {
    clearInterval(timer);
    if (playing && onScreen && !document.hidden) timer = setInterval(advance, 650);
  };
  function advance() {
    cycle = (cycle + 1) % cycles;
    paint();
    if (playing && cycle === cycles - 1) {
      setPlaying(false);
      run();
    }
  }
  play.addEventListener("click", () => {
    if (reduce) {
      cycle = cycles - 1;
      paint();
      return;
    }
    if (!playing && cycle >= cycles - 1) {
      cycle = 0;
      paint();
    }
    setPlaying(!playing);
    run();
  });
  step.addEventListener("click", () => {
    setPlaying(false);
    run();
    advance();
  });
  new IntersectionObserver((e) => {
    onScreen = e[0].isIntersecting;
    run();
  }).observe(fig);
  document.addEventListener("visibilitychange", run);
  paint();
  return fig;
}
