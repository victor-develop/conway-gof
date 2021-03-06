import * as bunyan from 'bunyan'
import { IConfig } from './iconfig'
import { serverRoot } from '../server-root'
import * as path from 'path'
import { devConfig } from './dev-config'

const logStartTime = new Date(Date.now())
const unixTimeDivider = 1000
const logStartTimeString =
  logStartTime.getFullYear() + '_' + logStartTime.getMonth() +
  '_' +logStartTime.getUTCDate() + '_' + Math.floor(logStartTime.getTime()/unixTimeDivider)

const rootLevelLoggerOpts: bunyan.LoggerOptions = {
  name: 'Test Log',
  streams: [{
    path: path.resolve(serverRoot,'tests',`output_${logStartTimeString}.txt`),
  }],
}

const partialConfig = {
  rootLevelLoggerOpts,
}

const testConfig: IConfig = Object.assign({}, devConfig, partialConfig)

export { testConfig }
