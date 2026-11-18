import { Link } from 'react-router-dom'

function PosterCard({ template }) {
  return (
    <Link
      to={`/poster/${template.id}`}
      className="group block border border-ink/8 rounded-md bg-surface overflow-hidden transition-[border-color,box-shadow,transform] duration-150 hover:border-ink/14 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_6px_16px_-4px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[4/5] bg-surface-sunken border-b border-ink/8 overflow-hidden">
        <img
          src={template.thumbnailUrl}
          alt={template.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-end justify-center pb-3 bg-[linear-gradient(180deg,transparent_55%,rgba(21,23,30,0.35)_100%)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <span className="px-3 py-1 bg-surface text-ink text-xs font-semibold rounded-full">
            Use this poster
          </span>
        </div>
      </div>
      <div className="px-3.5 py-3">
        <p className="m-0 text-[13px] font-semibold text-ink truncate">{template.title}</p>
        <p className="m-0.5 mt-1 text-xs text-ink-tertiary">
          {template.category} · {template.partyTag}
        </p>
      </div>
    </Link>
  )
}

export default PosterCard
