import { r1 } from '../animations/random';

/** [top y, bottom y, half-width] of each layer of branches, bottom layer first. */
export type Tier = readonly [number, number, number];

export const PINE_TIERS: readonly Tier[] = [
  [150, 262, 78],
  [100, 205, 62],
  [58, 150, 46],
  [24, 98, 30],
];

export const PINE_CENTRE = 100;

/** A layer of branches: curved sides and a scalloped, drooping lower edge. */
export function tierPath([top, bottom, half]: Tier, cx = PINE_CENTRE): string {
  const h = bottom - top;
  const scallops = 5;
  const step = (2 * half) / scallops;
  let d = `M${cx},${top}Q${r1(cx + half * 0.35)},${r1(top + h * 0.6)} ${cx + half},${bottom}`;
  for (let i = 1; i <= scallops; i++) {
    const x = cx + half - step * i;
    const tipLift = i === scallops ? 0 : i % 2 ? h * 0.05 : 0;
    d += `Q${r1(x + step * 0.5)},${r1(bottom - h * 0.17)} ${r1(x)},${r1(bottom - tipLift)}`;
  }
  return `${d}Q${r1(cx - half * 0.35)},${r1(top + h * 0.6)} ${cx},${top}Z`;
}

/** Snow resting on a layer: follows the upper slopes, with soft lobes hanging off the edge. */
export function tierSnowPath([top, bottom, half]: Tier, cx = PINE_CENTRE): string {
  const h = bottom - top;
  const edgeX = half * 0.528;
  const edgeY = top + h * 0.648;
  const lobes = 4;
  const step = (2 * edgeX) / lobes;
  let d = `M${cx},${top - 2}Q${r1(cx + half * 0.21)},${r1(top + h * 0.36)} ${r1(cx + edgeX)},${r1(edgeY)}`;
  for (let i = 0; i < lobes; i++) {
    const drop = h * (i % 2 ? 0.2 : 0.11);
    d += `q${r1(-step / 2)},${r1(drop)} ${r1(-step)},0`;
  }
  return `${d}Q${r1(cx - half * 0.21)},${r1(top + h * 0.36)} ${cx},${top - 2}Z`;
}

export interface TreeLight {
  x: number;
  y: number;
  color: string;
}

const WARM = '#ffe6a3';
const GOLD = '#ffc75a';
const ROSE = '#ff8f8f';
const ICE = '#bfe3ff';

/** Deliberately sparse: a natural pine with a single loose string of lights. */
export const TREE_LIGHTS: readonly TreeLight[] = [
  { x: 89, y: 89, color: WARM },
  { x: 111, y: 91, color: GOLD },
  { x: 72, y: 139, color: GOLD },
  { x: 95, y: 144, color: WARM },
  { x: 122, y: 137, color: ROSE },
  { x: 57, y: 192, color: WARM },
  { x: 82, y: 198, color: ICE },
  { x: 108, y: 195, color: WARM },
  { x: 138, y: 190, color: GOLD },
  { x: 42, y: 247, color: GOLD },
  { x: 68, y: 254, color: WARM },
  { x: 96, y: 251, color: ROSE },
  { x: 124, y: 255, color: WARM },
  { x: 152, y: 246, color: ICE },
];
