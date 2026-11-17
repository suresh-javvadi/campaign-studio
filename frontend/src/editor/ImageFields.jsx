import NumberField from './NumberField.jsx'

function ImageFields({ selection, onChange, onBringForward, onSendBackward }) {
  const { width, height, left, top, angle, opacity } = selection

  return (
    <>
      <h2 className="m-0 text-sm font-semibold text-ink">Image properties</h2>

      <div className="flex gap-3">
        <NumberField
          label="Width (px)"
          value={width}
          min={1}
          onChange={(value) => onChange({ width: value })}
        />
        <NumberField
          label="Height (px)"
          value={height}
          min={1}
          onChange={(value) => onChange({ height: value })}
        />
      </div>

      <div className="flex gap-3">
        <NumberField
          label="Position X"
          value={left}
          onChange={(value) => onChange({ left: value })}
        />
        <NumberField
          label="Position Y"
          value={top}
          onChange={(value) => onChange({ top: value })}
        />
      </div>

      <div className="flex gap-3">
        <NumberField
          label="Rotation (°)"
          value={angle}
          min={-360}
          max={360}
          onChange={(value) => onChange({ angle: value })}
        />
        <NumberField
          label="Opacity"
          value={opacity}
          min={0}
          max={1}
          step={0.05}
          onChange={(value) => onChange({ opacity: value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-secondary">
          Layer order
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBringForward}
            className="flex-1 h-9 rounded-sm border border-ink/8 bg-surface text-sm text-ink-secondary hover:border-ink/14 transition-colors duration-150"
          >
            Bring forward
          </button>
          <button
            type="button"
            onClick={onSendBackward}
            className="flex-1 h-9 rounded-sm border border-ink/8 bg-surface text-sm text-ink-secondary hover:border-ink/14 transition-colors duration-150"
          >
            Send backward
          </button>
        </div>
      </div>
    </>
  )
}

export default ImageFields
