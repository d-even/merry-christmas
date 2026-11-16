import type { CanvasRenderer } from './hooks';
import { clamp, lerp } from './random';

interface Flake {
  x: number;
  y: number;
  radius: number;
  fall: number;
  sway: number;
  swayRate: number;
  phase: number;
  alpha: number;
  /** 0 = far away, 1 = right in front of the camera. */
  depth: number;
}

export interface SnowRenderer extends CanvasRenderer {
  setIntensity(intensity: number): void;
}

const MAX_FLAKES = 900;
const MAX_DPR = 2;
const SPRITE_SIZE = 32;

/** A soft round flake, drawn once and stamped for every snowflake. */
function createFlakeSprite(): HTMLCanvasElement | null {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext('2d');
  if (!ctx) return null;
  const half = SPRITE_SIZE / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.85)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return sprite;
}

export function createSnowRenderer(
  canvas: HTMLCanvasElement,
  initialIntensity: number,
): SnowRenderer | null {
  const ctx = canvas.getContext('2d');
  const sprite = createFlakeSprite();
  if (!ctx || !sprite) return null;

  const flakes: Flake[] = [];
  let width = 0;
  let height = 0;
  let scale = 1;
  let time = 0;
  let intensity = initialIntensity;

  const place = (flake: Flake, anywhere: boolean) => {
    // Squaring biases towards distant flakes: many small ones, a few big close ones.
    const depth = Math.random() ** 2;
    flake.depth = depth;
    flake.radius = lerp(0.7, 4.2, depth ** 1.6) * scale;
    flake.fall = lerp(22, 95, depth) * scale * (0.8 + Math.random() * 0.4);
    flake.sway = lerp(5, 24, depth) * scale;
    flake.swayRate = 0.4 + Math.random() * 0.9;
    flake.phase = Math.random() * Math.PI * 2;
    flake.alpha = lerp(0.35, 0.95, depth) * (0.7 + Math.random() * 0.3);
    flake.x = Math.random() * width;
    flake.y = anywhere ? Math.random() * height : -flake.radius * 2 - Math.random() * 40;
  };

  const syncCount = () => {
    if (!width) return;
    const target = Math.round(clamp((width * height) / 7000, 40, 320) * intensity);
    const count = Math.min(MAX_FLAKES, target);
    while (flakes.length < count) {
      const flake = {} as Flake;
      place(flake, true);
      flakes.push(flake);
    }
    flakes.length = Math.min(flakes.length, count);
  };

  return {
    setIntensity(next) {
      intensity = next;
      syncCount();
    },

    resize(cssWidth, cssHeight) {
      if (!cssWidth || !cssHeight) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const firstLayout = width === 0;
      const sx = width ? cssWidth / width : 1;
      const sy = height ? cssHeight / height : 1;
      width = cssWidth;
      height = cssHeight;
      scale = clamp(Math.sqrt(width * height) / 1100, 0.55, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!firstLayout) {
        for (const flake of flakes) {
          flake.x *= sx;
          flake.y *= sy;
        }
      }
      syncCount();
    },

    render(dt) {
      if (!width) return;
      time += dt;
      // A slow, wandering breeze so the snow never falls in dead-straight lines.
      const wind = (Math.sin(time * 0.13) * 22 + Math.sin(time * 0.41 + 1.7) * 9 + 8) * scale;
      ctx.clearRect(0, 0, width, height);

      for (const flake of flakes) {
        flake.y += flake.fall * dt;
        flake.x += wind * (0.3 + flake.depth) * dt;
        const margin = flake.radius * 2 + flake.sway;
        if (flake.y - margin > height) place(flake, false);
        if (flake.x > width + margin) flake.x = -margin;
        else if (flake.x < -margin) flake.x = width + margin;

        const x = flake.x + Math.sin(time * flake.swayRate + flake.phase) * flake.sway;
        // The sprite fades to nothing at its rim, so it is drawn larger than the flake's core.
        const size = flake.radius * 3.2;
        ctx.globalAlpha = flake.alpha;
        ctx.drawImage(sprite, x - size / 2, flake.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    },
  };
}
