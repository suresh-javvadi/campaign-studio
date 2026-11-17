function ColorField({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-secondary">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-12 bg-surface-sunken border border-ink/8 rounded-sm cursor-pointer"
      />
    </div>
  )
}

export default ColorField
