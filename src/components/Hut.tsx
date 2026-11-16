import hutUrl from '../assets/images/hut.webp';

const PUFFS = [0, 1, 2, 3, 4];

/** The log cabin, with smoke drifting from its chimney and a flickering warm glow. */
export function Hut() {
  return (
    <div className="ca-hut">
      <svg className="ca-smoke" viewBox="0 0 120 140">
        {PUFFS.map((i) => (
          <circle
            key={i}
            className="ca-smoke-puff"
            cx="30"
            cy="128"
            r="11"
            style={{ animationDelay: `calc(${-i * 1.32}s / var(--ca-speed))` }}
          />
        ))}
      </svg>
      <img className="ca-art" src={hutUrl} alt="" draggable={false} />
      <div className="ca-hut-glow" />
    </div>
  );
}
