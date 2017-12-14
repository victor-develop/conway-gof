import ILogger from './ilogger'

const log = console.log

/**
 * Stop using it when starting develop backend service
 */
export default class TempLogger implements ILogger {
  info(obj: any) {
    log(obj)
  }
  err(obj: any, message: string): void {
    log(obj)
    log(message)
  }
}
