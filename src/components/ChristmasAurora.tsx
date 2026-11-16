import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { clamp } from '../animations/random';
import { useIsActive, useReducedMotion, useSceneUnit } from '../animations/hooks';
import { createSoundEngine, isSoundSupported, type SoundEngine } from '../animations/sound';
import type { ChristmasAuroraProps } from '../types';
import styles from '../styles/christmas-aurora.css?inline';
import { Aurora } from './Aurora';
import { ChristmasTree } from './ChristmasTree';
import { Greeting } from './Greeting';
import { Hut } from './Hut';
import { FramingPines, Ground, Mountains } from './Landscape';
import { Santa } from './Santa';
import { Snowfall } from './Snowfall';
import { Snowman } from './Snowman';
import { SoundToggle } from './SoundToggle';
import { Stars } from './Stars';

const DEFAULT_MESSAGE = 'May your days be filled with warmth, joy and new beginnings.';
const MIN_SPEED = 0.05;

/**
 * Sound stays off until the visitor presses the toggle. The engine (and its
 * AudioContext) is created inside that click, never on mount.
 */
function useSound(enabled: boolean, active: boolean) {
  const engineRef = useRef<SoundEngine | null>(null);
  const [on, setOn] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => setSupported(isSoundSupported()), []);

  useEffect(() => {
    if (enabled) return;
    engineRef.current?.destroy();
    engineRef.current = null;
    setOn(false);
  }, [enabled]);

  useEffect(() => {
    engineRef.current?.setActive(active);
  }, [active]);

  useEffect(
    () => () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    },
    [],
  );

  const onRef = useRef(on);
  onRef.current = on;

  const toggle = useCallback(() => {
    const next = !onRef.current;
    if (next) {
      engineRef.current ??= createSoundEngine();
      engineRef.current.start();
    } else {
      engineRef.current?.stop();
    }
    setOn(next);
  }, []);

  const jingle = useCallback(() => {
    if (onRef.current) engineRef.current?.jingle();
  }, []);
  const wee = useCallback(() => {
    if (onRef.current) engineRef.current?.wee();
  }, []);

  return { on, toggle, jingle, wee, available: enabled && supported };
}

export const ChristmasAurora = forwardRef<HTMLDivElement, ChristmasAuroraProps>(
  function ChristmasAurora(
    {
      snowfall = true,
      aurora = true,
      santa = true,
      snowman = true,
      christmasTree = true,
      hut = true,
      sound = false,
      speed = 1,
      intensity = 1,
      title = 'Merry Christmas',
      message = DEFAULT_MESSAGE,
      background = 'night',
      fullScreen = true,
      className,
      style,
      children,
      ...rest
    },
    forwardedRef,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => rootRef.current as HTMLDivElement, []);

    const reducedMotion = useReducedMotion();
    const onScreen = useIsActive(rootRef);
    useSceneUnit(rootRef);

    const requestedSpeed = Number.isFinite(speed) ? clamp(speed, 0, 4) : 1;
    const frozen = requestedSpeed === 0;
    const safeSpeed = Math.max(requestedSpeed, MIN_SPEED);
    const snowAmount = Number.isFinite(intensity) ? clamp(intensity, 0, 4) : 1;

    /** Canvas loops and CSS animations run only when there is something to see. */
    const active = onScreen && !frozen;
    const running = active && !reducedMotion;
    const audio = useSound(sound, active);

    const classes = [
      'ca',
      `ca--${background}`,
      fullScreen ? 'ca--fullscreen' : '',
      active ? '' : 'ca--paused',
      reducedMotion ? 'ca--reduced' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        {...rest}
        ref={rootRef}
        className={classes}
        style={{ ...style, ['--ca-speed' as string]: safeSpeed }}
      >
        <style dangerouslySetInnerHTML={{ __html: styles }} />

        <div className="ca-scene" aria-hidden="true">
          <Stars />
          {aurora ? <Aurora running={running} speed={safeSpeed} /> : null}
          <div className="ca-moon" />
          {santa ? (
            <Santa active={active} speed={safeSpeed} reducedMotion={reducedMotion} onSpeak={audio.jingle} />
          ) : null}
          <Mountains />
          <Ground auroraGlow={aurora} />
          <FramingPines />
          {hut ? <Hut /> : null}
          {christmasTree ? <ChristmasTree /> : null}
          {snowman ? <Snowman active={active} speed={safeSpeed} onSpeak={audio.wee} /> : null}
          {snowfall && snowAmount > 0 ? (
            <Snowfall running={running} speed={safeSpeed} intensity={snowAmount} />
          ) : null}
          <div className="ca-vignette" />
        </div>

        <Greeting title={title} message={message} />
        {children ? <div className="ca-content">{children}</div> : null}
        {audio.available ? <SoundToggle on={audio.on} onToggle={audio.toggle} /> : null}
      </div>
    );
  },
);

ChristmasAurora.displayName = 'ChristmasAurora';
