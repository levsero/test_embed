const NodeEnvironment = require('jest-environment-node');
const { setup: setupDevServer } = require('jest-dev-server');
const { teardown: teardownDevServer } = require('jest-dev-server');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    // Get a reference to Jest global browser instance as specified in puppeteer.setup.js
    this.global.puppeteerBrowser = global.__BROWSER_GLOBAL__;

    this.global.puppeteerTimeout = 30000;
    const devServerPort = 5000;
    const devServerHost = '0.0.0.0';

    this.global.puppeteerDevServer = `http://${devServerHost}:${devServerPort}`;

    if (process.env.NODE_ENV === 'ci')
    {
      await setupDevServer({
        command: 'npm run e2e:server',
        launchTimeout: 50000,
        host: devServerHost, // waits for the domain to be available before running tests
        port: devServerPort
      });
    }
  }

  async teardown() {
    await teardownDevServer();
    await super.teardown();
  }
}

module.exports = PuppeteerEnvironment;
