import { useId } from 'react';
import { PINE_TIERS, TREE_LIGHTS, tierPath, tierSnowPath } from '../assets/pine';

const TIER_PATHS = PINE_TIERS.map((tier) => tierPath(tier));
const SNOW_PATHS = PINE_TIERS.map((tier) => tierSnowPath(tier));

interface PineProps {
  /** Adds the string of lights and the star: this is what makes it the Christmas tree. */
  decorated?: boolean;
}

export function Pine({ decorated = false }: PineProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 200 300" className="ca-pine-svg">
      <defs>
        <linearGradient id={`${id}n`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={decorated ? '#2c7a58' : '#1c4a4d'} />
          <stop offset="1" stopColor={decorated ? '#0f3d2e' : '#0b2333'} />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={decorated ? '#c4cffb' : '#9aa8e6'} />
        </linearGradient>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}h`}>
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.9" />
          <stop offset="0.4" stopColor="#ffd166" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffd166" stopOpacity="0" />
        </radialGradient>
      </defs>

      {decorated ? (
        <>
          <ellipse className="ca-tree-halo" cx="100" cy="170" rx="150" ry="150" fill={`url(#${id}g)`} opacity="0.28" />
          <ellipse cx="100" cy="286" rx="130" ry="16" fill={`url(#${id}g)`} />
        </>
      ) : null}

      <rect x="92" y="252" width="16" height="38" rx="3" fill="#3b2218" />
      <ellipse cx="100" cy="290" rx="34" ry="7" fill="#dfe6ff" />

      {TIER_PATHS.map((d, i) => (
        <g key={i}>
          <path d={d} fill={`url(#${id}n)`} />
          <path d={SNOW_PATHS[i]} fill={`url(#${id}s)`} />
        </g>
      ))}

      {decorated ? (
        <>
          {TREE_LIGHTS.map((light, i) => (
            <g
              key={i}
              className="ca-twinkle"
              style={{ animationDelay: `-${(i * 0.73) % 3.4}s`, color: light.color }}
            >
              <circle cx={light.x} cy={light.y} r="9" fill="currentColor" opacity="0.34" />
              <circle cx={light.x} cy={light.y} r="3.2" fill="currentColor" />
              <circle cx={light.x - 0.9} cy={light.y - 1} r="1.1" fill="#fff" />
            </g>
          ))}
          <g className="ca-tree-star">
            <circle cx="100" cy="20" r="26" fill={`url(#${id}h)`} />
            <path
              d="M100,5l4.3,9.6 10.4,1.1 -7.8,7 2.2,10.3 -9.1,-5.3 -9.1,5.3 2.2,-10.3 -7.8,-7 10.4,-1.1z"
              fill="#ffd866"
              stroke="#fff3c4"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </g>
        </>
      ) : null}
    </svg>
  );
}
