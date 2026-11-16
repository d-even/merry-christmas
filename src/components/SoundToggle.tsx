interface SoundToggleProps {
  on: boolean;
  onToggle: () => void;
}

export function SoundToggle({ on, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      className="ca-sound"
      aria-pressed={on}
      aria-label={on ? 'Mute sound' : 'Play sound'}
      title={on ? 'Mute sound' : 'Play sound'}
      onClick={onToggle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4,9.5h3.5L12,5.5v13l-4.5,-4H4z" fill="currentColor" />
        {on ? (
          <path
            d="M15,9.2a4,4 0 0 1 0,5.6M17.3,6.8a7.3,7.3 0 0 1 0,10.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        ) : (
          <path d="M15.5,9.5l5,5M20.5,9.5l-5,5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
