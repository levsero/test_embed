import widgetPage from 'helpers/widget-page'
import widget from 'helpers/widget'
import launcher from 'helpers/launcher'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter')
})

test('api hides the widget and shows the launcher', async () => {
  await page.evaluate(() => zE('webWidget', 'open'))
  await page.evaluate(() => zE('webWidget', 'close'))
  await expect(widget).toBeHidden()
  await expect(launcher).toBeVisible()
})
