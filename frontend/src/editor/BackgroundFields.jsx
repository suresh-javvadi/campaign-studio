import ToggleButton from './ToggleButton.jsx'
import ColorField from './ColorField.jsx'

function BackgroundFields({ background, onChange }) {
  const { mode, solidColor, gradientFrom, gradientTo } = background

  return (
    <>
      <h2 className="m-0 text-sm font-semibold text-ink">Canvas background</h2>
      <p className="m-0 text-xs text-ink-tertiary">
        Nothing selected — adjust the canvas background here.
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-secondary">Type</label>
        <div className="flex gap-2">
          <ToggleButton
            pressed={mode === 'solid'}
            label="Solid"
            onClick={() => onChange({ mode: 'solid' })}
          >
            Solid
          </ToggleButton>
          <ToggleButton
            pressed={mode === 'gradient'}
            label="Gradient"
            onClick={() => onChange({ mode: 'gradient' })}
          >
            Gradient
          </ToggleButton>
        </div>
      </div>

      {mode === 'solid' ? (
        <ColorField
          label="Background colour"
          value={solidColor}
          onChange={(value) => onChange({ solidColor: value })}
        />
      ) : (
        <div className="flex gap-3">
          <ColorField
            label="From"
            value={gradientFrom}
            onChange={(value) => onChange({ gradientFrom: value })}
          />
          <ColorField
            label="To"
            value={gradientTo}
            onChange={(value) => onChange({ gradientTo: value })}
          />
        </div>
      )}
    </>
  )
}

export default BackgroundFields
