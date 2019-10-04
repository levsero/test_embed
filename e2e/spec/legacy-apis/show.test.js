import widgetPage from 'helpers/widget-page'
import widget from 'helpers/widget'
import launcher from 'helpers/launcher'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter')
})

test('api shows the widget and hides the launcher', async () => {
  await page.evaluate(() => zE.show())
  await expect(launcher).toBeVisible()
  await expect(widget).toBeHidden()
})

test('api does nothing when widget is already open', async () => {
  await launcher.click()
  await page.evaluate(() => zE.show())
  await expect(launcher).toBeHidden()
  await expect(widget).toBeVisible()
})

test('api shows the widget after hide', async () => {
  await page.evaluate(() => zE.hide())
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
  await page.evaluate(() => zE.show())
  await expect(launcher).toBeVisible()
  await expect(widget).toBeHidden()
})
