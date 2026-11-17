import { FONT_OPTIONS } from './fonts.js'
import { IconAlignLeft, IconAlignCenter, IconAlignRight } from '../components/icons.jsx'
import ToggleButton from './ToggleButton.jsx'
import NumberField from './NumberField.jsx'
import ColorField from './ColorField.jsx'

const ALIGN_OPTIONS = [
  { value: 'left', icon: IconAlignLeft, label: 'Align left' },
  { value: 'center', icon: IconAlignCenter, label: 'Align center' },
  { value: 'right', icon: IconAlignRight, label: 'Align right' },
]

function TextFields({ selection, onChange }) {
  const { text, fontFamily, fontSize, fill, bold, italic, textAlign } = selection

  return (
    <>
      <h2 className="m-0 text-sm font-semibold text-ink">Text properties</h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-secondary">
          Text content
        </label>
        <textarea
          value={text}
          onChange={(event) => onChange({ text: event.target.value })}
          rows={3}
          className="px-3 py-2 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-secondary">
          Font family
        </label>
        <select
          value={fontFamily}
          onChange={(event) => onChange({ fontFamily: event.target.value })}
          className="h-10 px-3 bg-surface-sunken border border-ink/8 rounded-sm text-sm text-ink outline-none focus:border-ink/14"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <NumberField
          label="Font size"
          value={fontSize}
          min={8}
          max={400}
          onChange={(value) => onChange({ fontSize: value })}
        />
        <ColorField
          label="Colour"
          value={fill}
          onChange={(value) => onChange({ fill: value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-secondary">Style</label>
        <div className="flex gap-2">
          <ToggleButton
            pressed={bold}
            label="Bold"
            onClick={() => onChange({ bold: !bold })}
          >
            <span className="font-bold">B</span>
          </ToggleButton>
          <ToggleButton
            pressed={italic}
            label="Italic"
            onClick={() => onChange({ italic: !italic })}
          >
            <span className="italic">I</span>
          </ToggleButton>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-secondary">
          Alignment
        </label>
        <div className="flex gap-2">
          {ALIGN_OPTIONS.map(({ value, icon: Icon, label }) => (
            <ToggleButton
              key={value}
              pressed={textAlign === value}
              label={label}
              onClick={() => onChange({ textAlign: value })}
            >
              <Icon className="w-4 h-4" />
            </ToggleButton>
          ))}
        </div>
      </div>
    </>
  )
}

export default TextFields
