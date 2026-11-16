import { useEffect, useId, useRef, useState } from 'react';
import { SpeechBubble } from './SpeechBubble';

interface SnowmanProps {
  /** False while the scene is paused or off screen: the snowman stops chatting. */
  active: boolean;
  speed: number;
  onSpeak?: () => void;
}

const FIRST_DELAY = 2600;
const VISIBLE_FOR = 3800;

/** Shows the speech bubble every so often, at slightly irregular intervals. */
function useOccasionalSpeech(active: boolean, speed: number, onSpeak?: () => void): boolean {
  const [speaking, setSpeaking] = useState(false);
  const onSpeakRef = useRef(onSpeak);
  onSpeakRef.current = onSpeak;

  useEffect(() => {
    if (!active) {
      setSpeaking(false);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      setSpeaking(true);
      onSpeakRef.current?.();
      timer = setTimeout(hide, VISIBLE_FOR);
    };
    const hide = () => {
      setSpeaking(false);
      timer = setTimeout(show, (6500 + Math.random() * 5500) / speed);
    };
    timer = setTimeout(show, FIRST_DELAY / speed);
    return () => clearTimeout(timer);
  }, [active, speed]);

  return speaking;
}

export function Snowman({ active, speed, onSpeak }: SnowmanProps) {
  const id = useId().replace(/:/g, '');
  const speaking = useOccasionalSpeech(active, speed, onSpeak);

  return (
    <div className={`ca-snowman ${speaking ? 'ca-snowman--excited' : ''}`}>
      <SpeechBubble visible={speaking} className="ca-bubble--snowman">
        Weeeeeeeeee! ☃️
      </SpeechBubble>
      <svg viewBox="0 0 160 220">
        <defs>
          <radialGradient id={`${id}b`} cx="0.36" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#e6ecff" />
            <stop offset="1" stopColor="#a9b5ee" />
          </radialGradient>
          <linearGradient id={`${id}h`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0424f" />
            <stop offset="1" stopColor="#b3162c" />
          </linearGradient>
        </defs>

        <ellipse className="ca-snowman-shadow" cx="84" cy="210" rx="56" ry="8" fill="#3b3f8f" opacity="0.4" />

        <g className="ca-snowman-body">
          {/* stick arms */}
          <g fill="none" stroke="#5b3a26" strokeWidth="3.4" strokeLinecap="round">
            <path d="M54,100L22,80M32,86L24,96M30,85L26,72" />
            <g className="ca-snowman-arm">
              <path d="M106,100L138,74M128,82L140,86M130,80L132,66" />
            </g>
          </g>

          <circle cx="80" cy="162" r="46" fill={`url(#${id}b)`} />
          <circle cx="80" cy="102" r="33" fill={`url(#${id}b)`} />
          <circle cx="80" cy="103" r="2.9" fill="#23233b" />
          <circle cx="80" cy="117" r="2.9" fill="#23233b" />
          <circle cx="80" cy="142" r="3.1" fill="#23233b" />

          <g className="ca-snowman-head">
            <circle cx="80" cy="56" r="25" fill={`url(#${id}b)`} />
            {/* face */}
            <circle cx="71" cy="51" r="3" fill="#1b1b2f" />
            <circle cx="89" cy="51" r="3" fill="#1b1b2f" />
            <circle cx="72" cy="50" r="1" fill="#fff" />
            <circle cx="90" cy="50" r="1" fill="#fff" />
            <circle cx="65" cy="60" r="4.5" fill="#ff8fa3" opacity="0.4" />
            <circle cx="95" cy="60" r="4.5" fill="#ff8fa3" opacity="0.4" />
            <path d="M70,64q10,9 20,0" fill="none" stroke="#1b1b2f" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M80,55L104,60L80,63z" fill="#ff8a3c" />
            <path d="M80,59L104,60L80,63z" fill="#e06a1f" />

            {/* Christmas cap */}
            <g transform="rotate(-9 80 34)">
              <path d="M57,33C58,8 92,-4 110,12C120,21 124,34 124,46C116,33 109,28 103,33z" fill={`url(#${id}h)`} />
              <rect x="53" y="28" width="54" height="12" rx="6" fill="#fff" />
              <rect x="53" y="34" width="54" height="6" rx="3" fill="#d5dcfb" opacity="0.7" />
              <circle cx="124" cy="48" r="7.5" fill="#fff" />
            </g>
          </g>

          {/* scarf */}
          <path d="M57,72Q80,88 103,72L106,83Q80,100 54,83z" fill={`url(#${id}h)`} />
          <path d="M66,79l-1,10M80,83v10M94,79l1,10" stroke="#fff" strokeOpacity="0.55" strokeWidth="2.4" />
          <g className="ca-snowman-scarf">
            <path d="M90,84l10,36l-15,3l-6,-36z" fill={`url(#${id}h)`} />
            <path d="M86,121l-1,7M91,120l0,7M96,119l1,7" stroke="#b3162c" strokeWidth="2" strokeLinecap="round" />
            <path d="M83,102l15,-3" stroke="#fff" strokeOpacity="0.55" strokeWidth="2.4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
