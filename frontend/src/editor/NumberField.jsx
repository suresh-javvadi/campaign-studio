function NumberField({ label, value, onChange, min, max, step = 1 }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-secondary">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14 tabular-nums"
      />
    </div>
  )
}

export default NumberField
