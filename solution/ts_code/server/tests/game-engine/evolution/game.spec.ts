import 'mocha'

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
})
