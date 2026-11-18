import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import FabricCanvas from '../editor/FabricCanvas.jsx'
import { lockTemplateCanvas, extractEditableFields } from '../editor/templateRoles.js'
import { getTemplate } from '../api/templates.js'
import { createProjectFromTemplate } from '../api/projects.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { setPendingTemplateId } from '../auth/pendingTemplate.js'

function PosterDetailPage() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [template, setTemplate] = useState(null)
  const [status, setStatus] = useState('loading')
  const [fields, setFields] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const canvasRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    getTemplate(templateId)
      .then((data) => {
        if (cancelled) return
        setTemplate(data)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [templateId])

  const handleReady = useCallback(
    (canvas) => {
      canvasRef.current = canvas
    },
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !template) return

    canvas.loadFromJSON(template.canvasData).then(() => {
      lockTemplateCanvas(canvas)
      canvas.getObjects().forEach((object) => {
        object.selectable = false
        object.evented = false
      })
      canvas.requestRenderAll()
      setFields(extractEditableFields(canvas))
    })
  }, [template])

  const handleUseTemplate = async () => {
    setError('')

    if (!user) {
      setPendingTemplateId(templateId)
      navigate(`/login?next=${encodeURIComponent(`/poster/${templateId}`)}`)
      return
    }

    setIsCreating(true)
    try {
      const project = await createProjectFromTemplate(templateId)
      navigate(`/personalize/${project.id}`)
    } catch {
      setError("Couldn't start this poster. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  if (status === 'loading') {
    return <p className="max-w-6xl mx-auto px-5 md:px-8 py-10 text-sm text-ink-tertiary">Loading poster…</p>
  }

  if (status === 'error' || !template) {
    return (
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 text-center">
        <p className="text-sm text-ink-secondary">We couldn&apos;t find this poster.</p>
        <Button className="mt-4" onClick={() => navigate('/gallery')}>
          Back to Gallery
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row gap-10">
      <div className="flex-1 min-w-0 flex items-center justify-center bg-surface-sunken rounded-md border border-ink/8 p-6" style={{ aspectRatio: `${template.width} / ${template.height}`, maxHeight: '75vh' }}>
        <FabricCanvas width={template.width} height={template.height} onReady={handleReady} />
      </div>

      <div className="w-full md:w-80 shrink-0 flex flex-col gap-5">
        <div>
          <p className="m-0 text-xs font-semibold text-accent uppercase tracking-wide">
            {template.category} · {template.partyTag}
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold text-ink tracking-tight">{template.title}</h1>
          <p className="mt-2 text-sm text-ink-secondary">{template.description}</p>
        </div>

        <div className="border border-ink/8 rounded-md p-4 bg-surface">
          <p className="m-0 text-[13px] font-semibold text-ink">What you can personalize</p>
          <ul className="mt-2.5 m-0 pl-0 list-none flex flex-col gap-2">
            {fields.map((field) => (
              <li key={field.fieldId} className="flex items-center gap-2 text-sm text-ink-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {field.label}
              </li>
            ))}
          </ul>
          <p className="mt-3 mb-0 text-xs text-ink-tertiary">
            Everything else in this poster — the background, decorations, and other photos — stays
            exactly as designed.
          </p>
        </div>

        {error && <p className="m-0 text-xs text-danger">{error}</p>}

        <Button onClick={handleUseTemplate} disabled={isCreating} className="w-full">
          {isCreating ? 'Starting…' : 'Use this template'}
        </Button>
        {!user && (
          <p className="m-0 text-xs text-ink-tertiary text-center">
            You&apos;ll be asked to log in or register first.
          </p>
        )}
      </div>
    </div>
  )
}

export default PosterDetailPage
