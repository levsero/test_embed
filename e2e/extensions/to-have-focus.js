import { getElementHTML, getElement } from './helpers'

const toHaveFocus = async function(maybeElement) {
  const element = await getElement(maybeElement)

  const isFocused = await page.evaluate(el => document.activeElement === el, element)
  const activeElement = await page.evaluate(() => {
    if (!document.activeElement) {
      return '<no element was focused>'
    }

    return document.activeElement.cloneNode(false).outerHTML
  })

  const expectedElement = await getElementHTML(element)

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

export default toHaveFocus
