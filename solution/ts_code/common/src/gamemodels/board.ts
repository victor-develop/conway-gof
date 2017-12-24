import ICell from './icell'
import IPos from './ipos'
import ILogger from '../ilogger'
import { arch } from 'os'

export interface HashCells {
  [x: number]: {
    [y: number]: any,
  }
}

export class Board {

  public static create = (width: number, height: number,
    positions: IPos[]) =>
      new Board(width, height, positions)

  /**
   * It can also be used to convert a seriliazed board back to class
   */
  public static clone = (board: Board) => new Board(
    board.width, board.height,[], board.hashCells,
  )

  protected constructor(width: number, height: number,
    positions: IPos[], hashCells: HashCells = null) {

    validatePositive(width, 'width')
    validatePositive(height, 'height')

    this.width = width
    this.height = height
    this.hashCells = {}

    this.initCells(positions)
    let copiedHashCells = {}
    if (hashCells != null) {
      copiedHashCells = JSON.parse(JSON.stringify(hashCells))
    }
    this.hashCells = Object.assign(this.hashCells, copiedHashCells)
  }

  private initCells(positions: IPos[]) {
    const self = this
    const hashCells = this.hashCells
    positions.forEach(posObj => self.addCell(posObj))
  }

  protected addCell(positionObj: IPos) {
    this.hashCells[positionObj.x] = this.hashCells[positionObj.x] || {}
    this.hashCells[positionObj.x][positionObj.y] = positionObj
  }

  public allPositions(): IPos[] {
    const xs = [...Array(this.width).keys()]
    const ys = [...Array(this.height).keys()]
    // tslint:disable-next-line:ter-arrow-body-style
    const positions = xs.map(x => ys.map((y) => { return { x, y } }))
    .reduce((posList, pos) => posList.concat(pos, []))
    return positions
  }

  public validPositions(): IPos[] {
    const positions: IPos[] = []
    const base = 10
    // tslint:disable-next-line:forin
    for(const x in this.hashCells) {
      // tslint:disable-next-line:forin
      for(const y in this.hashCells[x]) {
        const position = {
          x: parseInt(x, base),
          y: parseInt(y, base),
        }
        positions.push(position)
      }
    }
    return positions
  }

  public isValidPos(pos: IPos): boolean {
    if ((this.hashCells[pos.x] &&
       this.hashCells[pos.x][pos.y])) {
      return true
    }
    return false
  }

  public width: number
  public height: number
  public hashCells: HashCells

  public get cells(): HashCells {
    return this.hashCells
  }

  public static errorTypes: {
    INIT_FAIL: 'fail to init a board',
  }

}

const validatePositive = (arg, argName) => {
  if (arg < 0) {
    throw new RangeError(`${argName} should not be negative: ${arg}`)
  }
}
