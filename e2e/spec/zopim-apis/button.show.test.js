import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
})

test('api shows the launcher after it is hidden', async () => {
  await page.evaluate(() => $zopim.livechat.button.hide())
  await page.evaluate(() => $zopim.livechat.button.show())
  await expect(widget).toBeHidden()
  await expect(launcher).toBeVisible()
})
