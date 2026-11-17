import { FabricImage } from 'fabric'
import { uploadImageFile } from '../api/uploads.js'

export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export function isAcceptedImageFile(file) {
  return ACCEPTED_IMAGE_TYPES.includes(file.type)
}

/**
 * Uploads a File to the backend's persistent storage, then loads it into a
 * Fabric image object scaled uniformly to fit inside the canvas (never
 * upscaled, never stretched) and centered. Because the image is loaded from
 * a persistent URL (not a blob: URL), it — and its position/size/rotation —
 * survive a save and a later reload.
 */
export async function createImageObject(file, canvasWidth, canvasHeight) {
  const url = await uploadImageFile(file)
  const image = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' })

  const fitScale = Math.min(
    1,
    canvasWidth / image.width,
    canvasHeight / image.height,
  )

  image.set({
    left: (canvasWidth - image.width * fitScale) / 2,
    top: (canvasHeight - image.height * fitScale) / 2,
    scaleX: fitScale,
    scaleY: fitScale,
  })

  return image
}

export function isImageObject(object) {
  return Boolean(object) && object.isType('Image')
}

export function readImageSnapshot(object) {
  return {
    kind: 'image',
    width: Math.round(object.getScaledWidth()),
    height: Math.round(object.getScaledHeight()),
    left: Math.round(object.left),
    top: Math.round(object.top),
    angle: Math.round(object.angle),
    opacity: object.opacity,
  }
}

export function applyImageSnapshotPatch(object, patch) {
  const fabricPatch = {}

  if ('left' in patch) fabricPatch.left = patch.left
  if ('top' in patch) fabricPatch.top = patch.top
  if ('angle' in patch) fabricPatch.angle = patch.angle
  if ('opacity' in patch) fabricPatch.opacity = patch.opacity

  // Width/height are edited as scaled (visual) pixels; keep aspect ratio
  // locked by applying the same ratio to both axes, same as corner-handle
  // dragging on the canvas.
  if ('width' in patch) {
    const ratio = patch.width / object.width
    fabricPatch.scaleX = ratio
    fabricPatch.scaleY = ratio
  } else if ('height' in patch) {
    const ratio = patch.height / object.height
    fabricPatch.scaleX = ratio
    fabricPatch.scaleY = ratio
  }

  object.set(fabricPatch)
  object.setCoords()
}
