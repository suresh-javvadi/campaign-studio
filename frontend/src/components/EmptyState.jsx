import Button from './Button.jsx'

function EmptyState({ icon: Icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-1.5 px-6 py-12 border-[1.5px] border-dashed border-ink/14 rounded-md bg-surface-sunken">
      <div className="w-11 h-11 rounded-full bg-accent/8 text-accent flex items-center justify-center mb-1">
        <Icon />
      </div>
      <p className="m-0 text-[15px] font-semibold text-ink">{title}</p>
      {subtitle && (
        <p className="m-0 mb-3 text-[13px] text-ink-secondary max-w-xs">
          {subtitle}
        </p>
      )}
      {actionLabel && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
