import IPlayer from '../../common/src/gamemodels/iplayer'
import { Board } from '../../common/src/gamemodels/board'
import { IGameState } from '../../common/src/gamemodels/i-game-state'
import { presetPatternBoards } from '../../common/src/gamemodels/preset-pattern'

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
      presetPatternBoards,
    },
    errors: [],
    playername: '',
    selectedPattern: InitialValue.instance,
  }
}

export interface ClientContext {
  currentPlayer: InitialValue | IPlayer
  presetPatternBoards: Board[],
}

export interface ClientState {
  game: InitialValue | IGameState
  context: ClientContext
  errors: {
    message: string,
    data?: object,
    notified: boolean,
  }[],
  playername: string,
  selectedPattern: InitialValue | Board
}
