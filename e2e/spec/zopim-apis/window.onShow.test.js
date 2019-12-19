import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'chat')
  await zChat.online()
})

test('callback is called when widget is opened', async () => {
  await page.evaluate(() => {
    $zopim.livechat.window.onShow(() => (window.onOpenCalled = true))
  })

  await launcher.click()
  const result = await page.evaluate(() => window.onOpenCalled)
  expect(result).toEqual(true)
})
