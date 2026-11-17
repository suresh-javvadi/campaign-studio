import { Gradient } from 'fabric'

export const DEFAULT_BACKGROUND = {
  mode: 'solid',
  solidColor: '#ffffff',
  gradientFrom: '#e8572a',
  gradientTo: '#15171e',
}

/**
 * Applies a background snapshot to the live canvas. Fabric serializes
 * canvas.backgroundColor (a plain color string, or a Gradient instance)
 * as part of canvas.toJSON()/loadFromJSON automatically — no custom
 * save/restore logic needed beyond setting the right value here.
 */
export function applyBackground(canvas, background) {
  if (background.mode === 'gradient') {
    canvas.backgroundColor = new Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: canvas.height },
      colorStops: [
        { offset: 0, color: background.gradientFrom },
        { offset: 1, color: background.gradientTo },
      ],
    })
  } else {
    canvas.backgroundColor = background.solidColor
  }
  canvas.requestRenderAll()
}

export function readBackgroundSnapshot(canvas) {
  const bg = canvas.backgroundColor

  if (bg && typeof bg === 'object' && bg.type === 'linear') {
    const stops = bg.colorStops || []
    return {
      mode: 'gradient',
      solidColor: DEFAULT_BACKGROUND.solidColor,
      gradientFrom: stops[0]?.color || DEFAULT_BACKGROUND.gradientFrom,
      gradientTo: stops[1]?.color || DEFAULT_BACKGROUND.gradientTo,
    }
  }

  return {
    mode: 'solid',
    solidColor: typeof bg === 'string' && bg ? bg : DEFAULT_BACKGROUND.solidColor,
    gradientFrom: DEFAULT_BACKGROUND.gradientFrom,
    gradientTo: DEFAULT_BACKGROUND.gradientTo,
  }
}
