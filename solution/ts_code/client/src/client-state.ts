import IGameState from './game-state'
import IPlayer from '../../common/src/gamemodels/iplayer'
import { Board } from '../../common/src/gamemodels/board'

export class InitialValue {
  private static singleton: InitialValue
  protected constructor() {

  }
  public static get instance(): InitialValue {
    if (!InitialValue.singleton){
      InitialValue.singleton = new InitialValue()
    }
    return InitialValue.singleton
  }
}

export const initialClientState: ClientState = {
  game: InitialValue.instance,
  currentPlayer: InitialValue.instance,
  players: InitialValue.instance,
  presetPatternBoards: InitialValue.instance,
}

export interface ClientState {
  game: InitialValue | IGameState
  currentPlayer: InitialValue | IPlayer
  players: InitialValue | IPlayer[]
  presetPatternBoards: InitialValue | Board[]
}
