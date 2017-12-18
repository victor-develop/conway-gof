import IPlayer from '../../common/src/gamemodels/iplayer'
import { Board } from '../../common/src/gamemodels/board'
import GameBoard from '../../common/src/gamemodels/game-board'

type unixtime = number

export default interface IGameState {
  updateAt: unixtime,
  players: IPlayer[],
  board: GameBoard,
  presetPatternBoards: Board[]
}

