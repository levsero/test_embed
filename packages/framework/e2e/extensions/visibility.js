const waitForSelector = async (maybeSelector, prop) => {
  let selector = maybeSelector
  if (typeof maybeSelector === 'object' && typeof maybeSelector.selector === 'string') {
    selector = maybeSelector.selector
  }
  try {
    await page.waitForSelector(selector, {
      [prop]: true,
      timeout: 5000, // wait for 5 seconds
    })
    return {
      message: () => `expected ${selector} to be ${prop}`,
      pass: true,
    }
  } catch (e) {
    return {
      message: () => `expected ${selector} to be ${prop}, but it is not`,
      pass: false,
    }
  }
}

const toBeVisible = (selector) => waitForSelector(selector, 'visible')
const toBeHidden = (selector) => waitForSelector(selector, 'hidden')

export { toBeVisible, toBeHidden }
