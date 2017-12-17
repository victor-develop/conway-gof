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

  public static create = (width: number, height: number, positions: IPos[]) =>
      new Board(width, height, positions)

  protected constructor(width: number, height: number, positions: IPos[]) {

    validatePositive(width, 'width')
    validatePositive(height, 'height')

    this.width = width
    this.height = height
    this.hashCells = {}

    this.listcells = positions
    this.init()
  }

  private init() {
    const self = this
    const hashCells = this.hashCells
    self.listcells.forEach(posObj => self.addCell(posObj))
  }

  protected addCell(positionObj: IPos) {
    this.hashCells[positionObj.x] = this.hashCells[positionObj.x] || {}
    this.hashCells[positionObj.x][positionObj.y] = positionObj
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
  protected hashCells: HashCells

  public get cells(): HashCells {
    return this.hashCells
  }

  public static errorTypes: {
    INIT_FAIL: 'fail to init a board',
  }

  /**
   * Actual cells
   */
  private listcells: IPos[]
}

const validatePositive = (arg, argName) => {
  if (arg < 0) {
    throw new RangeError(`${argName} should not be negative: ${arg}`)
  }
}
