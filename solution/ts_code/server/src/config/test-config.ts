import * as bunyan from 'bunyan'
import { IConfig } from './iconfig'
import { serverRoot } from '../helpers'
import * as path from 'path'
import { devConfig } from './dev-config'

const logStartTime = new Date(Date.now())
const logStartTimeString =
  logStartTime.getFullYear() + '_' + logStartTime.getMonth() +
  '_' +logStartTime.getUTCDate() + '_' + logStartTime.getUTCSeconds()

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
