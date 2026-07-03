type Props = {
  eyebrow: string
  title: string
  intro?: string
}

export function PageHeader({ eyebrow, title, intro }: Props) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-4 pt-20 md:pt-28">
      <p className="font-mono text-[12px] uppercase tracking-[0.35em] text-terracotta">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.95] tracking-tight text-espresso">
        {title}
      </h1>
      {intro && (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-espresso-2">
          {intro}
        </p>
      )}
    </section>
  )
}
