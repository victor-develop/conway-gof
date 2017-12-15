import Player from '../../common/src/gamemodels/player'
import { Board } from '../../common/src/gamemodels/board'

export default interface IGameState {
  updateAt: Date,
  players: Player[],
  board: Board
}

