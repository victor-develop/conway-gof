import Player from '../../common/src/gamemodels/player'
import { Board } from '../../common/src/gamemodels/board'

type unixtime = number

export default interface IGameState {
  updateAt: unixtime,
  players: Player[],
  board: Board
}

