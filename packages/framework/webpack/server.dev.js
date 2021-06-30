const express = require('express')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const { merge } = require('webpack-merge')
const { execSync } = require('child_process')

const VERSION = execSync(
  `cat ${path.resolve(__dirname, '../../../REVISION')} || git rev-parse HEAD`
)
  .toString()
  .trim()
const PORT = 1337
const STATIC_ASSETS_DOMAIN = process.env.STATIC_ASSETS_DOMAIN || `localhost:${PORT}`

const projectRoot = path.resolve(__dirname, '../')
const versions = ['latest', VERSION]
const app = express()
const configBase = require('./webpack.ac.dev')()

const configs = versions.map((version) => {
  return merge(configBase, {
    output: {
      path: path.resolve(projectRoot, `dist/public/${version}`),
      publicPath: `${STATIC_ASSETS_DOMAIN}/web_widget/${version}/`,
    },
  })
})

configs.forEach((config) => {
  app.use(
    webpackDevMiddleware(webpack(config), {
      publicPath: config.output.publicPath,
    })
  )
})

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`\nApp listening on port ${PORT}!`)
  console.log(`Versions available: ${versions.join(', ')}\n`)
  /* eslint-enable no-console */
})
