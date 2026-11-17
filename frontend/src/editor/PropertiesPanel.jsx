import TextFields from './TextFields.jsx'
import ImageFields from './ImageFields.jsx'

function PropertiesPanel({ selection, onChange, onBringForward, onSendBackward }) {
  return (
    <aside className="w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-ink/8 bg-surface px-4 py-5 flex flex-col gap-5 overflow-y-auto">
      {!selection && (
        <p className="m-0 text-sm text-ink-tertiary">
          Select a text or image element to edit its properties.
        </p>
      )}
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
    </aside>
  )
}

export default PropertiesPanel
