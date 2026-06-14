type Props = {
  eyebrow: string
  title: string
  intro?: string
}

export function PageHeader({ eyebrow, title, intro }: Props) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-4 pt-20 md:pt-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-terracotta">
        {eyebrow}
      </p>
      <h1 className="mt-5 font-display text-[clamp(3.5rem,9vw,8rem)] font-light italic leading-[0.95] tracking-tight text-espresso">
        {title}
      </h1>
      {intro && (
        <p className="mt-8 max-w-2xl font-display text-xl leading-relaxed text-espresso-2">
          {intro}
        </p>
      )}
    </section>
  )
}
