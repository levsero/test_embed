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

// getElement is a helper function to allow users of custom matchers to pass in either
// - A string selector, e.g. 'div.someClass'
// - A custom element object that has a 'selector' property, e.g. launcher and widget objects
// - A puppeteer element, retrieved through something like () => page.waitForSelector('div.someClass')
const getElement = async element => {
  if (typeof element === 'string') {
    return page.waitForSelector(element, { timeout: 5000 })
  }

  if (typeof element === 'object' && typeof element.selector === 'string') {
    return page.waitForSelector(element.selector, { timeout: 5000 })
  }

  return element
}

const toHaveFocus = async function(maybeElement) {
  const element = await getElement(maybeElement)

  const isFocused = await page.evaluate(el => document.activeElement === el, element)
  const activeElement = await page.evaluate(() => {
    if (!document.activeElement) {
      return '<no element was focused>'
    }

    return document.activeElement.cloneNode(false).outerHTML
  })

  const expectedElement = await page.evaluate(el => {
    if (!el || typeof el.cloneNode !== 'function') {
      return '<unable to find expected element>'
    }

    return el.cloneNode(false).outerHTML
  }, element)

  const condition = this.isNot ? 'not to be' : 'to be'

  const errorMessage = `\n\nExpected element\n\n${expectedElement}\n\nActual element\n\n${activeElement}`

  if (isFocused) {
    return {
      message: () => `expected element ${condition} focused.${this.isNot ? errorMessage : ''}`,
      pass: true
    }
  }

  return {
    message: () => `expected element ${condition} focused.${!this.isNot ? errorMessage : ''}`,
    pass: false
  }
}

expect.extend({
  toBeVisible(selector) {
    return waitForSelector(selector, 'visible')
  },
  toBeHidden(selector) {
    return waitForSelector(selector, 'hidden')
  },
  toHaveFocus
})

process.on('unhandledRejection', function(err, promise) {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').') // eslint-disable-line no-console
})
