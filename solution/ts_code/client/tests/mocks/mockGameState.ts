import IGameState from '../../src/game-state'
import { presets } from '../../../common/src/gamemodels/preset-pattern';
import { Board } from '../../../common/src/gamemodels/board'
import { ILogger } from '../../../common/src/services'

export function mockGameState(logger: ILogger): IGameState {
  const w = 60
  const h = 100
  return {
    updateAt: 1513368397117,
    board: Board.create(logger)(w, h, presets[1]),
    players: [],
  }
}
