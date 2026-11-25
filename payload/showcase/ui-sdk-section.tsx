'use client';

import {useEffect, useId, useState} from 'react';
import {Copy, DataBase, DataTable, Download, Icon, TextWrap} from '@/components/monte/icon';
import {Button} from '@/components/monte/ui/button';
import {CodeBlock} from '@/components/monte/ui/code-block';
import {Label} from '@/components/monte/ui/field';
import {Listbox, ListboxItem} from '@/components/monte/ui/listbox';
import {
  Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroupLabel, MenubarItem, MenubarMenu, MenubarRadioGroup,
  MenubarRadioItem, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger,
} from '@/components/monte/ui/menubar';
import {NumberInput} from '@/components/monte/ui/number-input';
import {Resizable, ResizableHandle, ResizablePanel} from '@/components/monte/ui/resizable';
import {Tag} from '@/components/monte/ui/tag';
import {Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggle} from '@/components/monte/ui/toolbar';
import {Tree, TreeGroup, TreeItem, TreeItemLabel} from '@/components/monte/ui/tree';
import {monteAgent, setAgentApprover, useWebMcpTools, type AgentAction, type ObservedChange} from '@/lib/monte/agent';
import {Section, Specimen} from './section';

const schemas = [
  {name: 'analytics', tables: ['events', 'sessions_daily', 'page_views']},
  {name: 'billing', tables: ['invoices', 'usage_hourly']},
  {name: 'staging', tables: ['raw_clicks']},
];

const regions = ['eu-west-1', 'eu-central-1', 'us-east-1', 'us-west-2', 'ap-southeast-1'];
const recent = ['weekly_revenue.sql', 'churn_cohorts.sql'];

/** A query editor built only from the ui-sdk-backed components: menubar, toolbar, resizable panes, tree, listbox, number input. */
function QueryEditor({onLog}: {onLog: (line: string) => void}) {
  const [table, setTable] = useState<string | null>('analytics.events');
  const regionLabel = useId();
  const limitLabel = useId();

  return (
    <Specimen name="Query editor" source="ui/menubar.tsx, ui/toolbar.tsx, ui/resizable.tsx, ui/tree.tsx" className="flex flex-col">
      <div className="rule-row px-1">
        <Menubar aria-label="Editor">
          <MenubarMenu onAction={value => onLog(`File: ${value}`)}>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem value="New query" shortcut="mod+alt+n">New query</MenubarItem>
              <MenubarSub>
                <MenubarSubTrigger>Open recent</MenubarSubTrigger>
                <MenubarSubContent>
                  {recent.map(name => <MenubarItem key={name} value={`Open ${name}`}>{name}</MenubarItem>)}
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator/>
              <MenubarItem value="Delete query" destructive data-agent-confirm="Deletes the saved query weekly_revenue.sql">Delete query</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu onAction={value => onLog(`Edit: ${value}`)}>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem value="Undo" disabled>Undo</MenubarItem>
              <MenubarItem value="Format query">Format query</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem value="Schema" defaultChecked>Show schema</MenubarCheckboxItem>
              <MenubarCheckboxItem value="Line numbers">Show line numbers</MenubarCheckboxItem>
              <MenubarSeparator/>
              <MenubarRadioGroup defaultValue="Comfortable">
                <MenubarGroupLabel>Density</MenubarGroupLabel>
                <MenubarRadioItem value="Comfortable">Comfortable</MenubarRadioItem>
                <MenubarRadioItem value="Compact">Compact</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <Resizable className="h-96">
        <ResizablePanel id="schema" defaultSize={32} minSize="180px" collapsible className="py-1">
          <Tree
            aria-label="Warehouse"
            value={table}
            onValueChange={value => setTable(value)}
            defaultExpanded={['analytics']}
            size="sm"
          >
            {schemas.map(schema => (
              <TreeItem key={schema.name} value={schema.name}>
                <TreeItemLabel><Icon icon={DataBase}/>{schema.name}</TreeItemLabel>
                <TreeGroup>
                  {schema.tables.map(name => (
                    <TreeItem key={name} value={`${schema.name}.${name}`}>
                      <TreeItemLabel><Icon icon={DataTable}/>{name}</TreeItemLabel>
                    </TreeItem>
                  ))}
                </TreeGroup>
              </TreeItem>
            ))}
          </Tree>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize schema"/>
        <ResizablePanel id="query" className="flex flex-col">
          <div className="panel-head">
            <span className="min-w-0 truncate">{table ?? 'No table'}</span>
            <Toolbar aria-label="Results" className="ms-auto -me-1.5">
              <ToolbarToggle aria-label="Wrap lines"><Icon icon={TextWrap}/></ToolbarToggle>
              <ToolbarSeparator/>
              <ToolbarButton aria-label="Copy results" onClick={() => onLog('Copied results')}><Icon icon={Copy}/></ToolbarButton>
              <ToolbarButton aria-label="Download results" onClick={() => onLog('Downloaded results')}><Icon icon={Download}/></ToolbarButton>
            </Toolbar>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-4 p-(--inset) sm:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span id={regionLabel} className="type-label-sm text-text-2">Region</span>
              <Listbox aria-labelledby={regionLabel} defaultValue="eu-west-1" onValueChange={value => onLog(`Region: ${value}`)} className="max-h-48">
                {regions.map(region => <ListboxItem key={region} value={region}>{region}</ListboxItem>)}
              </Listbox>
            </div>
            <div className="flex w-full flex-col gap-1.5 sm:w-44">
              <Label id={limitLabel}>Row limit</Label>
              <NumberInput aria-labelledby={limitLabel} defaultValue={1000} min={100} max={100000} step={100} onValueCommit={value => onLog(`Row limit: ${value}`)}/>
            </div>
          </div>
        </ResizablePanel>
      </Resizable>
    </Specimen>
  );
}

/** Each planned step names its target the way a person would, and the actions it may take, in order of preference. */
const plan: {ref: string; prefer: string[]; args: unknown[]}[] = [
  {ref: 'Warehouse', prefer: ['setValue', 'select'], args: ['billing.invoices']},
  {ref: 'Region', prefer: ['setValue'], args: ['us-east-1']},
  {ref: 'Row limit', prefer: ['setValue'], args: [5000]},
  {ref: 'Wrap lines', prefer: ['setPressed', 'toggle'], args: [true]},
  {ref: 'File', prefer: ['press'], args: ['Delete query']},
];

type Pending = {step: AgentAction; answer: (ok: boolean) => void};

/** Reads the bridge's snapshot, runs a plan through act, and holds a marked step for the person. */
function AgentConsole({log}: {log: string[]}) {
  const [output, setOutput] = useState('// Read the snapshot or run the plan.');
  const [pending, setPending] = useState<Pending | null>(null);
  const [changes, setChanges] = useState<ObservedChange[]>([]);
  const [running, setRunning] = useState(false);
  const webMcp = useWebMcpTools();

  useEffect(() => {
    const unsubscribe = monteAgent().subscribe(change => setChanges(list => [change, ...list].slice(0, 6)));
    const release = setAgentApprover((step, signal) => new Promise<boolean>(resolve => {
      const answer = (ok: boolean) => { setPending(null); resolve(ok); };
      signal.addEventListener('abort', () => answer(false), {once: true});
      setPending({step, answer});
    }));
    return () => { unsubscribe(); release(); };
  }, []);

  const snapshot = () => setOutput(JSON.stringify(monteAgent().snapshot(), null, 2));

  const run = async () => {
    setRunning(true);
    const agent = monteAgent();
    const found = agent.snapshot();
    const steps = plan.map(({ref, prefer, args}) => {
      const entry = found.find(e => e.label === ref);
      const action = prefer.find(a => entry?.actions.includes(a)) ?? prefer[0];
      return {ref, action, args: action === 'toggle' ? [] : args};
    });
    const result = await agent.act({steps});
    setOutput(JSON.stringify({steps, result}, null, 2));
    setRunning(false);
  };

  return (
    <Specimen name="Agent bridge" source="lib/monte/agent.ts" className="flex flex-col">
      <div className="rule-row flex flex-wrap items-center gap-3 p-(--inset)">
        <p className="type-body-sm max-w-measure flex-1 text-text-2">
          The plan picks a table, a region and a row limit, turns on wrapping, then asks to delete the query, which
          waits for you.
        </p>
        <Tag variant={webMcp ? 'ok' : 'outline'}>{webMcp ? 'WebMCP on' : 'No WebMCP'}</Tag>
        <Button variant="secondary" onClick={snapshot}>Read snapshot</Button>
        <Button onClick={run} pending={running} pendingLabel="Running plan">Run plan</Button>
      </div>
      {pending && (
        <div role="alert" className="rule-row flex flex-wrap items-center gap-3 bg-warn-tint p-(--inset)">
          <p className="type-body-sm min-w-0 flex-1 text-text-1">The agent asks to: {pending.step.confirm}</p>
          <Button variant="secondary" onClick={() => pending.answer(false)}>Refuse</Button>
          <Button variant="destructive" onClick={() => pending.answer(true)}>Delete query</Button>
        </div>
      )}
      <div className="grid min-w-0 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 rule-col">
          <CodeBlock code={output} language="json" maxLines={18} className="border-0"/>
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="panel-head"><span>Changes</span></div>
          <ul className="flex flex-col">
            {changes.length === 0 && <li className="type-caption p-(--inset) text-text-3">None yet. Change a control above or run the plan.</li>}
            {changes.map((change, i) => (
              <li key={`${change.ref}-${change.key}-${i}`} className="rule-row flex items-baseline gap-2 px-(--inset) py-2">
                <span className="type-code-sm min-w-0 flex-1 truncate">{change.label ?? change.ref} {change.key}: {String(change.value)}</span>
                <Tag size="sm" variant={change.source === 'agent' ? 'neutral' : 'outline'}>{change.source === 'agent' ? 'Agent' : 'Person'}</Tag>
              </li>
            ))}
            {log.map((line, i) => <li key={`log-${i}-${line}`} className="rule-row type-code-sm px-(--inset) py-2 text-text-2">{line}</li>)}
          </ul>
        </div>
      </div>
    </Specimen>
  );
}

export function UiSdkSection() {
  const [log, setLog] = useState<string[]>([]);
  const onLog = (line: string) => setLog(list => [line, ...list].slice(0, 4));
  return (
    <Section
      id="ui-sdk"
      title="ui-sdk components"
      description="Tree, toolbar, menubar, listbox, number input and resizable panes come from ui-sdk, drawn in Monte's tokens by components/monte/ui-sdk.css. An agent can read and drive them through the bridge below."
    >
      <QueryEditor onLog={onLog}/>
      <AgentConsole log={log}/>
    </Section>
  );
}
