import { goToTestPage, failOnConsoleError } from 'e2e/helpers/utils'
import { wait } from 'pptr-testing-library'

const noEmbeds = {
  locale: 'en-us',
  brand: 'helloworld',
  color: '#eeeeee',
  embeds: {}
}

test('page view blip is still fired when there are no embeds', async () => {
  await jestPuppeteer.resetPage()
  await page.setRequestInterception(true)
  failOnConsoleError()
  const blipReceived = jest.fn()

  await page.on('request', request => {
    if (request.url().includes('config')) {
      request.respond({
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(noEmbeds)
      })
    } else if (request.url().includes('embeddable_blip?type=pageView')) {
      request.respond({
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'text/html',
        body: ''
      })
      blipReceived()
    } else {
      request.continue()
    }
  })
  await goToTestPage()
  await page.waitForFunction(`window.zE`)
  await page.evaluate(() => {
    localStorage['ZD-debug'] = true
  })
  page.waitFor(2000)
  await wait(() => {
    expect(blipReceived).toHaveBeenCalled()
  })
})
