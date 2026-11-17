import { useNavigate } from 'react-router-dom'
import { IconTrash } from './icons.jsx'

function formatRelativeTime(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateString).toLocaleDateString()
}

function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()

  return (
    <div className="group border border-ink/8 rounded-md bg-surface overflow-hidden flex flex-col transition-[border-color,box-shadow,transform] duration-150 hover:border-ink/14 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_6px_16px_-4px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        onClick={() => navigate(`/editor/${project.id}`)}
        aria-label={`Open ${project.name}`}
        className="aspect-[4/3] flex items-center justify-center bg-surface-sunken border-b border-ink/8 text-ink-disabled cursor-pointer"
      >
        <span className="text-xs tabular-nums">
          {project.width} × {project.height}
        </span>
      </button>
      <div className="px-3 py-2.5 flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate(`/editor/${project.id}`)}
          className="min-w-0 text-left cursor-pointer"
        >
          <p className="m-0 text-[13px] font-semibold text-ink truncate">
            {project.name}
          </p>
          <p className="m-0.5 mt-0.5 text-xs text-ink-tertiary">
            Updated {formatRelativeTime(project.updatedAt)}
          </p>
        </button>
        <button
          type="button"
          onClick={() => onDelete(project)}
          aria-label={`Delete ${project.name}`}
          className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-sm text-ink-tertiary transition-colors duration-150 hover:bg-surface-sunken hover:text-danger"
        >
          <IconTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default ProjectCard
