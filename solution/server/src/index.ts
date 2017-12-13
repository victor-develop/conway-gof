import Server from './server'
import { logger } from './helpers'
import { config } from './config/config'

const defaultPort = '8080'
const port = (process.env.PORT) || defaultPort
const server = new Server(logger, port).boot()

if (config.serveStatic) {
  server.serveStatic(config.staticDir)
}
