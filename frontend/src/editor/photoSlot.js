import { Rect } from 'fabric'
import { EDITABLE_PROPERTIES } from './templateRoles.js'

/**
 * Scales `image` to cover the slot's bounds (like CSS background-size:
 * cover), centers the overflow, and clips it to the slot's rectangle so it
 * never spills outside the designated photo area. The clipPath is
 * `absolutePositioned`, so it stays pinned to the slot's canvas coordinates
 * even as the user drags/zooms the image within it.
 */
export function fitImageToSlot(image, slot) {
  const slotLeft = slot.left
  const slotTop = slot.top
  const slotWidth = slot.getScaledWidth()
  const slotHeight = slot.getScaledHeight()

  const coverScale = Math.max(slotWidth / image.width, slotHeight / image.height)
  const scaledWidth = image.width * coverScale
  const scaledHeight = image.height * coverScale

  image.set({
    originX: 'left',
    originY: 'top',
    left: slotLeft - (scaledWidth - slotWidth) / 2,
    top: slotTop - (scaledHeight - slotHeight) / 2,
    scaleX: coverScale,
    scaleY: coverScale,
    clipPath: new Rect({
      left: slotLeft,
      top: slotTop,
      width: slotWidth,
      height: slotHeight,
      originX: 'left',
      originY: 'top',
      absolutePositioned: true,
    }),
  })
  image.setCoords()
}

/**
 * Swaps the mainPhoto slot object (the placeholder Rect, or a previously
 * uploaded Image) for a newly uploaded image, preserving its template role
 * tagging, frame bounds, and z-index so the swap is invisible to the rest of
 * the template.
 */
export function replaceMainPhoto(canvas, slotObject, image) {
  const index = canvas.getObjects().indexOf(slotObject)

  fitImageToSlot(image, slotObject)
  EDITABLE_PROPERTIES.forEach((prop) => {
    image[prop] = slotObject[prop]
  })
  image.selectable = true
  image.evented = true
  image.hasControls = true

  canvas.remove(slotObject)
  canvas.insertAt(index, image)
  canvas.requestRenderAll()

  return image
}

export function isPhotoFilled(object) {
  return Boolean(object) && object.isType('Image')
}
