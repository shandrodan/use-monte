'use client';

import {useEffect, useState} from 'react';

/** Reads the live value of each CSS custom property from the .monte scope. Re-reads when the theme changes. */
export function useTokenValues(names: string[], theme: string) {
  const [values, setValues] = useState<Record<string, string>>({});
  const key = names.join(',');
  useEffect(() => {
    let last = '';
    const read = () => {
      const el = document.querySelector('.monte') ?? document.body;
      const style = getComputedStyle(el);
      const next: Record<string, string> = {};
      for (const name of key.split(',')) next[name] = style.getPropertyValue(name).trim();
      const sig = JSON.stringify(next);
      if (sig !== last) { last = sig; setValues(next); }
    };
    // Read on the next frame (the theme attribute is set by the parent's effect, after this one), then every second,
    // so an edit to tokens.css that hot-reloads shows here without a theme switch.
    const frame = requestAnimationFrame(read);
    const timer = setInterval(read, 1000);
    return () => { cancelAnimationFrame(frame); clearInterval(timer); };
  }, [key, theme]);
  return values;
}

/** Parses "cubic-bezier(a, b, c, d)" or "linear" into four control numbers. */
export function parseBezier(value: string): [number, number, number, number] {
  const m = value.match(/cubic-bezier\(([^)]+)\)/);
  if (!m) return [0, 0, 1, 1];
  const n = m[1].split(',').map(s => parseFloat(s));
  return [n[0], n[1], n[2], n[3]];
}
