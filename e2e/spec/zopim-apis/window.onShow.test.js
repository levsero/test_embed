import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
})

test('callback is called when widget is opened', async () => {
  await page.evaluate(() => {
    $zopim.livechat.window.onShow(() => (window.onOpenCalled = true))
  })

  await launcher.click()
  const result = await page.evaluate(() => window.onOpenCalled)
  expect(result).toEqual(true)
})
