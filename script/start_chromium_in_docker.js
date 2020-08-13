#!/usr/bin/env node
const { exec } = require('child_process')
const rest = require('rest')
const fs = require('fs')

/* eslint-disable no-console */
const fetchVersion = async mode => {
  try {
    const dockerHost = mode === 'vbox' ? process.env.DOCKER_HOST_IP : 'localhost'
    console.log('Connecting to', dockerHost)
    const response = await rest(`http://${dockerHost}:9222/json/version`)
    if (response.status.code !== 200) {
      return false
    }
    return JSON.parse(response.entity)
  } catch (_e) {
    return false
  }
}

const wait = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const waitForConnection = async (id, mode) => {
  const attempts = 3
  for (let i = 0; i < attempts; i++) {
    console.log('Attempt: ', i + 1)
    const result = await fetchVersion(mode)
    if (result) {
      const output = {
        mode,
        container: id,
        wsEndpoint: result.webSocketDebuggerUrl
      }
      fs.writeFileSync('docker-chromium', JSON.stringify(output))
      console.log('Container ready')
      return
    }
    console.log('Try again in 5s')
    await wait(5000)
  }
  exit('Could not connect to Chrome in Docker')
}

console.log('Starting headless Chrome browser in Docker')

const dockerCommand = mode => {
  let addHost = '--net=host'
  if (mode === 'vbox') {
    addHost = '--add-host="host.docker.internal:10.0.2.2"'
  } else if (mode === 'dfm') {
    addHost = ''
  }
  return `docker container run ${addHost} -d -p 9222:9222 zenika/alpine-chrome --no-sandbox --remote-debugging-address=0.0.0.0 --remote-debugging-port=9222`
}

const startContainer = mode => {
  console.log('Mode:', mode)
  exec(dockerCommand(mode), async (error, stdout) => {
    if (error) {
      exit(error)
    }
    const containerId = stdout.trim()
    await waitForConnection(containerId, mode)
  })
}

const exit = error => {
  console.error(error)
  process.exit(1)
}

const run = () => {
  exec('docker ps', err => {
    if (err) {
      exit('Docker is not available, exiting.')
    }
    if (process.env.DOCKER_FOR_MAC_ENABLED === 'true') {
      startContainer('dfm')
    } else {
      exec('vboxmanage list runningvms', err => {
        const mode = err ? 'docker' : 'vbox'
        startContainer(mode)
      })
    }
  })
}

run()
