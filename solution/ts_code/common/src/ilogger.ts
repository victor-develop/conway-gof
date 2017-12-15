import IChildable from './ichildable'

interface ILogger extends IChildable<ILogger> {
  info
  err
}

export default ILogger
