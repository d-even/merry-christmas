import { createRandom, r1 } from '../animations/random';

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

export const STARS = buildStars(3, 130);
