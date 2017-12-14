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
    this.listcells.forEach((pos) => {
      hashCells[pos.x] = hashCells[pos.x] || {}
      hashCells[pos.x][pos.y] = pos
    })
  }

  public width: number
  public height: number
  public cells: HashCells

  /**
   * Actual cells
   */
  private listcells: IPos[]
  private logger: ILogger
}
