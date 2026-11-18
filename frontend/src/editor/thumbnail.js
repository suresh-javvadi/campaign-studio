import { uploadImageFile } from '../api/uploads.js'

const THUMBNAIL_MULTIPLIER = 0.2

/**
 * Renders a small preview of the canvas and uploads it through the same
 * storage endpoint used for user photo uploads, returning the resulting
 * URL to save on the project as `thumbnailUrl`. Best-effort: a failure here
 * shouldn't block the actual project save, so callers should treat `null`
 * as "skip updating the thumbnail this time."
 */
export async function generateThumbnail(canvas) {
  try {
    const dataUrl = canvas.toDataURL({ format: 'png', multiplier: THUMBNAIL_MULTIPLIER })
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], 'thumbnail.png', { type: 'image/png' })
    return await uploadImageFile(file)
  } catch {
    return null
  }
}
