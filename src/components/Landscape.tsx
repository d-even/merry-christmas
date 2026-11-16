import { useId } from 'react';
import {
  FAR_RANGE,
  FOREST_BACK,
  FOREST_FRONT,
  LANDSCAPE_FROM,
  LANDSCAPE_TO,
  NEAR_RANGE,
} from '../assets/landscape';
import { Pine } from './Pine';

/** Moonlit mountain ranges with a pine forest along their feet. */
export function Mountains() {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="ca-mountains" viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id={`${id}far`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4f9e" />
          <stop offset="1" stopColor="#353a86" />
        </linearGradient>
        <linearGradient id={`${id}near`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c3180" />
          <stop offset="1" stopColor="#1d2262" />
        </linearGradient>
        <linearGradient id={`${id}haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a5fb8" stopOpacity="0" />
          <stop offset="1" stopColor="#6a5fb8" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <g opacity="0.9">
        {FAR_RANGE.map((peak, i) => (
          <g key={i}>
            <path d={peak.body} fill={`url(#${id}far)`} />
            <path d={peak.snow} fill="#c3ccf7" />
            <path d={peak.shade} fill="#1a1c5c" opacity="0.38" />
          </g>
        ))}
      </g>
      <rect x={LANDSCAPE_FROM} y="200" width={LANDSCAPE_TO - LANDSCAPE_FROM} height="220" fill={`url(#${id}haze)`} />

      {NEAR_RANGE.map((peak, i) => (
        <g key={i}>
          <path d={peak.body} fill={`url(#${id}near)`} />
          <path d={peak.snow} fill="#e3e9ff" />
          <path d={peak.shade} fill="#0d1045" opacity="0.45" />
        </g>
      ))}
      <rect x={LANDSCAPE_FROM} y="290" width={LANDSCAPE_TO - LANDSCAPE_FROM} height="130" fill={`url(#${id}haze)`} />

      <path d={FOREST_BACK} fill="#1a1f5a" />
      <path d={FOREST_FRONT} fill="#10143f" />
    </svg>
  );
}

/** Rolling snow hills in the foreground. Stretches horizontally to fit any width. */
export function Ground({ auroraGlow }: { auroraGlow: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="ca-ground" viewBox="0 0 1600 300" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9aa6ea" />
          <stop offset="1" stopColor="#5a62b4" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c2ccff" />
          <stop offset="0.5" stopColor="#8c96de" />
          <stop offset="1" stopColor="#5d64b6" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef2ff" />
          <stop offset="0.35" stopColor="#b3bdf3" />
          <stop offset="1" stopColor="#5a5fae" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5dffb0" stopOpacity="0" />
          <stop offset="0.45" stopColor="#5dffb0" stopOpacity="0.22" />
          <stop offset="1" stopColor="#7aa8ff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d="M0,62C200,22 420,52 640,40C900,26 1100,6 1320,30C1450,44 1540,40 1600,28V300H0Z" fill={`url(#${id}a)`} />
      <path d="M0,128C260,84 520,120 800,106C1080,92 1300,70 1600,108V300H0Z" fill={`url(#${id}b)`} />
      {auroraGlow ? (
        <path className="ca-ground-glow" d="M0,128C260,84 520,120 800,106C1080,92 1300,70 1600,108V190H0Z" fill={`url(#${id}g)`} />
      ) : null}
      <path d="M0,205C240,160 520,196 820,180C1120,166 1380,192 1600,162V300H0Z" fill={`url(#${id}c)`} />
      <path d="M120,236C300,214 470,228 640,224M930,214C1090,202 1250,214 1420,206" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Dark, snow-laden pines that frame the scene and give it depth. */
export function FramingPines() {
  return (
    <>
      <div className="ca-pine ca-pine--far-a"><Pine /></div>
      <div className="ca-pine ca-pine--far-b"><Pine /></div>
      <div className="ca-pine ca-pine--far-c"><Pine /></div>
      <div className="ca-pine ca-pine--right-back"><Pine /></div>
      <div className="ca-pine ca-pine--right"><Pine /></div>
      <div className="ca-pine ca-pine--left"><Pine /></div>
    </>
  );
}
