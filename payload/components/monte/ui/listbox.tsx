'use client';

import type {ComponentProps, ReactNode} from 'react';
import {
  Listbox as ListboxPrimitive, ListboxGroup, ListboxGroupLabel, ListboxItem as ListboxItemPrimitive, ListboxItemIcon,
  ListboxItemIndicator, ListboxSeparator, type ListboxProps as ListboxPrimitiveProps,
} from '@ui-sdk/react/listbox';
import {cva, type VariantProps} from 'class-variance-authority';
import {Checkmark, Icon} from '@/components/monte/icon';
import {mergeClass} from '@/lib/monte/utils';

// Monte's listbox, on ui-sdk's Listbox (@ui-sdk/react/listbox): one or several options from a list that is always on
// the page, not in a popup, such as the regions a job may run in or the columns to export. One tab stop; the arrow
// keys move, a letter jumps, Shift extends a multiple selection and Ctrl or Command with A selects all. Its look
// comes from components/monte/ui-sdk.css: the panel with a 1px --line edge, rows in the list popups' light (the
// highlighted row lifts between two hairlines), and the chosen rows in the selection wash with an ink tick at the end.
//
//   <Listbox aria-label="Regions" multiple defaultValue={['eu-west-1']}>
//     <ListboxItem value="eu-west-1">eu-west-1</ListboxItem>
//     <ListboxItem value="us-east-1">us-east-1</ListboxItem>
//   </Listbox>
//
// Props: everything ui-sdk's Listbox takes (multiple, value, onValueChange, activation, orientation, readOnly, name,
// required ...) plus edge and size.
// Variants (closed):
//   edge  "framed" | "bare"    framed (the default) draws its own edge; bare drops it, for a listbox that fills a
//                              frame's body, so the frame's edge is the only one.
//   size  "default" | "sm"     32px rows in the 14px sans (default), or 26px rows in the 13px caption.
//
// Rules:
// - Name it with aria-label, or a visible label pointed at it with aria-labelledby. Options are named by their text.
// - In a form, pick one of many in a popup with Select; type to find with Combobox; a few choices with RadioGroup.
//   Listbox is for a list that stays open on the page, or for several choices from a list too long for checkboxes.
// - Give it a height (max-h-*) when it holds more than about eight rows; it scrolls inside its edge.
// - Keep app state in onValueChange: an agent's change runs no click handler.

const listboxVariants = cva('', {
  variants: {
    edge: {
      framed: '',
      bare: 'border-0 bg-transparent',
    },
    size: {
      default: '',
      sm: '',
    },
  },
  defaultVariants: {edge: 'framed', size: 'default'},
});

type ListboxProps<T = string, Multiple extends boolean | undefined = false> = ListboxPrimitiveProps<T, Multiple> & VariantProps<typeof listboxVariants>;

function Listbox<T = string, Multiple extends boolean | undefined = false>({edge, size, className, ...rest}: ListboxProps<T, Multiple>) {
  // The value and callback types are a union keyed on multiple, which a rest spread cannot keep narrowed.
  const props = rest as ListboxPrimitiveProps<T, Multiple>;
  const e = edge ?? 'framed';
  const s = size ?? 'default';
  return <ListboxPrimitive<T, Multiple> data-edge={e} data-size={s} className={mergeClass(listboxVariants({edge: e, size: s}), className)} {...props}/>;
}

type ListboxItemProps<T = string> = ComponentProps<typeof ListboxItemPrimitive<T>> & {children?: ReactNode};

/** One option, with its tick drawn at the end while it is chosen. */
function ListboxItem<T = string>({children, ...props}: ListboxItemProps<T>) {
  return <ListboxItemPrimitive<T> {...props}>
    {children}
    <ListboxItemIndicator><Icon icon={Checkmark} size={16}/></ListboxItemIndicator>
  </ListboxItemPrimitive>;
}

export {createListboxController} from '@ui-sdk/react/listbox';
export {
  Listbox, ListboxItem, ListboxItemIcon, ListboxGroup, ListboxGroupLabel, ListboxSeparator, listboxVariants,
  type ListboxProps, type ListboxItemProps,
};
