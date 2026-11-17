function ToggleButton({ pressed, onClick, children, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      className={`flex-1 inline-flex items-center justify-center h-9 rounded-sm border text-sm transition-colors duration-150 ${
        pressed
          ? 'bg-accent/8 border-transparent text-ink font-semibold'
          : 'bg-surface border-ink/8 text-ink-secondary hover:border-ink/14'
      }`}
    >
      {children}
    </button>
  )
}

export default ToggleButton
