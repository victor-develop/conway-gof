import { Board } from './board'
import IPlayer from './iplayer'

export default interface IPlayerContext {
  player: IPlayer,
  presetPatternBoards: Board[],
}
