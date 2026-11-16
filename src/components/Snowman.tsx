import { useEffect, useState } from 'react';
import snowmanUrl from '../assets/images/snowman.webp';
import { SpeechBubble } from './SpeechBubble';

interface SnowmanProps {
  /** False while the scene is paused or off screen. */
  active: boolean;
  onSpeak?: () => void;
}

/** The snowman sways gently, and cheers only while the cursor is over him. */
export function Snowman({ active, onSpeak }: SnowmanProps) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!active) setHovered(false);
  }, [active]);

  return (
    <div
      className={`ca-snowman ${hovered ? 'ca-snowman--excited' : ''}`}
      onMouseEnter={() => {
        setHovered(true);
        onSpeak?.();
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <SpeechBubble visible={hovered} className="ca-bubble--snowman">
        Weeeeeeeeee! ☃️
      </SpeechBubble>
      <img className="ca-art ca-snowman-art" src={snowmanUrl} alt="" draggable={false} />
    </div>
  );
}
