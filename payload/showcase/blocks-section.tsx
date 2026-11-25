'use client';

import {useState} from 'react';
import {Checkmark, Icon} from '@/components/monte/icon';
import {Button} from '@/components/monte/ui/button';
import {Meter, MeterLabel, MeterValue} from '@/components/monte/ui/meter';
import {SegmentedControl, SegmentedControlItem} from '@/components/monte/ui/segmented-control';
import {Status} from '@/components/monte/ui/status';
import {StatusStrip, StatusStripCell, StatusStripLabel, StatusStripUnit, StatusStripValue} from '@/components/monte/ui/status-strip';
import {Tag} from '@/components/monte/ui/tag';
import {cn} from '@/lib/monte/utils';
import {Section} from './section';

type Plan = {name: string; monthly: number | null; blurb: string; features: string[]; cta: string; featured?: boolean};

const plans: Plan[] = [
  {name: 'Hobby', monthly: 0, blurb: 'For one person running a few pipelines.', cta: 'Start free', features: ['3 pipelines', '1,000 runs a month', '7 days of logs', 'Community support']},
  {name: 'Team', monthly: 49, blurb: 'For a data team that ships every day.', cta: 'Start 14-day trial', featured: true, features: ['Unlimited pipelines', '50,000 runs a month', '90 days of logs', 'Alerts to Slack and PagerDuty', 'Role-based access']},
  {name: 'Enterprise', monthly: null, blurb: 'For regulated workloads and private networks.', cta: 'Talk to sales', features: ['Everything in Team', 'Single sign-on and SCIM', 'Private networking', 'Audit log export', '99.95% uptime agreement']},
];

function Pricing() {
  const [cycle, setCycle] = useState('monthly');
  const yearly = cycle === 'yearly';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="type-display">Pay for the runs you make</h3>
          <p className="type-body max-w-measure text-text-2">Every plan has the scheduler, the log viewer and retries. Pick by how much you run.</p>
        </div>
        <SegmentedControl value={cycle} onValueChange={v => setCycle(v)} aria-label="Billing cycle">
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
          <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
        </SegmentedControl>
      </div>

      <div className="frame grid md:grid-cols-3">
        {plans.map(plan => {
          const price = plan.monthly === null ? null : yearly ? Math.round(plan.monthly * 0.8) : plan.monthly;
          return (
            <div key={plan.name} className={cn('rule-col flex flex-col border-b border-line md:border-b-0', plan.featured && 'bg-panel')}>
              <div className="panel-head">
                <span className="type-code">{plan.name}</span>
                {plan.featured && <Tag size="sm" variant="outline" className="ms-auto">Most teams</Tag>}
              </div>
              <div className="flex flex-1 flex-col gap-5 p-(--inset) pb-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="type-figure tabular-nums">{price === null ? 'Custom' : `$${price}`}</span>
                    {price !== null && <span className="type-label-sm text-text-3">per seat a month</span>}
                  </div>
                  <span className="type-caption text-text-2">{price === null ? 'Billed yearly, by contract.' : yearly ? 'Billed yearly, 20% off.' : 'Billed monthly.'}</span>
                </div>
                <p className="type-body-sm text-text-2">{plan.blurb}</p>
                <ul className="flex flex-col">
                  {plan.features.map(f => (
                    <li key={f} className="rule-row type-body-sm flex items-center gap-2 py-2">
                      <Icon icon={Checkmark} size={16} className="shrink-0 text-text-2"/>{f}
                    </li>
                  ))}
                </ul>
                <Button className="mt-auto w-full" size="lg" variant={plan.featured ? 'primary' : 'secondary'}>{plan.cta}</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="type-title">analytics-xl</h3>
        <div className="flex gap-2">
          <Button variant="secondary">Edit warehouse</Button>
          <Button>Resize warehouse</Button>
        </div>
      </div>
      <StatusStrip label="Warehouse status">
        <StatusStripCell><StatusStripLabel>State</StatusStripLabel><StatusStripValue><Status status="running" size="sm"/></StatusStripValue></StatusStripCell>
        <StatusStripCell><StatusStripLabel>Queries today</StatusStripLabel><StatusStripValue>18,402</StatusStripValue></StatusStripCell>
        <StatusStripCell><StatusStripLabel>Queued</StatusStripLabel><StatusStripValue>12</StatusStripValue></StatusStripCell>
        <StatusStripCell><StatusStripLabel>Spend</StatusStripLabel><StatusStripValue>$412<StatusStripUnit>today</StatusStripUnit></StatusStripValue></StatusStripCell>
      </StatusStrip>
      <div className="frame flex flex-col">
        <div className="panel-head"><span className="type-code">Capacity</span></div>
        <div className="flex flex-col gap-4 p-(--inset)">
          <Meter value={84}><MeterLabel>Credits</MeterLabel><MeterValue/></Meter>
          <Meter value={41}><MeterLabel>Storage</MeterLabel><MeterValue/></Meter>
          <Meter value={92}><MeterLabel>Concurrency</MeterLabel><MeterValue/></Meter>
        </div>
      </div>
    </div>
  );
}

export function BlocksSection() {
  return (
    <>
      <Section id="pricing" title="Block: pricing" description="A pricing page made only from Monte parts: one frame divided by rules, the brand slab on the one plan to pick, the rest secondary.">
        <Pricing/>
      </Section>
      <Section id="overview" title="Block: warehouse overview" description="A status strip, meters and one primary action on a page.">
        <Overview/>
      </Section>
    </>
  );
}
