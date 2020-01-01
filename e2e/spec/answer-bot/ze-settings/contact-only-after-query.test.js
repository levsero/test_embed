import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { mockInteractionEndpoint, waitForAnswerBot, search } from 'e2e/helpers/answer-bot-embed'
import { queries, wait } from 'pptr-testing-library'

test('only show get in touch button after query', async () => {
  await loadWidget()
    .withPresets('answerBot', 'contactForm')
    .intercept(mockInteractionEndpoint())
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          answerBot: {
            contactOnlyAfterQuery: true
          }
        }
      }
    })
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await page.waitFor(3000)
  const doc = await widget.getDocument()
  let button = await queries.queryByText(doc, 'Get in touch')
  expect(button).toBeNull()
  await search('help')
  await wait(() => queries.getByText(doc, 'Here are some articles that may help:'))
  await page.waitFor(3000)
  await wait(() => queries.getByText(doc, 'Or you can get in touch.'))
  button = await queries.queryByText(doc, 'Get in touch')
  expect(button).toBeTruthy()
})
