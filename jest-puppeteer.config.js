module.exports = {
  rootDir: './e2e',
  moduleDirectories: ['node_modules', './'],
  preset: 'jest-puppeteer',
  globalSetup: './puppeteer.setup.js',
  globalTeardown: './puppeteer.teardown.js',
  setupFilesAfterEnv: ['expect-puppeteer', './setup.js'],
  launch: {
    headless: process.env.HEADLESS !== 'false'
  }
}
