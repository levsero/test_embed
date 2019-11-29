import { queries, wait } from 'pptr-testing-library'
import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'

test('can update title by api', async () => {
  await widgetPage.loadWithConfig('helpCenter', mockSearchEndpoint())
  await page.evaluate(() => {
    zE('webWidget', 'updateSettings', {
      webWidget: {
        helpCenter: {
          title: {
            '*': 'Search our Help Center',
            fr: "Cherchez dans le centre d'aide"
          }
        }
      }
    })
  })
  await launcher.click()

  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Search our Help Center')).toBeTruthy()
  })
  await page.evaluate(() => {
    zE('webWidget', 'setLocale', 'fr')
  })
  await wait(async () => {
    expect(await queries.queryByText(doc, "Cherchez dans le centre d'aide")).toBeTruthy()
  })
})
