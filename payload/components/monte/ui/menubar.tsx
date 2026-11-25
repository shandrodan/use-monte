'use client';

import type {ComponentProps, ReactNode} from 'react';
import {
  Menu, MenuCheckboxItem as MenuCheckboxItemPrimitive, MenuContent, MenuGroup, MenuGroupLabel, MenuItem,
  MenuItemIcon, MenuItemIndicator, MenuRadioGroup, MenuRadioItem as MenuRadioItemPrimitive, MenuSeparator, MenuShortcut,
  MenuSub, MenuSubContent as MenuSubContentPrimitive, MenuSubTrigger as MenuSubTriggerPrimitive, MenuTrigger,
} from '@ui-sdk/react/menu';
import {Menubar as MenubarPrimitive} from '@ui-sdk/react/menubar';
import {cva, type VariantProps} from 'class-variance-authority';
import {Checkmark, ChevronRight, Icon} from '@/components/monte/icon';
import {useMontePortal} from '@/lib/monte/portal';
import {mergeClass} from '@/lib/monte/utils';

// Monte's menubar, on ui-sdk's Menubar and Menu (@ui-sdk/react/menubar, @ui-sdk/react/menu): an application's menus
// (File, Edit, View) in one row that is a single tab stop. Left and Right move between menus, Down opens one, pointing
// at another trigger while one is open switches to it. Its look comes from components/monte/ui-sdk.css: the bar's
// triggers are quiet mono labels, a menu is the overlay recipe with 32px menu-row rows, as in DropdownMenu.
//
//   <Menubar aria-label="Editor">
//     <MenubarMenu onAction={run}>
//       <MenubarTrigger>File</MenubarTrigger>
//       <MenubarContent>
//         <MenubarItem value="new" shortcut="mod+n">New query</MenubarItem>
//         <MenubarSeparator/>
//         <MenubarItem value="delete" destructive data-agent-confirm="Deletes the saved query">Delete query</MenubarItem>
//       </MenubarContent>
//     </MenubarMenu>
//   </Menubar>
//
// Variants (closed):
//   MenubarContent  size  "default" | "sm"   32px rows (default) or 26px rows, for a bar in a small panel.
//
// Overlays: ui-sdk opens a menu in the browser's top layer, in place, with no portal. MenubarContent renders it into
// MontePortalProvider's container instead (the container prop), the same place Monte's Base UI overlays go, so the
// tokens, the theme and a right-to-left subtree's direction reach it. Without the provider it stays in place, which
// is still inside .monte.
//
// Rules:
// - Name the bar with aria-label when the page has another. Items are named by their text.
// - A single list of actions on one thing is DropdownMenu. A menubar is for an application's several menus.
// - Items run through the menu's onAction(value); keep app state there, not in onClick: an agent runs no click.
// - A destructive item takes destructive and data-agent-confirm, so an agent must ask the person first.

const menubarContentVariants = cva('', {
  variants: {
    size: {
      default: '',
      sm: '',
    },
  },
  defaultVariants: {size: 'default'},
});

const Menubar = MenubarPrimitive;
const MenubarMenu = Menu;
const MenubarTrigger = MenuTrigger;
const MenubarItem = MenuItem;
const MenubarItemIcon = MenuItemIcon;
const MenubarGroup = MenuGroup;
const MenubarGroupLabel = MenuGroupLabel;
const MenubarRadioGroup = MenuRadioGroup;
const MenubarSeparator = MenuSeparator;
const MenubarShortcut = MenuShortcut;
const MenubarSub = MenuSub;

type MenubarContentProps = ComponentProps<typeof MenuContent> & VariantProps<typeof menubarContentVariants>;

/** One menu's list. Opens into MontePortalProvider's container when there is one. */
function MenubarContent({size, className, container, ...props}: MenubarContentProps) {
  const portal = useMontePortal();
  const s = size ?? 'default';
  return <MenuContent data-size={s} container={container ?? portal ?? undefined} className={mergeClass(menubarContentVariants({size: s}), className)} {...props}/>;
}

/** A submenu's list. Nested popups stay inside their parent, so it needs no container of its own. */
function MenubarSubContent({size, className, ...props}: ComponentProps<typeof MenuSubContentPrimitive> & VariantProps<typeof menubarContentVariants>) {
  const s = size ?? 'default';
  return <MenuSubContentPrimitive data-size={s} className={mergeClass(menubarContentVariants({size: s}), className)} {...props}/>;
}

/** The row that opens a submenu, with its chevron at the end. */
function MenubarSubTrigger({children, ...props}: Omit<ComponentProps<typeof MenuSubTriggerPrimitive>, 'children'> & {children?: ReactNode}) {
  return <MenuSubTriggerPrimitive {...props}>{children}<Icon icon={ChevronRight} size={16}/></MenuSubTriggerPrimitive>;
}

/** A setting that turns on and off, with its tick in the leading column. */
function MenubarCheckboxItem({children, ...props}: Omit<ComponentProps<typeof MenuCheckboxItemPrimitive>, 'children'> & {children?: ReactNode}) {
  return <MenuCheckboxItemPrimitive {...props}>
    <MenuItemIndicator><Icon icon={Checkmark} size={16}/></MenuItemIndicator>
    {children}
  </MenuCheckboxItemPrimitive>;
}

/** One choice of a MenubarRadioGroup, with its tick in the leading column. */
function MenubarRadioItem({children, ...props}: Omit<ComponentProps<typeof MenuRadioItemPrimitive>, 'children'> & {children?: ReactNode}) {
  return <MenuRadioItemPrimitive {...props}>
    <MenuItemIndicator><Icon icon={Checkmark} size={16}/></MenuItemIndicator>
    {children}
  </MenuRadioItemPrimitive>;
}

export {createMenubarController} from '@ui-sdk/react/menubar';
export {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarItemIcon, MenubarCheckboxItem,
  MenubarRadioGroup, MenubarRadioItem, MenubarGroup, MenubarGroupLabel, MenubarSeparator, MenubarShortcut, MenubarSub,
  MenubarSubTrigger, MenubarSubContent, menubarContentVariants, type MenubarContentProps,
};
