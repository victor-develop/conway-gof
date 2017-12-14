import { ICellState } from './icell-state'
import { Color } from './color'
import IPos from './ipos'

export default interface ICell extends IPos {
  x: number
  y: number

  /**
   * Unique User ID
   */
  uid: string

  state: ICellState

  overlayColor: Color
}
