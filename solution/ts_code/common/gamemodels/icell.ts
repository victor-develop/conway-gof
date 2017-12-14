import { ICellState } from './icell-state'
import { Color } from './color'

export default interface ICell {
  x: number
  y: number

  /**
   * Unique User ID
   */
  uid: string

  state: ICellState

  overlayColor: Color
}
