import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { ChristmasAurora } from '../src';

/** jsdom has no canvas: a context where every method is a no-op lets the renderers run. */
function fakeContext(): CanvasRenderingContext2D {
  const gradient = { addColorStop: () => {} };
  return new Proxy(
    {},
    {
      get: (_target, key) =>
        key === 'createLinearGradient' || key === 'createRadialGradient' ? () => gradient : () => {},
      set: () => true,
    },
  ) as CanvasRenderingContext2D;
}

function mockReducedMotion(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

class FakeAudioContext {
  static instances = 0;
  currentTime = 0;
  sampleRate = 8000;
  state = 'running';
  destination = {};
  constructor() {
    FakeAudioContext.instances++;
  }
  private node() {
    const param = () => ({
      value: 0,
      setValueAtTime: () => {},
      linearRampToValueAtTime: () => {},
      exponentialRampToValueAtTime: () => {},
      cancelScheduledValues: () => {},
    });
    const node = {
      gain: param(),
      frequency: param(),
      Q: param(),
      connect: (next: unknown) => next,
      start: () => {},
      stop: () => {},
    };
    return node;
  }
  createGain = () => this.node();
  createOscillator = () => this.node();
  createBiquadFilter = () => this.node();
  createBufferSource = () => this.node();
  createBuffer = (_channels: number, length: number) => ({ getChannelData: () => new Float32Array(length) });
  resume = () => Promise.resolve();
  suspend = () => Promise.resolve();
  close = () => {
    this.state = 'closed';
    return Promise.resolve();
  };
}

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(fakeContext as never);
  mockReducedMotion(false);
  FakeAudioContext.instances = 0;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('ChristmasAurora', () => {
  it('renders the whole scene with default props', () => {
    const { container, getByText } = render(<ChristmasAurora />);
    expect(getByText('Merry Christmas')).toBeTruthy();
    expect(getByText(/warmth, joy and new beginnings/)).toBeTruthy();
    for (const selector of ['.ca-aurora', '.ca-snow', '.ca-santa', '.ca-snowman', '.ca-tree', '.ca-hut', '.ca-mountains']) {
      expect(container.querySelector(selector), selector).not.toBeNull();
    }
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('ca--night');
    expect(root.className).toContain('ca--fullscreen');
  });

  it('hides each element when its prop is false', () => {
    const { container } = render(
      <ChristmasAurora snowfall={false} aurora={false} santa={false} snowman={false} christmasTree={false} hut={false} />,
    );
    for (const selector of ['.ca-aurora', '.ca-snow', '.ca-santa', '.ca-snowman', '.ca-tree', '.ca-hut']) {
      expect(container.querySelector(selector), selector).toBeNull();
    }
    expect(container.querySelector('.ca-mountains')).not.toBeNull();
  });

  it('applies message, title, background, fullScreen, className and passes through DOM props', () => {
    const { container, getByText, queryByText } = render(
      <ChristmasAurora
        title="Happy Holidays"
        message="See you in the new year"
        background="dusk"
        fullScreen={false}
        className="my-hero"
        data-testid="scene"
        speed={2}
      >
        <button>Enter</button>
      </ChristmasAurora>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(getByText('Happy Holidays')).toBeTruthy();
    expect(getByText('See you in the new year')).toBeTruthy();
    expect(queryByText('Merry Christmas')).toBeNull();
    expect(getByText('Enter')).toBeTruthy();
    expect(root.className).toContain('ca--dusk');
    expect(root.className).toContain('my-hero');
    expect(root.className).not.toContain('ca--fullscreen');
    expect(root.dataset.testid).toBe('scene');
    expect(root.style.getPropertyValue('--ca-speed')).toBe('2');
  });

  it('hides the greeting when title and message are false', () => {
    const { container } = render(<ChristmasAurora title={false} message={false} />);
    expect(container.querySelector('.ca-greeting')).toBeNull();
  });

  it('pauses instead of dividing by zero when speed is 0', () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame');
    const { container } = render(<ChristmasAurora speed={0} />);
    expect((container.firstElementChild as HTMLElement).className).toContain('ca--paused');
    expect(raf).not.toHaveBeenCalled();
  });

  it('shows speech bubbles occasionally, then hides them again', () => {
    vi.useFakeTimers();
    const { container } = render(<ChristmasAurora />);
    const bubble = container.querySelector('.ca-bubble--snowman') as HTMLElement;
    expect(bubble.textContent).toContain('Weeeeeeeeee!');
    expect(bubble.className).not.toContain('ca-bubble--visible');
    act(() => void vi.advanceTimersByTime(2700));
    expect(bubble.className).toContain('ca-bubble--visible');
    act(() => void vi.advanceTimersByTime(3900));
    expect(bubble.className).not.toContain('ca-bubble--visible');

    const track = container.querySelector('.ca-santa-track') as HTMLElement;
    const santaBubble = container.querySelector('.ca-bubble--santa') as HTMLElement;
    expect(santaBubble.textContent).toContain('Hahaha! Merry Christmas!');
    // jsdom has no AnimationEvent, so React listens for the prefixed event name there.
    act(() => void track.dispatchEvent(new Event('webkitAnimationStart', { bubbles: true })));
    act(() => void vi.advanceTimersByTime(34000 * 0.3));
    expect(santaBubble.className).toContain('ca-bubble--visible');
    act(() => void vi.advanceTimersByTime(34000 * 0.2));
    expect(santaBubble.className).not.toContain('ca-bubble--visible');
  });

  it('never creates audio until the visitor presses the sound toggle', () => {
    vi.stubGlobal('AudioContext', FakeAudioContext);
    const { queryByRole, getByRole, rerender } = render(<ChristmasAurora />);
    expect(queryByRole('button')).toBeNull();

    rerender(<ChristmasAurora sound />);
    const button = getByRole('button', { name: 'Play sound' });
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(FakeAudioContext.instances).toBe(0);

    fireEvent.click(button);
    expect(FakeAudioContext.instances).toBe(1);
    expect(getByRole('button', { name: 'Mute sound' }).getAttribute('aria-pressed')).toBe('true');

    rerender(<ChristmasAurora sound={false} />);
    expect(queryByRole('button')).toBeNull();
  });

  it('runs no animation loops when the visitor prefers reduced motion', () => {
    mockReducedMotion(true);
    const raf = vi.spyOn(window, 'requestAnimationFrame');
    const { container } = render(<ChristmasAurora />);
    expect((container.firstElementChild as HTMLElement).className).toContain('ca--reduced');
    expect(raf).not.toHaveBeenCalled();
  });

  it('cancels every animation frame, timer and listener on unmount', () => {
    vi.useFakeTimers();
    const pending = new Set<number>();
    let nextId = 1;
    vi.stubGlobal('requestAnimationFrame', () => {
      pending.add(nextId);
      return nextId++;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => void pending.delete(id));
    const added = vi.spyOn(document, 'addEventListener');
    const removed = vi.spyOn(document, 'removeEventListener');
    const windowAdded = vi.spyOn(window, 'addEventListener');
    const windowRemoved = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<ChristmasAurora />);
    expect(pending.size).toBeGreaterThan(0);
    const whileMounted = vi.getTimerCount();
    unmount();

    expect(pending.size).toBe(0);
    // React itself keeps one scheduler timer under fake timers; measure that with an empty tree.
    const control = render(<div />);
    control.unmount();
    const reactOnly = vi.getTimerCount();
    expect(whileMounted).toBeGreaterThan(reactOnly);
    vi.clearAllTimers();
    const again = render(<ChristmasAurora />);
    again.unmount();
    expect(vi.getTimerCount()).toBe(reactOnly);
    const count = (spy: typeof added, type: string) => spy.mock.calls.filter(([t]) => t === type).length;
    expect(count(removed, 'visibilitychange')).toBe(count(added, 'visibilitychange'));
    expect(count(windowRemoved as never, 'resize')).toBe(count(windowAdded as never, 'resize'));
  });

  it('renders on the server without touching browser APIs', () => {
    const html = renderToString(<ChristmasAurora sound />);
    expect(html).toContain('Merry Christmas');
    expect(html).toContain('ca-santa');
  });
});
