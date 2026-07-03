type Props = {
  label?: string
}

// Editorial section break: a thin rule with an optional label tag pinned to the
// left. Less ornamental than diamonds — more like a printed running head.
export function SectionDivider({ label }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="relative">
        <span className="block h-px w-full bg-espresso/20" />
        {label && (
          <span className="absolute left-0 top-0 -translate-y-1/2 bg-background pr-4 font-mono text-[11px] uppercase tracking-[0.35em] text-terracotta">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
