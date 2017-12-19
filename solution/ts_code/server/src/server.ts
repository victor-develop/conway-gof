import * as express from 'express'
import * as http from 'http'
import ILogger from '../../common/src/ilogger'
import * as socketIo from 'socket.io'
import { socketEvents } from '../../common/src/api/socket-events'
import { Game } from './game-engine/game'
import { createGame } from './services'
import { setApiService } from './game-engine/api-service'

export default class Server {
  private appInstance: express.Application
  private httpServer: any
  private logger: ILogger
  private portInUse: string
  private socketIo: any
  private gameInstance: Game

  constructor(aLogger: ILogger, port: string) {
    this.appInstance = express()
    this.mountRoutes()
    this.logger = aLogger
    this.portInUse = port
    this.httpServer = http.createServer(this.appInstance)
    this.socketIo = socketIo(this.httpServer)
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
    this.httpServer.listen(this.portInUse, (err) => {
      if(err) {
        return this.logger.err(err, `cannot listen to port ${this.portInUse}`)
      }
    })
    this.logger.info(`listening on ${this.portInUse}`)

    this.socketIo.on(socketEvents.connect, (socket: any) => {
      this.logger.info(`Connected client on port ${this.port}`)

      socket.on(socketEvents.disconnect, () => {
        this.logger.info('Client disconnected')
      })
    })

    this.gameInstance = createGame(this.logger)
    setApiService(this.socketIo, this.logger, this.gameInstance.events)

    return this
  }

  public serveStatic(dir: string) {
    this.logger.info(`serving static files at ${dir}`)
    this.appInstance.use(express.static(dir))
    return this
  }
}
