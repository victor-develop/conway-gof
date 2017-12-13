import * as express from 'express'
import ILogger from './ilogger'

export default class Server {
  private appInstance: express.Application
  private logger: ILogger
  private portInUse: string

  constructor(aLogger: ILogger, port: string) {
    this.appInstance = express()
    this.mountRoutes()
    this.logger = aLogger
    this.portInUse = port
  }

  private mountRoutes(): void {
    const router = express.Router()
    router.get('/hello-world', (req, res) => {
      res.json({
        message: 'Hello World',
      })
    })
    this.appInstance.use('/', router)
  }

  get app(): express.Application {
    return this.appInstance
  }

  get port(): string {
    return this.portInUse
  }

  public boot(): Server {
    this.appInstance.listen(this.portInUse, (err) => {
      if(err) {
        return this.logger.info(err)
      }
    })
    this.logger.info(`listening on ${this.portInUse}`)
    return this
  }

  public serveStatic(dir: string) {
    this.logger.info(`serving static files at ${dir}`)
    this.appInstance.use(express.static(dir))
    return this
  }
}
