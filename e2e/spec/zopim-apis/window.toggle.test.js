import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'

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
