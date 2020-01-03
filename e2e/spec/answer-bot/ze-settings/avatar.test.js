import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { waitForAnswerBot } from 'e2e/helpers/answer-bot-embed'
import { queries, wait } from 'pptr-testing-library'

test('uses the supplied avatar values', async () => {
  await loadWidget()
    .withPresets('answerBot')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          answerBot: {
            avatar: {
              url: '/e2e/fixtures/files/large-attachment.jpg',
              name: {
                '*': 'Wildcard name',
                fr: 'French name'
              }
            }
          }
        }
      }
    })
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  const doc = await widget.getDocument()
  const avatar = await queries.getByAltText(doc, 'avatar')
  const src = await avatar.getProperty('src')
  expect(await src.jsonValue()).toEqual(
    'http://localhost:5123/e2e/fixtures/files/large-attachment.jpg'
  )
  const name = await queries.queryByText(doc, 'Wildcard name')
  expect(name).toBeTruthy()
  await page.evaluate(() => zE('webWidget', 'setLocale', 'fr'))
  await wait(async () => {
    expect(await queries.queryByText(doc, 'French name')).toBeTruthy()
  })
})
