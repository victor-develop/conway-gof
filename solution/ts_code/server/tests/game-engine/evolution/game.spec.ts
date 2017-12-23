import 'mocha'
import { Game } from '../../../src/game-engine/game'
import { createGame } from '../../../src/services'
import { presetPatternBoards, blinker } from '../../../../common/src/gamemodels/preset-pattern'
import * as assert from 'assert'
import IResponse from '../../../../common/src/api/IResponse'
import { TempLogger, ILogger } from '../../../../common/src/services'
import IPlayerContext from '../../../../common/src/gamemodels/iplayer-context'

const logger = () => new TempLogger('Game test')

const assertNewPlayerContext = (newPlayerName: string ,context: IPlayerContext) => {
  assert.equal(context.player.name, newPlayerName)
  assert.ok(context.player.uid)
  assert.ok(context.presetPatternBoards)
}

describe('Server Game test', () => {
  describe('newPlayer()', () => {

    const game = createGame(logger())

    it('player A receives context information from server', (done) => {
      const playerA = 'player A'
      game.newPlayer(playerA)
      .then((context: IPlayerContext) => {
        assertNewPlayerContext(playerA, context)
        game.stop()
        done()
      })
    })

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
      // test pattern blinker always stays the same
      const game = createGame(logger())
      game.newPlayer('TestMan')
        .then((context: IPlayerContext) => {
          const testMan = context.player
          return game.playerPatchCells(testMan, blinker)
            .then((firstResponse: IResponse) => {
              assert.equal(firstResponse.success, true)
              return game.playerPatchCells(testMan, blinker)
                .then((response: IResponse) => {
                  assert.equal(response.success, false)
                  assert.deepEqual(response.data.rejectedPositions, blinker)
                  game.stop()
                  done()
                })
            })
        })
    })
  })
})
