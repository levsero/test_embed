const { teardown: teardownDevServer } = require('jest-dev-server')
const { teardown: teardownPuppeteer } = require('jest-environment-puppeteer')
const { shutdown } = require('./env')

module.exports = async function globalTeardown(globalConfig) {
  shutdown()
  await teardownPuppeteer(globalConfig)
  await teardownDevServer()
}
