'use client';

import {useEffect, useState} from 'react';
import {agentTools, createAgent, registerTools, type AgentAction} from '@ui-sdk/react/agent';

// The page's one agent bridge, for the ui-sdk-backed Monte components (Tree, Toolbar, Menubar, Listbox, NumberInput,
// Resizable). ui-sdk's createAgent lists those components by their accessible names (snapshot), finds their choices
// (query) and calls their actions (act), the same calls a person's keys make, so onValueChange still runs and sees
// details.source === "agent". Monte's Base UI components are not in the bridge: an agent cannot see or press them.
//
// A step on anything marked data-agent-confirm="<what it does>" waits for a person. The bridge asks the approver a
// screen set with setAgentApprover (an inline Approve / Refuse row, a Dialog); with none set, it refuses.
//
// A browser agent (WebMCP) gets the same three tools from useWebMcpTools(), which does nothing in a browser without
// document.modelContext. Its allow answers true: the bridge's own allow above already asks the person, once.
//
// Client only. Import it from a "use client" component and call monteAgent() in an effect or a handler, never while
// rendering on the server.

type Approver = (step: AgentAction, signal: AbortSignal) => boolean | Promise<boolean>;

let approver: Approver | null = null;
let bridge: ReturnType<typeof createAgent> | null = null;

/** Sets who answers for the person when a step needs one. Returns the undo. */
function setAgentApprover(next: Approver) {
  approver = next;
  return () => { if (approver === next) approver = null; };
}

/** The bridge, made on first use in the browser. */
function monteAgent() {
  bridge ??= createAgent({
    allow: (step, {signal}) => !step.confirm || (approver ? approver(step, signal) : false),
  });
  return bridge;
}

/** Whether this browser offers WebMCP (document.modelContext). */
function hasWebMcp() {
  return typeof document !== 'undefined' && 'modelContext' in document;
}

/** Registers snapshot, query and act with a WebMCP browser agent while mounted. Returns whether it registered. */
function useWebMcpTools(enabled = true) {
  const [registered, setRegistered] = useState(false);
  useEffect(() => {
    if (!enabled || !hasWebMcp()) return;
    const unregister = registerTools(monteAgent(), {allow: () => true});
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the registration happens here, in the browser
    setRegistered(true);
    return () => { unregister(); setRegistered(false); };
  }, [enabled]);
  return registered;
}

export {agentTools, monteAgent, setAgentApprover, hasWebMcp, useWebMcpTools, type Approver};
export type {AgentAction, AgentComponent, AgentStep, ObservedChange} from '@ui-sdk/react/agent';
