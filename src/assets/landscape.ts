import { createRandom, lerp, r1 } from '../animations/random';

type Point = readonly [number, number];

const toPath = (points: readonly Point[]): string =>
  `M${points.map(([x, y]) => `${r1(x)},${r1(y)}`).join('L')}Z`;

export interface Peak {
  /** Whole mountain silhouette. */
  body: string;
  /** Snow cap with a jagged lower edge. */
  snow: string;
  /** The face turned away from the moon, drawn as a translucent shadow. */
  shade: string;
}

/** [centre x, summit y, left half-width, right half-width] */
export type PeakSpec = readonly [number, number, number, number];

const SEGMENTS = 6;

function buildPeak(rand: () => number, [cx, top, wl, wr]: PeakSpec, base: number): Peak {
  const rise = base - top;
  const slope = (halfWidth: number, direction: 1 | -1): Point[] => {
    const points: Point[] = [[cx, top]];
    for (let i = 1; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      const jitter = i < SEGMENTS ? (rand() - 0.5) * halfWidth * 0.09 : 0;
      points.push([cx + direction * halfWidth * t + jitter, top + rise * t + (rand() - 0.5) * rise * 0.03]);
    }
    return points;
  };
  const left = slope(wl, -1);
  const right = slope(wr, 1);

  // A wandering ridge line from the summit to the foot splits the lit and shaded faces.
  const ridge: Point[] = [];
  const drift = (wr - wl) * 0.2 + (rand() - 0.5) * 40;
  for (let i = 1; i <= 5; i++) {
    const t = i / 5;
    ridge.push([cx + drift * t + (i % 2 ? 1 : -1) * (wl + wr) * 0.035 * t, lerp(top, base, t)]);
  }

  const snowLeft = left.slice(0, 3);
  const snowRight = right.slice(0, 3);
  const [fromX, fromY] = snowRight[2];
  const [toX, toY] = snowLeft[2];
  const teeth: Point[] = [];
  for (let j = 1; j <= 7; j++) {
    const t = j / 8;
    const depth = rise * 0.09 * (0.6 + rand() * 0.8);
    teeth.push([lerp(fromX, toX, t), lerp(fromY, toY, t) + (j % 2 ? depth : -depth * 0.4)]);
  }

  return {
    body: toPath([...left.slice().reverse(), ...right.slice(1)]),
    snow: toPath([...snowLeft.slice().reverse(), ...snowRight.slice(1), ...teeth]),
    shade: toPath([[cx, top], ...right.slice(1), ...ridge.slice().reverse()]),
  };
}

/**
 * The landscape is generated well beyond the 1600-unit viewBox on both sides,
 * so very wide banners still have mountains from edge to edge.
 */
export const LANDSCAPE_FROM = -1600;
export const LANDSCAPE_TO = 3200;

interface RangeOptions {
  spacing: number;
  /** Summit height range (smaller y is taller). */
  top: readonly [number, number];
  halfWidth: readonly [number, number];
  base: number;
}

export function buildRange(seed: number, { spacing, top, halfWidth, base }: RangeOptions): Peak[] {
  const rand = createRandom(seed);
  const peaks: Peak[] = [];
  for (let x = LANDSCAPE_FROM; x <= LANDSCAPE_TO; x += spacing * (0.85 + rand() * 0.3)) {
    const spec: PeakSpec = [
      x,
      lerp(top[0], top[1], rand()),
      lerp(halfWidth[0], halfWidth[1], rand()),
      lerp(halfWidth[0], halfWidth[1], rand()),
    ];
    peaks.push(buildPeak(rand, spec, base));
  }
  return peaks;
}

/** A row of distant pine silhouettes as a single path. */
export function buildForest(
  seed: number,
  base: number,
  minHeight: number,
  maxHeight: number,
): string {
  const rand = createRandom(seed);
  let d = '';
  for (let x = LANDSCAPE_FROM; x < LANDSCAPE_TO; x += 11 + rand() * 20) {
    const h = lerp(minHeight, maxHeight, rand() ** 1.5);
    const w = h * 0.3;
    const foot = base + rand() * 6;
    for (let tier = 0; tier < 3; tier++) {
      const tierWidth = w * (1 - 0.24 * tier);
      const bottom = foot - h * 0.27 * tier;
      const tip = tier === 2 ? foot - h : bottom - h * 0.5;
      d += `M${r1(x - tierWidth)},${r1(bottom)}L${r1(x)},${r1(tip)}L${r1(x + tierWidth)},${r1(bottom)}Z`;
    }
  }
  return d;
}

export interface Star {
  /** Position as a percentage of the sky. */
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkle: boolean;
  delay: number;
  duration: number;
}

export function buildStars(seed: number, count: number): Star[] {
  const rand = createRandom(seed);
  return Array.from({ length: count }, () => {
    const size = rand();
    return {
      x: r1(rand() * 100),
      // Fewer stars near the horizon, where the sky is brighter.
      y: r1(rand() ** 1.4 * 72),
      radius: r1(0.5 + size ** 3 * 1.5),
      opacity: r1(0.35 + rand() * 0.6),
      twinkle: rand() < 0.4,
      delay: r1(rand() * 6),
      duration: r1(2.5 + rand() * 4),
    };
  });
}

export const FAR_RANGE = buildRange(11, { spacing: 340, top: [70, 150], halfWidth: [250, 320], base: 420 });
export const NEAR_RANGE = buildRange(29, { spacing: 325, top: [175, 240], halfWidth: [220, 290], base: 420 });
export const FOREST_BACK = buildForest(5, 392, 26, 58);
export const FOREST_FRONT = buildForest(8, 412, 34, 76);
export const STARS = buildStars(3, 130);
