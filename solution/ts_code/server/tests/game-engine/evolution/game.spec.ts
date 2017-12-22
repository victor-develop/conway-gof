import 'mocha'
import { Game } from '../../../src/game-engine/game'
import { logger } from '../../../src/helpers'
import { createGame } from '../../../src/services'
import { presetPatternBoards, blinker } from '../../../../common/src/gamemodels/preset-pattern'
import * as assert from 'assert'
import IResponse from '../../../../common/src/api/IResponse'
import { TempLogger, ILogger } from '../../../../common/src/services'
import IPlayerContext from '../../../../common/src/gamemodels/iplayer-context'


describe('Server Game test', () => {
  describe('When a player A connects', () => {
    it('player A receives context information from server')
    it('player A receives the current game state')

    describe('player B comes in', () => {
      it('player A got his players list updated')
      it('player B receives context information')
      it('player B got his players list synced')

      describe('player A patch some cells', () => {
        it('player B got his board updated')
      })
    })
  })

  describe('When a player try to patch cells on existed positions', () => {
    it('should reject the player\'s attempt', (done) => {
      const game = createGame(logger)
      game.newPlayer('TestMan')
        .then((context: IPlayerContext) => {
          const testMan = context.player
          return game.playerPatchCells(testMan, blinker)
            .then((firstResponse: IResponse) => {
              assert.equal(firstResponse.success, true)
              return game.playerPatchCells(testMan, blinker)
                .then((response: IResponse) => {
                  assert.equal(response.success, false)
                  game.stop()
                  done()
                })
            })
        })
    })
  })
})
