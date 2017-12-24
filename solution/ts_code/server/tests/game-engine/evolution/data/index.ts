import * as fs from 'fs'
import * as path from 'path'
import { encoding } from './settings'
import { serverRoot } from '../../../../src/server-root'

function readJson(file: string): any {
  const fullPath = path.resolve(serverRoot, 'tests', 'game-engine', 'evolution', 'data', file)
  return JSON.parse(fs.readFileSync(fullPath, { encoding }))
}

const zeroNeighborBoards = readJson('zero-neighbor-boards.json')
const oneNeighborsBoards = readJson('one-neighbor-boards.json')
const twoNeighborsBoards = readJson('two-neighbors-boards.json')
const threeNeighborsBoards = readJson('three-neighbors-boards.json')
const multipleNeighborsBoards = readJson('multiple-neighbors-boards.json')
const deadCellWithThreeNeighbors = readJson('dead-three-neighbors-boards.json')

export const testSamples = {
  zeroNeighborBoards,
  oneNeighborsBoards,
  twoNeighborsBoards,
  threeNeighborsBoards,
  multipleNeighborsBoards,
  deadCellWithThreeNeighbors,
}
