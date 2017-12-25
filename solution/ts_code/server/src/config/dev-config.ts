import { IConfig } from './iconfig'
import { serverRoot } from '../server-root'
import * as path from 'path'

const port = process.env.PORT

const devConfig: IConfig = {
  serveStatic: true,
  staticDir: path.resolve(serverRoot, '..', 'client', 'static'),
  serverURL: `localhost:${port}`,
  game: {
    evolveInterval: 5000,
    boardWidth: 80,
    boardHeight: 60,
  },
  rootLevelLoggerOpts: {
    name: 'Development Log',
  },
}

export { devConfig }
