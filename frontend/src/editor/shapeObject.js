import { Circle, Line, Rect, Triangle } from 'fabric'
import {
  IconCircleShape,
  IconLineShape,
  IconRectangle,
  IconTriangleShape,
} from '../components/icons.jsx'

export const SHAPE_TOOLS = [
  { type: 'rect', label: 'Rectangle', icon: IconRectangle },
  { type: 'circle', label: 'Circle', icon: IconCircleShape },
  { type: 'line', label: 'Line', icon: IconLineShape },
  { type: 'triangle', label: 'Triangle', icon: IconTriangleShape },
]

const DEFAULT_FILL = '#ffffff'
const DEFAULT_STROKE = '#15171e'

export function createShapeObject(shapeType, canvasWidth, canvasHeight) {
  const left = canvasWidth / 2
  const top = canvasHeight / 2
  const shared = { left, top, originX: 'center', originY: 'center' }

  switch (shapeType) {
    case 'circle':
      return new Circle({
        ...shared,
        radius: 70,
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE,
        strokeWidth: 2,
      })
    case 'line':
      return new Line([-80, 0, 80, 0], {
        ...shared,
        stroke: DEFAULT_STROKE,
        strokeWidth: 4,
      })
    case 'triangle':
      return new Triangle({
        ...shared,
        width: 140,
        height: 120,
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE,
        strokeWidth: 2,
      })
    case 'rect':
    default:
      return new Rect({
        ...shared,
        width: 160,
        height: 100,
        rx: 0,
        ry: 0,
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE,
        strokeWidth: 2,
      })
  }
}

export function isShapeObject(object) {
  return Boolean(object) && object.isType('Rect', 'Circle', 'Line', 'Triangle')
}

export function readShapeSnapshot(object) {
  return {
    kind: 'shape',
    shapeType: object.type,
    fill: object.fill || '#ffffff',
    stroke: object.stroke || '#15171e',
    strokeWidth: object.strokeWidth ?? 0,
    opacity: object.opacity,
    cornerRadius: object.type === 'rect' ? (object.rx ?? 0) : undefined,
  }
}

export function applyShapeSnapshotPatch(object, patch) {
  const fabricPatch = {}

  if ('fill' in patch) fabricPatch.fill = patch.fill
  if ('stroke' in patch) fabricPatch.stroke = patch.stroke
  if ('strokeWidth' in patch) fabricPatch.strokeWidth = patch.strokeWidth
  if ('opacity' in patch) fabricPatch.opacity = patch.opacity
  if ('cornerRadius' in patch && object.type === 'rect') {
    fabricPatch.rx = patch.cornerRadius
    fabricPatch.ry = patch.cornerRadius
  }

  object.set(fabricPatch)
  object.setCoords()
}
