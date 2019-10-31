import widgetPage from 'helpers/widget-page'
import launcher from 'helpers/launcher'
import widget from 'helpers/widget'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter')
})

test('api hides the widget', async () => {
  await page.evaluate(() => zE('webWidget', 'hide'))
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})

test('api hides an opened widget', async () => {
  await launcher.click()
  await page.evaluate(() => zE('webWidget', 'hide'))
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})

test('calling api multiple times is a no-op', async () => {
  await page.evaluate(() => zE('webWidget', 'hide'))
  await page.evaluate(() => zE('webWidget', 'hide'))
  await page.evaluate(() => zE('webWidget', 'hide'))
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})