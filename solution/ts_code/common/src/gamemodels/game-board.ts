import { Board, HashCells } from './board'
import ICell from './icell'

export default class GameBoard extends Board {

  public static create = (width: number, height: number,
    positions: ICell[], hashCells: HashCells = null) =>
      new GameBoard(width, height, positions, hashCells)

  public static clone = (board: GameBoard) => new GameBoard(
    board.width,
    board.height,
    [],
    board.hashCells,
  )

  public addCell(cell: ICell) {
    super.addCell(cell)
  }

  protected constructor(width: number, height: number,
    positions: ICell[], hashCells: HashCells = null) {
    super(width, height, positions, hashCells)
  }
}
