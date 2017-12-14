import { IConfig } from './iconfig'
import { serverRoot } from '../helpers'
import * as path from 'path'

const devConfig: IConfig = {
  serveStatic: true,
  staticDir: path.resolve(serverRoot, '..', '..', 'static'),
}

export { devConfig }
