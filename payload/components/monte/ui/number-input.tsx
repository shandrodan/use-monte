'use client';

import type {ComponentProps} from 'react';
import {
  NumberInput as NumberInputPrimitive, NumberInputControl as NumberInputControlPrimitive, NumberInputDecrement,
  NumberInputGroup as NumberInputGroupPrimitive, NumberInputIncrement,
} from '@ui-sdk/react/number-input';
import {cva, type VariantProps} from 'class-variance-authority';
import {Add, Icon, Subtract} from '@/components/monte/icon';
import {mergeClass} from '@/lib/monte/utils';

// Monte's number input, on ui-sdk's NumberInput (@ui-sdk/react/number-input): a count, a limit or an amount a person
// types or steps, such as replicas, a retry limit or a budget. It formats for the page's locale, clamps to min and
// max, snaps to step, and takes Up and Down (Shift for largeStep, Page Up and Down) and the two step buttons. Its look
// comes from components/monte/ui-sdk.css: the field recipe as the box, the value in tabular figures, then two square
// step cells divided from it and from each other by 1px rules. A step button at its bound turns text-disabled.
//
//   <NumberInput aria-label="Replicas" defaultValue={3} min={1} max={12}/>
//   <NumberInput aria-label="Monthly budget" defaultValue={1200} step={50} format={{style: 'currency', currency: 'USD'}}/>
//
// Props: everything ui-sdk's NumberInput takes (value, defaultValue, onValueChange, onValueCommit, min, max, step,
// largeStep, format, locale, disabled, readOnly, required, name) plus size, aria-label, aria-labelledby and
// placeholder, which go to the input. Save in onValueCommit, which runs once a typed value or a held step ends.
// Variants (closed):
//   size  "sm" | "default" | "lg"   26, 32 (default) or 36px tall, the heights of Input.
//
// Rules:
// - Name it: aria-label, or a visible Monte Label pointed at it with aria-labelledby. An agent sets it by that name.
// - One line of free text is Input; a number on a track you drag is Slider. Use NumberInput when the exact value
//   matters and a person may type it.
// - Percentages are fractions: format={{style: 'percent'}} shows 0.5 as 50%.

const numberInputVariants = cva('', {
  variants: {
    size: {
      sm: '[--field-h:var(--control-sm)] [--field-px:var(--field-inset-sm)] [--field-size:var(--control-sm)] [--field-icon:var(--icon-sm)] type-caption',
      default: '',
      lg: '[--field-h:var(--control-lg)] [--field-px:var(--field-inset-lg)] [--field-size:var(--control-lg)] type-body',
    },
  },
  defaultVariants: {size: 'default'},
});

type NumberInputProps = Omit<ComponentProps<typeof NumberInputPrimitive>, 'children'> & VariantProps<typeof numberInputVariants> & {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  placeholder?: string;
  /** The input's id, for a <label htmlFor>. */
  id?: string;
};

function NumberInput({size, className, 'aria-label': label, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, placeholder, id, ...props}: NumberInputProps) {
  const s = size ?? 'default';
  return <NumberInputPrimitive data-size={s} className={mergeClass(numberInputVariants({size: s}), className)} {...props}>
    <NumberInputGroupPrimitive>
      <NumberInputControlPrimitive data-control="" id={id} aria-label={label} aria-labelledby={labelledBy} aria-describedby={describedBy} placeholder={placeholder}/>
      <NumberInputDecrement aria-label="Decrease"><Icon icon={Subtract} size={16}/></NumberInputDecrement>
      <NumberInputIncrement aria-label="Increase"><Icon icon={Add} size={16}/></NumberInputIncrement>
    </NumberInputGroupPrimitive>
  </NumberInputPrimitive>;
}

export {createNumberInputController} from '@ui-sdk/react/number-input';
export {NumberInput, numberInputVariants, type NumberInputProps};
