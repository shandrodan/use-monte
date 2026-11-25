'use client';

import {useEffect, useState} from 'react';

import {SegmentedControl, SegmentedControlItem} from '@/components/monte/ui/segmented-control';
import {TooltipProvider} from '@/components/monte/ui/tooltip';
import {BlocksSection} from './blocks-section';
import {ComponentsSection} from './components-section';
import {MotionSection} from './motion-section';
import {TokensSection} from './tokens-section';
import {UiSdkSection} from './ui-sdk-section';

const nav = [
  ['color', 'Color'], ['type', 'Type'], ['space', 'Space'], ['motion', 'Motion'],
  ['components', 'Components'], ['inputs', 'Inputs'], ['feedback', 'Feedback'], ['overlays', 'Overlays'],
  ['data', 'Data'], ['code', 'Code'], ['ui-sdk', 'ui-sdk'], ['pricing', 'Pricing'], ['overview', 'Overview'],
] as const;

/** The specimen page: every token and component of the design system on one screen, light or dark. */
export function Showcase() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <TooltipProvider>
      <div className="min-h-dvh bg-page text-text-1">
        <header className="sticky top-0 z-(--z-raised) border-b border-line bg-page">
          <div className="mx-auto flex max-w-(--breakpoint-xl) items-center gap-4 px-4 py-2">
            <span className="type-label">Monte</span>
            <nav aria-label="Sections" className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
              {nav.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="type-label-sm shrink-0 px-2 py-1.5 text-text-2 hover:bg-hover hover:text-text-1">{label}</a>
              ))}
            </nav>
            <SegmentedControl size="sm" value={theme} onValueChange={v => setTheme(v)} aria-label="Theme">
              <SegmentedControlItem value="light">Light</SegmentedControlItem>
              <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
            </SegmentedControl>
          </div>
        </header>

        <main className="mx-auto flex max-w-(--breakpoint-xl) flex-col gap-12 px-4 py-10">
          <div className="flex flex-col gap-3">
            <h1 className="type-title">Design system</h1>
            <p className="type-body max-w-measure text-text-2">
              Every token and component on one page. Retune values in components/monte/tokens.css, or a component in
              components/monte/ui, and this page updates on save.
            </p>
          </div>
          <TokensSection theme={theme}/>
          <MotionSection theme={theme}/>
          <ComponentsSection/>
          <UiSdkSection/>
          <BlocksSection/>
        </main>
      </div>
    </TooltipProvider>
  );
}
