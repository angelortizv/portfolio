/*
 * Adapted from React Bits "Dot Grid" (https://reactbits.dev/backgrounds/dot-grid).
 * Copyright (c) 2026 David Haz — MIT + Commons Clause License Condition v1.0.
 * Used here as part of a website; the component itself is not sold or redistributed.
 *
 * Changes: theme colors are read from CSS variables, dots rest at a low alpha and brighten with
 * energy, the intro waits for the loader curtain (and is shorter), circle shape only, no click
 * shockwave, touch input is ignored, and a callback reports whether WebGL2 was available.
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const VERTEX = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aMotion;
layout(location = 2) in vec2 aState;

uniform vec2 uResolution;
uniform float uSize;
uniform float uSwell;
uniform float uGlow;

out vec2 vLocal;
out float vRadius;
out float vEnergy;

void main() {
  float energy = aState.x;
  float radius = 0.5 * uSize * aState.y * (1.0 + uSwell * energy);
  float pad = radius * (1.0 + uGlow * energy * 2.5) + 2.0;
  vec2 local = aCorner * pad;
  vec2 point = aMotion.xy + local;
  vLocal = local;
  vRadius = radius;
  vEnergy = energy;
  vec2 clip = point / uResolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const FRAGMENT = `#version 300 es
precision highp float;

in vec2 vLocal;
in float vRadius;
in float vEnergy;

uniform vec3 uBase;
uniform vec3 uActive;
uniform float uGlow;
uniform float uRest;

out vec4 outColor;

void main() {
  float d = length(vLocal) - vRadius;
  float aa = max(fwidth(d), 0.0001);
  float body = clamp(0.5 - d / aa, 0.0, 1.0);
  float halo = uGlow * vEnergy * 0.5 * exp(-max(d, 0.0) / max(vRadius * 1.3, 0.6));
  float alpha = body + (1.0 - body) * halo;
  float lift = mix(uRest, 1.0, clamp(vEnergy * 1.4, 0.0, 1.0));
  vec3 color = mix(uBase, uActive, clamp(vEnergy * 1.2, 0.0, 1.0));
  alpha *= lift;
  outColor = vec4(color * alpha, alpha);
}
`;

const INTRO_SECONDS = 1.1;

const toRgb = color => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(color).trim());
  if (!match) {
    return [1, 1, 1];
  }
  const hex = match[1].length === 3 ? match[1].replace(/./g, digit => digit + digit) : match[1];
  return [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
};

const smootherstep = t => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
};

const backOut = t => {
  const s = 1.9;
  const x = t - 1;
  return 1 + x * x * ((s + 1) * x + s);
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

const readTheme = () => {
  const style = window.getComputedStyle(document.documentElement);
  return {
    base: toRgb(style.getPropertyValue('--signal-color')),
    active: toRgb(style.getPropertyValue('--signal-soft')),
  };
};

const StyledDotGrid = styled.div`
  position: absolute;
  inset: 0;

  canvas {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`;

const DotGrid = ({
  dotSize = 3,
  gap = 29,
  proximity = 150,
  strength = 0.4,
  bounce = 0.35,
  tension = 0.4,
  returnDuration = 0.6,
  swell = 0.5,
  glow = 0.4,
  rest = 0.2,
  waitForIntro = false,
  onReady,
}) => {
  const canvasRef = useRef(null);
  const settingsRef = useRef({});
  settingsRef.current = {
    dotSize,
    gap,
    proximity,
    strength,
    bounce,
    tension,
    returnDuration,
    swell,
    glow,
    rest,
  };
  const waitRef = useRef(waitForIntro);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    if (!gl) {
      return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    const uniforms = {};
    ['uResolution', 'uSize', 'uSwell', 'uGlow', 'uBase', 'uActive', 'uRest'].forEach(name => {
      uniforms[name] = gl.getUniformLocation(program, name);
    });

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const cornerBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 24, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 24, 16);
    gl.vertexAttribDivisor(2, 1);
    gl.bindVertexArray(null);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const view = { width: 0, height: 0, ratio: 1 };
    const grid = { count: 0, cols: 1, rows: 1, cell: 1, centerX: 0, centerY: 0, reach: 1 };
    let restPos = new Float32Array(0);
    let offset = new Float32Array(0);
    let velocity = new Float32Array(0);
    let force = new Float32Array(0);
    let next = new Float32Array(0);
    let energy = new Float32Array(0);
    let instances = new Float32Array(0);
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, time: 0, inside: false, presence: 0 };
    // intro: null = finished, Infinity = hidden and waiting for the loader curtain
    let introStart = reduced ? null : waitRef.current ? Infinity : null;
    let raf = 0;
    let last = 0;
    let theme = readTheme();

    const rebuild = () => {
      const { dotSize: size, gap: spacing } = settingsRef.current;
      const cell = Math.max(2, size + spacing);
      const cols = Math.max(1, Math.floor((view.width + spacing) / cell));
      const rows = Math.max(1, Math.floor((view.height + spacing) / cell));
      const startX = (view.width - (cols * cell - spacing)) / 2 + size / 2;
      const startY = (view.height - (rows * cell - spacing)) / 2 + size / 2;
      const count = cols * rows;
      restPos = new Float32Array(count * 2);
      offset = new Float32Array(count * 2);
      velocity = new Float32Array(count * 2);
      force = new Float32Array(count * 2);
      next = new Float32Array(count * 2);
      energy = new Float32Array(count);
      instances = new Float32Array(count * 6);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = (row * cols + col) * 2;
          restPos[index] = startX + col * cell;
          restPos[index + 1] = startY + row * cell;
        }
      }
      Object.assign(grid, {
        count,
        cols,
        rows,
        cell,
        centerX: view.width / 2,
        centerY: view.height / 2,
        reach: Math.hypot(view.width, view.height) / 2,
      });
      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, instances.byteLength, gl.DYNAMIC_DRAW);
    };

    const render = now => {
      const s = settingsRef.current;
      const radius = Math.max(1, s.proximity);
      const introAge = introStart === null ? Infinity : (now - introStart) / 1000;
      const introFront = introAge * grid.reach * 1.9;
      const introBand = grid.cell * 4;
      for (let i = 0; i < grid.count; i++) {
        const index = i * 2;
        const x = restPos[index] + offset[index];
        const y = restPos[index + 1] + offset[index + 1];
        let glowing = energy[i];
        if (pointer.presence > 0.001) {
          const distance = Math.hypot(x - pointer.x, y - pointer.y);
          if (distance < radius) {
            glowing = Math.max(
              glowing,
              smootherstep(1 - distance / radius) * 0.4 * pointer.presence,
            );
          }
        }
        let scale = 1;
        if (introStart !== null) {
          const distance = Math.hypot(
            restPos[index] - grid.centerX,
            restPos[index + 1] - grid.centerY,
          );
          const appear = Math.min(1, Math.max(0, (introFront - distance) / introBand));
          scale = appear >= 1 ? 1 : Math.max(0, backOut(appear));
          glowing = Math.max(glowing, Math.sin(appear * Math.PI) * 0.6);
        }
        const target = i * 6;
        instances[target] = x;
        instances[target + 1] = y;
        instances[target + 2] = velocity[index];
        instances[target + 3] = velocity[index + 1];
        instances[target + 4] = glowing;
        instances[target + 5] = scale;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(program);
      gl.uniform2f(uniforms.uResolution, view.width, view.height);
      gl.uniform1f(uniforms.uSize, Math.max(0.5, s.dotSize));
      gl.uniform1f(uniforms.uSwell, reduced ? 0 : Math.max(0, s.swell));
      gl.uniform1f(uniforms.uGlow, Math.max(0, s.glow));
      gl.uniform3f(uniforms.uBase, theme.base[0], theme.base[1], theme.base[2]);
      gl.uniform3f(uniforms.uActive, theme.active[0], theme.active[1], theme.active[2]);
      gl.uniform1f(uniforms.uRest, Math.min(1, Math.max(0, s.rest)));
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, instances);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, grid.count);
      gl.bindVertexArray(null);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      Object.assign(view, { width, height, ratio });
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      rebuild();
      render(performance.now());
    };

    // Damped springs pulled by the pointer, coupled to their neighbours like a sheet
    const step = dt => {
      const s = settingsRef.current;
      const motion = reduced ? 0 : 1;
      const zeta = 1 - 0.85 * Math.min(1, Math.max(0, s.bounce));
      const omega = 4 / (zeta * Math.max(0.2, s.returnDuration));
      const stiffness = omega * omega;
      const damping = 2 * zeta * omega;
      const radius = Math.max(1, s.proximity);
      const speed = Math.hypot(pointer.vx, pointer.vy);
      const drive = pointer.inside ? 6500 * Math.tanh(speed / 900) * s.strength * motion : 0;
      const dirX = speed > 0.001 ? pointer.vx / speed : 0;
      const dirY = speed > 0.001 ? pointer.vy / speed : 0;
      const coupling = (Math.max(0, s.tension) * 900) ** 2 / (grid.cell * grid.cell);
      const viscosity = Math.sqrt(coupling) * 0.06;
      const limit = Math.sqrt(stiffness + 8 * coupling) + damping + 8 * viscosity;
      const steps = Math.min(24, Math.max(1, Math.ceil(dt / Math.min(1 / 120, 1.2 / limit))));
      const h = dt / steps;
      for (let i = 0; i < grid.count; i++) {
        const index = i * 2;
        let ax = 0;
        let ay = 0;
        if (drive > 0) {
          const ex = restPos[index] + offset[index] - pointer.x;
          const ey = restPos[index + 1] + offset[index + 1] - pointer.y;
          const distance = Math.hypot(ex, ey);
          if (distance < radius) {
            const weight = smootherstep(1 - distance / radius) * drive;
            const nx = distance > 0.001 ? ex / distance : 0;
            const ny = distance > 0.001 ? ey / distance : 0;
            ax += weight * (dirX + nx * 0.6);
            ay += weight * (dirY + ny * 0.6);
          }
        }
        force[index] = ax;
        force[index + 1] = ay;
      }
      const { cols, rows } = grid;
      const stride = cols * 2;
      for (let n = 0; n < steps; n++) {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const index = (row * cols + col) * 2;
            let ax = force[index] - stiffness * offset[index] - damping * velocity[index];
            let ay =
              force[index + 1] - stiffness * offset[index + 1] - damping * velocity[index + 1];
            if (coupling > 0) {
              let lx = -4 * offset[index];
              let ly = -4 * offset[index + 1];
              let mx = -4 * velocity[index];
              let my = -4 * velocity[index + 1];
              if (col > 0) {
                lx += offset[index - 2];
                ly += offset[index - 1];
                mx += velocity[index - 2];
                my += velocity[index - 1];
              }
              if (col < cols - 1) {
                lx += offset[index + 2];
                ly += offset[index + 3];
                mx += velocity[index + 2];
                my += velocity[index + 3];
              }
              if (row > 0) {
                lx += offset[index - stride];
                ly += offset[index - stride + 1];
                mx += velocity[index - stride];
                my += velocity[index - stride + 1];
              }
              if (row < rows - 1) {
                lx += offset[index + stride];
                ly += offset[index + stride + 1];
                mx += velocity[index + stride];
                my += velocity[index + stride + 1];
              }
              ax += coupling * lx + viscosity * mx;
              ay += coupling * ly + viscosity * my;
            }
            next[index] = velocity[index] + ax * h;
            next[index + 1] = velocity[index + 1] + ay * h;
          }
        }
        for (let i = 0; i < offset.length; i++) {
          velocity[i] = next[i];
          offset[i] += velocity[i] * h;
        }
      }
      for (let i = 0; i < grid.count; i++) {
        const index = i * 2;
        energy[i] = Math.min(
          1,
          (Math.hypot(velocity[index], velocity[index + 1]) / 380) * 0.85 +
            (Math.hypot(offset[index], offset[index + 1]) / (grid.cell * 2.2)) * 0.35,
        );
      }
      const decay = 1 - Math.exp(-dt / 0.08);
      pointer.vx -= pointer.vx * decay;
      pointer.vy -= pointer.vy * decay;
      const presenceTarget = pointer.inside ? 1 : 0;
      pointer.presence += (presenceTarget - pointer.presence) * (1 - Math.exp(-dt / 0.2));
    };

    const settled = now => {
      if (introStart !== null && introStart !== Infinity) {
        if ((now - introStart) / 1000 < INTRO_SECONDS) {
          return false;
        }
        introStart = null;
      }
      if (Math.abs(pointer.vx) + Math.abs(pointer.vy) > 1) {
        return false;
      }
      const presenceTarget = pointer.inside ? 1 : 0;
      if (Math.abs(presenceTarget - pointer.presence) > 0.002) {
        return false;
      }
      for (let i = 0; i < offset.length; i++) {
        if (Math.abs(offset[i]) > 0.02 || Math.abs(velocity[i]) > 0.5) {
          return false;
        }
      }
      return true;
    };

    const frame = now => {
      raf = 0;
      if (document.hidden) {
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      step(dt);
      render(now);
      if (!settled(now)) {
        raf = requestAnimationFrame(frame);
      }
    };

    const wake = () => {
      if (raf || document.hidden) {
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = event => {
      if (event.pointerType === 'touch') {
        return;
      }
      const x = event.clientX;
      const y = event.clientY;
      const inside = x >= 0 && y >= 0 && x <= view.width && y <= view.height;
      const time = event.timeStamp || performance.now();
      if (inside && pointer.inside && pointer.time) {
        const elapsed = Math.max(4, time - pointer.time) / 1000;
        pointer.vx += ((x - pointer.x) / elapsed - pointer.vx) * 0.6;
        pointer.vy += ((y - pointer.y) / elapsed - pointer.vy) * 0.6;
      } else {
        pointer.vx = 0;
        pointer.vy = 0;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.time = time;
      pointer.inside = inside;
      wake();
    };

    const onLeave = () => {
      pointer.inside = false;
      pointer.time = 0;
      wake();
    };

    const onOut = event => {
      if (!event.relatedTarget) {
        onLeave();
      }
    };

    const startIntro = () => {
      if (introStart !== Infinity) {
        return;
      }
      introStart = performance.now();
      wake();
    };

    // The loader tells us when its curtain starts to open; fall back after a while regardless
    // the loader fires the event as its curtain starts to open
    let introTimer = 0;
    const onReveal = () => {
      introTimer = window.setTimeout(startIntro, 100);
    };
    window.addEventListener('portfolio:reveal', onReveal);
    const introFallback = waitRef.current ? window.setTimeout(startIntro, 6000) : 0;

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerout', onOut);
    window.addEventListener('blur', onLeave);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      wake();
    });
    resizeObserver.observe(canvas);

    // Theme toggle rewrites CSS variables on <html>: repaint with the new colors
    const themeObserver = new MutationObserver(() => {
      theme = readTheme();
      render(performance.now());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    });

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        wake();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    wake();
    if (readyRef.current) {
      readyRef.current();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(introFallback);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.clearTimeout(introTimer);
      window.removeEventListener('portfolio:reveal', onReveal);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('blur', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteBuffer(cornerBuffer);
      gl.deleteBuffer(instanceBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <StyledDotGrid aria-hidden="true">
      <canvas ref={canvasRef} />
    </StyledDotGrid>
  );
};

DotGrid.propTypes = {
  dotSize: PropTypes.number,
  gap: PropTypes.number,
  proximity: PropTypes.number,
  strength: PropTypes.number,
  bounce: PropTypes.number,
  tension: PropTypes.number,
  returnDuration: PropTypes.number,
  swell: PropTypes.number,
  glow: PropTypes.number,
  rest: PropTypes.number,
  waitForIntro: PropTypes.bool,
  onReady: PropTypes.func,
};

export default DotGrid;
