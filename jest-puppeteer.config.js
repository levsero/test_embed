const parallelism = require('ci-parallel-vars')
const chunkd = require('chunkd')

const limitTests = () => {
  // JEST_TESTS env var is the console output of `npm run e2e --listTests --json`
  let tests = process.env.JEST_TESTS
  // the console output contains some extra lines that we want to ignore before
  // we can parse the JSON input.
  tests = tests.split('\n').filter(line => line.startsWith('['))
  // sort the files so that the list is deterministic
  tests = JSON.parse(tests[0]).sort((a, b) => {
    return b.localeCompare(a)
  })
  tests = chunkd(tests, parallelism.index, parallelism.total)
  return { testMatch: tests }
}

const options = parallelism && !process.env.SKIP_PARALLEL ? limitTests() : {}

module.exports = {
  rootDir: './e2e',
  moduleDirectories: ['node_modules', './'],
  preset: 'jest-puppeteer',
  globalSetup: './puppeteer.setup.js',
  globalTeardown: './puppeteer.teardown.js',
  setupFilesAfterEnv: ['expect-puppeteer', './setup.js'],
  launch: {
    headless: process.env.HEADLESS !== 'false'
  },
  ...options
}
