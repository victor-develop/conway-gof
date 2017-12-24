import { devConfig } from './dev-config'
import { testConfig } from './test-config'
import { IConfig } from './iconfig'

const configList = {
  development: devConfig,
  test: testConfig,
}

if (!configList[process.env.NODE_ENV]) {
  throw new Error('NODE_ENV is not set properly')
}

const config: IConfig = configList[process.env.NODE_ENV]

export { config }
