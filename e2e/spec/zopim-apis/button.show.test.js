import widgetPage from 'helpers/widget-page'
import launcher from 'helpers/launcher'
import widget from 'helpers/widget'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
})

test('api shows the launcher after it is hidden', async () => {
  await page.evaluate(() => $zopim.livechat.button.hide())
  await page.evaluate(() => $zopim.livechat.button.show())
  await expect(widget).toBeHidden()
  await expect(launcher).toBeVisible()
})
