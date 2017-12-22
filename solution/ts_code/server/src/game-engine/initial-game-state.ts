import { IGameState } from '../../../common/src/gamemodels/i-game-state'
import GameBoard from '../../../common/src/gamemodels/game-board'
import { presetPatternBoards } from '../../../common/src/gamemodels/preset-pattern'
import { config } from '../config/config'

export function initialGameState(): IGameState {
  return {
    updateAt: Date.now(),
    players: [],
    board:GameBoard.create(config.game.boardWidth, config.game.boardHeight, []),
  }
}
