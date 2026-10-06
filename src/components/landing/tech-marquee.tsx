import { TECH_ICONS } from "@/lib/content";

const FORWARD = [...TECH_ICONS, ...TECH_ICONS];
const REVERSE = [...TECH_ICONS].reverse();
const REVERSE_LOOP = [...REVERSE, ...REVERSE];

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: typeof FORWARD;
  reverse?: boolean;
}) {
  return (
    <div className="flex overflow-hidden">
      <ul
        className={
          reverse
            ? "marquee-reverse marquee-pause flex w-max shrink-0 items-center"
            : "marquee marquee-pause flex w-max shrink-0 items-center"
        }
        role="list"
      >
        {items.map((tech, index) => (
          <li
            key={`${tech.id}-${reverse ? "rev" : "fwd"}-${index}`}
            className="flex shrink-0 items-center gap-3 px-7 sm:px-9"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tech.icon}
              alt=""
              width={28}
              height={28}
              className="size-7 object-contain"
            />
            <span className="text-foreground/80 text-sm font-medium whitespace-nowrap">
              {tech.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TechMarquee() {
  return (
    <section
      id="tecnologias"
      className="border-b border-border bg-background py-10 overflow-hidden"
      aria-label="Tecnologias que usamos"
    >
      <p className="text-muted-foreground mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.2em]">
        Tecnologias que usamos
      </p>

      <div className="relative flex flex-col gap-5">
        <div
          aria-hidden
          className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent sm:w-28"
        />
        <div
          aria-hidden
          className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent sm:w-28"
        />

        <MarqueeRow items={FORWARD} />
        <MarqueeRow items={REVERSE_LOOP} reverse />
      </div>
    </section>
  );
}
