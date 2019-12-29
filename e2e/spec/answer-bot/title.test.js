import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page/fluent'
import widget from 'e2e/helpers/widget'

test('updates the title', async () => {
  await loadWidget()
    .withPresets('answerBot')
    .evaluateOnNewDocument(() => {
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
    })
    .load()
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
