import { useCallback, useEffect, useRef, useState, type AnimationEvent } from 'react';
import { SpeechBubble } from './SpeechBubble';

interface SantaProps {
  /** False while the scene is paused or off screen. */
  active: boolean;
  speed: number;
  reducedMotion: boolean;
  onSpeak?: () => void;
}

/** Seconds for one full loop at speed 1: the crossing plus a pause out of sight. */
export const SANTA_PERIOD = 34;
/** Santa calls out while he is over the middle of the scene. */
const SPEAK_FROM = 0.24;
const SPEAK_UNTIL = 0.42;
/** He greets most passes, not every single one. */
const SPEAK_CHANCE = 0.8;

function Reindeer({ x, y, lead = false, delay }: { x: number; y: number; lead?: boolean; delay: number }) {
  const gallop = { animationDelay: `calc(${delay}s / var(--ca-speed))` };
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="ca-reindeer" style={gallop}>
        {/* far legs */}
        <g transform="translate(37 47)"><path className="ca-leg ca-leg--b" style={gallop} d="M0,0L-3,13L0,25" /></g>
        <g transform="translate(64 47)"><path className="ca-leg ca-leg--a" style={gallop} d="M0,0L4,12L1,25" /></g>
        {/* tail, body, neck */}
        <circle cx="76" cy="36" r="4" fill="#f3e6d3" />
        <ellipse cx="52" cy="41" rx="25" ry="11.5" fill="#8a5a3a" />
        <ellipse cx="54" cy="46" rx="18" ry="5.5" fill="#b98a62" opacity="0.6" />
        <path d="M34,46C26,40 22,30 20,22L32,20C34,28 40,34 46,36z" fill="#8a5a3a" />
        {/* near legs */}
        <g transform="translate(33 48)"><path className="ca-leg ca-leg--a" style={gallop} d="M0,0L-4,13L-1,26" /></g>
        <g transform="translate(69 48)"><path className="ca-leg ca-leg--b" style={gallop} d="M0,0L4,13L1,26" /></g>
        {/* head */}
        <path d="M31,15l5,-8l2,9z" fill="#6f452b" />
        <ellipse cx="22" cy="20" rx="11" ry="7.5" transform="rotate(-14 22 20)" fill="#94623f" />
        <ellipse cx="13" cy="23" rx="5.5" ry="4.5" fill="#b98a62" />
        <circle cx="21" cy="17.5" r="1.5" fill="#1b1b2f" />
        {lead ? (
          <>
            <circle className="ca-rudolph-glow" cx="8.5" cy="22" r="8" fill="#ff3b3b" opacity="0.45" />
            <circle cx="8.5" cy="22" r="3" fill="#ff3b3b" />
            <circle cx="7.7" cy="21" r="1" fill="#ffd0d0" />
          </>
        ) : (
          <circle cx="8.5" cy="22.5" r="2.2" fill="#2b170f" />
        )}
        {/* antlers */}
        <path d="M27,13C26,6 28,2 33,-2M28,7L22,2M30,3L35,5M32,14C34,8 38,5 43,3M35,9L40,10" fill="none" stroke="#e3c79b" strokeWidth="2" strokeLinecap="round" />
        {/* harness */}
        <path d="M36,31q5,10 2,20" fill="none" stroke="#c81f33" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="38" cy="50" r="2.4" fill="#ffd166" />
      </g>
    </g>
  );
}

function SantaArtwork() {
  return (
    <svg viewBox="0 0 620 160" className="ca-santa-svg">
      {/* magic dust trailing behind the sleigh */}
      <g className="ca-dust" fill="#ffe9a8">
        {[
          [512, 96, 2.6], [530, 84, 1.8], [546, 104, 2.2], [560, 90, 1.5], [574, 108, 1.9],
          [588, 96, 1.3], [600, 112, 1.6], [522, 112, 1.4], [552, 118, 1.2], [608, 102, 1],
        ].map(([x, y, r], i) => (
          <path
            key={i}
            className="ca-dust-spark"
            style={{ animationDelay: `calc(${-i * 0.23}s / var(--ca-speed))` }}
            transform={`translate(${x} ${y}) scale(${r})`}
            d="M0,-3L0.8,-0.8L3,0L0.8,0.8L0,3L-0.8,0.8L-3,0L-0.8,-0.8z"
          />
        ))}
      </g>

      {/* reins */}
      <path d="M352,84Q300,96 262,84M352,84Q230,104 164,84M352,84Q180,112 66,84" fill="none" stroke="#3b2218" strokeWidth="1.4" opacity="0.85" />

      <Reindeer x={28} y={36} lead delay={0} />
      <Reindeer x={126} y={38} delay={-0.18} />
      <Reindeer x={224} y={36} delay={-0.36} />

      {/* sack of presents */}
      <rect x="452" y="46" width="18" height="18" rx="2" fill="#3fa7d6" transform="rotate(-12 461 55)" />
      <path d="M452,54l18,-4M459,46l4,18" stroke="#fff" strokeWidth="2" transform="rotate(-12 461 55)" />
      <rect x="476" y="40" width="16" height="16" rx="2" fill="#ffd166" transform="rotate(10 484 48)" />
      <path d="M452,100C440,76 452,56 470,58C492,52 506,70 498,100z" fill="#7a4a2a" />
      <path d="M466,60q8,-10 18,-2" fill="none" stroke="#5b331f" strokeWidth="3" strokeLinecap="round" />
      <path d="M458,92q-4,-16 6,-26" fill="none" stroke="#a06a42" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

      {/* Santa */}
      <g className="ca-santa-wave">
        <path d="M434,74L452,44" stroke="#c8102e" strokeWidth="11" strokeLinecap="round" />
        <circle cx="452" cy="43" r="6.5" fill="#fff" />
        <circle cx="455" cy="35" r="6" fill="#2b170f" />
      </g>
      <ellipse cx="424" cy="84" rx="21" ry="24" fill="#d4172f" />
      <path d="M424,62v40" stroke="#fff" strokeWidth="5" />
      <rect x="404" y="88" width="40" height="6" fill="#1b1b2f" />
      <rect x="420" y="86.5" width="9" height="9" rx="1.5" fill="none" stroke="#ffd166" strokeWidth="2" />
      {/* head */}
      <circle cx="419" cy="52" r="11.5" fill="#f6cdaa" />
      <path d="M409,52C404,62 408,76 420,78C431,76 434,64 431,54C426,60 414,60 409,52z" fill="#fff" />
      <path d="M408,55q6,-4 11,0q-5,5 -11,0z" fill="#fff" />
      <circle cx="408.5" cy="53" r="2.6" fill="#f0a58a" />
      <circle cx="413" cy="49" r="1.3" fill="#1b1b2f" />
      <circle cx="410" cy="58" r="2.2" fill="#ffb3b3" opacity="0.6" />
      {/* hat streaming back in the wind */}
      <path d="M408,45C408,30 428,26 440,34C450,40 456,44 464,42C458,52 446,52 432,46z" fill="#d4172f" />
      <path d="M406,48q13,-9 27,-2" fill="none" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" />
      <circle cx="465" cy="42" r="5" fill="#fff" />
      {/* arm holding the reins */}
      <path d="M414,76L378,84" stroke="#c8102e" strokeWidth="10.5" strokeLinecap="round" />
      <circle cx="376" cy="84.5" r="6" fill="#fff" />
      <circle cx="369" cy="85" r="5.5" fill="#2b170f" />

      {/* sleigh */}
      <path d="M350,82C340,60 356,50 366,60C372,92 392,100 430,100L478,100C494,100 500,86 498,62L508,62C514,96 500,122 474,122L384,122C362,122 354,104 350,82z" fill="#c8102e" />
      <path d="M350,82C340,60 356,50 366,60C372,92 392,100 430,100L478,100C494,100 500,86 498,62L508,62" fill="none" stroke="#ffd166" strokeWidth="3" strokeLinecap="round" />
      <path d="M372,110q50,8 116,-2" fill="none" stroke="#ffd166" strokeWidth="2" opacity="0.8" />
      <path d="M392,122v14M470,122v14" stroke="#e0b24a" strokeWidth="3" />
      <path d="M346,126C338,126 336,136 346,137L494,137C510,137 518,126 512,114" fill="none" stroke="#ffd166" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Santa({ active, speed, reducedMotion, onSpeak }: SantaProps) {
  const [speaking, setSpeaking] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const firstPass = useRef(true);
  const onSpeakRef = useRef(onSpeak);
  onSpeakRef.current = onSpeak;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  /** Queues the greeting for one pass, timed against the flight animation. */
  const schedulePass = useCallback(() => {
    clearTimers();
    setSpeaking(false);
    const always = firstPass.current;
    firstPass.current = false;
    if (!always && Math.random() > SPEAK_CHANCE) return;
    const period = (SANTA_PERIOD * 1000) / speed;
    timers.current = [
      setTimeout(() => {
        setSpeaking(true);
        onSpeakRef.current?.();
      }, period * SPEAK_FROM),
      setTimeout(() => setSpeaking(false), period * SPEAK_UNTIL),
    ];
  }, [clearTimers, speed]);

  // With reduced motion Santa hovers in place, so the greeting runs on a plain timer.
  useEffect(() => {
    if (!active) {
      clearTimers();
      setSpeaking(false);
      return;
    }
    if (!reducedMotion) return clearTimers;
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      setSpeaking(true);
      onSpeakRef.current?.();
      timer = setTimeout(hide, 4200);
    };
    const hide = () => {
      setSpeaking(false);
      timer = setTimeout(show, 9000 + Math.random() * 6000);
    };
    timer = setTimeout(show, 5000);
    return () => clearTimeout(timer);
  }, [active, reducedMotion, clearTimers]);

  const handleFlight = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && active && !reducedMotion) schedulePass();
  };

  return (
    <div
      className="ca-santa-track"
      style={{ animationDuration: `${SANTA_PERIOD / speed}s` }}
      onAnimationStart={handleFlight}
      onAnimationIteration={handleFlight}
    >
      <div className="ca-santa-arc" style={{ animationDuration: `${SANTA_PERIOD / speed}s` }}>
        <div className="ca-santa">
          <SpeechBubble visible={speaking} className="ca-bubble--santa">
            Hahaha! Merry Christmas! 🎅
          </SpeechBubble>
          <SantaArtwork />
        </div>
      </div>
    </div>
  );
}
