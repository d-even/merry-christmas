/**
 * All sound is synthesised with the Web Audio API, so the package ships no audio
 * files. An AudioContext is only ever created from `start()`, which the component
 * calls from a click handler: nothing can play before the visitor asks for it.
 */
export interface SoundEngine {
  start(): void;
  stop(): void;
  /** Pause or resume output without losing state (used when the scene is off screen). */
  setActive(active: boolean): void;
  /** Sleigh bells, played as Santa calls out. */
  jingle(): void;
  /** A rising "wee!" whistle for the snowman. */
  wee(): void;
  destroy(): void;
}

type AudioContextConstructor = typeof AudioContext;

function getAudioContext(): AudioContextConstructor | undefined {
  if (typeof window === 'undefined') return undefined;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext
  );
}

export function isSoundSupported(): boolean {
  return getAudioContext() !== undefined;
}

export function createSoundEngine(): SoundEngine {
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let windNodes: AudioScheduledSourceNode[] = [];

  const startWind = (ctx: AudioContext, out: AudioNode) => {
    const seconds = 4;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.6;

    // A slow LFO sweeps the filter so the wind rises and falls.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 220;
    lfo.connect(lfoDepth).connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.value = 0.11;
    noise.connect(filter).connect(gain).connect(out);
    noise.start();
    lfo.start();
    windNodes = [noise, lfo];
  };

  const bell = (ctx: AudioContext, out: AudioNode, at: number, volume: number) => {
    for (const partial of [2637, 3951, 5274, 6645]) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = partial * (0.985 + Math.random() * 0.03);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(volume, at + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
      osc.connect(gain).connect(out);
      osc.start(at);
      osc.stop(at + 0.25);
    }
  };

  return {
    start() {
      const Ctor = getAudioContext();
      if (!Ctor) return;
      if (!context) {
        context = new Ctor();
        master = context.createGain();
        master.gain.value = 0;
        master.connect(context.destination);
        startWind(context, master);
      }
      void context.resume();
      master!.gain.cancelScheduledValues(context.currentTime);
      master!.gain.linearRampToValueAtTime(1, context.currentTime + 0.8);
    },

    stop() {
      if (!context || !master) return;
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);
    },

    setActive(active) {
      if (!context || context.state === 'closed') return;
      void (active ? context.resume() : context.suspend());
    },

    jingle() {
      if (!context || !master || context.state !== 'running') return;
      const start = context.currentTime + 0.02;
      for (let i = 0; i < 8; i++) {
        bell(context, master, start + i * 0.17, i % 2 ? 0.018 : 0.03);
      }
    },

    wee() {
      if (!context || !master || context.state !== 'running') return;
      const at = context.currentTime + 0.02;
      const osc = context.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, at);
      osc.frequency.exponentialRampToValueAtTime(1500, at + 0.55);
      const gain = context.createGain();
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.05, at + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.65);
      osc.connect(gain).connect(master);
      osc.start(at);
      osc.stop(at + 0.7);
    },

    destroy() {
      for (const node of windNodes) {
        try {
          node.stop();
        } catch {
          // already stopped
        }
      }
      windNodes = [];
      if (context && context.state !== 'closed') void context.close();
      context = null;
      master = null;
    },
  };
}
