import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'

const buildWidget = () => loadWidget().withPresets('helpCenter')

test('callback is called when launcher is clicked', async () => {
  await buildWidget()
    .evaluateOnNewDocument(() => {
      zE('webWidget:on', 'open', () => {
        window.onOpenCalled = true
      })
    })
    .load()

  await launcher.click()
  const result = await page.evaluate(() => window.onOpenCalled)
  expect(result).toEqual(true)
})

test('callback is called when widget is opened via api', async () => {
  await buildWidget()
    .evaluateOnNewDocument(() => {
      zE('webWidget:on', 'open', () => {
        window.onOpenCalledWithApi = true
      })
    })
    .load()
  await page.evaluate(() => zE('webWidget', 'open'))
  const result = await page.evaluate(() => window.onOpenCalledWithApi)
  expect(result).toEqual(true)
})

test('callback is called when widget is opened via toggle API', async () => {
  await buildWidget()
    .evaluateOnNewDocument(() => {
      zE('webWidget:on', 'open', () => {
        window.onOpenCalledWithApi = true
      })
    })
    .load()

  await page.evaluate(() => zE('webWidget', 'toggle'))
  const result = await page.evaluate(() => window.onOpenCalledWithApi)

  expect(result).toEqual(true)
})
