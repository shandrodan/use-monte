'use client';

import type {ComponentProps} from 'react';
import {
  Toolbar as ToolbarPrimitive, ToolbarButton as ToolbarButtonPrimitive, ToolbarGroup as ToolbarGroupPrimitive,
  ToolbarInput as ToolbarInputPrimitive, ToolbarLink as ToolbarLinkPrimitive, ToolbarSeparator as ToolbarSeparatorPrimitive,
} from '@ui-sdk/react/toolbar';
import {Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive, ToggleIcon} from '@ui-sdk/react/toggle';
import {cva, type VariantProps} from 'class-variance-authority';
import {mergeClass} from '@/lib/monte/utils';

// Monte's toolbar, on ui-sdk's Toolbar and Toggle (@ui-sdk/react/toolbar, @ui-sdk/react/toggle): the tools that act on
// one view, such as a log's wrap, follow and filter, in one row that is a single tab stop. Tab enters the bar once;
// the arrow keys move between its tools; Home and End jump to the ends. Toggle groups inside join that navigation
// instead of adding stops. Its look comes from components/monte/ui-sdk.css; this file adds the variants.
//
//   <Toolbar aria-label="Log">
//     <ToolbarToggle aria-label="Wrap lines"><Icon icon={TextWrap}/></ToolbarToggle>
//     <ToolbarSeparator/>
//     <ToolbarButton>Download</ToolbarButton>
//   </Toolbar>
//
// Variants (closed):
//   Toolbar        size     "sm" | "default"           26px tools (sm, the default, as in a panel-head) or 32px tools.
//   ToolbarButton  variant  "ghost" | "secondary"      ghost (the default): quiet, no edge. secondary: the edged button,
//                                                      for the one tool that matters most in a long bar.
// Tools are mono labels in capitals (type-label-sm) or a square icon with an aria-label. A pressed toggle takes the
// checked recipe: the azure fill with a darker edge, the one state a toolbar colours.
//
// Rules:
// - Name the toolbar and every icon-only tool with aria-label. An agent finds a tool by that name.
// - No primary slab in a toolbar: the frame's footer holds the one primary action.
// - Joined buttons that are each their own tab stop are ButtonGroup. Two to five views of one thing are
//   SegmentedControl. A toolbar is for tools that act on the view next to it.
// - A disabled tool stays focusable (aria-disabled) so arrow keys and a tooltip still reach it.
// - Mark a tool an agent must not use alone with data-agent-confirm="<what it does>".

const toolbarVariants = cva('', {
  variants: {
    size: {
      sm: '',
      default: '',
    },
  },
  defaultVariants: {size: 'sm'},
});

type ToolbarProps = ComponentProps<typeof ToolbarPrimitive> & VariantProps<typeof toolbarVariants>;

function Toolbar({size, className, ...props}: ToolbarProps) {
  const s = size ?? 'sm';
  return <ToolbarPrimitive data-size={s} className={mergeClass(toolbarVariants({size: s}), className)} {...props}/>;
}

const toolbarButtonVariants = cva('', {
  variants: {
    variant: {
      ghost: '',
      secondary: 'edged',
    },
  },
  defaultVariants: {variant: 'ghost'},
});

type ToolbarButtonProps = ComponentProps<typeof ToolbarButtonPrimitive> & VariantProps<typeof toolbarButtonVariants>;

function ToolbarButton({variant, className, ...props}: ToolbarButtonProps) {
  const v = variant ?? 'ghost';
  return <ToolbarButtonPrimitive data-variant={v} className={mergeClass(toolbarButtonVariants({variant: v}), className)} {...props}/>;
}

const ToolbarGroup = ToolbarGroupPrimitive;
const ToolbarSeparator = ToolbarSeparatorPrimitive;
const ToolbarLink = ToolbarLinkPrimitive;
const ToolbarInput = ToolbarInputPrimitive;

/** A tool that stays pressed, like Wrap lines. Inside a ToolbarToggleGroup, the group's value decides. */
const ToolbarToggle = TogglePrimitive;
/** Toggles that share a value: one pressed at a time, or several with multiple. One stop in the toolbar's arrow keys. */
const ToolbarToggleGroup = ToggleGroupPrimitive;
const ToolbarToggleIcon = ToggleIcon;

export {createToolbarController} from '@ui-sdk/react/toolbar';
export {
  Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarLink, ToolbarInput, ToolbarToggle, ToolbarToggleGroup,
  ToolbarToggleIcon, toolbarVariants, toolbarButtonVariants, type ToolbarProps, type ToolbarButtonProps,
};
