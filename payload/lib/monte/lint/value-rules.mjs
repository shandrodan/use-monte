export const LINT_IGNORES = ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**', '**/out/**', '**/components/ui/**'];

/** A raw color value: #hex (not an entity, a URL fragment or part of a word; `_#fff` in a bracket value counts), or a color function. */
export const RAW = /(?<![A-Za-z0-9&/-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(/;

/**
 * Words that may stand where a color goes without being one: the CSS-wide keywords, transparent and currentColor, and
 * the other words a border, background or outline shorthand carries.
 */
const NOT_COLOR = new Set(['transparent', 'currentcolor', 'inherit', 'initial', 'unset', 'revert', 'none', 'auto', 'normal', 'important',
  'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'hidden', 'thin', 'medium', 'thick',
  'repeat', 'center', 'top', 'bottom', 'left', 'right', 'cover', 'contain', 'fixed', 'scroll', 'local']);

/**
 * A CSS named color where a color goes: any bare word of letters that is not one of the keywords above. Testing the
 * shape rather than listing the names catches every named color the browser knows.
 */
export const isNamedColor = word => /^[a-z]+$/i.test(word) && !NOT_COLOR.has(word.toLowerCase());

/**
 * Whether the arbitrary value `inside` the brackets of `base` is a hand-picked number. Transition lists, keywords,
 * proportions (a lone %, vh or vw, fr tracks) and values that read var(--) or --spacing() are fine.
 */
export function handPickedValue(base, inside) {
  // A grid track list in fr (grid-cols-[1fr_auto], grid-cols-[auto_1fr]) is a proportion, not a size, and so is
  // an fr track that may shrink past its content (minmax(0,1fr)): its zero is no hand-picked number.
  const tracks = inside.replace(/minmax\(0,/g, 'minmax(').replace(/(?<![A-Za-z0-9.])\d+(?:\.\d+)?fr(?![a-z0-9])/g, '');
  if (/^transition-\[/.test(base) || !/\d/.test(tracks)) return false;
  if (/^-?\d+(?:\.\d+)?(?:%|d?vh|svh|lvh|d?vw|svw|lvw)$/.test(inside)) return false;
  return !/var\(--|--spacing\(/.test(inside);
}
