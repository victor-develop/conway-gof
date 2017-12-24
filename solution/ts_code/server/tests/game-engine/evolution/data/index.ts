import * as fs from 'fs'
import * as path from 'path'
import { encoding } from './settings'
import { serverRoot } from '../../../../src/helpers'

function readJson(file: string): any {
  const fullPath = path.resolve(serverRoot, 'tests', 'game-engine', 'evolution', 'data', file)
  return JSON.parse(fs.readFileSync(fullPath, { encoding }))
}
const oneNeighborsBoards = readJson('one-neighbor-boards.json')
const twoNeighborsBoards = readJson('two-neighbors-boards.json')
const threeNeighborsBoards = readJson('three-neighbors-boards.json')
const multipleNeighborsBoards = readJson('multiple-neighbors-boards.json')
const deadCellWithThreeNeighbors = readJson('dead-three-neighbors-boards.json')

export const testSamples = {
  oneNeighborsBoards,
  twoNeighborsBoards,
  threeNeighborsBoards,
  multipleNeighborsBoards,
  deadCellWithThreeNeighbors,
}
