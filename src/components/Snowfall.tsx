import { useEffect } from 'react';
import { useCanvasAnimation } from '../animations/hooks';
import { createSnowRenderer } from '../animations/snowRenderer';

interface SnowfallProps {
  running: boolean;
  speed: number;
  intensity: number;
}

/** Depth-layered snowflakes drifting on a slow breeze. */
export function Snowfall({ running, speed, intensity }: SnowfallProps) {
  const { canvasRef, rendererRef } = useCanvasAnimation(
    (canvas) => createSnowRenderer(canvas, intensity),
    { running, speed },
  );

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    renderer.setIntensity(intensity);
    if (!running) renderer.render(0);
  }, [intensity, running, rendererRef]);

  return <canvas ref={canvasRef} className="ca-snow" />;
}
