import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
})

test('callback is called when widget is closed', async () => {
  await page.evaluate(() => {
    $zopim.livechat.window.onHide(() => (window.onCloseCalled = true))
  })

  await launcher.click()
  await widget.clickClose()
  const result = await page.evaluate(() => window.onCloseCalled)
  expect(result).toEqual(true)
})
