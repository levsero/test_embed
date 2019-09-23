import { embeddableConfigResponse } from '../fixtures/widget-config-response'

export function goToTestPage() {
  page.goto('http://localhost:5123/e2e.html')
}

export function defaultRequestHandler(request) {
  const url = request.url()
  if (url.includes('embeddable_blip')) {
    request.respond({
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      contentType: 'text/html',
      body: ''
    })
    return true
  }
}

export async function loadPageWithWidget(response = embeddableConfigResponse) {
  await jestPuppeteer.resetPage()
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (defaultRequestHandler(request)) {
      return
    } else if (request.url().includes('config')) {
      request.respond(response)
    } else {
      request.continue()
    }
  })
  await goToTestPage()
  await page.waitForSelector('iframe#launcher')
}
