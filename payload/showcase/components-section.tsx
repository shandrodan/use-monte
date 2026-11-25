'use client';

import {useState} from 'react';
import {Add, ArrowRight, Copy, DataBase, Download, Edit, Icon, Play, Renew, Settings, TrashCan} from '@/components/monte/icon';
import {Alert, AlertAction, AlertDescription, AlertTitle} from '@/components/monte/ui/alert';
import {Avatar, AvatarGroup} from '@/components/monte/ui/avatar';
import {BarBlocks} from '@/components/monte/ui/bar-blocks';
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from '@/components/monte/ui/breadcrumb';
import {Button} from '@/components/monte/ui/button';
import {LineChart} from '@/components/monte/ui/chart';
import {Checkbox} from '@/components/monte/ui/checkbox';
import {CodeBlock} from '@/components/monte/ui/code-block';
import {DataList, DataListItem, DataListLabel, DataListValue} from '@/components/monte/ui/data-list';
import {Dialog, DialogAction, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/monte/ui/dialog';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from '@/components/monte/ui/dropdown-menu';
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle} from '@/components/monte/ui/empty-state';
import {Field, FieldDescription, FieldLabel} from '@/components/monte/ui/field';
import {Input} from '@/components/monte/ui/input';
import {Kbd} from '@/components/monte/ui/kbd';
import {Meter, MeterLabel, MeterValue} from '@/components/monte/ui/meter';
import {Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger} from '@/components/monte/ui/popover';
import {Progress, ProgressLabel, ProgressValue} from '@/components/monte/ui/progress';
import {RadioGroup, RadioGroupOption} from '@/components/monte/ui/radio-group';
import {SegmentedControl, SegmentedControlItem} from '@/components/monte/ui/segmented-control';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/monte/ui/select';
import {Skeleton, SkeletonText} from '@/components/monte/ui/skeleton';
import {Slider} from '@/components/monte/ui/slider';
import {Status} from '@/components/monte/ui/status';
import {StatusStrip, StatusStripCell, StatusStripLabel, StatusStripUnit, StatusStripValue} from '@/components/monte/ui/status-strip';
import {StemChart} from '@/components/monte/ui/stem-chart';
import {Swimlanes} from '@/components/monte/ui/swimlanes';
import {Switch} from '@/components/monte/ui/switch';
import {Tabs, TabsContent, TabsCount, TabsList, TabsTrigger} from '@/components/monte/ui/tabs';
import {Tag} from '@/components/monte/ui/tag';
import {Textarea} from '@/components/monte/ui/textarea';
import {Toaster, toast} from '@/components/monte/ui/toast';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/monte/ui/tooltip';
import {ToolCallRow, ToolCallStack} from '@/components/monte/ai/tool-call-row';
import {JobRuns} from '@/components/monte/blocks/job-runs';
import {Section, Specimen} from './section';

const rowsPerDay = [
  {day: 'Nov 16', loaded: 812000, failed: 4200},
  {day: 'Nov 17', loaded: 790000, failed: 3100},
  {day: 'Nov 18', loaded: 861000, failed: 9800},
  {day: 'Nov 19', loaded: 902000, failed: 2200},
  {day: 'Nov 20', loaded: 874000, failed: 1900},
  {day: 'Nov 21', loaded: 948000, failed: 2600},
  {day: 'Nov 22', loaded: 1012000, failed: 1500},
];

const runsPerWeek = [
  {week: 'W42', runs: 182}, {week: 'W43', runs: 204}, {week: 'W44', runs: 168},
  {week: 'W45', runs: 231}, {week: 'W46', runs: 219}, {week: 'W47', runs: 246},
];

function ActionsDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Specimen name="Button" source="ui/button.tsx" className="flex flex-col">
        <div className="rule-row flex flex-wrap items-center gap-3 p-(--inset)">
          <Button>Run pipeline</Button>
          <Button variant="secondary">Edit schedule</Button>
          <Button variant="ghost">Cancel</Button>
          <div><Button variant="destructive">Delete pipeline</Button></div>
        </div>
        <div className="rule-row flex flex-wrap items-center gap-3 p-(--inset)">
          <div><Button size="sm">Small</Button></div>
          <div><Button>Default</Button></div>
          <div><Button size="lg">Large</Button></div>
          <Button variant="secondary" size="icon-sm" aria-label="Refresh"><Icon icon={Renew}/></Button>
          <Button variant="secondary" size="icon" aria-label="Settings"><Icon icon={Settings}/></Button>
          <Button variant="secondary" size="icon-lg" aria-label="Download"><Icon icon={Download}/></Button>
        </div>
        <div className="rule-row flex flex-wrap items-center gap-3 p-(--inset)">
          <div><Button pending>Deploying</Button></div>
          <div><Button disabled>Disabled</Button></div>
          <Button variant="secondary"><Icon icon={Add}/>New pipeline</Button>
          <Button variant="ghost">Open logs<Icon icon={ArrowRight}/></Button>
        </div>
      </Specimen>

      <div className="flex flex-col gap-4">
        <Specimen name="Tag and status" source="ui/tag.tsx, ui/status.tsx" className="flex flex-col">
          <div className="rule-row flex flex-wrap items-center gap-2 p-(--inset)">
            <Tag>Production</Tag>
            <Tag variant="outline">Staging</Tag>
            <Tag variant="ok">Passed</Tag>
            <Tag variant="warn">Slow</Tag>
            <Tag variant="fail">Failed</Tag>
            <Tag size="sm">Small</Tag>
            <Tag count={128}/>
          </div>
          <div className="rule-row flex flex-wrap items-center gap-4 p-(--inset)">
            <Status status="idle"/>
            <Status status="queued"/>
            <Status status="running"/>
            <Status status="paused"/>
            <Status status="ok"/>
            <Status status="warn"/>
            <Status status="fail"/>
          </div>
        </Specimen>
        <Specimen name="Avatar and kbd" source="ui/avatar.tsx, ui/kbd.tsx">
          <AvatarGroup label="Owners">
            <Avatar name="Priya Nair"/>
            <Avatar name="Tomás Ruiz"/>
            <Avatar name="Mei Chen"/>
            <Avatar name="ingest-bot" type="service"/>
          </AvatarGroup>
          <Avatar name="Warehouse" type="service" size="sm"/>
          <span className="ms-auto flex items-center gap-2"><Kbd keys="mod+k"/><Kbd keys="shift+enter"/><Kbd>Esc</Kbd></span>
        </Specimen>
      </div>
    </div>
  );
}

function InputsDemo() {
  const [notify, setNotify] = useState(true);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Specimen name="Field, input, select, textarea" source="ui/field.tsx, ui/input.tsx" className="flex flex-col gap-4 p-(--inset)">
        <Field>
          <FieldLabel>Pipeline name</FieldLabel>
          <Input defaultValue="orders-daily" mono/>
          <FieldDescription>Lowercase letters, digits and dashes.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Search runs</FieldLabel>
          <Input mode="search" placeholder="Run ID or pipeline" shortcut="/"/>
        </Field>
        <Field>
          <FieldLabel>API key</FieldLabel>
          <Input mode="password" defaultValue="sk_live_51Hx8fQ2e"/>
        </Field>
        <Field>
          <FieldLabel>Endpoint</FieldLabel>
          <Input mode="copy" value="https://api.example.com/v2/ingest" noun="endpoint"/>
        </Field>
        <Field>
          <FieldLabel>Region</FieldLabel>
          <Select items={{'eu-west-1': 'EU West (Ireland)', 'us-east-1': 'US East (Virginia)', 'ap-south-1': 'Asia Pacific (Mumbai)'}} defaultValue="eu-west-1">
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="eu-west-1">EU West (Ireland)</SelectItem>
              <SelectItem value="us-east-1">US East (Virginia)</SelectItem>
              <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea defaultValue="Loads yesterday's orders from Postgres into the warehouse."/>
        </Field>
      </Specimen>

      <div className="flex flex-col gap-4">
        <Specimen name="Checkbox, radio, switch" source="ui/checkbox.tsx, ui/radio-group.tsx, ui/switch.tsx" className="flex flex-col">
          <div className="rule-row flex flex-wrap items-center gap-5 p-(--inset)">
            <label className="type-body-sm flex items-center gap-2"><Checkbox defaultChecked/>Retry on failure</label>
            <label className="type-body-sm flex items-center gap-2"><Checkbox/>Skip weekends</label>
            <label className="type-body-sm flex items-center gap-2"><Switch checked={notify} onCheckedChange={setNotify}/>Notify on fail</label>
          </div>
          <div className="rule-row p-(--inset)">
            <RadioGroup defaultValue="hourly" aria-label="Schedule">
              <RadioGroupOption value="hourly" label="Hourly" description="At minute 0 of every hour."/>
              <RadioGroupOption value="daily" label="Daily" description="At 02:00 UTC."/>
              <RadioGroupOption value="manual" label="Manual" description="Only when someone runs it."/>
            </RadioGroup>
          </div>
        </Specimen>
        <Specimen name="Slider and segmented control" source="ui/slider.tsx, ui/segmented-control.tsx" className="flex flex-col">
          <div className="rule-row p-(--inset)">
            <Slider defaultValue={64} thumbLabels={['Concurrency']} showValue/>
          </div>
          <div className="rule-row flex flex-wrap gap-3 p-(--inset)">
            <SegmentedControl defaultValue="day" aria-label="Range">
              <SegmentedControlItem value="hour">Hour</SegmentedControlItem>
              <SegmentedControlItem value="day">Day</SegmentedControlItem>
              <SegmentedControlItem value="week">Week</SegmentedControlItem>
            </SegmentedControl>
          </div>
        </Specimen>
      </div>
    </div>
  );
}

function FeedbackDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Alert status="fail">
          <AlertTitle>Load failed at step 3</AlertTitle>
          <AlertDescription>The orders table rejected 48 rows with a null customer_id.</AlertDescription>
          <AlertAction><Button variant="secondary" size="sm">Retry load</Button></AlertAction>
        </Alert>
        <Alert status="warn">
          <AlertTitle>Credits at 84%</AlertTitle>
          <AlertDescription>At this rate the warehouse runs out on Nov 28.</AlertDescription>
        </Alert>
        <Alert status="ok">
          <AlertTitle>Backfill finished</AlertTitle>
          <AlertDescription>1,204 partitions written in 18 minutes.</AlertDescription>
        </Alert>
        <Alert>
          <AlertTitle>Maintenance on Sunday</AlertTitle>
          <AlertDescription>Runs pause from 01:00 to 03:00 UTC.</AlertDescription>
        </Alert>
      </div>
      <div className="flex flex-col gap-4">
        <Specimen name="Meter and progress" source="ui/meter.tsx, ui/progress.tsx" className="flex flex-col gap-4 p-(--inset)">
          <Meter value={42}><MeterLabel>Storage</MeterLabel><MeterValue/></Meter>
          <Meter value={84}><MeterLabel>Credits</MeterLabel><MeterValue/></Meter>
          <Meter value={104}><MeterLabel>Concurrency</MeterLabel><MeterValue/></Meter>
          <Progress value={62}><ProgressLabel>Partitions written</ProgressLabel><ProgressValue/></Progress>
          <Progress value={null}><ProgressLabel>Waiting for a worker</ProgressLabel></Progress>
        </Specimen>
        <Specimen name="Status strip" source="ui/status-strip.tsx" className="p-0">
          <StatusStrip variant="plain" label="Cluster status" className="w-full">
            <StatusStripCell><StatusStripLabel>Runs today</StatusStripLabel><StatusStripValue>246</StatusStripValue></StatusStripCell>
            <StatusStripCell><StatusStripLabel>Failed</StatusStripLabel><StatusStripValue>3</StatusStripValue></StatusStripCell>
            <StatusStripCell><StatusStripLabel>p95 duration</StatusStripLabel><StatusStripValue>4.2<StatusStripUnit>min</StatusStripUnit></StatusStripValue></StatusStripCell>
            <StatusStripCell><StatusStripLabel>Rows</StatusStripLabel><StatusStripValue>1.01<StatusStripUnit>M</StatusStripUnit></StatusStripValue></StatusStripCell>
          </StatusStrip>
        </Specimen>
        <Specimen name="Skeleton" source="ui/skeleton.tsx" className="flex flex-col gap-3 p-(--inset)">
          <Skeleton className="h-6 w-1/3"/>
          <SkeletonText lines={3}/>
        </Specimen>
      </div>
    </div>
  );
}

function OverlaysDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Specimen name="Dialog, popover, tooltip, menu, toast" source="ui/dialog.tsx, ui/popover.tsx ...">
      <Button variant="secondary" onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Pause orders-daily?</DialogTitle></DialogHeader>
          <DialogBody>
            <DialogDescription>Runs scheduled while it is paused are skipped, not queued. You can resume it at any time.</DialogDescription>
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary"/>}>Keep running</DialogClose>
            <DialogAction>Pause pipeline</DialogAction>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Popover>
        <PopoverTrigger render={<Button variant="secondary"/>}>Open popover</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Retention</PopoverTitle>
          <PopoverDescription>Runs older than 90 days are deleted with their logs.</PopoverDescription>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary" size="icon" aria-label="Copy run ID"/>}><Icon icon={Copy}/></TooltipTrigger>
        <TooltipContent>Copy run ID</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary"/>}>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem><Icon icon={Play}/>Run now</DropdownMenuItem>
          <DropdownMenuItem><Icon icon={Edit}/>Edit schedule</DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuItem variant="destructive"><Icon icon={TrashCan}/>Delete pipeline</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="secondary" onClick={() => toast.success('Pipeline orders-daily resumed')}>Show toast</Button>
      <Button variant="secondary" onClick={() => toast.fail('Run run_8f2a90 failed at step 3')}>Show failure toast</Button>
      <Toaster/>
    </Specimen>
  );
}

function NavigationDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Specimen name="Breadcrumb" source="ui/breadcrumb.tsx">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#components">Pipelines</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem><BreadcrumbLink href="#components">orders-daily</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem><BreadcrumbPage>run_8f2a90</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Specimen>
      <Specimen name="Tabs" source="ui/tabs.tsx" className="flex flex-col">
        <Tabs defaultValue="runs">
          <TabsList>
            <TabsTrigger value="runs">Runs<TabsCount>246</TabsCount></TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="runs" className="type-body-sm p-(--inset) text-text-2">The last 246 runs of orders-daily.</TabsContent>
          <TabsContent value="schedule" className="type-body-sm p-(--inset) text-text-2">Every day at 02:00 UTC.</TabsContent>
          <TabsContent value="settings" className="type-body-sm p-(--inset) text-text-2">Retries, alerts and owners.</TabsContent>
        </Tabs>
      </Specimen>
    </div>
  );
}

function DataDemo() {
  return (
    <div className="flex flex-col gap-4">
      <JobRuns/>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="frame flex flex-col">
          <div className="panel-head"><span className="type-code">Rows loaded per day</span></div>
          <div className="p-(--inset)">
            <LineChart
              label="Rows loaded and failed per day"
              data={rowsPerDay}
              xKey="day"
              config={{loaded: {label: 'Loaded'}, failed: {label: 'Failed', status: 'fail'}}}
              area
              height={220}
            />
          </div>
        </div>
        <div className="frame flex flex-col">
          <div className="panel-head"><span className="type-code">Runs per week</span></div>
          <div className="p-(--inset)">
            <StemChart label="Runs per week" data={runsPerWeek} xKey="week" valueKey="runs" xLabel="Week" valueLabel="Runs" height={220}/>
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen name="Bar blocks" source="ui/bar-blocks.tsx" className="p-(--inset)">
          <BarBlocks className="w-full" label="Rows loaded by source" data={[
            {label: 'Postgres', value: 612000},
            {label: 'Stripe', value: 214000},
            {label: 'Segment', value: 168000},
            {label: 'Failed rows', value: 18000, tone: 'fail'},
          ]}/>
        </Specimen>
        <Specimen name="Data list" source="ui/data-list.tsx" className="p-0">
          <DataList className="w-full">
            <DataListItem><DataListLabel>Owner</DataListLabel><DataListValue>Priya Nair</DataListValue></DataListItem>
            <DataListItem><DataListLabel>Schedule</DataListLabel><DataListValue>Daily, 02:00 UTC</DataListValue></DataListItem>
            <DataListItem><DataListLabel>Warehouse</DataListLabel><DataListValue>analytics-xl</DataListValue></DataListItem>
            <DataListItem><DataListLabel>Last run</DataListLabel><DataListValue><Status status="ok" size="sm"/></DataListValue></DataListItem>
          </DataList>
        </Specimen>
      </div>
      <Specimen name="Swimlanes" source="ui/swimlanes.tsx" className="p-(--inset)">
        <Swimlanes
          className="w-full"
          label="Nightly sync from Postgres to the warehouse"
          lanes={[{id: 'pg', label: 'Postgres'}, {id: 'queue', label: 'Queue'}, {id: 'wh', label: 'Warehouse'}]}
          steps={[
            {label: 'Export orders', from: 'pg', meta: '1.2s'},
            {label: 'Enqueue batches', from: 'pg', to: 'queue', meta: '48 batches'},
            {label: 'Load partitions', from: 'queue', to: 'wh', meta: '48,210 rows', tone: 'accent'},
            {label: 'Refresh views', from: 'wh', meta: 'Passed'},
          ]}
        />
      </Specimen>
    </div>
  );
}

function CodeAndRunsDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <CodeBlock language="sql" filename="orders_daily.sql" lineNumbers highlight={[4]} code={`select\n  date_trunc('day', created_at) as day,\n  count(*) as orders\nfrom orders\nwhere created_at >= now() - interval '7 days'\ngroup by 1\norder by 1;`}/>
        <CodeBlock variant="command" code={`$ npx eslint -c monte.eslint.config.mjs .\nNo problems found.`}/>
      </div>
      <div className="flex flex-col gap-4">
        <ToolCallStack>
          <ToolCallRow label="Read source" detail="models/orders.sql" duration={420}/>
          <ToolCallRow label="Run query" detail="orders_daily" duration={3800}/>
          <ToolCallRow label="Write partitions" detail="warehouse.orders_daily" state="running" tab="Writing partitions"/>
          <ToolCallRow label="Refresh views" state="queued"/>
        </ToolCallStack>
        <Empty>
          <EmptyHeader>
            <EmptyIcon icon={DataBase}/>
            <EmptyTitle>No pipelines yet</EmptyTitle>
            <EmptyDescription>Connect a source to load its tables on a schedule.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent><Button>Connect source</Button></EmptyContent>
        </Empty>
      </div>
    </div>
  );
}

export function ComponentsSection() {
  return (
    <>
      <Section id="components" title="Actions and display" description="Buttons, tags, the status words and avatars. One brand slab per group.">
        <ActionsDemo/>
      </Section>
      <Section id="inputs" title="Inputs and selection" description="Fields read by their label, placeholder and fill. Checked controls take the brand as a state.">
        <InputsDemo/>
      </Section>
      <Section id="feedback" title="Feedback" description="Alerts, meters, progress, the status strip and skeletons.">
        <FeedbackDemo/>
      </Section>
      <Section id="overlays" title="Overlays" description="Press each one: the panel with a rule edge, no shadow; a dialog adds the scrim.">
        <OverlaysDemo/>
      </Section>
      <Section id="navigation" title="Navigation" description="Where the page sits and which panel is open.">
        <NavigationDemo/>
      </Section>
      <Section id="data" title="Data and charts" description="Tables, lines, stems, blocks and swimlanes, all on the data series tokens.">
        <DataDemo/>
      </Section>
      <Section id="code" title="Code, runs and empty states" description="Code in the well, a run's steps joined by connectors, and an empty region that says why.">
        <CodeAndRunsDemo/>
      </Section>
    </>
  );
}

