import landscapeUrl from '../assets/images/landscape.webp';
import { Pine } from './Pine';

/** Snow-capped mountains, a pine forest at their feet and rolling snowfields. */
export function Mountains() {
  return <img className="ca-mountains" src={landscapeUrl} alt="" draggable={false} />;
}

/** Dark, snow-laden pines that frame the scene and give it depth. */
export function FramingPines() {
  return (
    <>
      <div className="ca-pine ca-pine--right"><Pine /></div>
      <div className="ca-pine ca-pine--left"><Pine /></div>
    </>
  );
}
