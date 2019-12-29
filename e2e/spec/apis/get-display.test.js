import loadWidget from 'e2e/helpers/widget-page/fluent'
import launcher from 'e2e/helpers/launcher'

beforeEach(async () => {
  await loadWidget('helpCenter')
})

test('returns launcher when launcher is visible', async () => {
  const result = await page.evaluate(() => zE('webWidget:get', 'display'))
  expect(result).toEqual('launcher')
})

test('returns the active embed when the widget is open', async () => {
  await launcher.click()
  const result = await page.evaluate(() => zE('webWidget:get', 'display'))
  expect(result).toEqual('helpCenter')
})

test('returns hidden when whole widget is hidden', async () => {
  await page.evaluate(() => zE('webWidget', 'hide'))
  const result = await page.evaluate(() => zE('webWidget:get', 'display'))
  expect(result).toEqual('hidden')
})
