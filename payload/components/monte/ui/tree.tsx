'use client';

import type {ComponentProps, ReactNode} from 'react';
import {
  Tree as TreePrimitive, TreeGroup as TreeGroupPrimitive, TreeItem as TreeItemPrimitive,
  TreeItemCheckbox as TreeItemCheckboxPrimitive, TreeItemIndicator as TreeItemIndicatorPrimitive,
  TreeItemLabel as TreeItemLabelPrimitive, type TreeMode, type TreeProps as TreePrimitiveProps,
} from '@ui-sdk/react/tree';
import {cva, type VariantProps} from 'class-variance-authority';
import {Checkmark, ChevronRight, Icon, Subtract} from '@/components/monte/icon';
import {mergeClass} from '@/lib/monte/utils';

// Monte's tree, on ui-sdk's Tree (@ui-sdk/react/tree): a hierarchy of files, schemas or pages a person browses and
// picks from, with one tab stop and the arrow keys between rows. Its look comes from components/monte/ui-sdk.css,
// read off ui-sdk's data-slot and state attributes; this file adds the size, the chevron and the checkbox's marks.
//
//   <Tree aria-label="Warehouse">                    name it: an agent and a screen reader find it by this name
//     <TreeItem value="analytics">
//       <TreeItemLabel><Icon icon={DataBase}/>analytics</TreeItemLabel>
//       <TreeGroup>
//         <TreeItem value="analytics.events"><TreeItemLabel>events</TreeItemLabel></TreeItem>
//       </TreeGroup>
//     </TreeItem>
//   </Tree>
//
// Props: everything ui-sdk's Tree takes (items, paths, mode, value, expanded, checkable, current, loadChildren,
// onAction ...) plus size.
// Variants (closed):
//   size  "default" | "sm"   32px rows in the 14px sans (default); 26px rows in the 13px caption, for a side panel.
//
// Rows: a 16px chevron, then the item's own icon and its name, indented 16px a level. The chevron turns a quarter
// on --dur-state and holds its place on a leaf, so names line up. The selected row and the current page take the
// selection wash; the current page's name reads in --accent-text. No side rail, no bold.
//
// Rules:
// - Name the tree with aria-label. Items are named by their label's visible text.
// - TreeItemLabel draws the chevron itself; pass indicator={false} only when the row draws its own.
// - A JSON value is JsonView, not a Tree. A short list with no levels is Listbox.
// - Keep app state in onValueChange and onExpandedChange: an agent's change runs no click handler.

const treeVariants = cva('', {
  variants: {
    size: {
      default: '',
      sm: '',
    },
  },
  defaultVariants: {size: 'default'},
});

type TreeProps<Mode extends TreeMode = 'single'> = TreePrimitiveProps<Mode> & VariantProps<typeof treeVariants>;

function Tree<Mode extends TreeMode = 'single'>({size, className, ...props}: TreeProps<Mode>) {
  const s = size ?? 'default';
  return <TreePrimitive<Mode> data-size={s} className={mergeClass(treeVariants({size: s}), className)} {...props}/>;
}

const TreeItem = TreeItemPrimitive;
const TreeGroup = TreeGroupPrimitive;

type TreeItemLabelProps = Omit<ComponentProps<typeof TreeItemLabelPrimitive>, 'children'> & {
  children?: ReactNode;
  /** Draws the chevron at the start of the row. On by default. */
  indicator?: boolean;
};

function TreeItemLabel({indicator = true, children, ...props}: TreeItemLabelProps) {
  return <TreeItemLabelPrimitive {...props}>
    {indicator && <TreeItemIndicator/>}
    {children}
  </TreeItemLabelPrimitive>;
}

function TreeItemIndicator(props: ComponentProps<typeof TreeItemIndicatorPrimitive>) {
  return <TreeItemIndicatorPrimitive {...props}><Icon icon={ChevronRight} size={16}/></TreeItemIndicatorPrimitive>;
}

/** The row's checkbox, with checkable on the Tree: a tick when checked, a bar while only some of a branch is. */
function TreeItemCheckbox(props: ComponentProps<typeof TreeItemCheckboxPrimitive>) {
  return <TreeItemCheckboxPrimitive {...props}>
    {state => state.checked === 'indeterminate' ? <Icon icon={Subtract} size={16}/> : state.checked ? <Icon icon={Checkmark} size={16}/> : null}
  </TreeItemCheckboxPrimitive>;
}

export {createTreeController, treeFromPaths, visibleTreeRows, type TreeItemData, type TreeController} from '@ui-sdk/react/tree';
export {Tree, TreeItem, TreeItemLabel, TreeItemIndicator, TreeItemCheckbox, TreeGroup, treeVariants, type TreeProps, type TreeItemLabelProps};
