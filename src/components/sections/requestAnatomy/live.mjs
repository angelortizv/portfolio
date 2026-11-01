/**
 * Anatomy of an agent — live behaviour.
 *
 * Mounts on a root element that contains the figure SVG (see geometry.mjs).
 * Framework-free so the same module drives the Gatsby section and the
 * standalone verification page.
 */
import { iso } from '../../iso/iso-kit.mjs';
import { P, PATHS, needleAt, cardAt, CARD, DIAL_FULL_S } from './geometry.mjs';

const TRACE_Z = 0.25;
const rev = points => [...points].reverse();

// True time budget of a typical agent run, in seconds. The animation plays
// these nearly 1:1, so the dial runs in (almost) real time.
export const T = {
  submit: 0.12, // task reaches the core
  plan: 1.25, // first model call: read the task, plan
  think: 0.85, // model call between tool results
  final: 0.7, // model call that drafts the answer
  hop: 0.06, // pulse to or from a tool
  web: 0.9, // a web search round trip
  db: 0.15, // a database query
  docs: 0.35, // retrieving a document
  answer: 0.12, // answer streams back to the console
};

const TOOLS = {
  web: { path: PATHS.toWeb, act: T.web, word: 'web', led: 'web' },
  db: { path: PATHS.toDb, act: T.db, word: 'db', led: 'db' },
  docs: { path: PATHS.toDocs, act: T.docs, word: 'docs', card: true },
};

// The task profiles the button cycles through.
export const RUNS = [['web', 'db'], ['docs'], ['web', 'db', 'docs']];

function lengthsOf(points) {
  const cums = [0];
  for (let i = 1; i < points.length; i++) {
    cums.push(
      cums[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]),
    );
  }
  return cums;
}

function pointAt(points, cums, s) {
  const total = cums[cums.length - 1];
  const want = Math.max(0, Math.min(total, s));
  let i = 1;
  while (i < cums.length - 1 && cums[i] < want) {
    i++;
  }
  const span = cums[i] - cums[i - 1] || 1;
  const t = (want - cums[i - 1]) / span;
  return [
    points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t,
    points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t,
  ];
}

function trailD(points, cums, from, to) {
  const pts = [pointAt(points, cums, from)];
  for (let i = 0; i < points.length; i++) {
    if (cums[i] > from && cums[i] < to) {
      pts.push(points[i]);
    }
  }
  pts.push(pointAt(points, cums, to));
  return pts
    .map((p, i) => {
      const [sx, sy] = iso([p[0], p[1], TRACE_Z + 0.1], P);
      return `${i ? 'L' : 'M'}${Math.round(sx * 10) / 10} ${Math.round(sy * 10) / 10}`;
    })
    .join('');
}

const ease = t => t * t * (3 - 2 * t);
const moveDur = len => Math.min(0.7, Math.max(0.35, len * 0.004));

// Build the step list for one run: think between every hop, tools in order.
function sequenceOf(tools) {
  const steps = [
    { type: 'move', pts: PATHS.submit, secs: T.submit, word: 'task' },
    { type: 'hold', secs: T.plan, word: 'thinking', glow: true },
  ];
  tools.forEach((name, index) => {
    const tool = TOOLS[name];
    steps.push({ type: 'move', pts: tool.path, secs: T.hop, word: tool.word });
    steps.push({ type: 'hold', secs: tool.act, word: tool.word, led: tool.led, card: tool.card });
    steps.push({ type: 'move', pts: rev(tool.path), secs: T.hop, word: tool.word });
    steps.push({
      type: 'hold',
      secs: index === tools.length - 1 ? T.final : T.think,
      word: 'thinking',
      glow: true,
    });
  });
  steps.push({ type: 'move', pts: rev(PATHS.submit), secs: T.answer, word: 'answering' });
  for (const step of steps) {
    if (step.type === 'move') {
      step.cums = lengthsOf(step.pts);
      step.dur = moveDur(step.cums[step.cums.length - 1]);
    } else {
      step.dur = Math.max(step.secs, 0.5); // a 0.15 s query still reads
    }
  }
  return steps;
}

export const totalOf = tools => sequenceOf(tools).reduce((sum, step) => sum + step.secs, 0);

export function mountRequestAnatomy(root, strings) {
  const stage = root.querySelector('.iso-stage');
  const svg = stage.querySelector('svg');
  const q = name => svg.querySelector(`[data-part="${name}"]`);
  const needle = q('needle');
  const pulse = q('pulse');
  const pulseTrail = q('pulse-trail');
  const pulseDot = q('pulse-dot');
  const card = q('card');
  const glow = q('chamber-glow');
  const leds = { web: q('web-led'), db: q('db-led') };
  const doneLed = q('done-led');
  const sendBtn = q('send-btn');
  const readout = root.querySelector('[data-readout]');
  const announce = root.querySelector('[data-announce]');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');

  const state = {
    seq: null, // active sequence
    tools: RUNS[0],
    runIndex: 0,
    step: 0,
    phase: 0, // seconds into the current step
    doneSecs: 0, // budget of completed steps
    shownSecs: 0,
    needle: { at: 0, rate: 0 },
    cardExt: 0,
    cardTarget: 0,
    cardShown: -1,
    glowEnv: 0, // rises while the model thinks
    glowLevel: 0,
    ledEnv: { web: 0, db: 0 },
    done: 0, // answer-lamp level, decays
    pulseAlpha: 0,
    press: 0, // button depression envelope
    clock: 0,
    idleFor: 0,
    touring: true,
    tourStep: 0,
    visible: false,
    lastReading: null,
  };
  let frame = 0;
  let last = 0;
  let idleTimer = 0;

  const idleText = () => `${strings.idle} · ${strings.ready}`;
  const doneText = total =>
    `${strings.done} · ${total.toFixed(1)} s · ${state.tools.length} ${
      state.tools.length === 1 ? strings.tool : strings.tools
    }`;

  function say(text) {
    if (readout && readout.textContent !== text) {
      readout.textContent = text;
    }
  }

  function tell(text) {
    if (announce && announce.textContent !== text) {
      announce.textContent = text;
    }
  }

  function finish() {
    const total = totalOf(state.tools);
    state.seq = null;
    state.doneSecs = total;
    state.lastReading = doneText(total);
    state.done = 1;
    if (state.cardTarget > 0) {
      setTimeout(() => {
        state.cardTarget = 0;
        run();
      }, 1000);
    }
    say(state.lastReading);
    tell(state.lastReading);
  }

  function send() {
    if (state.seq) {
      return;
    }
    state.tools = RUNS[state.runIndex % RUNS.length];
    state.runIndex += 1;
    state.seq = sequenceOf(state.tools);
    state.step = 0;
    state.phase = 0;
    state.doneSecs = 0;
    state.shownSecs = 0;
    state.press = 1;
    state.done = 0;
    if (still.matches) {
      // No travel under reduced motion: jump to the result.
      state.seq = null;
      const total = totalOf(state.tools);
      state.needle.at = total;
      state.needle.rate = 0;
      state.doneSecs = total;
      if (state.tools.includes('docs')) {
        state.cardExt = CARD.reach;
        state.cardTarget = CARD.reach;
        setTimeout(() => {
          state.cardTarget = 0;
          state.cardExt = 0;
          draw();
        }, 2200);
      }
      state.done = 1;
      state.lastReading = doneText(total);
      say(state.lastReading);
      tell(state.lastReading);
      draw();
      return;
    }
    run();
  }

  function draw() {
    needle.setAttribute('d', needleAt(Math.max(0, Math.min(DIAL_FULL_S, state.needle.at))));
    pulse.style.opacity = state.pulseAlpha.toFixed(2);
    glow.style.opacity = state.glowLevel.toFixed(2);
    const blink = 0.55 + 0.45 * Math.sin(state.clock * 14);
    for (const name of ['web', 'db']) {
      leds[name].style.opacity = (state.ledEnv[name] * blink).toFixed(2);
    }
    doneLed.style.opacity = state.done.toFixed(2);
    sendBtn.setAttribute('transform', `translate(0 ${(state.press * 1.6).toFixed(2)})`);
    const ext = Math.round(state.cardExt * 4) / 4;
    if (ext !== state.cardShown) {
      card.innerHTML = cardAt(ext);
      state.cardShown = ext;
    }
  }

  function envTo(value, want, dt, tau = 0.18) {
    const next = value + (want - value) * (1 - Math.exp(-dt / tau));
    return Math.abs(next - want) < 0.01 ? want : next;
  }

  function stepSeq(dt) {
    const step = state.seq[state.step];
    state.phase += dt;
    const t = Math.min(1, state.phase / step.dur);
    const soft = ease(t);
    if (step.type === 'move') {
      const total = step.cums[step.cums.length - 1];
      const s = soft * total;
      state.pulseAlpha = Math.min(1, state.pulseAlpha + dt * 8);
      pulseTrail.setAttribute('d', trailD(step.pts, step.cums, Math.max(0, s - 7), s));
      const [px, py] = pointAt(step.pts, step.cums, s);
      const [sx, sy] = iso([px, py, TRACE_Z + 0.1], P);
      pulseDot.setAttribute('cx', sx.toFixed(1));
      pulseDot.setAttribute('cy', sy.toFixed(1));
    } else {
      state.pulseAlpha = Math.max(0, state.pulseAlpha - dt * 6);
      if (step.card) {
        state.cardTarget = CARD.reach;
      }
    }
    state.glowEnv = envTo(state.glowEnv, step.glow ? 1 : 0, dt, 0.25);
    state.glowLevel = state.glowEnv * (0.72 + 0.28 * Math.sin(state.clock * 7));
    for (const name of ['web', 'db']) {
      state.ledEnv[name] = envTo(state.ledEnv[name], step.led === name ? 1 : 0, dt);
    }
    const target = state.doneSecs + step.secs * soft;
    state.shownSecs += (target - state.shownSecs) * (1 - Math.exp(-dt / 0.08));
    say(`${strings[step.word]} · ${state.shownSecs.toFixed(1)} s`);
    if (t >= 1) {
      state.doneSecs += step.secs;
      state.step += 1;
      state.phase = 0;
      if (state.step >= state.seq.length) {
        state.pulseAlpha = 0;
        state.shownSecs = state.doneSecs;
        finish();
      }
    }
  }

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = still.matches;
    state.clock = now / 1000;

    if (state.touring && !state.seq && !calm) {
      state.idleFor += dt;
      const waits = [1.1, 1.6, 1.6, 6];
      if (state.idleFor >= waits[state.tourStep % waits.length]) {
        state.idleFor = 0;
        state.tourStep += 1;
        send();
      }
    }

    if (state.seq) {
      stepSeq(dt);
    } else {
      state.pulseAlpha = Math.max(0, state.pulseAlpha - dt * 6);
      state.glowEnv = envTo(state.glowEnv, 0, dt, 0.25);
      state.glowLevel = state.glowEnv * (0.72 + 0.28 * Math.sin(state.clock * 7));
      for (const name of ['web', 'db']) {
        state.ledEnv[name] = envTo(state.ledEnv[name], 0, dt);
      }
      if (state.done > 0) {
        state.done = Math.max(0, state.done - dt / 2.4);
      }
      if (!state.lastReading) {
        say(idleText());
      }
    }

    // needle spring toward the shown seconds
    const want = state.seq ? state.shownSecs : state.lastReading ? state.doneSecs : 0;
    const stiff = 120;
    const drag = calm ? 2 * Math.sqrt(stiff) : 17;
    for (let i = 0; i < 4; i++) {
      state.needle.rate += ((want - state.needle.at) * stiff - state.needle.rate * drag) * (dt / 4);
      state.needle.at += state.needle.rate * (dt / 4);
    }
    if (Math.abs(want - state.needle.at) < 0.004 && Math.abs(state.needle.rate) < 0.004) {
      state.needle.at = want;
      state.needle.rate = 0;
    }

    // card follow
    state.cardExt += (state.cardTarget - state.cardExt) * (1 - Math.exp(-dt / 0.14));
    if (Math.abs(state.cardTarget - state.cardExt) < 0.2) {
      state.cardExt = state.cardTarget;
    }

    state.press = Math.max(0, state.press - dt * 5);

    draw();

    const settled =
      !state.seq &&
      !(state.touring && !calm) &&
      state.needle.rate === 0 &&
      state.needle.at === want &&
      state.cardExt === state.cardTarget &&
      state.done === 0 &&
      state.glowEnv === 0 &&
      state.ledEnv.web === 0 &&
      state.ledEnv.db === 0 &&
      state.pulseAlpha === 0 &&
      state.press === 0;
    frame = state.visible && !settled ? requestAnimationFrame(tick) : 0;
  }

  function run() {
    if (!frame && state.visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  function interact() {
    state.touring = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      state.touring = !still.matches;
      state.idleFor = 0;
      state.tourStep = 0;
      run();
    }, 14000);
  }

  const onPress = event => {
    if (event.type === 'keydown') {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
    }
    interact();
    send();
    run();
  };

  const observer = new IntersectionObserver(
    entries => {
      state.visible = entries[entries.length - 1].isIntersecting;
      if (state.visible) {
        run();
      }
    },
    { rootMargin: '120px 0px' },
  );
  observer.observe(stage);

  if (still.matches) {
    state.touring = false;
  }
  stage.addEventListener('pointerdown', onPress);
  stage.addEventListener('keydown', onPress);
  say(idleText());
  draw();

  return () => {
    observer.disconnect();
    stage.removeEventListener('pointerdown', onPress);
    stage.removeEventListener('keydown', onPress);
    clearTimeout(idleTimer);
    if (frame) {
      cancelAnimationFrame(frame);
    }
  };
}
