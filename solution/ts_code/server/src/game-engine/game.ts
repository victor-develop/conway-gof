import { setInterval, clearInterval } from 'timers'
import { IEventBus } from '../../../common/src/ievent-bus'
import { IGameState } from '../../../common/src/gamemodels/i-game-state'
import { apiEvents } from '../../../common/src/api/api-events'
import createPlayer from '../../../common/tests/mocks/mock-player'
import * as shortid from 'shortid'
import IPlayer from '../../../common/src/gamemodels/iplayer'
import { Color } from '../../../common/src/gamemodels/color'
import { ColorUtil } from './color-util'
import { ILogger } from '../../../common/src/services'
import { Pattern } from '../../../common/src/gamemodels/ipattern'
import createCell from '../../../common/src/gamemodels/cell'
import { CellState } from '../../../common/src/gamemodels/cell-state'
import GameBoard from '../../../common/src/gamemodels/game-board'
import IPos from '../../../common/src/gamemodels/ipos'
import { presetPatternBoards } from '../../../common/src/gamemodels/preset-pattern'
import { config } from '../config/config'
import { initialGameState } from './initial-game-state'
import IResponse from '../../../common/src/api/IResponse'
import IPlayerContext from '../../../common/src/gamemodels/iplayer-context'
import { IIntervalLoopSetter } from './i-interval-loop'


export const updateBoardEvent = {
  newPlayerIn: apiEvents.newPlayerIn,
  evolution: 'evolution',
  playerPatchCells: 'player-patch-cells',
}

const jobConsumeInterval = 10

export class Game {

  private evolveIntervalMilleSecond: number
  private evolveFunc: (board: GameBoard) => GameBoard
  private getRandomPattern: (board: GameBoard) => Pattern
  private currentEvolutionToken: number
  private state: IGameState
  private eventBus: IEventBus
  private logger: ILogger
  private jobQueue: Function[]

  private init(evolveTimer: IIntervalLoopSetter, jobQueueTimer: IIntervalLoopSetter) {

    const evolve = evolveTimer(() => {
      this.runEvolution()
    }, this.evolveIntervalMilleSecond)

    const jobQLoop = jobQueueTimer(() => {
      if (this.jobQueue.length > 0) {
        const job = this.jobQueue.pop()
        job()
      }
    }, jobConsumeInterval)

    jobQLoop.start()
    evolve.start()

    this.stop = () => {
      evolve.stop()
      jobQLoop.stop()
    }
  }

  public newPlayer(name: string): Promise<IPlayerContext> {
    const color = ColorUtil.assignNew(this.state.players)
    const uid = shortid.generate()
    const player = createPlayer(name, color, uid)
    this.state.players.push(player)
    this.patchRandomCells(player)
    this.broadcastState()
    return Promise.resolve({
      player,
      presetPatternBoards,
    })
  }

  public removePlayer(player: IPlayer) {
    this.state.players = this.state.players.filter(p => p.uid !== player.uid)
    this.broadcastState()
  }

  public playerPatchCells(player: IPlayer, positions: IPos[]) {
    return new Promise((resolve, reject) => {
      const callback = (rejectedPositions) => {
        if (rejectedPositions.length > 0) {
          resolve({
            success: false,
            messages: 'Some positions cannot be patched with you cell. They may be taken by others cells already',
            data: { rejectedPositions },
          })
        } else {
          const successResponse: IResponse = {
            success: true,
            messages: [],
            data: null,
          }
          resolve(successResponse)
        }
      }

      this.pushNewBoard(() => this.patchCells(player, positions, callback),
        updateBoardEvent.playerPatchCells)
    })
  }

  private broadcastState() {
    this.eventBus.emit(apiEvents.gameStateUpdate, this.state)
  }

  private patchCells(player: IPlayer, positions: IPos[], callback): GameBoard {
    const makeCell = (pos: IPos) =>
      createCell(pos.x, pos.y, player.uid, CellState.AliveStill, player.color)
    const newBoard = GameBoard.clone(this.state.board)
    const rejectedPositions = []
    positions.forEach((pos) => {
      if (newBoard.isValidPos(pos)) {
        rejectedPositions.push(pos)
      } else {
        newBoard.addCell(makeCell(pos))
      }
    })
    callback(rejectedPositions)
    return newBoard
  }

  private patchRandomCells(player: IPlayer) {
    const pattern: Pattern = this.getRandomPattern(this.state.board)
    const callback = (rejectedPositions: Array<IPos>) => {
      if (rejectedPositions.length > 0) {
        this.logger.info('some random cells failed to be patch for a new player')
      }
    }
    this.pushNewBoard(() =>
      this.patchCells(player, pattern, callback), updateBoardEvent.newPlayerIn)
  }

  private runEvolution() {
    this.pushNewBoard(() => this.evolveFunc(this.state.board), updateBoardEvent.evolution)
  }

  private pushNewBoard(board: () => GameBoard, eventKey: string) {
    this.jobQueue.push(() => {
      const newBoard = board()
      this.logger.info(newBoard, `update the board due to ${eventKey}`)
      const updateToken = Date.now()
      this.currentEvolutionToken = updateToken
      this.state.updateAt = updateToken
      this.state.board = newBoard
      this.broadcastState()
    })
  }

  public get events(): IEventBus {
    return this.eventBus
  }

  public stop: Function

  /**
   * Creation of the class
   * 
   * @param logger 
   * @param evolveFunc - a function takes a board and returned a transformed board,
   *                     supposingly, the evolution loggic
   * @param getRandomPattern - a function that generates random positions for a board
   * @param evolveInterval - how long will a board evolve naturally
   * @param eventBus - for broadcasting states
   * @param evolveTimer - a wrapper of setInterval function, used to run evolution periodically
   * @param jobQueueTimer - a wrapper of setInterval function,
   *                        used to consume the job queue perdiodically
   */
  public constructor(
    logger: ILogger,
    evolveFunc: (board: GameBoard) => GameBoard,
    getRandomPattern: (board: GameBoard) => Pattern,
    evolveInterval: number,
    eventBus: IEventBus,
    evolveTimer: IIntervalLoopSetter,
    jobQueueTimer: IIntervalLoopSetter) {

    this.logger = logger
    this.evolveFunc = evolveFunc
    this.getRandomPattern = getRandomPattern
    this.evolveIntervalMilleSecond = evolveInterval
    this.eventBus = eventBus
    this.jobQueue = []
    this.state = initialGameState()
    this.init(evolveTimer, jobQueueTimer)
  }
}
