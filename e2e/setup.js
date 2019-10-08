import 'expect-puppeteer'

jest.setTimeout(30000)

const waitForSelector = async (selector, prop) => {
  if (typeof selector === 'object' && typeof selector.selector === 'string') {
    selector = selector.selector
  }
  try {
    await page.waitForSelector(selector, {
      [prop]: true,
      timeout: 5000 // wait for 5 seconds
    })
    return {
      message: () => `expected ${selector} to be ${prop}`,
      pass: true
    }
  } catch (e) {
    return {
      message: () => `expected ${selector} to be ${prop}, but it is not`,
      pass: false
    }
  }
}

expect.extend({
  toBeVisible(selector) {
    return waitForSelector(selector, 'visible')
  },
  toBeHidden(selector) {
    return waitForSelector(selector, 'hidden')
  }
})

process.on('unhandledRejection', function(err, promise) {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').') // eslint-disable-line no-console
})
