const getElementHTML = element => {
  return page.evaluate(el => {
    if (!el || typeof el.cloneNode !== 'function') {
      return '<unable to find expected element>'
    }

    // cloneNode(false) copies the element, but not its children
    // so outerHTML will only contain the HTML of the element itself
    return el.cloneNode(false).outerHTML
  }, element)
}

// getElement is a helper function to allow custom matchers to pass in either
// - A string selector, e.g. 'div.someClass'
// - A custom element object that has a 'selector' property, e.g. launcher and widget objects
// - A puppeteer element, retrieved through something like () => page.waitForSelector('div.someClass')
const getElement = async element => {
  if (typeof element === 'string') {
    return page.waitForSelector(element)
  }

  if (Boolean(element) && typeof element === 'object' && typeof element.selector === 'string') {
    return page.waitForSelector(element.selector)
  }

  return element
}

export { getElementHTML, getElement }
