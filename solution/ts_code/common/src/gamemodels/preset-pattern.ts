import { Pattern } from './ipattern'

/**
 *  refer to `https://en.wikipedia.org/wiki/Conway's_Game_of_Life#Examples_of_patterns`
 */

export const blinker: Pattern = [
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
]

export const toad: Pattern = [
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
]

export const tub: Pattern = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 2 },
]

export const presetPatterns: Pattern[] = [blinker, toad, tub]
