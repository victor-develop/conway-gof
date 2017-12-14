import ILogger from '../../common/ilogger'
import * as path from 'path'

const logger: ILogger = { info: console.log }
const serverRoot = path.resolve(__dirname, '../')
export { logger, serverRoot }
