import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import PosterCard from '../components/PosterCard.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Button from '../components/Button.jsx'
import CreateDesignModal from '../components/CreateDesignModal.jsx'
import { IconFrame, IconPlus } from '../components/icons.jsx'
import { listProjects, deleteProject } from '../api/projects.js'
import { listTemplates } from '../api/templates.js'
import { useAuth } from '../auth/AuthContext.jsx'

const RECENT_PROJECTS_LIMIT = 6
const POPULAR_TEMPLATES_LIMIT = 6

function DashboardPage() {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [projectsStatus, setProjectsStatus] = useState('loading')
  const [templates, setTemplates] = useState([])
  const [pendingDelete, setPendingDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    listProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data)
          setProjectsStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setProjectsStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    listTemplates()
      .then((data) => {
        if (!cancelled) setTemplates(data)
      })
      .catch(() => {
        // the popular-templates section is a nice-to-have; fail quietly
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
      // leave the list as-is; reopening the dashboard will re-sync
    }
  }

  return (
    <>
      <section className="flex items-center justify-between gap-5 flex-wrap">
        <div>
          <h2 className="text-[22px] md:text-2xl tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h2>
          <p className="mt-1.5 text-sm text-ink-secondary">
            Here&apos;s what&apos;s happening with your campaigns today.
          </p>
        </div>
        <Button className="w-full md:w-auto" onClick={() => setIsModalOpen(true)}>
          <IconPlus />
          Create New Design
        </Button>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-lg">Recent Projects</h3>
        </div>

        {projectsStatus === 'loading' && (
          <p className="m-0 text-sm text-ink-tertiary">Loading projects…</p>
        )}
        {projectsStatus === 'error' && (
          <p className="m-0 text-sm text-danger">
            Couldn&apos;t load your projects. Is the backend running?
          </p>
        )}
        {projectsStatus === 'ready' && projects.length === 0 && (
          <EmptyState
            icon={IconFrame}
            title="No projects yet"
            subtitle="Your recent campaign designs will show up here once you create one."
            actionLabel="Create your first design"
            onAction={() => setIsModalOpen(true)}
          />
        )}
        {projectsStatus === 'ready' && projects.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4">
            {projects.slice(0, RECENT_PROJECTS_LIMIT).map((project) => (
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
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-lg">Popular Posters</h3>
            <p className="m-0 text-[13px] text-ink-secondary">
              Start fast with a ready-made poster
            </p>
          </div>
          <Link to="/app/templates" className="text-sm font-semibold text-accent hover:text-accent-hover">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4">
          {templates.slice(0, POPULAR_TEMPLATES_LIMIT).map((template) => (
            <PosterCard key={template.id} template={template} />
          ))}
        </div>
      </section>

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
    </>
  )
}

export default DashboardPage
