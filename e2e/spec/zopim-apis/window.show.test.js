import widgetPage from 'helpers/widget-page'
import launcher from 'helpers/launcher'
import widget from 'helpers/widget'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
})

test('api opens the widget', async () => {
  await page.evaluate(() => $zopim.livechat.window.show())

  await expect(widget).toBeVisible()
  await expect(launcher).toBeHidden()
})

test('api shows the widget in opened state when the whole widget is initially hidden', async () => {
  await page.evaluate(() => $zopim.livechat.window.hide())
  await page.evaluate(() => $zopim.livechat.window.show())
  await expect(widget).toBeVisible()
  await expect(launcher).toBeHidden()
})
