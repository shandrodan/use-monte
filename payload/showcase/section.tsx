import type {ReactNode} from 'react';

/** One section of the specimen page: an anchor, a heading in sans, a sentence and the content. */
export function Section({id, title, description, children}: {id: string; title: string; description?: string; children: ReactNode}) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-4 border-t border-line pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="type-heading">{title}</h2>
        {description && <p className="type-body-sm max-w-measure text-text-2">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** A labelled specimen: a frame with a panel-head naming the piece and where it lives. */
export function Specimen({name, source, children, className}: {name: string; source?: string; children: ReactNode; className?: string}) {
  return (
    <div className="frame flex flex-col">
      <div className="panel-head">
        <span className="type-code">{name}</span>
        {source && <span className="type-code-sm ms-auto truncate text-text-3">{source}</span>}
      </div>
      <div className={className ?? 'flex flex-wrap items-center gap-3 p-(--inset)'}>{children}</div>
    </div>
  );
}
