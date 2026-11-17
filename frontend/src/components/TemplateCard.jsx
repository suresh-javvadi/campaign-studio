function TemplateCard({ template }) {
  const Icon = template.icon

  return (
    <div className="group border border-ink/8 rounded-md bg-surface overflow-hidden cursor-pointer transition-[border-color,box-shadow,transform] duration-150 hover:border-ink/14 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_6px_16px_-4px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[4/3] flex items-center justify-center bg-surface-sunken border-b border-ink/8 text-ink-disabled">
        <Icon className="w-8 h-8" />
        <div className="absolute inset-0 flex items-end justify-center pb-3 bg-[linear-gradient(180deg,transparent_50%,rgba(21,23,30,0.08)_100%)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <span className="px-3 py-1 bg-ink text-surface text-xs font-semibold rounded-full">
            Use template
          </span>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="m-0 text-[13px] font-semibold text-ink">{template.name}</p>
        <p className="m-0.5 mt-0.5 text-xs text-ink-tertiary">
          {template.category} · {template.dimensions}
        </p>
      </div>
    </div>
  )
}

export default TemplateCard
