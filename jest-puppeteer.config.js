module.exports = {
  rootDir: './e2e',
  moduleDirectories: ['node_modules', 'e2e'],
  preset: 'jest-puppeteer',
  globalSetup: './puppeteer.setup.js',
  globalTeardown: './puppeteer.teardown.js',
  setupFilesAfterEnv: ['./setup.js']
}
