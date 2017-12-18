import IPlayer from './iplayer'
import { Board } from './board'
import GameBoard from './game-board'

type unixtime = number

export interface IGameState {
  updateAt: unixtime,
  players: IPlayer[],
  board: GameBoard,
  presetPatternBoards: Board[]
}

export interface IPartialGameState_Evolution {
  updateAt: unixtime,
  board: GameBoard
}

