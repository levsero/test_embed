import widgetPage from 'helpers/widget-page'
import launcher from 'helpers/launcher'
import widget from 'helpers/widget'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
})

test('toggles the widget from hidden to visible', async () => {
  await page.evaluate(() => $zopim.livechat.window.toggle())

  await expect(launcher).toBeHidden()
  await expect(widget).toBeVisible()
  await page.evaluate(() => $zopim.livechat.window.toggle())
  await expect(launcher).toBeVisible()
  await expect(widget).toBeHidden()
})
