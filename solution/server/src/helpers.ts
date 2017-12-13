import ILogger from './ilogger'
import * as path from 'path'

const logger: ILogger = { info: console.log }
const serverRoot = path.resolve(__dirname, '../')
export { logger, serverRoot }
