/*
  Ascent mission patches: original embroidered-style SVG patches, one per crew.

  Every patch shares one construction, like a real patch run: a twill field, a
  thick merrowed border drawn as dense stitches, the crew name sewn around the
  top arc, and a motif in the middle. Motifs are drawn from simple shapes:
    rocket         Princeton Rocketry Club
    moon           STAR lunar trajectory team (a trans-lunar injection arc)
    constellation  MATRIX (eight spacecraft in three groups)
    lamp           teaching (a lamp over an open book)
  Colors come from the Ascent palette: night field, starlight thread, flame.
*/

const FIELD = "#1d2147";
const THREAD = "#eef0f7";
const FLAME = "#ff7a3d";
const SKY = "#7fb1e2";

let uid = 0;

const MOTIFS = {
  rocket: () => `
    <path d="M100 52 C112 66 116 86 114 112 L86 112 C84 86 88 66 100 52 Z" fill="${THREAD}"/>
    <path d="M100 52 C106 59 110 66 112 74 L88 74 C90 66 94 59 100 52 Z" fill="${FLAME}"/>
    <circle cx="100" cy="90" r="6" fill="${FIELD}" stroke="${SKY}" stroke-width="2.5"/>
    <path d="M86 100 L74 122 L86 116 Z M114 100 L126 122 L114 116 Z" fill="${FLAME}"/>
    <path d="M90 114 Q100 142 110 114 Z" fill="${FLAME}" opacity=".9"/>
    <path d="M95 116 Q100 132 105 116 Z" fill="#ffd27a"/>`,
  moon: () => `
    <circle cx="70" cy="122" r="20" fill="${SKY}"/>
    <path d="M58 112 q8 -4 14 2 M62 128 q10 4 16 -4" stroke="${FIELD}" stroke-width="2" fill="none" opacity=".5"/>
    <circle cx="134" cy="66" r="14" fill="${THREAD}"/>
    <circle cx="129" cy="62" r="2.5" fill="#c9ccd4"/><circle cx="138" cy="71" r="2" fill="#c9ccd4"/>
    <path d="M88 108 C 96 70, 118 52, 146 62" fill="none" stroke="${FLAME}" stroke-width="3" stroke-dasharray="5 4"/>
    <path d="M90 104 l-6 8 9 -1 z" fill="${FLAME}"/>`,
  constellation: () => {
    const orbits = [
      [34, 20],
      [48, 28],
      [62, 36],
    ];
    const sats = [
      [0, 0.3, 1.4],
      [1, 0.1, 1.15, 2.2, 4],
      [2, 0.8, 3.6],
    ];
    let out = `<circle cx="100" cy="98" r="9" fill="${SKY}"/>`;
    orbits.forEach(([rx, ry], i) => {
      out += `<ellipse cx="100" cy="98" rx="${rx}" ry="${ry}" fill="none" stroke="${THREAD}" stroke-width="1.6" opacity=".7" transform="rotate(-18 100 98)"/>`;
      const list = sats[i].slice(1);
      for (const a of list) {
        const x = 100 + rx * Math.cos(a);
        const y = 98 + ry * Math.sin(a);
        const r = Math.atan2(y - 98, x - 100);
        const rot = -18 * (Math.PI / 180);
        const px = 100 + (x - 100) * Math.cos(rot) - (y - 98) * Math.sin(rot);
        const py = 98 + (x - 100) * Math.sin(rot) + (y - 98) * Math.cos(rot);
        out += `<rect x="${(px - 3.5).toFixed(1)}" y="${(py - 3.5).toFixed(1)}" width="7" height="7" fill="${FLAME}" transform="rotate(${((r * 180) / Math.PI).toFixed(0)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
      }
    });
    return out;
  },
  lamp: () => `
    <path d="M62 118 Q82 108 100 118 Q118 108 138 118 L138 132 Q118 122 100 132 Q82 122 62 132 Z" fill="${THREAD}"/>
    <path d="M100 118 L100 132" stroke="${FIELD}" stroke-width="2"/>
    <path d="M70 120 l22 -4 M70 125 l22 -4 M108 116 l22 4 M108 121 l22 4" stroke="${SKY}" stroke-width="1.6"/>
    <path d="M100 104 L100 74" stroke="${THREAD}" stroke-width="3"/>
    <path d="M84 74 L116 74 L108 58 L92 58 Z" fill="${FLAME}"/>
    <path d="M90 76 L76 104 M110 76 L124 104" stroke="#ffd27a" stroke-width="2" opacity=".75"/>
    <circle cx="100" cy="104" r="5" fill="${THREAD}"/>`,
};

export function patchSVG(p) {
  const id = `pk-arc-${++uid}`;
  const name = p.name.toUpperCase();
  const motif = (MOTIFS[p.motif] || MOTIFS.rocket)();
  // Shrink long names so they stay on the arc.
  const size = Math.min(13, 230 / (name.length * 0.68)).toFixed(1);
  return `
<svg viewBox="0 0 200 200" role="img" aria-label="Mission patch for ${p.name.replace(/"/g, "&quot;")}">
  <defs>
    <path id="${id}" d="M 34 100 A 66 66 0 0 1 166 100"/>
    <pattern id="${id}-twill" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="${FIELD}"/><line x1="0" y1="0" x2="0" y2="6" stroke="#262b5a" stroke-width="2"/>
    </pattern>
  </defs>
  <circle cx="100" cy="100" r="94" fill="${FLAME}"/>
  <circle cx="100" cy="100" r="94" fill="none" stroke="#c8551f" stroke-width="10" stroke-dasharray="1.2 1.6"/>
  <circle cx="100" cy="100" r="84" fill="url(#${id}-twill)"/>
  <circle cx="100" cy="100" r="84" fill="none" stroke="${THREAD}" stroke-width="1" stroke-dasharray="2 2" opacity=".55"/>
  <text class="patch-arc" fill="${THREAD}" style="font-size:${size}px"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${name}</textPath></text>
  <g>${motif}</g>
  <text class="patch-when" x="100" y="166" text-anchor="middle" fill="${SKY}">${(p.when || "").toUpperCase()}</text>
</svg>`;
}
