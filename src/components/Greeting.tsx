interface GreetingProps {
  title: string | false;
  message: string | false;
}

/** The headline and greeting. This is the only part of the scene exposed to assistive tech. */
export function Greeting({ title, message }: GreetingProps) {
  if (!title && !message) return null;
  return (
    <div className="ca-greeting">
      {title ? (
        <p className="ca-title">
          {title}
          <svg className="ca-holly" viewBox="0 0 60 44" aria-hidden="true">
            <path d="M29,28C18,30 9,25 4,14c5,1 8,-1 10,-5 3,4 7,5 11,3 -1,5 1,9 5,11z" fill="#2f8f5b" />
            <path d="M31,27C36,17 45,12 57,13c-3,4 -3,8 0,11 -5,0 -8,2 -9,7 -3,-4 -7,-5 -11,-2 0,-1 -3,-1 -6,-2z" fill="#237a4b" />
            <circle cx="27" cy="31" r="5" fill="#e0323f" />
            <circle cx="36" cy="33" r="5" fill="#c81f33" />
            <circle cx="31" cy="38" r="5" fill="#ef4b55" />
            <circle cx="29.5" cy="36.5" r="1.3" fill="#fff" opacity="0.7" />
          </svg>
        </p>
      ) : null}
      {title && message ? (
        <div className="ca-divider" aria-hidden="true">
          <span />
          <svg viewBox="0 0 24 24">
            <path
              d="M12,2v20M3.3,7l17.4,10M20.7,7L3.3,17M12,5.5l-2.2,-2M12,5.5l2.2,-2M12,18.5l-2.2,2M12,18.5l2.2,2M6.4,8.8l-2.9,0.6M6.4,8.8l-0.9,-2.8M17.6,15.2l2.9,-0.6M17.6,15.2l0.9,2.8M17.6,8.8l2.9,0.6M17.6,8.8l0.9,-2.8M6.4,15.2l-2.9,-0.6M6.4,15.2l-0.9,2.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span />
        </div>
      ) : null}
      {message ? <p className="ca-message">{message}</p> : null}
    </div>
  );
}
