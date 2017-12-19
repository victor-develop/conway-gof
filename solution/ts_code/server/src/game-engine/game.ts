import { setInterval } from 'timers'
import { IEventBus } from '../../../common/src/ievent-bus'
import { IGameState, IPartialGameState_Evolution, IPartialGameState_Players } from '../../../common/src/gamemodels/game-state'
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

export type ISendPlayer = (player: IPlayer) => void

export const updateBoardEvent = {
  newPlayerIn: apiEvents.newPlayerIn,
  evolution: 'evolution',
  playerPatchCells: 'player-patch-cells',
}

const jobConsumeInterval = 50

export class Game {

  private evolveIntervalSecond: number
  private evolveFunc: (board: GameBoard) => GameBoard
  private getRandomPattern: (board: GameBoard) => Pattern
  private currentEvolutionToken: number
  private state: IGameState
  private eventBus: IEventBus
  private logger: ILogger
  private jobQueue: Function[]

  private init() {
    this.eventBus.on(apiEvents.newPlayerIn, (name, sendBack: ISendPlayer) =>
      this.newPlayer(name, sendBack))

    this.eventBus.on(apiEvents.playerOut, (leaver: IPlayer) =>
      this.removePlayer(leaver))

    this.eventBus.on(updateBoardEvent.playerPatchCells,
      (player, positions) => this.playerPatchCells(player, positions))

    setInterval(() => {
      this.runEvolution()
    }, this.evolveIntervalSecond)

    setInterval(() => {
      if (this.jobQueue.length > 0) {
        const job = this.jobQueue.pop()
        job()
      }
    }, jobConsumeInterval)
  }

  private newPlayer(name: string, sendBack: ISendPlayer) {
    const color = ColorUtil.assignNew(this.state.players)
    const uid = shortid.generate()
    const player = createPlayer(name, color, uid)
    this.state.players.push(player)
    sendBack(player)
    this.broadcastPlayers()
    this.patchRandomCells(player)
  }

  private removePlayer(player: IPlayer) {
    this.state.players = this.state.players.filter(p => p.uid !== player.uid)
    this.broadcastPlayers()
  }

  private broadcastPlayers() {
    const stateUpdate: IPartialGameState_Players = {
      players: this.state.players,
    }
    this.eventBus.emit(apiEvents.gameStateUpdate, stateUpdate)
  }

  private broadcastBoard() {
    const newPartialState: IPartialGameState_Evolution = {
      updateAt: this.currentEvolutionToken,
      board: this.state.board,
    }
    this.state = Object.assign({}, this.state, newPartialState)
    this.eventBus.emit(apiEvents.gameStateUpdate, newPartialState)
  }

  private patchCells(player: IPlayer, positions: IPos[]): GameBoard {
    const makeCell = (pos: IPos) =>
      createCell(pos.x, pos.y, player.uid, CellState.AliveStill, player.color)
    const newBoard = GameBoard.create(this.state.board.width, this.state.board.height, [])
    positions.forEach(pos => newBoard.addCell(makeCell(pos)))
    return newBoard
  }

  private playerPatchCells(player: IPlayer, positions: IPos[]) {
    this.pushNewBoard(() => this.patchCells(player, positions),updateBoardEvent.playerPatchCells)
  }

  private patchRandomCells(player: IPlayer) {
    const pattern: Pattern = this.getRandomPattern(this.state.board)
    this.pushNewBoard(() => this.patchCells(player, pattern), updateBoardEvent.newPlayerIn)
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
      this.state.board = newBoard
      this.broadcastBoard()
    })
  }

  public get events(): IEventBus {
    return this.eventBus
  }

  public constructor(
    logger: ILogger,
    evolveFunc: (board: GameBoard) => GameBoard,
    getRandomPattern: (board: GameBoard) => Pattern,
    evolveInterval: number,
    eventBus: IEventBus) {

    this.logger = logger
    this.evolveFunc = evolveFunc
    this.getRandomPattern = getRandomPattern
    this.evolveIntervalSecond = evolveInterval
    this.eventBus = eventBus
    this.jobQueue = []
    this.state = initialGameState()
    this.init()
  }
}
