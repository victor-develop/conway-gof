import 'mocha'

describe('Game board evolution', () => {
  describe('under-population: live cell with fewer than two live neighbors', () => {
    it('dies')
  })

  describe('live cell with two or three live neighbors', () => {
    it('lives on to next generation')
  })

  describe('live cell with more than three neighbors', () => {
    it('dies')
  })

  describe('dead cell with just three neighbors', () => {
    it('gets alive again')

    it('has an average color of its three neighbors')
  })
})
