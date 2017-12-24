import * as bunyan from 'bunyan'
import { config } from './config/config'
import { ILogger } from '../../common/src/services'

const rootBunyan = bunyan.createLogger(<any>config.rootLevelLoggerOpts)

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

export { logger }
