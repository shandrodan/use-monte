'use client';

import {useState, type CSSProperties} from 'react';
import {Icon, Play} from '@/components/monte/icon';
import {Button} from '@/components/monte/ui/button';
import {Slider} from '@/components/monte/ui/slider';
import {Section, Specimen} from './section';
import {parseBezier, useTokenValues} from './use-tokens';

const curves = ['--ease-out', '--ease-soft', '--ease-in', '--ease-linear'];
const durations = ['--dur-press', '--dur-state', '--dur-overlay', '--dur-wipe', '--dur-light', '--dur-draw', '--dur-glow', '--dur-scramble', '--dur-pending'];

const S = 120;

function Curve({value}: {value: string}) {
  const [x1, y1, x2, y2] = parseBezier(value);
  const p = (x: number, y: number) => `${x * S},${(1 - y) * S}`;
  return (
    <svg viewBox={`-8 -8 ${S + 16} ${S + 16}`} className="size-36 shrink-0 text-text-1" aria-hidden>
      <rect x={0} y={0} width={S} height={S} className="fill-none stroke-line" strokeWidth={1}/>
      <line x1={0} y1={S} x2={p(x1, y1).split(',')[0]} y2={p(x1, y1).split(',')[1]} className="stroke-line-control" strokeWidth={1} strokeDasharray="2 2"/>
      <line x1={S} y1={0} x2={p(x2, y2).split(',')[0]} y2={p(x2, y2).split(',')[1]} className="stroke-line-control" strokeWidth={1} strokeDasharray="2 2"/>
      <path d={`M${p(0, 0)} C${p(x1, y1)} ${p(x2, y2)} ${p(1, 1)}`} className="fill-none stroke-current" strokeWidth={1.5}/>
      <rect x={x1 * S - 3} y={(1 - y1) * S - 3} width={6} height={6} className="fill-data-1 stroke-accent-edge"/>
      <rect x={x2 * S - 3} y={(1 - y2) * S - 3} width={6} height={6} className="fill-data-1 stroke-accent-edge"/>
    </svg>
  );
}

/** A square that crosses its track when `on` flips, with the given curve and duration. */
function Track({on, ease, duration}: {on: boolean; ease: string; duration: string}) {
  return (
    <div className="relative h-4 w-full overflow-hidden bg-well">
      <div
        className={`absolute inset-y-0 start-0 w-full transition-transform duration-(--run-dur) ease-(--run-ease) ${on ? 'translate-x-[calc(100%-var(--space-4))]' : 'translate-x-0'}`}
        style={{'--run-dur': duration, '--run-ease': ease} as CSSProperties}
      >
        <span className="block size-4 border border-primary-foreground/20 bg-data-1"/>
      </div>
    </div>
  );
}

export function MotionSection({theme}: {theme: string}) {
  const values = useTokenValues([...curves, ...durations], theme);
  const [ms, setMs] = useState(600);
  const [curveRun, setCurveRun] = useState(false);
  const [durRun, setDurRun] = useState(false);

  return (
    <Section id="motion" title="Motion" description="Mechanical: ease-out on moves, linear wipes, no springs. The curves and durations below are drawn from the live tokens; press Play to run them.">
      <Specimen name="Easing curves" source="--ease-*" className="flex flex-col">
        <div className="panel-head">
          <span className="type-label-sm text-text-2">Duration</span>
          <Slider className="max-w-64 flex-1" min={120} max={2000} step={20} value={ms} onValueChange={v => setMs(Array.isArray(v) ? v[0] : v)} thumbLabels={['Duration']} showValue format={{style: 'unit', unit: 'millisecond', unitDisplay: 'narrow'}}/>
          <Button className="ms-auto" variant="secondary" size="sm" onClick={() => setCurveRun(r => !r)}><Icon icon={Play}/>Play curves</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {curves.map(c => (
            <div key={c} className="rule-col flex flex-col gap-3 border-b border-line p-(--inset) lg:border-b-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="type-code-sm">{c.slice(2)}</span>
              </div>
              <Curve value={values[c] ?? ''}/>
              <span className="type-code-sm truncate text-text-3">{values[c]}</span>
              <Track on={curveRun} ease={`var(${c})`} duration={`${ms}ms`}/>
            </div>
          ))}
        </div>
      </Specimen>

      <Specimen name="Durations" source="--dur-*" className="flex flex-col">
        <div className="panel-head">
          <span className="type-caption text-text-2">Each runs on the house curve, ease-out.</span>
          <Button className="ms-auto" variant="secondary" size="sm" onClick={() => setDurRun(r => !r)}><Icon icon={Play}/>Play durations</Button>
        </div>
        {durations.map(d => (
          <div key={d} className="rule-row grid grid-cols-[var(--label-col)_1fr] items-center gap-3 px-(--inset) py-2">
            <span className="flex justify-between gap-2"><span className="type-code-sm">{d.slice(2)}</span><span className="type-code-sm text-text-3">{values[d]}</span></span>
            <Track on={durRun} ease="var(--ease-out)" duration={`var(${d})`}/>
          </div>
        ))}
      </Specimen>
    </Section>
  );
}
