const puppeteer = require('puppeteer')

// Jest environment setup, store Puppeteer browser instance in Jest global
// This global is not accessible in the test suite.
module.exports = async function() {
  const browser = await puppeteer.launch({ headless: true, devtools: false })

  global.__BROWSER_GLOBAL__ = browser
}
