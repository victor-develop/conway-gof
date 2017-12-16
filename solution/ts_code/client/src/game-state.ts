import IPlayer from '../../common/src/gamemodels/iplayer'
import { Board } from '../../common/src/gamemodels/board'

type unixtime = number

export default interface IGameState {
  updateAt: unixtime,
  players: IPlayer[],
  board: Board
}

