import { IConfig } from './iconfig'
import { serverRoot } from '../helpers'
import * as path from 'path'

const port = process.env.PORT

const devConfig: IConfig = {
  serveStatic: true,
  staticDir: path.resolve(serverRoot, '..', 'client', 'static'),
  serverURL: `localhost:${port}`,
  game: {
    evolveInterval: 10000,
    boardWidth: 80,
    boardHeight: 60,
  },
  rootLevelLoggerOpts: {
    name: 'Development Log',
  },
}

export { devConfig }
