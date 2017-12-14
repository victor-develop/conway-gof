import ICell from './icell'
import IPos from './ipos'
import ILogger from '../ilogger'

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

  public Create(w: number, h: number, positions: IPos[]): Board {
    return new Board(w, h, positions, this.logger)
  }
}

export class Board {

  constructor(w: number, h: number, positions: IPos[], aLogger: ILogger) {
    this.width = w
    this.height = h
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

  public isValidPos(pos: IPos) {
    return (this.cells[pos.x] && this.cells[pos.x][pos.y])
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
