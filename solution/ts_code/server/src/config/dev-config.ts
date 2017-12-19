import { IConfig } from './iconfig'
import { serverRoot } from '../helpers'
import * as path from 'path'

const port = process.env.PORT

const devConfig: IConfig = {
  serveStatic: true,
  staticDir: path.resolve(serverRoot, '..', 'client', 'static'),
  serverURL: `localhost:${port}`,
}

export { devConfig }
