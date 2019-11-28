import { queries, wait } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'

export function goToTestPage() {
  page.goto('http://localhost:5123/e2e.html')
}

export function mockBlipEndpoint(request) {
  if (!request.url().includes('embeddable_blip')) {
    return false
  }

  if (!request.url().includes('embeddable_identify')) {
    return false
  }

  request.respond({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentType: 'text/html',
    body: ''
  })
}

export function failOnConsoleError() {
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.location().url.includes('rollbar')) {
      fail(`Console error detected: ${msg.text()}`)
    }
  })
}

export const waitForHelpCenter = async () => {
  const doc = await widget.getDocument()
  await wait(() => queries.getByPlaceholderText(doc, 'How can we help?'))
}
