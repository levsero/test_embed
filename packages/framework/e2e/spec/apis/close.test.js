import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'

beforeEach(async () => {
  await loadWidget('helpCenter')
})

test('api hides the widget and shows the launcher', async () => {
  await page.evaluate(() => zE('webWidget', 'open'))
  await page.evaluate(() => zE('webWidget', 'close'))
  await expect(widget).toBeHidden()
  await expect(launcher).toBeVisible()
})
