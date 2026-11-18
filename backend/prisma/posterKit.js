// Reusable Fabric-JSON builder functions for poster templates. Every
// function returns a plain object (or array of objects) matching Fabric's
// serialized object schema — these are composed into a template's
// `objects` array in templates.js, the same shape `canvas.loadFromJSON`
// already consumes on the frontend.

const TELUGU_FONT = 'Nirmala UI, Noto Sans Telugu, sans-serif';
const BODY_FONT = 'Segoe UI, system-ui, sans-serif';

function locked(extra = {}) {
  return { selectable: false, evented: false, editableRole: 'locked', ...extra };
}

/** A Fabric Gradient-shaped value, usable as a canvas `background` or an object's `fill`. */
function linearGradient(colorStops, { x1 = 0, y1 = 0, x2 = 0, y2 = 1, width = 1, height = 1 } = {}) {
  return {
    type: 'linear',
    coords: { x1: x1 * width, y1: y1 * height, x2: x2 * width, y2: y2 * height },
    colorStops: colorStops.map(([offset, color]) => ({ offset, color })),
  };
}

function rect({ left, top, width, height, fill, rx = 0, ry = 0, angle = 0, stroke, strokeWidth = 0, opacity = 1, shadow, originX = 'left', originY = 'top', extra = {} }) {
  return locked({
    type: 'Rect',
    left,
    top,
    width,
    height,
    rx,
    ry,
    fill,
    angle,
    stroke,
    strokeWidth,
    opacity,
    originX,
    originY,
    ...(shadow ? { shadow } : {}),
    ...extra,
  });
}

/** A rotated, drop-shadowed banner rect for headlines/slogans — the closest clean vector approximation of a brush-stroke/ribbon text panel. */
function ribbonBanner({ left, top, width, height, fill, angle = 0, rx = 6 }) {
  return rect({
    left,
    top,
    width,
    height,
    fill,
    rx,
    ry: rx,
    angle,
    shadow: { type: 'shadow', color: 'rgba(0,0,0,0.35)', offsetX: 0, offsetY: 6, blur: 14 },
  });
}

/** A small rounded callout pill (e.g. ward number, date). */
function badgePill({ left, top, width, height, fill }) {
  return ribbonBanner({ left, top, width, height, fill, rx: height / 2 });
}

function text({ text: value, left, top, fontSize, fill, fontFamily = BODY_FONT, fontWeight = 'bold', textAlign = 'center', originX = 'center', originY = 'center', width, opacity = 1, angle = 0, stroke, strokeWidth = 0, editableRole, fieldId, label }) {
  const base = {
    type: 'IText',
    text: value,
    left,
    top,
    fontFamily,
    fontSize,
    fontWeight,
    fill,
    textAlign,
    originX,
    originY,
    width,
    opacity,
    angle,
    stroke,
    strokeWidth,
  };
  return editableRole
    ? { ...base, editableRole, fieldId, label }
    : locked(base);
}

/** Decorative concentric-ring border placed around a photo slot — stays in place when the slot's photo is replaced, since it's an independent object. */
function photoRing({ cx, cy, radius, color = '#ffffff' }) {
  return [
    locked({
      type: 'Circle',
      left: cx,
      top: cy,
      originX: 'center',
      originY: 'center',
      radius: radius + 14,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 3,
      opacity: 0.9,
    }),
    locked({
      type: 'Circle',
      left: cx,
      top: cy,
      originX: 'center',
      originY: 'center',
      radius: radius + 6,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 1,
      opacity: 0.6,
    }),
  ]
}

/** The replaceable main-person photo slot — a circular placeholder with a soft gradient fill, standing in until the user uploads their photo. */
function mainPhotoSlot({ cx, cy, radius, fieldId = 'mainPhoto', label = 'Your Photo' }) {
  return {
    type: 'Circle',
    left: cx,
    top: cy,
    originX: 'center',
    originY: 'center',
    radius,
    fill: linearGradient([
      [0, '#aab2c0'],
      [1, '#7b8495'],
    ], { x1: 0, y1: 0, x2: 0, y2: 1, width: radius * 2, height: radius * 2 }),
    editableRole: 'mainPhoto',
    fieldId,
    label,
  };
}

/** A smaller, non-replaceable "other person" photo placeholder (e.g. a senior/endorsing leader). */
function fixedPersonSlot({ cx, cy, radius, fill = '#9aa2b1' }) {
  return [
    ...photoRing({ cx, cy, radius, color: '#ffffff' }),
    locked({
      type: 'Circle',
      left: cx,
      top: cy,
      originX: 'center',
      originY: 'center',
      radius,
      fill,
    }),
  ]
}

/** A stylized distant-crowd silhouette strip along the bottom edge — small overlapping head/shoulder shapes, suggesting a rally without needing a photo. */
function crowdSilhouette({ canvasWidth, baseline, color = 'rgba(10,10,15,0.55)', count = 26 }) {
  const shapes = []
  for (let i = 0; i < count; i += 1) {
    const spacing = canvasWidth / count
    const cx = spacing * i + spacing / 2 + (i % 2 === 0 ? -6 : 6)
    const headR = 12 + ((i * 37) % 10)
    const shoulderW = headR * 2.6
    const shoulderH = headR * 1.8
    shapes.push(
      locked({
        type: 'Circle',
        left: cx,
        top: baseline - headR * 1.6,
        originX: 'center',
        originY: 'center',
        radius: headR,
        fill: color,
      }),
      locked({
        type: 'Rect',
        left: cx,
        top: baseline,
        originX: 'center',
        originY: 'bottom',
        width: shoulderW,
        height: shoulderH,
        rx: shoulderW / 2,
        ry: shoulderW / 2,
        fill: color,
      }),
    )
  }
  return shapes
}

/** A circular emblem badge: outer ring + filled core + a centered symbol glyph. Entirely generic/abstract — not a real party symbol. */
function emblemBadge({ cx, cy, radius, ringColor, coreColor, symbolColor = '#ffffff', symbol = '★' }) {
  return [
    locked({
      type: 'Circle',
      left: cx,
      top: cy,
      originX: 'center',
      originY: 'center',
      radius,
      fill: coreColor,
      stroke: ringColor,
      strokeWidth: 5,
    }),
    text({
      text: symbol,
      left: cx,
      top: cy,
      fontSize: radius,
      fill: symbolColor,
      fontFamily: BODY_FONT,
      fontWeight: 'normal',
    }),
  ]
}

module.exports = {
  TELUGU_FONT,
  BODY_FONT,
  locked,
  linearGradient,
  rect,
  ribbonBanner,
  badgePill,
  text,
  photoRing,
  mainPhotoSlot,
  fixedPersonSlot,
  crowdSilhouette,
  emblemBadge,
};
