import { ILogger } from '../../common/src/services'
import Client from './client'

export default function(window: Window, logger: ILogger, client: Client) {
  client
   .setup()
   .then(() => client.collectPlayerInfo())
   .then(() => client
    .connectToGame()
    .catch((err) => {
      client.noticer.error(err, client.errorTypes.GAME_CONNECT_FAIL)
    }))
}
