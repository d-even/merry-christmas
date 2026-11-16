import type { ReactNode } from 'react';

interface SpeechBubbleProps {
  visible: boolean;
  className?: string;
  children: ReactNode;
}

export function SpeechBubble({ visible, className = '', children }: SpeechBubbleProps) {
  return (
    <div className={`ca-bubble ${visible ? 'ca-bubble--visible' : ''} ${className}`}>
      {children}
    </div>
  );
}
