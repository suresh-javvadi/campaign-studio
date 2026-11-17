import { useRef } from 'react'
import Button from '../components/Button.jsx'
import { IconPlus, IconFrame, IconTrash } from '../components/icons.jsx'

const SAVE_STATUS_LABEL = {
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Save failed',
}

function Toolbar({ onAddText, onUploadFiles, onDelete, hasSelection, onSave, saveStatus }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    onUploadFiles(event.target.files)
    event.target.value = ''
  }

  return (
    <div className="h-14 shrink-0 flex items-center gap-2 px-4 md:px-6 border-b border-ink/8 bg-surface">
      <Button variant="outline" onClick={onAddText}>
        <IconPlus className="w-4 h-4" />
        Add Text
      </Button>

      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <IconFrame className="w-4 h-4" />
        Upload Image
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={onDelete}
        disabled={!hasSelection}
        aria-label="Delete selected object"
        className="inline-flex items-center justify-center w-9 h-9 rounded-sm text-ink-secondary transition-colors duration-150 hover:bg-surface-sunken disabled:opacity-40 disabled:pointer-events-none"
      >
        <IconTrash className="w-4 h-4" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        {saveStatus && (
          <span
            className={`text-xs tabular-nums ${
              saveStatus === 'error' ? 'text-danger' : 'text-ink-tertiary'
            }`}
          >
            {SAVE_STATUS_LABEL[saveStatus]}
          </span>
        )}
        <Button variant="outline" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default Toolbar
