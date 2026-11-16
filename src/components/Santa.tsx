import { useEffect, useState } from 'react';
import santaUrl from '../assets/images/santa.webp';
import { SpeechBubble } from './SpeechBubble';

interface SantaProps {
  /** False while the scene is paused or off screen. */
  active: boolean;
  speed: number;
  onSpeak?: () => void;
}

/** Seconds for one full loop at speed 1: the crossing plus a pause out of sight. */
export const SANTA_PERIOD = 34;

/** Santa's sleigh crosses the sky as a silhouette; he calls out only while the cursor is over him. */
export function Santa({ active, speed, onSpeak }: SantaProps) {
  const [hovered, setHovered] = useState(false);
  const duration = { animationDuration: `${SANTA_PERIOD / speed}s` };

  useEffect(() => {
    if (!active) setHovered(false);
  }, [active]);

  return (
    <div className="ca-santa-track" style={duration}>
      <div className="ca-santa-arc" style={duration}>
        <div
          className="ca-santa"
          onMouseEnter={() => {
            setHovered(true);
            onSpeak?.();
          }}
          onMouseLeave={() => setHovered(false)}
        >
          <SpeechBubble visible={hovered} className="ca-bubble--santa">
            Hahaha! Merry Christmas! 🎅
          </SpeechBubble>
          {/* nine gallop frames side by side, stepped through by CSS */}
          <div className="ca-santa-sprite">
            <img src={santaUrl} alt="" draggable={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
