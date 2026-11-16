import { useCanvasAnimation } from '../animations/hooks';
import { createAuroraRenderer } from '../animations/auroraRenderer';

interface AuroraProps {
  running: boolean;
  speed: number;
}

/** Northern lights, painted on a small canvas that the browser scales up and softens. */
export function Aurora({ running, speed }: AuroraProps) {
  const { canvasRef } = useCanvasAnimation(createAuroraRenderer, { running, speed, fps: 30 });
  return <canvas ref={canvasRef} className="ca-aurora" />;
}
