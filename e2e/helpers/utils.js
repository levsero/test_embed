import { queries } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'

export function goToTestPage() {
  page.goto('http://localhost:5123/e2e.html')
}

export function failOnConsoleError() {
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.location().url.includes('rollbar')) {
      fail(`Console error detected: ${msg.text()}`)
    }
  })
}

export const assertInputValue = async (label, value) => {
  const doc = await widget.getDocument()
  const input = await queries.getByLabelText(doc, label)
  const valueHandle = await input.getProperty('value')
  expect(await valueHandle.jsonValue()).toEqual(value)
}
