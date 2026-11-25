'use client';

import type React from 'react';
import {Section, Specimen} from './section';
import {useTokenValues} from './use-tokens';

const colorGroups: {name: string; tokens: string[]}[] = [
  {name: 'Surfaces', tokens: ['--page', '--panel', '--well', '--code-surface', '--hover', '--pressed', '--selected', '--selected-strong', '--scrim']},
  {name: 'Text', tokens: ['--text-1', '--text-2', '--text-3', '--text-disabled', '--text-inverse']},
  {name: 'Lines', tokens: ['--line-faint', '--line', '--line-control', '--mark', '--dot']},
  {name: 'Accent and primary', tokens: ['--accent', '--accent-text', '--accent-edge', '--primary-bg', '--primary-text', '--primary-edge', '--primary-hover', '--primary-ring']},
  {name: 'Secondary and field', tokens: ['--secondary-bg', '--secondary-hover', '--secondary-edge', '--field-bg', '--field-focus-bg', '--field-focus-edge', '--field-ring-focus', '--row-highlight']},
  {name: 'Checked', tokens: ['--check-bg', '--check-edge', '--check-mark', '--check-off', '--check-range']},
  {name: 'Status', tokens: ['--ok', '--ok-text', '--ok-tint', '--warn', '--warn-text', '--warn-tint', '--fail', '--fail-text', '--fail-tint']},
  {name: 'Data', tokens: ['--data-1', '--data-2', '--data-3', '--data-4', '--data-5', '--data-6']},
  {name: 'Focus', tokens: ['--focus', '--caret']},
];

const typeRoles: {cls: string; token: string; sample: string}[] = [
  {cls: 'type-display', token: '--type-display', sample: 'Every run, in one place'},
  {cls: 'type-title', token: '--type-title', sample: 'Pipeline runs'},
  {cls: 'type-heading', token: '--type-heading', sample: 'Warehouse capacity'},
  {cls: 'type-heading-sm', token: '--type-heading-sm', sample: 'Storage by schema'},
  {cls: 'type-figure', token: '--type-figure', sample: '1,204,881'},
  {cls: 'type-body', token: '--type-body', sample: 'The backfill wrote 1,204 partitions and skipped 3 that were already current.'},
  {cls: 'type-body-sm', token: '--type-body-sm', sample: 'Runs every night at 02:00 UTC on the analytics warehouse.'},
  {cls: 'type-caption', token: '--type-caption', sample: 'Last edited by Priya Nair, 4 minutes ago'},
  {cls: 'type-label-lg', token: '--type-label-lg', sample: 'Resize warehouse'},
  {cls: 'type-label', token: '--type-label', sample: 'Run pipeline'},
  {cls: 'type-label-sm', token: '--type-label-sm', sample: 'Queued'},
  {cls: 'type-micro', token: '--type-micro', sample: 'Rows per hour'},
  {cls: 'type-code', token: '--type-code', sample: 'select count(*) from orders_daily;'},
  {cls: 'type-code-sm', token: '--type-code-sm', sample: 'run_8f2a91'},
];

const space = ['--space-0-5', '--space-1', '--space-1-5', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-8', '--space-10', '--inset'];
const sizes = ['--control-sm', '--control', '--control-lg', '--row-sm', '--row', '--head', '--icon', '--icon-sm', '--marker'];
const lines = ['--radius', '--line-width', '--focus-width', '--focus-offset'];

function Swatch({name, value}: {name: string; value?: string}) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="h-14 border border-line bg-(--sw)" style={{'--sw': `var(${name})`} as React.CSSProperties}/>
      <span className="type-code-sm mt-1.5 truncate text-text-1">{name.slice(2)}</span>
      <span className="type-code-sm truncate text-text-3">{value || ' '}</span>
    </div>
  );
}

export function TokensSection({theme}: {theme: string}) {
  const all = [...colorGroups.flatMap(g => g.tokens), ...typeRoles.map(t => t.token), ...space, ...sizes, ...lines];
  const values = useTokenValues(all, theme);

  return (
    <>
      <Section id="color" title="Color" description="Every color role, read live from components/monte/tokens.css. Change a value there and the swatch, and every component below, updates on save. Flip the theme in the header to see the dark values.">
        <div className="flex flex-col gap-6">
          {colorGroups.map(group => (
            <div key={group.name} className="flex flex-col gap-2">
              <h3 className="type-label-sm text-text-2">{group.name}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {group.tokens.map(t => <Swatch key={t} name={t} value={values[t]}/>)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="type" title="Typography" description="Geist for headlines and prose, Geist Mono capitals for every interface word. One weight; hierarchy is size, case and color.">
        <div className="frame">
          {typeRoles.map(t => (
            <div key={t.cls} className="rule-row grid grid-cols-1 gap-2 px-(--inset) py-3 md:grid-cols-[var(--label-col)_1fr] md:items-baseline">
              <div className="flex flex-col">
                <span className="type-code-sm text-text-1">{t.cls}</span>
                <span className="type-code-sm truncate text-text-3">{values[t.token]?.replace(/var\(--font-(sans|mono)\)/, '$1')}</span>
              </div>
              <p className={`${t.cls} min-w-0 text-pretty`}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="space" title="Space, size and lines" description="A 4px grid, 32px controls, 40px rows, square corners and 1px rules.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Specimen name="Space" source="--space-*" className="flex flex-col">
            {space.map(t => (
              <div key={t} className="rule-row flex items-center gap-3 px-(--inset) py-2">
                <span className="type-code-sm w-28 shrink-0">{t.slice(2)}</span>
                <span className="type-code-sm w-12 shrink-0 text-text-3">{values[t]}</span>
                <span className="h-3 w-(--sz) bg-data-1" style={{'--sz': `var(${t})`} as React.CSSProperties}/>
              </div>
            ))}
          </Specimen>
          <div className="flex flex-col gap-4">
            <Specimen name="Size" source="--control, --row, --icon" className="flex flex-col">
              {sizes.map(t => (
                <div key={t} className="rule-row flex items-center gap-3 px-(--inset) py-2">
                  <span className="type-code-sm w-28 shrink-0">{t.slice(2)}</span>
                  <span className="type-code-sm w-12 shrink-0 text-text-3">{values[t]}</span>
                  <span className="size-(--sz) border border-line-control bg-well" style={{'--sz': `var(${t})`} as React.CSSProperties}/>
                </div>
              ))}
            </Specimen>
            <Specimen name="Corners and lines" source="--radius, --line-width" className="flex flex-col">
              {lines.map(t => (
                <div key={t} className="rule-row flex items-center gap-3 px-(--inset) py-2">
                  <span className="type-code-sm w-28 shrink-0">{t.slice(2)}</span>
                  <span className="type-code-sm text-text-3">{values[t]}</span>
                </div>
              ))}
            </Specimen>
          </div>
        </div>
      </Section>
    </>
  );
}
