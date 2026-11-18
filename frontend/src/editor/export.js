import { FabricText } from 'fabric'

const EXPORT_MULTIPLIER = 2

function addWatermark(canvas) {
  const text = new FabricText('Campaign Studio', {
    left: canvas.width / 2,
    top: canvas.height - 28,
    originX: 'center',
    originY: 'center',
    fontFamily: 'Segoe UI, system-ui, sans-serif',
    fontSize: Math.max(18, Math.round(canvas.width / 40)),
    fontWeight: '600',
    fill: '#ffffff',
    opacity: 0.55,
    selectable: false,
    evented: false,
    excludeFromExport: false,
  })
  canvas.add(text)
  canvas.bringObjectToFront(text)
  return text
}

/**
 * Waits for any webfonts used on the canvas (notably Noto Sans Telugu) to
 * finish loading before rendering — otherwise Telugu glyphs can export as
 * tofu/fallback boxes if the export happens to run before the font is ready.
 */
async function waitForFonts() {
  if (document.fonts?.ready) {
    await document.fonts.ready
  }
}

/**
 * Renders the canvas to a PNG and triggers a browser download. Free
 * downloads get a watermark added just for the export (never persisted to
 * the project's saved canvasData); a future paid/watermark-free tier is a
 * one-line change at the call site.
 */
export async function exportPosterPng(canvas, { fileName = 'poster.png', watermark = true } = {}) {
  await waitForFonts()

  const watermarkObject = watermark ? addWatermark(canvas) : null
  canvas.requestRenderAll()

  const dataUrl = canvas.toDataURL({ format: 'png', multiplier: EXPORT_MULTIPLIER })

  if (watermarkObject) {
    canvas.remove(watermarkObject)
    canvas.requestRenderAll()
  }

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = fileName
  link.click()
}
