import widgetPage from 'helpers/widget-page'
import launcher from 'helpers/launcher'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
})

test('api returns false when launcher is visible', async () => {
  expect(await page.evaluate(() => $zopim.livechat.window.getDisplay())).toEqual(false)
})

test('api returns true when widget is open', async () => {
  await launcher.click()
  expect(await page.evaluate(() => $zopim.livechat.window.getDisplay())).toEqual(true)
})
