import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'

const buildWidget = () => loadWidget().withPresets('helpCenter')

test('callback is called when widget is closed', async () => {
  await buildWidget()
    .evaluateAfterSnippetLoads(() => {
      zE('webWidget:on', 'close', () => {
        window.onCloseCalled = true
      })
    })
    .load()

  await launcher.click()
  await waitForHelpCenter()
  await widget.clickClose()
  const result = await page.evaluate(() => window.onCloseCalled)
  expect(result).toEqual(true)
})

test('callback is called when widget is closed via api', async () => {
  await buildWidget()
    .evaluateAfterSnippetLoads(() => {
      zE('webWidget:on', 'close', () => {
        window.onCloseCalledWithApi = true
      })
    })
    .load()
  await page.evaluate(() => zE('webWidget', 'open'))
  await page.evaluate(() => zE('webWidget', 'close'))
  const result = await page.evaluate(() => window.onCloseCalledWithApi)
  expect(result).toEqual(true)
})

test('callback is called when widget is closed via toggle API', async () => {
  await buildWidget()
    .evaluateAfterSnippetLoads(() => {
      zE('webWidget:on', 'close', () => {
        window.onClosedCalledWithApi = true
      })
    })
    .load()

  await page.evaluate(() => zE('webWidget', 'open'))
  await page.evaluate(() => zE('webWidget', 'toggle'))
  const result = await page.evaluate(() => window.onClosedCalledWithApi)

  expect(result).toEqual(true)
})
