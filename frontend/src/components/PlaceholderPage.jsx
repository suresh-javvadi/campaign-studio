import EmptyState from './EmptyState.jsx'
import { IconFrame } from './icons.jsx'

function PlaceholderPage({ title, description }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[22px] md:text-2xl tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1.5 text-sm text-ink-secondary">{description}</p>
        )}
      </div>
      <EmptyState
        icon={IconFrame}
        title="This section is coming soon"
        subtitle="We're still building this part of Campaign Studio — check back soon."
      />
    </div>
  )
}

export default PlaceholderPage
