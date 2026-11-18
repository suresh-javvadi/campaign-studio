import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FabricImage } from 'fabric'
import Button from '../components/Button.jsx'
import { IconArrowLeft } from '../components/icons.jsx'
import FabricCanvas from '../editor/FabricCanvas.jsx'
import { lockTemplateCanvas, extractEditableFields, EDITABLE_PROPERTIES } from '../editor/templateRoles.js'
import { replaceMainPhoto, isPhotoFilled } from '../editor/photoSlot.js'
import { isAcceptedImageFile } from '../editor/imageObject.js'
import { uploadImageFile } from '../api/uploads.js'
import { generateThumbnail } from '../editor/thumbnail.js'
import { exportPosterPng } from '../editor/export.js'
import { getProject, updateProject } from '../api/projects.js'

const AUTOSAVE_DELAY_MS = 1500

function PersonalizePage({ projectId }) {
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loadStatus, setLoadStatus] = useState('loading')
  const [saveStatus, setSaveStatus] = useState(null)
  const [fields, setFields] = useState([])
  const [fieldValues, setFieldValues] = useState({})
  const [photoError, setPhotoError] = useState('')
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const canvasRef = useRef(null)
  const isRestoringRef = useRef(false)
  const saveTimerRef = useRef(null)
  const isSavingRef = useRef(false)
  const pendingSaveRef = useRef(false)
  const performSaveRef = useRef(() => {})
  const fileInputRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    getProject(projectId)
      .then((data) => {
        if (cancelled) return
        setProject(data)
        setLoadStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setLoadStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [projectId])

  const performSave = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !project) return

    if (isSavingRef.current) {
      pendingSaveRef.current = true
      return
    }

    isSavingRef.current = true
    setSaveStatus('saving')
    const canvasData = canvas.toJSON(EDITABLE_PROPERTIES)

    generateThumbnail(canvas)
      .then((thumbnailUrl) =>
        updateProject(project.id, thumbnailUrl ? { canvasData, thumbnailUrl } : { canvasData }),
      )
      .then(() => setSaveStatus('saved'))
      .catch(() => setSaveStatus('error'))
      .finally(() => {
        isSavingRef.current = false
        if (pendingSaveRef.current) {
          pendingSaveRef.current = false
          performSaveRef.current()
        }
      })
  }, [project])

  useEffect(() => {
    performSaveRef.current = performSave
  }, [performSave])

  const scheduleAutosave = useCallback(() => {
    if (isRestoringRef.current) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(performSave, AUTOSAVE_DELAY_MS)
  }, [performSave])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  const syncFieldsFromCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const nextFields = extractEditableFields(canvas)
    setFields(nextFields)
    setFieldValues((prev) => {
      const next = { ...prev }
      nextFields
        .filter((field) => field.kind === 'text')
        .forEach((field) => {
          next[field.fieldId] = field.object.text
        })
      return next
    })
  }, [])

  const handleReady = useCallback(
    (canvas) => {
      canvasRef.current = canvas
      canvas.on('object:modified', scheduleAutosave)

      if (project?.canvasData?.objects?.length) {
        isRestoringRef.current = true
        canvas.loadFromJSON(project.canvasData).then(() => {
          lockTemplateCanvas(canvas)
          canvas.requestRenderAll()
          isRestoringRef.current = false
          syncFieldsFromCanvas()
        })
      }
    },
    [project, scheduleAutosave, syncFieldsFromCanvas],
  )

  const handleTextChange = (field, value) => {
    const canvas = canvasRef.current
    if (!canvas) return
    field.object.set('text', value)
    canvas.requestRenderAll()
    setFieldValues((prev) => ({ ...prev, [field.fieldId]: value }))
    scheduleAutosave()
  }

  const handlePhotoFile = async (file) => {
    const canvas = canvasRef.current
    const photoField = fields.find((field) => field.kind === 'photo')
    if (!canvas || !photoField) return

    setPhotoError('')

    if (!isAcceptedImageFile(file)) {
      setPhotoError('Please upload a PNG, JPEG, or WEBP image.')
      return
    }

    setIsUploadingPhoto(true)
    try {
      const url = await uploadImageFile(file)
      const image = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' })
      replaceMainPhoto(canvas, photoField.object, image)
      syncFieldsFromCanvas()
      scheduleAutosave()
    } catch {
      setPhotoError("Couldn't upload that photo. Please try again.")
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleDownload = async () => {
    const canvas = canvasRef.current
    if (!canvas || !project) return
    setIsExporting(true)
    try {
      await exportPosterPng(canvas, { fileName: `${project.name}.png` })
    } finally {
      setIsExporting(false)
    }
  }

  if (loadStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-sm text-ink-secondary">Loading poster…</p>
      </div>
    )
  }

  if (loadStatus === 'error' || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
        <p className="max-w-sm text-sm text-ink-secondary">
          We couldn&apos;t load this poster. It may have been deleted, or the backend isn&apos;t
          reachable.
        </p>
        <Button onClick={() => navigate('/app/projects')}>Back to My Projects</Button>
      </div>
    )
  }

  const { name, width, height } = project
  const photoField = fields.find((field) => field.kind === 'photo')
  const textFields = fields.filter((field) => field.kind === 'text')

  return (
    <div className="min-h-screen flex flex-col bg-surface-sunken">
      <header className="h-16 shrink-0 flex items-center gap-3 px-4 md:px-6 border-b border-ink/8 bg-surface">
        <button
          type="button"
          onClick={() => navigate('/app/projects')}
          aria-label="Back to My Projects"
          className="inline-flex items-center justify-center w-9 h-9 rounded-sm text-ink-secondary hover:bg-surface-sunken transition-colors duration-150"
        >
          <IconArrowLeft />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-semibold text-ink truncate">{name}</h1>
          <p className="m-0 text-xs text-ink-tertiary tabular-nums">
            {width} × {height} px
            {saveStatus === 'saving' && ' · Saving…'}
            {saveStatus === 'saved' && ' · Saved'}
            {saveStatus === 'error' && ' · Could not save'}
          </p>
        </div>
        <Button onClick={handleDownload} disabled={isExporting}>
          {isExporting ? 'Preparing…' : 'Download PNG'}
        </Button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="flex-1 min-h-0 flex p-6 md:p-10">
          <FabricCanvas width={width} height={height} onReady={handleReady} />
        </div>

        <aside className="w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-l border-ink/8 bg-surface px-5 py-6 flex flex-col gap-6 overflow-y-auto">
          {photoField && (
            <div className="flex flex-col gap-2.5">
              <p className="m-0 text-[13px] font-semibold text-ink">{photoField.label}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) handlePhotoFile(file)
                  event.target.value = ''
                }}
              />
              <Button
                variant="outline"
                disabled={isUploadingPhoto}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploadingPhoto
                  ? 'Uploading…'
                  : isPhotoFilled(photoField.object)
                    ? 'Replace Photo'
                    : 'Upload Photo'}
              </Button>
              {isPhotoFilled(photoField.object) && (
                <p className="m-0 text-xs text-ink-tertiary">
                  Drag the photo on the canvas to reposition it, or use the corner handle to zoom.
                </p>
              )}
              {photoError && <p className="m-0 text-xs text-danger">{photoError}</p>}
            </div>
          )}

          {textFields.map((field) => (
            <div key={field.fieldId} className="flex flex-col gap-1.5">
              <label htmlFor={field.fieldId} className="text-[13px] font-medium text-ink">
                {field.label}
              </label>
              <input
                id={field.fieldId}
                type="text"
                lang="te"
                value={fieldValues[field.fieldId] ?? ''}
                onChange={(event) => handleTextChange(field, event.target.value)}
                className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14"
              />
            </div>
          ))}

          <p className="mt-auto m-0 text-xs text-ink-tertiary">
            Free downloads include a Campaign Studio watermark.
          </p>
        </aside>
      </div>
    </div>
  )
}

function PersonalizePageRoute() {
  const { projectId } = useParams()
  return <PersonalizePage key={projectId} projectId={projectId} />
}

export default PersonalizePageRoute
