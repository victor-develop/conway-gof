import ILogger from '../../common/src/ilogger'
import TempLogger from '../../common/src/temp-logger'
import * as path from 'path'

const logger = new TempLogger('server start')
const serverRoot = path.resolve(__dirname, '../')
export { logger, serverRoot }
