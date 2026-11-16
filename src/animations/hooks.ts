import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(onChange: () => void): () => void {
  if (!window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener?.('change', onChange);
  return () => query.removeEventListener?.('change', onChange);
}

/**
 * Tracks the visitor's `prefers-reduced-motion` setting. Read synchronously on
 * the client so a reduced-motion visitor never sees a single animated frame.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => (window.matchMedia ? window.matchMedia(REDUCED_MOTION).matches : false),
    () => false,
  );
}

/** True while the element is on screen and the tab is visible, so off-screen scenes cost nothing. */
export function useIsActive(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    const update = () => setTabVisible(document.visibilityState !== 'hidden');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return inView && tabVisible;
}

/** Calls `onResize` with the element's CSS size now and whenever it changes. */
export function observeSize(
  el: Element,
  onResize: (width: number, height: number) => void,
): () => void {
  const measure = () => {
    const rect = el.getBoundingClientRect();
    onResize(rect.width, rect.height);
  };
  measure();
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }
  window.addEventListener('resize', measure);
  return () => window.removeEventListener('resize', measure);
}

/**
 * Every piece of the scene is sized in "scene units" (`--ca-u`) so the artwork
 * keeps its proportions in any container, from a phone to an ultrawide banner.
 */
export function useSceneUnit(ref: RefObject<HTMLElement | null>): void {
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeSize(el, (width, height) => {
      if (!width || !height) return;
      const unit = Math.min(height / 56, width / 58);
      el.style.setProperty('--ca-u', `${unit.toFixed(3)}px`);
      el.classList.toggle('ca--portrait', width / height < 0.85);
    });
  }, [ref]);
}

export interface CanvasRenderer {
  /** Called with the canvas CSS size whenever it changes. */
  resize(width: number, height: number): void;
  /** Advances the animation by `dt` seconds and draws. `dt = 0` draws a still frame. */
  render(dt: number): void;
}

interface CanvasAnimationOptions {
  /** When false the loop stops and the last frame stays on screen. */
  running: boolean;
  /** Time multiplier. */
  speed: number;
  /** Optional frame-rate cap for layers that do not need 60fps. */
  fps?: number;
}

/**
 * Owns a canvas renderer's lifecycle: creates it once, keeps it sized, runs a
 * requestAnimationFrame loop while `running`, and tears everything down on unmount.
 */
export function useCanvasAnimation<R extends CanvasRenderer>(
  create: (canvas: HTMLCanvasElement) => R | null,
  { running, speed, fps }: CanvasAnimationOptions,
): { canvasRef: RefObject<HTMLCanvasElement | null>; rendererRef: RefObject<R | null> } {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<R | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = create(canvas);
    if (!renderer) return;
    rendererRef.current = renderer;
    const stopObserving = observeSize(canvas, (width, height) => {
      renderer.resize(width, height);
      renderer.render(0);
    });
    return () => {
      stopObserving();
      rendererRef.current = null;
    };
    // The factory is intentionally read once: renderers are configured through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = 0;
    const minInterval = fps ? 1000 / fps - 2 : 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!last) {
        last = now;
        return;
      }
      const elapsed = now - last;
      if (elapsed < minInterval) return;
      last = now;
      // Clamp so a long pause (tab switch, breakpoint) never causes a visible jump.
      rendererRef.current?.render((Math.min(elapsed, 100) / 1000) * speedRef.current);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, fps]);

  return { canvasRef, rendererRef };
}
