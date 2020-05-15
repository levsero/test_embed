const { setup: setupPuppeteer } = require('jest-environment-puppeteer')
const { setup: setupDevServer } = require('jest-dev-server')

module.exports = async function globalSetup(globalConfig) {
  await setupPuppeteer(globalConfig)
  await setupDevServer({
    command: 'npm run e2e:server',
    usedPortAction: 'ignore',
    launchTimeout: 15000,
    host: '0.0.0.0',
    port: 5123,
    debug: true
  })
}
