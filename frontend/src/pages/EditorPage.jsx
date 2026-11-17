import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { getProject, updateProject } from '../api/projects.js'

const AUTOSAVE_DELAY_MS = 1500

function snapshotOf(object) {
  if (isTextObject(object)) return readTextSnapshot(object)
  if (isImageObject(object)) return readImageSnapshot(object)
  return null
}

function hasSavedContent(canvasData) {
  return Boolean(canvasData) && Array.isArray(canvasData.objects) && canvasData.objects.length > 0
}

function EditorPage({ projectId }) {
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loadStatus, setLoadStatus] = useState('loading')
  const [saveStatus, setSaveStatus] = useState(null)
  const [selection, setSelection] = useState(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

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

    updateProject(project.id, { canvasData })
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
        canvas.loadFromJSON(project.canvasData).then(() => {
          canvas.requestRenderAll()
          isRestoringRef.current = false
        })
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
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
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

  const handleUploadFiles = async (fileList) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const files = Array.from(fileList).filter(isAcceptedImageFile)
    let lastImage = null

    for (const file of files) {
      const image = await createImageObject(file, width, height)
      canvas.add(image)
      lastImage = image
    }

    if (lastImage) {
      canvas.setActiveObject(lastImage)
      canvas.requestRenderAll()
      syncSelectionFromCanvas()
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
    } else {
      return
    }

    canvas.requestRenderAll()
    setSelection(snapshotOf(active))
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
          onClick={() => navigate('/')}
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
        onDelete={handleDelete}
        hasSelection={Boolean(selection)}
        onSave={handleManualSave}
        saveStatus={saveStatus}
      />

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
