import moonUrl from '../assets/images/moon.webp';

export function Moon() {
  return (
    <div className="ca-moon">
      <img className="ca-art" src={moonUrl} alt="" draggable={false} />
    </div>
  );
}
