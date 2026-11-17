import { IText } from 'fabric'
import { DEFAULT_FONT_FAMILY } from './fonts.js'

export function createTextObject(canvasWidth, canvasHeight) {
  return new IText('Add your text', {
    left: canvasWidth / 2,
    top: canvasHeight / 2,
    originX: 'center',
    originY: 'center',
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 48,
    fill: '#15171e',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
  })
}

export function isTextObject(object) {
  return Boolean(object) && object.isType('IText')
}

export function readTextSnapshot(object) {
  return {
    kind: 'text',
    text: object.text,
    fontFamily: object.fontFamily,
    fontSize: object.fontSize,
    fill: object.fill,
    bold: object.fontWeight === 'bold',
    italic: object.fontStyle === 'italic',
    textAlign: object.textAlign,
  }
}

export function applySnapshotPatch(object, patch) {
  const fabricPatch = {}

  if ('text' in patch) fabricPatch.text = patch.text
  if ('fontFamily' in patch) fabricPatch.fontFamily = patch.fontFamily
  if ('fontSize' in patch) fabricPatch.fontSize = patch.fontSize
  if ('fill' in patch) fabricPatch.fill = patch.fill
  if ('bold' in patch) fabricPatch.fontWeight = patch.bold ? 'bold' : 'normal'
  if ('italic' in patch) fabricPatch.fontStyle = patch.italic ? 'italic' : 'normal'
  if ('textAlign' in patch) fabricPatch.textAlign = patch.textAlign

  object.set(fabricPatch)
}
