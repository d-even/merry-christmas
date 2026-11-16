import { useId } from 'react';

const LOGS = [122, 138.5, 155, 171.5, 188, 204.5];
const EAVE_LIGHTS: readonly (readonly [number, number, string])[] = [
  [44, 124, '#ff6b6b'],
  [62, 111, '#ffd166'],
  [80, 98, '#7bdcff'],
  [98, 85, '#8cff9e'],
  [116, 72, '#ff6b6b'],
  [134, 59, '#ffd166'],
  [166, 59, '#7bdcff'],
  [184, 72, '#8cff9e'],
  [202, 85, '#ff6b6b'],
  [220, 98, '#ffd166'],
  [238, 111, '#7bdcff'],
  [256, 124, '#8cff9e'],
];

function HutWindow({ x, id }: { x: number; id: string }) {
  return (
    <g>
      <rect x={x - 4} y="146" width="52" height="48" rx="3" fill="#2b170f" />
      <rect className="ca-window-light" x={x} y="150" width="44" height="40" rx="2" fill={`url(#${id}w)`} />
      <path d={`M${x + 22},150v40M${x},170h44`} stroke="#2b170f" strokeWidth="3" />
      {/* curtains */}
      <path d={`M${x},150h13q-2,14 -13,20zM${x + 44},150h-13q2,14 13,20z`} fill="#c8402f" opacity="0.55" />
      <path d={`M${x - 7},194q29,-9 58,0v5h-58z`} fill="#f4f6ff" />
    </g>
  );
}

/** A log cabin with warm windows, fairy lights on the eaves and a smoking chimney. */
export function Hut() {
  const id = useId().replace(/:/g, '');
  return (
    <div className="ca-hut">
      <svg viewBox="0 0 300 240">
        <defs>
          <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9a6238" />
            <stop offset="0.45" stopColor="#7a4728" />
            <stop offset="1" stopColor="#4a2817" />
          </linearGradient>
          <radialGradient id={`${id}w`} cx="0.5" cy="0.6" r="0.75">
            <stop offset="0" stopColor="#fff6cf" />
            <stop offset="0.5" stopColor="#ffc861" />
            <stop offset="1" stopColor="#f08a2c" />
          </radialGradient>
          <radialGradient id={`${id}g`}>
            <stop offset="0" stopColor="#ffb648" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ff9a2e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#c9d3ff" />
          </linearGradient>
        </defs>

        {/* warm light spilling over the snow and around the windows */}
        <ellipse className="ca-window-glow" cx="150" cy="226" rx="170" ry="24" fill={`url(#${id}g)`} />
        <ellipse className="ca-window-glow" cx="90" cy="170" rx="62" ry="54" fill={`url(#${id}g)`} opacity="0.55" />
        <ellipse className="ca-window-glow" cx="210" cy="170" rx="62" ry="54" fill={`url(#${id}g)`} opacity="0.55" />

        {/* chimney smoke */}
        <g className="ca-smoke">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} className="ca-smoke-puff" cx="211" cy="30" r="9" style={{ animationDelay: `calc(${-i * 1.1}s / var(--ca-speed))` }} />
          ))}
        </g>

        {/* chimney */}
        <rect x="196" y="40" width="30" height="64" fill="#5a4856" />
        <path d="M196,56h30M196,72h30M196,88h30M206,40v16M216,56v16M206,72v16M216,88v16" stroke="#3d2f3d" strokeWidth="1.5" />
        <rect x="192" y="36" width="38" height="8" rx="2" fill="#473646" />
        <path d="M190,37q4,-10 14,-7q6,-6 14,-1q11,-2 14,8q-21,5 -42,0z" fill={`url(#${id}s)`} />

        {/* gable */}
        <path d="M44,124L150,44L256,124Z" fill="#5b331f" />
        <path d="M80,124V98M106,124V78M128,124V62M150,124V46M172,124V62M194,124V78M220,124V98" stroke="#43240f" strokeWidth="1.5" opacity="0.7" />
        <circle cx="150" cy="92" r="13" fill="#2b170f" />
        <circle className="ca-window-light" cx="150" cy="92" r="9.5" fill={`url(#${id}w)`} />
        <path d="M150,82.5v19M140.5,92h19" stroke="#2b170f" strokeWidth="2.2" />

        {/* log walls */}
        <rect x="50" y="122" width="200" height="100" fill="#4a2817" />
        {LOGS.map((y) => (
          <g key={y}>
            <rect x="44" y={y} width="212" height="15.5" rx="7.5" fill={`url(#${id}l)`} />
            <circle cx="48" cy={y + 7.75} r="7" fill="#b07a4c" />
            <circle cx="48" cy={y + 7.75} r="3.6" fill="none" stroke="#7a4728" strokeWidth="1.2" />
            <circle cx="252" cy={y + 7.75} r="7" fill="#b07a4c" />
            <circle cx="252" cy={y + 7.75} r="3.6" fill="none" stroke="#7a4728" strokeWidth="1.2" />
          </g>
        ))}

        {/* door with a wreath */}
        <path d="M128,222v-58q0,-14 22,-14t22,14v58z" fill="#2b170f" />
        <path d="M132,222v-57q0,-11 18,-11t18,11v57z" fill="#6a3a22" />
        <path d="M141,156v66M150,154v68M159,156v66" stroke="#4a2817" strokeWidth="1.3" />
        <circle cx="163" cy="194" r="2.2" fill="#ffd166" />
        <circle cx="150" cy="174" r="8.5" fill="none" stroke="#2f8f5b" strokeWidth="5" strokeDasharray="3.5 1.2" />
        <circle cx="145" cy="168" r="1.5" fill="#ef4b55" />
        <circle cx="157" cy="172" r="1.5" fill="#ef4b55" />
        <circle cx="147" cy="181" r="1.5" fill="#ef4b55" />
        <path d="M150,180l-5,6h10z" fill="#e0323f" />

        <HutWindow x={68} id={id} />
        <HutWindow x={188} id={id} />

        {/* roof: dark boards, a blue shadow line, then thick snow */}
        <path d="M28,130L150,38L272,130" fill="none" stroke="#2b170f" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24,122L150,27L276,122" fill="none" stroke="#a9b5ee" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24,117L150,22L276,117" fill="none" stroke={`url(#${id}s)`} strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
        {/* icicles */}
        <path d="M38,121l3,13 3,-15zM70,97l2.5,10 2.5,-12zM104,71l2.5,11 2.5,-13zM192,69l2.5,12 2.5,-10zM230,98l2.5,12 2.5,-9zM258,119l3,13 3,-11z" fill="#dfe8ff" opacity="0.9" />

        {/* fairy lights along the eaves */}
        <path d="M36,132L150,46L264,132" fill="none" stroke="#1c0f0a" strokeWidth="0.8" opacity="0.6" />
        {EAVE_LIGHTS.map(([x, y, color], i) => (
          <g key={i} className="ca-twinkle" style={{ animationDelay: `-${(i * 0.57) % 3.1}s`, color }}>
            <circle cx={x} cy={y + 10} r="8" fill="currentColor" opacity="0.32" />
            <circle cx={x} cy={y + 10} r="3.1" fill="currentColor" />
            <circle cx={x - 0.8} cy={y + 9.1} r="1" fill="#fff" opacity="0.85" />
          </g>
        ))}

        {/* snow drift against the walls */}
        <path d="M14,232q24,-18 52,-12q30,-10 62,-2q34,-8 62,0q32,-8 60,2q22,-4 36,12q-136,16 -272,0z" fill={`url(#${id}s)`} />
      </svg>
    </div>
  );
}
