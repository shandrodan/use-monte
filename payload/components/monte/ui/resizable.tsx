'use client';

import {Resizable as ResizablePrimitive, ResizableHandle, ResizablePanel} from '@ui-sdk/react/resizable';

// Monte's resizable panels, on ui-sdk's Resizable (@ui-sdk/react/resizable): two or more panels a person resizes by
// the rule between them, with the pointer or the arrow keys (Shift for largeStep, Enter to collapse a collapsible
// panel), such as a schema tree beside a query editor. The rule is the region's own 1px --line, grown to a 9px hit
// area; it turns --line-control under the pointer and while dragged, and takes the focus ring from the keyboard. Its
// look comes from components/monte/ui-sdk.css.
//
//   <Resizable className="frame h-96" autoSaveId="editor-layout">
//     <ResizablePanel id="schema" defaultSize={30} minSize="200px" collapsible>...</ResizablePanel>
//     <ResizableHandle aria-label="Resize schema"/>
//     <ResizablePanel id="query">...</ResizablePanel>
//   </Resizable>
//
// Props: ui-sdk's own (orientation, layout, defaultLayout, onLayoutChange, onLayoutCommit, autoSaveId, step; a panel's
// defaultSize, minSize, maxSize, collapsible, collapsedSize).
// Variants: none. The handle is the rule a frame already draws between its columns, so there is nothing to choose.
//
// Rules:
// - Give the group a height (or let a flex parent give it one) and box it once with frame; the handle is the rule
//   inside, so never add rule-col to a panel.
// - Name every handle with aria-label, for what it resizes: "Resize schema". An agent moves it by that name.
// - Give panels an id when the layout is saved (autoSaveId), so a change elsewhere on the page keeps it.
// - Panels that never change size are a flex row with rule-col, not a Resizable.

const Resizable = ResizablePrimitive;

export {createResizableController} from '@ui-sdk/react/resizable';
export {Resizable, ResizablePanel, ResizableHandle};
