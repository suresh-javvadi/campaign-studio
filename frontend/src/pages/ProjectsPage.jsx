import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Button from '../components/Button.jsx'
import CreateDesignModal from '../components/CreateDesignModal.jsx'
import { IconFrame, IconPlus } from '../components/icons.jsx'
import { listProjects, deleteProject } from '../api/projects.js'

function ProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => {
    let cancelled = false
    listProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleCreate = (project) => {
    navigate(`/editor/${project.id}`)
  }

  const handleConfirmDelete = async () => {
    const project = pendingDelete
    setPendingDelete(null)
    try {
      await deleteProject(project.id)
      setProjects((current) => current.filter((item) => item.id !== project.id))
    } catch {
      // leave the list as-is; reloading the page will re-sync
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-5 flex-wrap">
        <div>
          <h2 className="text-[22px] md:text-2xl tracking-tight">My Projects</h2>
          <p className="mt-1.5 text-sm text-ink-secondary">
            All of your campaign designs, saved and ready to reopen.
          </p>
        </div>
        <Button className="w-full md:w-auto" onClick={() => setIsModalOpen(true)}>
          <IconPlus />
          Create New Design
        </Button>
      </div>

      {status === 'loading' && (
        <p className="m-0 text-sm text-ink-tertiary">Loading projects…</p>
      )}
      {status === 'error' && (
        <p className="m-0 text-sm text-danger">
          Couldn&apos;t load your projects. Is the backend running?
        </p>
      )}
      {status === 'ready' && projects.length === 0 && (
        <EmptyState
          icon={IconFrame}
          title="No projects yet"
          subtitle="Create your first campaign design to see it here."
          actionLabel="Create your first design"
          onAction={() => setIsModalOpen(true)}
        />
      )}
      {status === 'ready' && projects.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={setPendingDelete}
              onRenamed={(updated) =>
                setProjects((current) =>
                  current.map((item) => (item.id === updated.id ? updated : item)),
                )
              }
            />
          ))}
        </div>
      )}

      <CreateDesignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete project"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.name}"? This can't be undone.`
            : ''
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default ProjectsPage
