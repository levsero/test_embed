import loadWidget from 'e2e/helpers/widget-page/fluent'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'

beforeEach(async () => {
  await loadWidget('helpCenter')
})

test('api shows the widget and hides the launcher', async () => {
  await page.evaluate(() => zE('webWidget', 'show'))
  await expect(launcher).toBeVisible()
  await expect(widget).toBeHidden()
})

test('api does nothing when widget is already open', async () => {
  await launcher.click()
  await page.evaluate(() => zE('webWidget', 'show'))
  await expect(launcher).toBeHidden()
  await expect(widget).toBeVisible()
})

test('api shows the widget after hide', async () => {
  await page.evaluate(() => zE('webWidget', 'hide'))
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
  await page.evaluate(() => zE('webWidget', 'show'))
  await expect(launcher).toBeVisible()
  await expect(widget).toBeHidden()
})
