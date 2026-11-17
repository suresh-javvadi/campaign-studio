import { useId, useState } from 'react'
import Modal from './Modal.jsx'
import Button from './Button.jsx'
import { createProject } from '../api/projects.js'

const PRESETS = [
  { id: 'square', label: 'Square Poster', width: 1080, height: 1080 },
  { id: 'portrait', label: 'Portrait Poster', width: 1080, height: 1350 },
  { id: 'story', label: 'Instagram Story', width: 1080, height: 1920 },
  { id: 'landscape', label: 'Landscape', width: 1920, height: 1080 },
  { id: 'custom', label: 'Custom dimensions', width: null, height: null },
]

const MIN_DIMENSION = 1
const MAX_DIMENSION = 10000

function CreateDesignModal({ isOpen, onClose, onCreate }) {
  const nameId = useId()
  const widthId = useId()
  const heightId = useId()

  const [name, setName] = useState('')
  const [presetId, setPresetId] = useState('square')
  const [customWidth, setCustomWidth] = useState('1080')
  const [customHeight, setCustomHeight] = useState('1080')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isCustom = presetId === 'custom'
  const selectedPreset = PRESETS.find((preset) => preset.id === presetId)
  const width = isCustom ? Number(customWidth) : selectedPreset.width
  const height = isCustom ? Number(customHeight) : selectedPreset.height
  const hasValidDimensions =
    Number.isInteger(width) &&
    Number.isInteger(height) &&
    width >= MIN_DIMENSION &&
    width <= MAX_DIMENSION &&
    height >= MIN_DIMENSION &&
    height <= MAX_DIMENSION

  const resetAndClose = () => {
    setName('')
    setPresetId('square')
    setCustomWidth('1080')
    setCustomHeight('1080')
    setErrors({})
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const nextErrors = {}

    if (!trimmedName) {
      nextErrors.name = 'Project name is required.'
    }
    if (!hasValidDimensions) {
      nextErrors.dimensions = `Enter a width and height between ${MIN_DIMENSION} and ${MAX_DIMENSION}px.`
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const project = await createProject({ name: trimmedName, width, height })
      onCreate(project)
      resetAndClose()
    } catch {
      setErrors({ submit: "Couldn't create the project. Is the backend running?" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Create New Design">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="text-[13px] font-medium text-ink">
            Project name
          </label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Summer Sale Launch"
            className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink placeholder:text-ink-tertiary outline-none focus:border-ink/14"
          />
          {errors.name && <p className="m-0 text-xs text-danger">{errors.name}</p>}
        </div>

        <fieldset className="flex flex-col gap-2 border-none m-0 p-0">
          <legend className="mb-1 p-0 text-[13px] font-medium text-ink">
            Design size
          </legend>
          <div className="flex flex-col gap-1.5">
            {PRESETS.map((preset) => {
              const checked = preset.id === presetId
              return (
                <label
                  key={preset.id}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-sm border cursor-pointer transition-colors duration-150 ${
                    checked
                      ? 'bg-accent/8 border-transparent'
                      : 'bg-surface border-ink/8 hover:border-ink/14'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="preset"
                      value={preset.id}
                      checked={checked}
                      onChange={() => setPresetId(preset.id)}
                      className="w-4 h-4 accent-accent"
                    />
                    <span
                      className={`text-sm ${checked ? 'font-semibold text-ink' : 'text-ink-secondary'}`}
                    >
                      {preset.label}
                    </span>
                  </span>
                  {preset.width && (
                    <span className="text-xs text-ink-tertiary tabular-nums">
                      {preset.width} × {preset.height}
                    </span>
                  )}
                </label>
              )
            })}
          </div>

          {isCustom && (
            <div className="flex items-end gap-3 pt-1">
              <div className="flex flex-1 flex-col gap-1.5">
                <label
                  htmlFor={widthId}
                  className="text-xs font-medium text-ink-secondary"
                >
                  Width (px)
                </label>
                <input
                  id={widthId}
                  type="number"
                  min={MIN_DIMENSION}
                  max={MAX_DIMENSION}
                  value={customWidth}
                  onChange={(event) => setCustomWidth(event.target.value)}
                  className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14 tabular-nums"
                />
              </div>
              <span className="pb-2.5 text-sm text-ink-tertiary">×</span>
              <div className="flex flex-1 flex-col gap-1.5">
                <label
                  htmlFor={heightId}
                  className="text-xs font-medium text-ink-secondary"
                >
                  Height (px)
                </label>
                <input
                  id={heightId}
                  type="number"
                  min={MIN_DIMENSION}
                  max={MAX_DIMENSION}
                  value={customHeight}
                  onChange={(event) => setCustomHeight(event.target.value)}
                  className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14 tabular-nums"
                />
              </div>
            </div>
          )}

          {errors.dimensions && (
            <p className="m-0 text-xs text-danger">{errors.dimensions}</p>
          )}
        </fieldset>

        <div className="flex items-center justify-between rounded-sm border border-ink/8 bg-surface-sunken px-3 py-2.5">
          <span className="text-xs font-medium text-ink-secondary">
            Canvas size
          </span>
          <span className="text-sm font-semibold text-ink tabular-nums">
            {hasValidDimensions ? `${width} × ${height} px` : '—'}
          </span>
        </div>

        {errors.submit && <p className="m-0 text-xs text-danger">{errors.submit}</p>}

        <div className="flex items-center justify-end gap-3 pt-1">
          <Button type="button" variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create Design'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateDesignModal
