import { STARS } from '../assets/landscape';

export function Stars() {
  return (
    <>
      <svg className="ca-stars" width="100%" height="100%">
        {STARS.map((star, i) => (
          <circle
            key={i}
            className={star.twinkle ? 'ca-star ca-star--twinkle' : 'ca-star'}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.radius}
            opacity={star.opacity}
            style={
              star.twinkle
                ? { animationDelay: `-${star.delay}s`, animationDuration: `calc(${star.duration}s / var(--ca-speed))` }
                : undefined
            }
          />
        ))}
      </svg>
      <div className="ca-shooting-star" />
    </>
  );
}
