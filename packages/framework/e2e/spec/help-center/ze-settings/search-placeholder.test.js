import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries, wait } from 'pptr-testing-library'

test('can update search placeholder by api', async () => {
  await loadWidget().withPresets('helpCenter').intercept(mockSearchEndpoint()).load()
  await page.evaluate(() => {
    zE('webWidget', 'updateSettings', {
      webWidget: {
        helpCenter: {
          searchPlaceholder: {
            '*': 'Search our Help Center',
            fr: "Cherchez dans le centre d'aide",
          },
        },
      },
    })
  })
  await launcher.click()

  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByPlaceholderText(doc, 'Search our Help Center')).toBeTruthy()
  })
  await page.evaluate(() => {
    zE('webWidget', 'setLocale', 'fr')
  })
  await wait(async () => {
    expect(await queries.queryByPlaceholderText(doc, "Cherchez dans le centre d'aide")).toBeTruthy()
  })
})
