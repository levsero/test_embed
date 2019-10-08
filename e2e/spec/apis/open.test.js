import widgetPage from 'helpers/widget-page'
import widget from 'helpers/widget'
import launcher from 'helpers/launcher'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter')
})

test('api opens the widget and hides the launcher', async () => {
  await page.evaluate(() => zE('webWidget', 'open'))
  await expect(widget).toBeVisible()
  await expect(launcher).toBeHidden()
})
