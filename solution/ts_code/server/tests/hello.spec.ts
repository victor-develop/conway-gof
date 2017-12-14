import 'mocha'
import * as assert from 'assert'
import * as supertest from 'supertest'
import ILogger from '../../common/ilogger'
import Server from '../src/server'
import { config } from '../src/config/config'
import * as cheerio from 'cheerio'

const testPort = '3000'
const testLogger: ILogger = { info: console.log }
const bootServer = () => new Server(testLogger,testPort)

describe('Everything', () => {
  const successCode: number = 200
  it('should have hello world message at /hello-world', (done) => {
    supertest(bootServer().app)
          .get('/hello-world')
          .expect('Content-Type', /json/)
          .expect(successCode)
          .expect((res) => {
            testLogger.info(res.body)
            assert.deepEqual(res.body, { message: 'Hello World' })
          })
          .end((err, res) => {
            done(err)
          })
  })
  it('should see static page hello world at /static.html', (done) => {
    const server = bootServer().serveStatic(config.staticDir)
    supertest(server.app)
    .get('/static.html')
    .expect(successCode)
    .expect((res) => {
      const dom = cheerio.load(res.text)
      const h1text = dom('h1').text()
      assert.equal(h1text, 'Static page: Hello World.')
    })
    .end((err, res) => {
      done(err)
    })
  })
})
