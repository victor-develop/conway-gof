import { Board, HashCells } from './board'
import ICell from './icell'

export default class GameBoard extends Board {

  public static create = (width: number, height: number, positions: ICell[]) =>
      new GameBoard(width, height, positions)

  public addCell(cell: ICell) {
    super.addCell(cell)
  }

  protected constructor(width: number, height: number, positions: ICell[]) {
    super(width, height, positions)
  }
}
