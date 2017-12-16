import ICell from './icell'
import IPos from './ipos'
import ILogger from '../ilogger'
import { arch } from 'os';

interface HashCells {
  [x: number]: {
    [y: number]: Object,
  }
}

export class BoardBuilder {

  private logger: ILogger

  constructor(aLogger: ILogger) {
    this.logger = aLogger
  }

  public Create(width: number, height: number, positions: IPos[]): Board {
    return new Board(width, height, positions, this.logger)
  }
}

export class Board {

  public static create = (logger: ILogger) =>
    (width: number, height: number, positions: IPos[]) =>
      new Board(width, height, positions, logger)

  constructor(width: number, height: number, positions: IPos[], aLogger: ILogger) {

    validatePositive(width, 'width')
    validatePositive(height, 'height')

    this.width = width
    this.height = height
    this.cells = {}

    this.listcells = positions
    this.logger = aLogger
    this.init()
  }

  private init() {
    const hashCells = this.cells
    try {
      this.listcells.forEach((pos) => {
        hashCells[pos.x] = hashCells[pos.x] || {}
        hashCells[pos.x][pos.y] = pos
      })
    } catch(error) {
      this.logger.err(error, Board.errorTypes.INIT_FAIL)
      throw error
    }
  }

  public isValidPos(pos: IPos): boolean {
    if ((this.cells[pos.x] &&
       this.cells[pos.x][pos.y])) {
      return true
    }
    return false
  }

  public width: number
  public height: number
  public cells: HashCells

  public static errorTypes: {
    INIT_FAIL: 'fail to init a board',
  }

  /**
   * Actual cells
   */
  private listcells: IPos[]
  private logger: ILogger
}

const validatePositive = (arg, argName) => {
  if (arg < 0) {
    throw new RangeError(`${argName} should not be negative: ${arg}`)
  }
}
