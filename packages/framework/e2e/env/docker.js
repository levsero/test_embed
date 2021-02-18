const fs = require('fs')
const { execSync } = require('child_process')

const useDocker = process.env.USE_DOCKER === 'true'

const config = useDocker && JSON.parse(fs.readFileSync('docker-chromium'))

const getHost = () => {
  if (useDocker && (config.mode === 'vbox' || config.mode === 'dfm')) {
    return 'host.docker.internal'
  }
  return 'localhost'
}

/* eslint-disable no-console */
const stopContainer = () => {
  console.log(`Stopping docker container ${config.container}...`)
  execSync(`docker stop ${config.container}`)
  console.log('Stopped docker container')
  fs.unlinkSync('docker-chromium')
  console.log('Deleted docker-chromium file')
}
/* eslint-enable no-console */

const getWsEndpoint = () => config.wsEndpoint

module.exports = {
  useDocker,
  stopContainer,
  getHost,
  getWsEndpoint,
}
