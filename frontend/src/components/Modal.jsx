import { useEffect, useRef } from 'react'
import { IconClose } from './icons.jsx'

function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-[calc(100%-2rem)] max-w-[480px] rounded-lg border border-ink/8 bg-surface p-0 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.18)] backdrop:bg-transparent"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink/8">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-ink-tertiary hover:bg-surface-sunken hover:text-ink transition-colors duration-150"
        >
          <IconClose className="w-4 h-4" />
        </button>
      </div>
      <div className="px-5 py-5">{children}</div>
    </dialog>
  )
}

export default Modal
