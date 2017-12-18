import IPlayer from '../../common/src/gamemodels/iplayer'
import { Board } from '../../common/src/gamemodels/board'
import { IGameState } from '../../common/src/gamemodels/game-state'

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

export function initialClientState(): ClientState {
  return {
    game: InitialValue.instance,
    context: {
      currentPlayer: InitialValue.instance,
    },
  }
}

export interface ClientContext {
  currentPlayer: InitialValue | IPlayer
}

export interface ClientState {
  game: InitialValue | IGameState
  context: ClientContext
}
