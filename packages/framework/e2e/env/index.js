const { useDocker, stopContainer, getHost, getWsEndpoint } = require('./docker')
const { useParallel, limitTests } = require('./ci')

let host = 'localhost'
const port = 5123
let headless = process.env.HEADLESS !== 'false'

// when using docker, reassign these values
if (useDocker) {
  headless = true
  host = getHost()
}

const shutdown = () => {
  if (useDocker) {
    stopContainer()
  }
}

const jestConfig = () => {
  const options = {
    launch: {
      headless,
    },
  }

  if (useDocker) {
    options.connect = {
      browserWSEndpoint: getWsEndpoint(),
    }
  }

  if (useParallel) {
    options.testMatch = limitTests()
  }

  return options
}

module.exports = {
  hostWithPort: `${host}:${port}`,
  port,
  shutdown,
  jestConfig,
  headless,
}
