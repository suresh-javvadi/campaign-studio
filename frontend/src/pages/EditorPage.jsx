import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Rect } from 'fabric'
import Button from '../components/Button.jsx'
import { IconArrowLeft } from '../components/icons.jsx'
import FabricCanvas from '../editor/FabricCanvas.jsx'
import Toolbar from '../editor/Toolbar.jsx'
import PropertiesPanel from '../editor/PropertiesPanel.jsx'
import {
  applySnapshotPatch,
  createTextObject,
  isTextObject,
  readTextSnapshot,
} from '../editor/textObject.js'
import {
  applyImageSnapshotPatch,
  createImageObject,
  isAcceptedImageFile,
  isImageObject,
  readImageSnapshot,
} from '../editor/imageObject.js'
import {
  applyShapeSnapshotPatch,
  createShapeObject,
  isShapeObject,
  readShapeSnapshot,
} from '../editor/shapeObject.js'
import {
  DEFAULT_BACKGROUND,
  applyBackground,
  readBackgroundSnapshot,
} from '../editor/backgroundObject.js'
import { getProject, updateProject } from '../api/projects.js'
import { generateThumbnail } from '../editor/thumbnail.js'

const AUTOSAVE_DELAY_MS = 1500

function snapshotOf(object) {
  if (isTextObject(object)) return readTextSnapshot(object)
  if (isImageObject(object)) return readImageSnapshot(object)
  if (isShapeObject(object)) return readShapeSnapshot(object)
  return null
}

function hasSavedContent(canvasData) {
  if (!canvasData) return false
  const hasObjects = Array.isArray(canvasData.objects) && canvasData.objects.length > 0
  return hasObjects || Boolean(canvasData.background)
}

function EditorPage({ projectId }) {
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loadStatus, setLoadStatus] = useState('loading')
  const [saveStatus, setSaveStatus] = useState(null)
  const [selection, setSelection] = useState(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [assetWarning, setAssetWarning] = useState(null)
  const [background, setBackground] = useState(DEFAULT_BACKGROUND)

  const canvasRef = useRef(null)
  const isRestoringRef = useRef(false)
  const saveTimerRef = useRef(null)
  const isSavingRef = useRef(false)
  const pendingSaveRef = useRef(false)
  const performSaveRef = useRef(() => {})

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
    const canvasData = canvas.toJSON()

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

  const syncSelectionFromCanvas = useCallback(() => {
    const canvas = canvasRef.current
    setSelection(snapshotOf(canvas?.getActiveObject()))
  }, [])

  const handleReady = useCallback(
    (canvas) => {
      canvasRef.current = canvas
      canvas.on('selection:created', syncSelectionFromCanvas)
      canvas.on('selection:updated', syncSelectionFromCanvas)
      canvas.on('selection:cleared', syncSelectionFromCanvas)
      canvas.on('text:changed', syncSelectionFromCanvas)
      canvas.on('object:modified', syncSelectionFromCanvas)

      canvas.on('object:added', scheduleAutosave)
      canvas.on('object:removed', scheduleAutosave)
      canvas.on('object:modified', scheduleAutosave)
      canvas.on('text:changed', scheduleAutosave)

      if (hasSavedContent(project?.canvasData)) {
        isRestoringRef.current = true
        let missingImageCount = 0

        // If an image's file is missing (deleted on disk, etc.), Fabric
        // skips it by default — this reviver instead swaps in a dashed
        // placeholder at the same position/size/rotation, so the gap is
        // visible and recoverable rather than silently vanishing.
        const reviver = (serialized, _object, error) => {
          if (!error || serialized.type !== 'Image') return undefined
          missingImageCount += 1
          return new Rect({
            left: serialized.left,
            top: serialized.top,
            width: serialized.width,
            height: serialized.height,
            scaleX: serialized.scaleX ?? 1,
            scaleY: serialized.scaleY ?? 1,
            angle: serialized.angle ?? 0,
            fill: 'rgba(138, 143, 153, 0.08)',
            stroke: 'rgba(21, 23, 30, 0.14)',
            strokeDashArray: [6, 4],
          })
        }

        canvas.loadFromJSON(project.canvasData, reviver).then(() => {
          canvas.requestRenderAll()
          isRestoringRef.current = false
          setBackground(readBackgroundSnapshot(canvas))
          if (missingImageCount > 0) {
            setAssetWarning(
              `${missingImageCount} image${missingImageCount > 1 ? 's' : ''} couldn't be loaded and ${
                missingImageCount > 1 ? 'were' : 'was'
              } replaced with a placeholder.`,
            )
          }
        })
      } else {
        setBackground(readBackgroundSnapshot(canvas))
      }
    },
    [syncSelectionFromCanvas, scheduleAutosave, project],
  )

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return

      const activeElementTag = document.activeElement?.tagName
      if (activeElementTag === 'INPUT' || activeElementTag === 'TEXTAREA') return

      const canvas = canvasRef.current
      const active = canvas?.getActiveObject()
      if (!active || active.isEditing) return

      canvas.remove(active)
      canvas.discardActiveObject()
      canvas.requestRenderAll()
      setSelection(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loadStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-sm text-ink-secondary">Loading design…</p>
      </div>
    )
  }

  if (loadStatus === 'error' || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
        <p className="max-w-sm text-sm text-ink-secondary">
          We couldn&apos;t load this design. It may have been deleted, or the
          backend isn&apos;t reachable.
        </p>
        <Button onClick={() => navigate('/app/projects')}>Back to Dashboard</Button>
      </div>
    )
  }

  const { name, width, height } = project

  const handleAddText = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const textObject = createTextObject(width, height)
    canvas.add(textObject)
    canvas.setActiveObject(textObject)
    canvas.requestRenderAll()
    syncSelectionFromCanvas()
  }

  const handleAddShape = (shapeType) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const shape = createShapeObject(shapeType, width, height)
    canvas.add(shape)
    canvas.setActiveObject(shape)
    canvas.requestRenderAll()
    syncSelectionFromCanvas()
  }

  const handleUploadFiles = async (fileList) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const files = Array.from(fileList).filter(isAcceptedImageFile)
    let lastImage = null
    const failures = []

    for (const file of files) {
      try {
        const image = await createImageObject(file, width, height)
        canvas.add(image)
        lastImage = image
      } catch {
        failures.push(file.name)
      }
    }

    if (lastImage) {
      canvas.setActiveObject(lastImage)
      canvas.requestRenderAll()
      syncSelectionFromCanvas()
    }

    if (failures.length > 0) {
      setAssetWarning(`Couldn't upload ${failures.join(', ')}. Please try again.`)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDraggingOver(false)
    handleUploadFiles(event.dataTransfer.files)
  }

  const handleDelete = () => {
    const canvas = canvasRef.current
    const active = canvas?.getActiveObject()
    if (!active) return
    canvas.remove(active)
    canvas.discardActiveObject()
    canvas.requestRenderAll()
    setSelection(null)
  }

  const handlePropertyChange = (patch) => {
    const canvas = canvasRef.current
    const active = canvas?.getActiveObject()
    if (!active) return

    if (isTextObject(active)) {
      applySnapshotPatch(active, patch)
    } else if (isImageObject(active)) {
      applyImageSnapshotPatch(active, patch)
    } else if (isShapeObject(active)) {
      applyShapeSnapshotPatch(active, patch)
    } else {
      return
    }

    canvas.requestRenderAll()
    setSelection(snapshotOf(active))
    scheduleAutosave()
  }

  const handleBackgroundChange = (patch) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const next = { ...background, ...patch }
    setBackground(next)
    applyBackground(canvas, next)
    scheduleAutosave()
  }

  const handleBringForward = () => {
    const canvas = canvasRef.current
    const active = canvas?.getActiveObject()
    if (!active) return
    canvas.bringObjectForward(active)
    canvas.requestRenderAll()
    scheduleAutosave()
  }

  const handleSendBackward = () => {
    const canvas = canvasRef.current
    const active = canvas?.getActiveObject()
    if (!active) return
    canvas.sendObjectBackwards(active)
    canvas.requestRenderAll()
    scheduleAutosave()
  }

  const handleManualSave = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    performSave()
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-sunken">
      <header className="h-16 shrink-0 flex items-center gap-3 px-4 md:px-6 border-b border-ink/8 bg-surface">
        <button
          type="button"
          onClick={() => navigate('/app/projects')}
          aria-label="Back to dashboard"
          className="inline-flex items-center justify-center w-9 h-9 rounded-sm text-ink-secondary hover:bg-surface-sunken transition-colors duration-150"
        >
          <IconArrowLeft />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-ink truncate">{name}</h1>
          <p className="m-0 text-xs text-ink-tertiary tabular-nums">
            {width} × {height} px
          </p>
        </div>
      </header>

      <Toolbar
        onAddText={handleAddText}
        onUploadFiles={handleUploadFiles}
        onAddShape={handleAddShape}
        onDelete={handleDelete}
        hasSelection={Boolean(selection)}
        onSave={handleManualSave}
        saveStatus={saveStatus}
      />

      {assetWarning && (
        <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-2 bg-warning/10 border-b border-ink/8 text-xs text-ink">
          <span>{assetWarning}</span>
          <button
            type="button"
            onClick={() => setAssetWarning(null)}
            className="shrink-0 text-ink-tertiary hover:text-ink transition-colors duration-150"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div
          className={`flex-1 min-h-0 flex p-6 md:p-10 transition-colors duration-150 ${
            isDraggingOver ? 'bg-accent/5' : ''
          }`}
          onDragOver={(event) => event.preventDefault()}
          onDragEnter={(event) => {
            event.preventDefault()
            setIsDraggingOver(true)
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
        >
          <FabricCanvas width={width} height={height} onReady={handleReady} />
        </div>
        <PropertiesPanel
          selection={selection}
          onChange={handlePropertyChange}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          background={background}
          onBackgroundChange={handleBackgroundChange}
        />
      </div>
    </div>
  )
}

function EditorPageRoute() {
  const { projectId } = useParams()
  return <EditorPage key={projectId} projectId={projectId} />
}

export default EditorPageRoute
