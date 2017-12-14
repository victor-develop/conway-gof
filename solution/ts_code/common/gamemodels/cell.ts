import ICell from './icell'
import { ICellState } from './icell-state'

export default class Cell implements ICell {
  x: number
  y: number
  uid: string
  state: ICellState
  overlayColor: string
}
