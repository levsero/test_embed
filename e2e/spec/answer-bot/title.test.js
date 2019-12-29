import { queries, wait } from 'pptr-testing-library'
import widgetPage from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { mockEmbeddableConfigEndpoint } from 'e2e/helpers/widget-page/embeddable-config'

test('updates the title', async () => {
  await widgetPage.load({
    mockRequests: [mockEmbeddableConfigEndpoint('answerBot')],
    preload: () => {
      window.zESettings = {
        webWidget: {
          answerBot: {
            title: {
              '*': 'answer bot title fallback',
              fr: 'french ab title'
            }
          }
        }
      }
    }
  })
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'answer bot title fallback')).toBeTruthy()
  })
  await page.evaluate(() => {
    zE('webWidget', 'setLocale', 'fr')
  })
  await wait(async () => {
    expect(await queries.queryByText(doc, 'french ab title')).toBeTruthy()
  })
})
