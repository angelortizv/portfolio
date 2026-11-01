/**
 * Anatomy of an agent — static geometry.
 *
 * A bench model of one LLM-agent run: a task leaves the terminal console,
 * the model core thinks (its vents breathe), calls its tools — a web-search
 * mast, a stack of database platters, a document drawer that ejects a card —
 * and writes the answer back, while a face-up dial gauge runs in near real
 * time (one turn = 10 seconds).
 *
 * Built with the Anatomy isometric kit (MIT). Everything here is computed
 * once at module load; the live module only moves groups and rebuilds the
 * needle, the pulse and the document card.
 */
import * as k from '../../iso/iso-kit.mjs';

export const WIDTH = 640;
export const HEIGHT = 400;

// ---------------------------------------------------------------- world plan
const PLATE = { x: -150, y: -78, w: 300, d: 156, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

const CONSOLE = { x: -132, y: 12, w: 42, d: 36, r: 3 };
const CONSOLE_H = 10;
const BUTTON = [-96, 39]; // run button centre
const BUTTON_R = 4.2;
const LED_DONE = [-96, 19]; // answer lamp on the console

// The model core: the agent's "brain", centre back.
const CORE = [-28, -46];
const CORE_R = 20;
const CORE_TOP = 40;
const CORE_PAD_R = 23.5;

// Web-search station: a small box with a beacon mast, back left.
const WEB = { x: -122, y: -66, w: 30, d: 26, r: 2.5 };
const WEB_H = 8;
const MAST = [-107, -53];
const MAST_TOP = 32;

// Database: a stack of platters, between core and drawer.
const DB = [14, -52];
const DB_R = 11;
const DB_PAD_R = 13.5;
const DB_TOP = 15.5;

// Document drawer (retrieval): ejects a card when the agent reads docs.
const CABINET = { x: 44, y: -70, w: 46, d: 30, r: 2.5 };
const CABINET_H = 24;
const SLOT = { x: 52, z0: 8, w: 30, h: 4.2 }; // card slot on the front face
export const CARD = { x: 55, w: 24, z: 9, h: 2.4, reach: 13 }; // the retrieved document
const CARD_FACE = CABINET.y + CABINET.d; // front face plane the card slides out of

const DIAL = [52, 44];
const DIAL_R = 15;
const DIAL_Z = 6;
const DIAL_H = 10;
const DIAL_TOP = DIAL_Z + DIAL_H;
export const DIAL_FULL_S = 10; // one full turn of the needle, in seconds

// Engraved traces: a bus along the front of the back row, with stubs to each
// station. The pulse travels PATHS; TRACE_LEGS is only what gets drawn.
const BUS_Y = -18;
const CORE_PORT = [-42, -23];
const WEB_PORT = [-107, -36];
const DB_PORT = [14, -35];
const DOCS_PORT = [84, -36];

export const PATHS = {
  submit: [[-86, 30], [-74, 30], [-74, BUS_Y], [CORE_PORT[0], BUS_Y], CORE_PORT], // console -> core
  toWeb: [CORE_PORT, [CORE_PORT[0], BUS_Y], [WEB_PORT[0], BUS_Y], WEB_PORT],
  toDb: [CORE_PORT, [CORE_PORT[0], BUS_Y], [DB_PORT[0], BUS_Y], DB_PORT],
  toDocs: [CORE_PORT, [CORE_PORT[0], BUS_Y], [DOCS_PORT[0], BUS_Y], DOCS_PORT],
};
const TRACE_LEGS = [
  [
    [WEB_PORT[0], BUS_Y],
    [DOCS_PORT[0], BUS_Y],
  ], // the bus
  [
    [-86, 30],
    [-74, 30],
    [-74, BUS_Y],
  ], // console drop
  [[CORE_PORT[0], BUS_Y], CORE_PORT], // core stub
  [[WEB_PORT[0], BUS_Y], WEB_PORT], // web stub
  [[DB_PORT[0], BUS_Y], DB_PORT], // database stub
  [[DOCS_PORT[0], BUS_Y], DOCS_PORT], // drawer stub
];
const TRACE_Z = 0.25;

export const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [CORE[0] - CORE_R, CORE[1] - CORE_R, CORE_TOP],
    [CORE[0] + CORE_R, CORE[1] + CORE_R, CORE_TOP],
    [MAST[0], MAST[1], MAST_TOP + 4],
    [DIAL[0] + DIAL_R + 10, DIAL[1], DIAL_TOP],
    [CONSOLE.x, CONSOLE.y, CONSOLE_H + 4],
  ],
  WIDTH,
  HEIGHT,
  { pad: 28, azimuth: 48 },
);

const at = point => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = points =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// ------------------------------------------------------------------ the base
function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
    out.push(
      S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }),
    );
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid' }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'faint' }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
  out.push(
    D(
      screws.map(([x, y]) => at([x, y, 0])),
      { size: 0.5 },
    ),
  );

  // ruler strip along the front edge
  const strip = { x: -122, y: PLATE.y + PLATE.d - 15, w: 142, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
  const ticks = k.topTicks(
    strip.x + 4,
    strip.x + strip.w - 4,
    4,
    5,
    strip.y + 0.8,
    0.6,
    [2, 3.6],
    P,
  );
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));
  out.push(
    D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], {
      size: 0.45,
    }),
  );

  // label plate with three rule lines (printed text), front centre
  const label = { x: -42, y: 42, w: 30, d: 14, r: 1.5 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: 'lo', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 3), { tone: 'faint' }));
  [
    [4, 24],
    [8, 18],
    [12, 10],
  ].forEach(([dy, len]) => {
    out.push(
      L(k.lineOnTop([label.x + 3, label.y + dy], [label.x + 3 + len, label.y + dy], 0.8, P), {
        tone: 'lo',
        free: true,
      }),
    );
  });
  out.push(
    D([at([label.x + 2, label.y + 2, 0.8]), at([label.x + label.w - 2, label.y + 2, 0.8])], {
      size: 0.45,
    }),
  );

  // spare tapped mounting holes, front right
  const holes = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      holes.push([100 + i * 9, 34 + j * 9]);
    }
  }
  out.push(L(holes.map(([hx, hy]) => k.ring(hx, hy, 1.4, 0, P, 12)).join(''), { tone: 'faint' }));
  out.push(
    D(
      holes.map(([hx, hy]) => at([hx, hy, 0])),
      { size: 0.5, tone: 'lo' },
    ),
  );
  return out.join('');
}

// --------------------------------------------------------- engraved traces
function pad(x, y, r = 1.8) {
  return (
    L(k.ring(x, y, r, TRACE_Z, P, 16), { tone: 'mid' }) + D([at([x, y, TRACE_Z])], { size: 0.5 })
  );
}

function traces() {
  const out = [];
  for (const leg of TRACE_LEGS) {
    out.push(L(k.onTop(leg, TRACE_Z, P), { tone: 'mid' }));
  }
  out.push(pad(-86, 30)); // console port
  out.push(pad(...CORE_PORT)); // core port
  out.push(pad(...WEB_PORT)); // web-search port
  out.push(pad(...DB_PORT)); // database port
  out.push(pad(...DOCS_PORT)); // drawer port
  // tee vias where the stubs leave the bus
  out.push(pad(-74, BUS_Y, 1.2));
  out.push(pad(CORE_PORT[0], BUS_Y, 1.2));
  out.push(pad(DB_PORT[0], BUS_Y, 1.2));
  return out.join('');
}

// ------------------------------------------------------------- the terminal
function consoleUnit() {
  const out = [];
  const seam = k.sideSeam(CONSOLE, 2.5, P, 6);
  out.push(
    S(k.slabOf(CONSOLE, 0, CONSOLE_H, P, 6, 1), { tone: 'mid', inner: L(seam, { tone: 'faint' }) }),
  );
  out.push(L(k.planOutline(k.insetPlan(CONSOLE, 2.5), CONSOLE_H, P, 4), { tone: 'faint' }));
  // keypad: two rows of three keys
  for (const row of [16, 26]) {
    for (const col of [-127, -117, -107]) {
      out.push(
        S(k.slabOf({ x: col, y: row, w: 7, d: 7, r: 1.2 }, CONSOLE_H, 2.2, P, 2, 0.4), {
          tone: 'mid',
        }),
      );
    }
  }
  // answer lamp
  out.push(
    S(k.cylinder(LED_DONE[0], LED_DONE[1], 1.7, CONSOLE_H, 1.2, P, 14), {
      tone: 'mid',
      crease: 'none',
    }),
  );
  out.push(D([at([LED_DONE[0], LED_DONE[1], CONSOLE_H + 1.2])], { size: 0.45, tone: 'lo' }));
  out.push(
    `<g data-part="done-led" style="opacity:0">${D(
      [at([LED_DONE[0], LED_DONE[1], CONSOLE_H + 1.2])],
      { size: 0.8, tone: 'hi' },
    )}</g>`,
  );
  // screws on the deck
  out.push(
    D(
      [
        at([CONSOLE.x + 3, CONSOLE.y + 3, CONSOLE_H]),
        at([CONSOLE.x + CONSOLE.w - 3, CONSOLE.y + CONSOLE.d - 3, CONSOLE_H]),
      ],
      { size: 0.45 },
    ),
  );
  // the run button rides in its own group so it can depress
  const button = [
    S(k.cylinder(BUTTON[0], BUTTON[1], BUTTON_R, CONSOLE_H, 3.2, P, 24), {
      tone: 'hi',
      crease: 'lo',
    }),
    L(k.ring(BUTTON[0], BUTTON[1], 2.6, CONSOLE_H + 3.2, P, 18), { tone: 'lo' }),
    D([at([BUTTON[0], BUTTON[1], CONSOLE_H + 3.2])], { size: 0.5, tone: 'hi' }),
  ].join('');
  out.push(
    S(k.cylinder(BUTTON[0], BUTTON[1], BUTTON_R + 1.2, CONSOLE_H, 1, P, 24), {
      tone: 'mid',
      crease: 'none',
    }),
  );
  out.push(`<g data-part="send-btn">${button}</g>`);
  return out.join('');
}

// ------------------------------------------------- the web-search station
function webStation() {
  const out = [];
  const seam = k.sideSeam(WEB, WEB_H - 2.5, P, 6);
  out.push(
    S(k.slabOf(WEB, 0, WEB_H, P, 6, 0.8), { tone: 'mid', inner: L(seam, { tone: 'faint' }) }),
  );
  out.push(L(k.planOutline(k.insetPlan(WEB, 2.5), WEB_H, P, 4), { tone: 'faint' }));
  out.push(
    D([at([WEB.x + 3, WEB.y + 3, WEB_H]), at([WEB.x + WEB.w - 3, WEB.y + WEB.d - 3, WEB_H])], {
      size: 0.45,
    }),
  );
  const [mx, my] = MAST;
  // mast collar, mast, seam rings, beacon head
  out.push(S(k.cylinder(mx, my, 3.4, WEB_H, 2.5, P, 20), { tone: 'mid' }));
  out.push(
    S(k.cylinder(mx, my, 1.5, WEB_H + 2.5, MAST_TOP - WEB_H - 2.5, P, 14), {
      tone: 'mid',
      crease: 'none',
    }),
  );
  out.push(L([16, 24].map(z => k.sideArc(mx, my, 1.5, z, P, 10)).join(''), { tone: 'faint' }));
  out.push(S(k.cylinder(mx, my, 3.2, MAST_TOP, 3, P, 20), { tone: 'hi', crease: 'lo' }));
  out.push(L(k.ring(mx, my, 2, MAST_TOP + 3, P, 14), { tone: 'lo' }));
  out.push(D([at([mx, my, MAST_TOP + 3])], { size: 0.5, tone: 'lo' }));
  // fetching lamp: blinks while the agent searches
  out.push(
    `<g data-part="web-led" style="opacity:0">${D([at([mx, my, MAST_TOP + 3])], {
      size: 0.9,
      tone: 'hi',
    })}${L(k.ring(mx, my, 2, MAST_TOP + 3, P, 14), { tone: 'lit' })}</g>`,
  );
  return out.join('');
}

// ------------------------------------------------------------- the database
function dbStation() {
  const out = [];
  const [dx, dy] = DB;
  out.push(S(k.cylinder(dx, dy, DB_PAD_R, 0, 1.5, P, 40, 0.3), { tone: 'lo' }));
  const seams = [6, 10.5].map(z => k.sideArc(dx, dy, DB_R, z, P, 32)).join('');
  out.push(
    S(k.cylinder(dx, dy, DB_R, 1.5, DB_TOP - 1.5, P, 48, 0.6), {
      tone: 'hi',
      crease: 'lo',
      inner: L(seams, { tone: 'faint' }),
    }),
  );
  out.push(L(k.ring(dx, dy, DB_R - 2.5, DB_TOP, P, 36), { tone: 'lo' }));
  out.push(D([at([dx, dy + (DB_R - 5), DB_TOP])], { size: 0.5, tone: 'lo' }));
  // query lamp: the top ring lights while the agent queries
  out.push(
    `<g data-part="db-led" style="opacity:0">${L(k.ring(dx, dy, DB_R - 2.5, DB_TOP, P, 36), {
      tone: 'lit',
    })}${D([at([dx, dy + (DB_R - 5), DB_TOP])], { size: 0.9, tone: 'hi' })}</g>`,
  );
  return out.join('');
}

// ------------------------------------------------------ the document drawer
function cabinet() {
  const out = [];
  const plinth = k.insetPlan(CABINET, -2);
  out.push(S(k.slabOf(plinth, 0, 2, P, 4, 0.4), { tone: 'lo', crease: 'none' }));
  const seam = k.sideSeam(CABINET, CABINET_H - 4, P, 6);
  out.push(
    S(k.slabOf(CABINET, 2, CABINET_H - 2, P, 6, 0.8), {
      tone: 'mid',
      inner: L(seam, { tone: 'faint' }),
    }),
  );
  out.push(L(k.planOutline(k.insetPlan(CABINET, 2.5), CABINET_H, P, 4), { tone: 'faint' }));
  // vent slots on the lid
  for (const x of [52, 62, 72]) {
    out.push(
      L(k.planOutline({ x, y: CABINET.y + 6, w: 7, d: 2, r: 1 }, CABINET_H, P, 2), { tone: 'lo' }),
    );
  }
  // card slot on the front face: a closed outline in the face plane
  const s = SLOT;
  const slot = [
    [s.x, CARD_FACE, s.z0],
    [s.x + s.w, CARD_FACE, s.z0],
    [s.x + s.w, CARD_FACE, s.z0 + s.h],
    [s.x, CARD_FACE, s.z0 + s.h],
    [s.x, CARD_FACE, s.z0],
  ];
  out.push(
    L(
      slot
        .map(
          (p, i) =>
            `${i ? 'L' : 'M'}${at(p)
              .map(v => Math.round(v * 10) / 10)
              .join(' ')}`,
        )
        .join(''),
      { tone: 'lo' },
    ),
  );
  // corner screws on the lid
  out.push(
    D(
      [
        at([CABINET.x + 3, CABINET.y + 3, CABINET_H]),
        at([CABINET.x + CABINET.w - 3, CABINET.y + 3, CABINET_H]),
        at([CABINET.x + CABINET.w - 3, CABINET.y + CABINET.d - 3, CABINET_H]),
        at([CABINET.x + 3, CABINET.y + CABINET.d - 3, CABINET_H]),
      ],
      { size: 0.45 },
    ),
  );
  return out.join('');
}

// The document card is rebuilt per frame as it slides out of the slot.
export function cardAt(ext) {
  if (ext < 0.4) {
    return '';
  }
  const plan = { x: CARD.x, y: CARD_FACE, w: CARD.w, d: ext, r: Math.min(0.8, ext / 2) };
  const paths = k.slabOf(plan, CARD.z, CARD.h, P, 2);
  return (
    k.solidSvg(paths, { tone: 'hi', lit: true }) +
    (ext > 4
      ? L(
          k.lineOnTop(
            [CARD.x + 2.5, CARD_FACE + ext - 2],
            [CARD.x + CARD.w - 2.5, CARD_FACE + ext - 2],
            CARD.z + CARD.h,
            P,
          ),
          { tone: 'lo', free: true },
        )
      : '')
  );
}

// ------------------------------------------------------------ the model core
function core() {
  const out = [];
  const [cx, cy] = CORE;
  out.push(
    `<path class="iso-halo" d="${k.haloOf(
      {
        x: cx - CORE_PAD_R,
        y: cy - CORE_PAD_R,
        w: CORE_PAD_R * 2,
        d: CORE_PAD_R * 2,
        r: CORE_PAD_R,
      },
      0,
      0.1,
      P,
    )}" style="filter:blur(5px)"/>`,
  );
  out.push(S(k.cylinder(cx, cy, CORE_PAD_R, 0, 3, P, 56, 0.5), { tone: 'lo' }));
  // hold-down tabs standing on the pad rim
  const tabs = [72, 180, 318].map(deg => {
    const a = (deg * Math.PI) / 180;
    return [cx + Math.cos(a) * 17.5, cy + Math.sin(a) * 17.5];
  });
  for (const [tx, ty] of byDepth(tabs)) {
    out.push(
      S(k.slabOf({ x: tx - 3, y: ty - 2.5, w: 6, d: 5, r: 1 }, 3, 2, P, 2, 0.3), { tone: 'mid' }),
    );
    out.push(D([at([tx, ty, 5])], { size: 0.45 }));
  }
  const seams = [14, 28].map(z => k.sideArc(cx, cy, CORE_R, z, P, 40)).join('');
  out.push(
    S(k.cylinder(cx, cy, CORE_R, 3, CORE_TOP - 3, P, 64, 0.8), {
      tone: 'hi',
      crease: 'lo',
      inner: L(seams, { tone: 'faint' }),
    }),
  );
  // knurled collar under the lid
  out.push(L(k.knurl(cx, cy, CORE_R, CORE_TOP - 6, CORE_TOP - 2, 72, P, 0.3), { tone: 'lo' }));
  out.push(L(k.sideArc(cx, cy, CORE_R, CORE_TOP - 6, P, 40), { tone: 'faint' }));
  out.push(L(k.sideArc(cx, cy, CORE_R, CORE_TOP - 2, P, 40), { tone: 'faint' }));
  // lid: bolt ring and vent dots
  out.push(L(k.ring(cx, cy, CORE_R - 3, CORE_TOP, P, 56), { tone: 'lo' }));
  const bolts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    return at([cx + Math.cos(a) * (CORE_R - 5), cy + Math.sin(a) * (CORE_R - 5), CORE_TOP]);
  });
  out.push(D(bolts, { size: 0.5 }));
  const vents = ringPoints(cx, cy, 9, 10, CORE_TOP).concat(
    ringPoints(cx, cy, 5, 6, CORE_TOP, Math.PI / 6),
  );
  out.push(
    D(
      vents.map(p => at(p)),
      { size: 0.55, tone: 'lo' },
    ),
  );
  out.push(L(k.ring(cx, cy, 11.5, CORE_TOP, P, 40), { tone: 'faint' }));
  // the glow the live code breathes while the model is thinking
  out.push(
    `<g data-part="chamber-glow" style="opacity:0">${D(
      vents.map(p => at(p)),
      { size: 1, tone: 'hi' },
    )}${L(k.ring(cx, cy, 11.5, CORE_TOP, P, 40), { tone: 'lit' })}${L(
      k.ring(cx, cy, 14, CORE_TOP, P, 40),
      { tone: 'hi' },
    )}</g>`,
  );
  return out.join('');
}

function ringPoints(cx, cy, r, count, z, phase = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + phase;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z];
  });
}

// ------------------------------------------------------------ the dial gauge
function dial() {
  const out = [];
  const [x, y] = DIAL;
  out.push(S(k.cylinder(x, y, 8, 0, DIAL_Z, P, 32, 0.4), { tone: 'mid' }));
  out.push(L(k.sideArc(x, y, 8, 2.5, P, 20), { tone: 'faint' }));
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 64, 0.8), { tone: 'hi', crease: 'lo' }));
  out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 3, DIAL_TOP, 72, P, 0.3), { tone: 'lo' }));
  out.push(L(k.sideArc(x, y, DIAL_R, DIAL_TOP - 3, P, 40), { tone: 'faint' }));
  out.push(L(k.ring(x, y, DIAL_R - 2.2, DIAL_TOP, P, 56), { tone: 'lo' }));
  const ticks = k.radialTicks(x, y, DIAL_R - 3, 50, 5, DIAL_TOP, [1.1, 2.4], P);
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));
  // zero mark
  out.push(
    L(k.lineOnTop([x, y - (DIAL_R - 3)], [x, y - (DIAL_R - 6.2)], DIAL_TOP, P), { tone: 'hi' }),
  );
  // crown: a small neck and a knurled thumb wheel on the +x side
  out.push(
    S(k.slabOf({ x: x + DIAL_R - 1, y: y - 2.4, w: 4.5, d: 4.8, r: 1.2 }, DIAL_Z + 2, 5, P, 3), {
      tone: 'mid',
    }),
  );
  out.push(
    S(
      k.slabOf(
        { x: x + DIAL_R + 3.2, y: y - 3.2, w: 2.6, d: 6.4, r: 1.2 },
        DIAL_Z + 1.2,
        6.6,
        P,
        3,
      ),
      { tone: 'mid' },
    ),
  );
  out.push(L(k.ring(x, y, 1.6, DIAL_TOP, P, 16), { tone: 'mid' }));
  out.push(
    k.faceTextSvg(k.topMatrix([x, y + 7.5], DIAL_TOP, P, 'x'), 's', {
      size: 2.4,
      tone: 'lo',
      anchor: 'middle',
    }),
  );
  return out.join('');
}

export const needleAt = seconds => {
  const angle = (seconds / DIAL_FULL_S) * Math.PI * 2;
  const [x, y] = DIAL;
  return k.lineOnTop(
    [x - Math.sin(angle) * 3, y + Math.cos(angle) * 3],
    [x + Math.sin(angle) * (DIAL_R - 4), y - Math.cos(angle) * (DIAL_R - 4)],
    DIAL_TOP + 0.2,
    P,
  );
};

// ------------------------------------------------------------------ assembly
export const FIGURE_LABEL =
  'A bench model of one LLM-agent run. A task leaves the terminal console as a pulse on an engraved trace; the model core thinks while its vents breathe, then calls its tools in turn — a web-search mast whose beacon blinks, a stack of database platters whose top ring lights, and a document drawer that ejects a card — and finally writes the answer back to the console. A face-up dial gauge runs in near real time: one turn is ten seconds, and most of the run is the model thinking.';

export const FIGURE_SVG = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: FIGURE_LABEL,
  body: [
    plate(),
    traces(),
    webStation(),
    core(),
    consoleUnit(),
    dbStation(),
    cabinet(),
    `<g data-part="card"></g>`,
    `<g data-part="pulse" style="opacity:0"><path data-part="pulse-trail" class="iso-line" data-tone="lit" style="stroke-width:1.4" d=""/><circle data-part="pulse-dot" class="iso-pulse-dot" r="2"/></g>`,
    dial(),
    `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(
      0,
    )}" style="stroke-width:1.1"/>`,
  ].join(''),
});
