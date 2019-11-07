import launcher from 'e2e/helpers/launcher'
import widgetPage from 'e2e/helpers/widget-page'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter')
})

test('callback is called when launcher is clicked', async () => {
  await page.evaluate(() => {
    zE('webWidget:on', 'open', () => {
      window.onOpenCalled = true
    })
  })

  await launcher.click()
  const result = await page.evaluate(() => window.onOpenCalled)
  expect(result).toEqual(true)
})

test('callback is called when widget is opened via api', async () => {
  await page.evaluate(() => {
    zE('webWidget:on', 'open', () => {
      window.onOpenCalledWithApi = true
    })
  })
  await page.evaluate(() => zE('webWidget', 'open'))
  const result = await page.evaluate(() => window.onOpenCalledWithApi)
  expect(result).toEqual(true)
})
