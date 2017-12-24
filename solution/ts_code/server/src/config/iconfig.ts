import * as bunyan from 'bunyan'

export interface IConfig {
  serveStatic: boolean
  staticDir: string
  serverURL: string
  game: {
    evolveInterval: number,
    boardWidth: number,
    boardHeight: number,
  },
  rootLevelLoggerOpts: bunyan.LoggerOptions,
}
