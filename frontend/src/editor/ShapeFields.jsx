import NumberField from './NumberField.jsx'
import ColorField from './ColorField.jsx'

function ShapeFields({ selection, onChange }) {
  const { shapeType, fill, stroke, strokeWidth, opacity, cornerRadius } = selection

  return (
    <>
      <h2 className="m-0 text-sm font-semibold text-ink capitalize">
        {shapeType} properties
      </h2>

      <div className="flex gap-3">
        {shapeType !== 'line' && (
          <ColorField
            label="Fill colour"
            value={fill}
            onChange={(value) => onChange({ fill: value })}
          />
        )}
        <ColorField
          label="Border colour"
          value={stroke}
          onChange={(value) => onChange({ stroke: value })}
        />
      </div>

      <div className="flex gap-3">
        <NumberField
          label="Border thickness"
          value={strokeWidth}
          min={0}
          max={40}
          onChange={(value) => onChange({ strokeWidth: value })}
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

      {shapeType === 'rect' && (
        <NumberField
          label="Corner radius"
          value={cornerRadius}
          min={0}
          max={200}
          onChange={(value) => onChange({ cornerRadius: value })}
        />
      )}
    </>
  )
}

export default ShapeFields
