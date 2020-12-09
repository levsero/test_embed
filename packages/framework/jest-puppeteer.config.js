const { jestConfig } = require('./e2e/env')

module.exports = {
  runner: 'groups',
  rootDir: './e2e',
  moduleDirectories: ['node_modules', './'],
  preset: 'jest-puppeteer',
  globalSetup: './puppeteer.setup.js',
  globalTeardown: './puppeteer.teardown.js',
  setupFilesAfterEnv: ['expect-puppeteer', './setup.js'],
  ...jestConfig()
}
