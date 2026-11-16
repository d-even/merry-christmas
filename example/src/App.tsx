import { useState } from 'react';
import { ChristmasAurora, type ChristmasAuroraBackground } from 'christmas-aurora';

const TOGGLES = ['snowfall', 'aurora', 'santa', 'snowman', 'christmasTree', 'hut', 'sound'] as const;
type Toggle = (typeof TOGGLES)[number];

const LABELS: Record<Toggle, string> = {
  snowfall: 'Snowfall',
  aurora: 'Aurora',
  santa: 'Santa',
  snowman: 'Snowman',
  christmasTree: 'Christmas tree',
  hut: 'Hut',
  sound: 'Sound toggle',
};

// ?clean hides the control panel, handy for screenshots and recordings.
const params = new URLSearchParams(window.location.search);
const CLEAN = params.has('clean');

export function App() {
  const [flags, setFlags] = useState<Record<Toggle, boolean>>({
    snowfall: true,
    aurora: true,
    santa: true,
    snowman: true,
    christmasTree: true,
    hut: true,
    sound: false,
  });
  const [speed, setSpeed] = useState(1);
  const [intensity, setIntensity] = useState(1);
  const [background, setBackground] = useState<ChristmasAuroraBackground>(
    (params.get('background') as ChristmasAuroraBackground) ?? 'dusk',
  );
  const [message, setMessage] = useState('May your days be filled with warmth, joy and new beginnings.');
  const [open, setOpen] = useState(true);

  return (
    <ChristmasAurora {...flags} speed={speed} intensity={intensity} background={background} message={message}>
      {CLEAN ? null : (
        <aside className={`panel ${open ? '' : 'panel--closed'}`}>
          <button className="panel__handle" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? 'Hide controls' : 'Show controls'}
          </button>
          {open ? (
            <div className="panel__body">
              <h1>christmas-aurora</h1>
              <div className="panel__grid">
                {TOGGLES.map((key) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={flags[key]}
                      onChange={(e) => setFlags({ ...flags, [key]: e.target.checked })}
                    />
                    {LABELS[key]}
                  </label>
                ))}
              </div>
              <label className="panel__row">
                <span>Speed <output>{speed.toFixed(1)}×</output></span>
                <input type="range" min="0" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(+e.target.value)} />
              </label>
              <label className="panel__row">
                <span>Snow intensity <output>{intensity.toFixed(1)}×</output></span>
                <input type="range" min="0" max="4" step="0.1" value={intensity} onChange={(e) => setIntensity(+e.target.value)} />
              </label>
              <label className="panel__row">
                <span>Background</span>
                <select value={background} onChange={(e) => setBackground(e.target.value as ChristmasAuroraBackground)}>
                  <option value="night">night</option>
                  <option value="midnight">midnight</option>
                  <option value="dusk">dusk</option>
                </select>
              </label>
              <label className="panel__row">
                <span>Message</span>
                <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
              </label>
            </div>
          ) : null}
        </aside>
      )}
    </ChristmasAurora>
  );
}
