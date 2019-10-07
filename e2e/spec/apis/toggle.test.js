import widgetPage from 'helpers/widget-page'
import widget from 'helpers/widget'
import launcher from 'helpers/launcher'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter')
})

test('api toggles the widget visibility', async () => {
  await page.evaluate(() => zE('webWidget', 'toggle'))
  await expect(launcher).toBeHidden()
  await expect(widget).toBeVisible()
  expect(await page.evaluate(() => zE('webWidget:get', 'display'))).toEqual('helpCenter')
  await page.evaluate(() => zE('webWidget', 'toggle'))
  await expect(launcher).toBeVisible()
  await expect(widget).toBeHidden()
  expect(await page.evaluate(() => zE('webWidget:get', 'display'))).toEqual('launcher')
})

test('widget toggles to launcher when it is initially open', async () => {
  await launcher.click()
  await page.evaluate(() => zE('webWidget', 'toggle'))
  await expect(widget).toBeHidden()
  await expect(launcher).toBeVisible()
})
