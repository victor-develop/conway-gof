import ICell from './icell'

export default function createCell(x, y, uid, state, overlayColor): ICell {
  return { x, y, uid, state, overlayColor }
}

