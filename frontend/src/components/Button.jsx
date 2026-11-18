const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  outline: 'bg-surface text-ink border border-ink/14 hover:bg-surface-sunken',
  danger: 'bg-danger text-white hover:opacity-90',
}

function Button({ as: Component = 'button', variant = 'primary', className = '', children, ...props }) {
  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      className={`inline-flex items-center justify-center gap-1.5 h-[38px] px-4 rounded-sm text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Button
