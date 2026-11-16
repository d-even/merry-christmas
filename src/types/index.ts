import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/** Sky colour theme. */
export type ChristmasAuroraBackground = 'night' | 'midnight' | 'dusk';

export interface ChristmasAuroraProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Falling snow. @default true */
  snowfall?: boolean;
  /** Animated northern lights. @default true */
  aurora?: boolean;
  /** Santa, his sleigh and reindeer flying across the sky. @default true */
  santa?: boolean;
  /** The snowman on the right of the scene. @default true */
  snowman?: boolean;
  /** The snow-covered Christmas tree. @default true */
  christmasTree?: boolean;
  /** The wooden hut with glowing windows and chimney smoke. @default true */
  hut?: boolean;
  /**
   * Makes sound effects available (wind ambience, sleigh bells, a snowman "wee").
   * Audio never autoplays: this only shows a mute toggle, and sound starts once
   * the visitor presses it. @default false
   */
  sound?: boolean;
  /** Animation speed multiplier. `1` is normal, `0` freezes the scene. Clamped to 0–4. @default 1 */
  speed?: number;
  /** Snowfall density multiplier. `1` is a gentle snowfall. Clamped to 0–4. @default 1 */
  intensity?: number;
  /** Large script headline. Pass `false` or an empty string to hide it. @default "Merry Christmas" */
  title?: string | false;
  /** Greeting shown under the headline. Pass `false` or an empty string to hide it. */
  message?: string | false;
  /** Sky colour theme. @default "night" */
  background?: ChristmasAuroraBackground;
  /**
   * `true` pins the scene to the viewport as a fixed background.
   * `false` makes it fill its parent element instead. @default true
   */
  fullScreen?: boolean;
  /** Extra class names for the root element. */
  className?: string;
  /** Inline styles for the root element. Also the place to set the `--ca-*` CSS variables. */
  style?: CSSProperties;
  /** Content rendered on top of the scene. */
  children?: ReactNode;
}
