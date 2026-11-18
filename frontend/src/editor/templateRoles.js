// Custom Fabric object properties used to mark template regions. Passed as
// `propertiesToInclude` to toObject()/toJSON() wherever template-derived
// canvases are serialized, so they round-trip through save/load like any
// standard Fabric property (confirmed against Fabric's own toObject/
// fromObject implementation, which spreads any instance property named in
// `propertiesToInclude` into the JSON, and restores arbitrary JSON keys back
// onto the instance via its constructor options).
export const EDITABLE_PROPERTIES = ['editableRole', 'fieldId', 'label']

export const ROLE = {
  LOCKED: 'locked',
  MAIN_PHOTO: 'mainPhoto',
  EDITABLE_TEXT: 'editableText',
}

/**
 * Makes every object on a template-derived canvas non-interactive except the
 * ones the template designer marked as editable — the one `mainPhoto` slot
 * stays selectable/scalable (so the user can drag/zoom their photo within
 * the frame), everything else (locked decorations, editableText objects,
 * which are edited through the side panel instead) is click-through.
 */
export function lockTemplateCanvas(canvas) {
  canvas.selection = false
  canvas.getObjects().forEach((object) => {
    // Only a *filled* mainPhoto slot (an uploaded Image) stays interactive,
    // so the user can drag/zoom it — the empty placeholder Rect isn't
    // draggable until replaceMainPhoto() swaps it for a real photo.
    const isDraggablePhoto = object.editableRole === ROLE.MAIN_PHOTO && object.isType('Image')
    object.selectable = isDraggablePhoto
    object.evented = isDraggablePhoto
    object.hasControls = isDraggablePhoto
  })
}

/**
 * Walks a loaded canvas and returns the fields the side panel should render:
 * one entry per editableText object (kind: 'text') plus the single mainPhoto
 * slot (kind: 'photo'), in template (z-index) order.
 */
export function extractEditableFields(canvas) {
  return canvas
    .getObjects()
    .filter((object) => object.editableRole === ROLE.EDITABLE_TEXT || object.editableRole === ROLE.MAIN_PHOTO)
    .map((object) => ({
      fieldId: object.fieldId,
      label: object.label || object.fieldId,
      kind: object.editableRole === ROLE.MAIN_PHOTO ? 'photo' : 'text',
      object,
    }))
}
