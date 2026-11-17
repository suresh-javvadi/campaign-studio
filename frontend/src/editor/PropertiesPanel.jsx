import TextFields from './TextFields.jsx'
import ImageFields from './ImageFields.jsx'
import ShapeFields from './ShapeFields.jsx'
import BackgroundFields from './BackgroundFields.jsx'

function PropertiesPanel({
  selection,
  onChange,
  onBringForward,
  onSendBackward,
  background,
  onBackgroundChange,
}) {
  return (
    <aside className="w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-ink/8 bg-surface px-4 py-5 flex flex-col gap-5 overflow-y-auto">
      {selection?.kind === 'text' && (
        <TextFields selection={selection} onChange={onChange} />
      )}
      {selection?.kind === 'image' && (
        <ImageFields
          selection={selection}
          onChange={onChange}
          onBringForward={onBringForward}
          onSendBackward={onSendBackward}
        />
      )}
      {selection?.kind === 'shape' && (
        <ShapeFields selection={selection} onChange={onChange} />
      )}
      {!selection && (
        <BackgroundFields background={background} onChange={onBackgroundChange} />
      )}
    </aside>
  )
}

export default PropertiesPanel
