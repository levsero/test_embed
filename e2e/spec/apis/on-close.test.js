import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import widgetPage from 'e2e/helpers/widget-page'
import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter')
})

test('callback is called when widget is closed', async () => {
  await page.evaluate(() => {
    zE('webWidget:on', 'close', () => {
      window.onCloseCalled = true
    })
  })

  await launcher.click()
  await waitForHelpCenter()
  await widget.clickClose()
  const result = await page.evaluate(() => window.onCloseCalled)
  expect(result).toEqual(true)
})

test('callback is called when widget is closed via api', async () => {
  await page.evaluate(() => {
    zE('webWidget:on', 'close', () => {
      window.onCloseCalledWithApi = true
    })
  })
  await page.evaluate(() => zE('webWidget', 'open'))
  await page.evaluate(() => zE('webWidget', 'close'))
  const result = await page.evaluate(() => window.onCloseCalledWithApi)
  expect(result).toEqual(true)
})
