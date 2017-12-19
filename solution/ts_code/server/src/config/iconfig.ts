export interface IConfig {
  serveStatic: boolean
  staticDir: string
  serverURL: string
  game: {
    evolveInterval: number,
    boardWidth: number,
    boardHeight: number,
  }
}
