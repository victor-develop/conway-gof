import ILogger from '../../common/src/ilogger'
import TempLogger from '../../common/src/temp-logger'
import * as path from 'path'
import * as bunyan from 'bunyan'

const rootBunyan = bunyan.createLogger({ name: 'rootLevelLogger' })

function wrapLogger(bunyanLogger: bunyan) : ILogger {
  return {
    info: (obj: any, msg: string) => {
      bunyanLogger.info(obj, msg)
    },
    err: (obj: any, msg: string) => {
      bunyanLogger.error(obj, msg)
    },
    child: (name: string) => {
      const childID = {}
      childID[name] = name
      return Promise.resolve(wrapLogger(bunyanLogger.child(childID)))
    },
  }
}

const logger: ILogger = wrapLogger(rootBunyan)
const serverRoot = path.resolve(__dirname, '../')
export { logger, serverRoot }
