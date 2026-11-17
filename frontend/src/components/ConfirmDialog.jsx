import Modal from './Modal.jsx'
import Button from './Button.jsx'

function ConfirmDialog({ isOpen, title, message, confirmLabel = 'Delete', onCancel, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="flex flex-col gap-5">
        <p className="m-0 text-sm text-ink-secondary">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
