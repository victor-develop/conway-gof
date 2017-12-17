import { CellState } from './cell-state'
import { Color } from './color'
import IPos from './ipos'

export default interface ICell extends IPos {
  x: number
  y: number

  /**
   * Unique User ID
   */
  uid: string

  state: CellState

  overlayColor: Color
}
