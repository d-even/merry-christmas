import type { CanvasRenderer } from './hooks';

type RGB = readonly [number, number, number];

interface Ribbon {
  /** Height of the curtain's lower edge, as a fraction of the canvas height. */
  base: number;
  /** Slope of the ribbon across the sky. */
  tilt: number;
  /** How far the lower edge waves up and down. */
  amp: number;
  f1: number;
  f2: number;
  s1: number;
  s2: number;
  /** Curtain height as a fraction of the canvas height. */
  height: number;
  alpha: number;
  phase: number;
  /** Colour of the bright lower edge. */
  low: RGB;
  /** Colour the curtain fades into higher up. */
  high: RGB;
}

const RIBBONS: readonly Ribbon[] = [
  { base: 0.56, tilt: 0.24, amp: 0.09, f1: 0.9, f2: 2.3, s1: 0.11, s2: 0.17, height: 0.6, alpha: 1, phase: 0, low: [70, 255, 170], high: [60, 130, 255] },
  { base: 0.4, tilt: -0.12, amp: 0.1, f1: 1.3, f2: 3.1, s1: 0.08, s2: 0.21, height: 0.46, alpha: 0.75, phase: 2.1, low: [60, 235, 205], high: [140, 90, 255] },
  { base: 0.7, tilt: 0.3, amp: 0.07, f1: 0.7, f2: 2.7, s1: 0.14, s2: 0.1, height: 0.52, alpha: 0.7, phase: 4.2, low: [120, 255, 150], high: [70, 170, 255] },
  { base: 0.3, tilt: -0.18, amp: 0.07, f1: 1.7, f2: 4, s1: 0.06, s2: 0.13, height: 0.36, alpha: 0.65, phase: 5.5, low: [190, 110, 255], high: [255, 100, 205] },
];

const SPRITE_HEIGHT = 128;
/** The aurora is drawn small and scaled up by the browser, which is both cheap and naturally soft. */
const INTERNAL_WIDTH = 640;
const COLUMN = 2;

/** One vertical slice of curtain: transparent at the top, brightest just above the lower edge. */
function createSprite(ribbon: Ribbon): HTMLCanvasElement | null {
  const sprite = document.createElement('canvas');
  sprite.width = 1;
  sprite.height = SPRITE_HEIGHT;
  const ctx = sprite.getContext('2d');
  if (!ctx) return null;
  const [lr, lg, lb] = ribbon.low;
  const [hr, hg, hb] = ribbon.high;
  const gradient = ctx.createLinearGradient(0, 0, 0, SPRITE_HEIGHT);
  gradient.addColorStop(0, `rgba(${hr},${hg},${hb},0)`);
  gradient.addColorStop(0.3, `rgba(${hr},${hg},${hb},0.3)`);
  gradient.addColorStop(0.7, `rgba(${lr},${lg},${lb},0.7)`);
  gradient.addColorStop(0.9, `rgba(${Math.min(255, lr + 90)},255,${Math.min(255, lb + 60)},0.95)`);
  gradient.addColorStop(0.97, `rgba(${lr},${lg},${lb},0.4)`);
  gradient.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1, SPRITE_HEIGHT);
  return sprite;
}

export function createAuroraRenderer(canvas: HTMLCanvasElement): CanvasRenderer | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const sprites = RIBBONS.map(createSprite);
  let width = 0;
  let height = 0;
  let time = 40; // start mid-motion rather than from a flat line

  return {
    resize(cssWidth, cssHeight) {
      if (!cssWidth || !cssHeight) return;
      width = Math.round(Math.min(INTERNAL_WIDTH, cssWidth));
      height = Math.max(60, Math.round((width * cssHeight) / cssWidth));
      canvas.width = width;
      canvas.height = height;
    },

    render(dt) {
      if (!width) return;
      time += dt;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < RIBBONS.length; i++) {
        const ribbon = RIBBONS[i];
        const sprite = sprites[i];
        if (!sprite) continue;
        const p = ribbon.phase;
        const breathing = 0.72 + 0.28 * Math.sin(time * 0.19 + p * 1.3);

        for (let x = 0; x < width; x += COLUMN) {
          const u = x / width;
          const wave =
            Math.sin(u * ribbon.f1 * 6.283 + time * ribbon.s1 + p) * 0.6 +
            Math.sin(u * ribbon.f2 * 6.283 - time * ribbon.s2 + p * 1.7) * 0.4;
          const bottom = height * (ribbon.base + ribbon.tilt * (u - 0.5) + ribbon.amp * wave);
          const curtain =
            height * ribbon.height * (0.72 + 0.28 * Math.sin(u * 5.1 + time * 0.23 + p));
          // Fine vertical rays that drift sideways, the signature look of an aurora curtain.
          const rays =
            0.55 +
            0.45 *
              ((Math.sin(u * 92 + time * 0.8 + p) +
                Math.sin(u * 37 - time * 0.45 + p * 2) +
                Math.sin(u * 151 + time * 1.2)) /
                3);
          // Slow brightness swells travelling along the ribbon.
          const swell = 0.6 + 0.4 * Math.sin(u * 3.3 - time * 0.27 + p * 0.7);
          const edge = Math.min(1, Math.sin(Math.PI * u) * 2.2);

          ctx.globalAlpha = Math.min(1, ribbon.alpha * breathing * rays * swell * edge * 1.9);
          ctx.drawImage(sprite, x, bottom - curtain, COLUMN, curtain);
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    },
  };
}
