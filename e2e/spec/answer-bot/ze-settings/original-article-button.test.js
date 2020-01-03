import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import {
  search,
  waitForAnswerBot,
  mockInteractionEndpoint,
  mockViewedEndpoint
} from 'e2e/helpers/answer-bot-embed'
import { queries, wait } from 'pptr-testing-library'

test('hides the original article link', async () => {
  await loadWidget()
    .withPresets('answerBot')
    .intercept(mockInteractionEndpoint())
    .intercept(mockViewedEndpoint())
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          helpCenter: {
            originalArticleButton: false
          }
        }
      }
    })
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()

  const doc = await widget.getDocument()
  await search('Help')
  await wait(() => queries.getByText(doc, 'Here are some articles that may help:'))
  const link = await queries.getByText(doc, 'The second article')
  await link.click()
  await queries.getByText(doc, 'body of second article')
  const originalArticleLink = await queries.queryByTitle(doc, 'View original article')
  expect(originalArticleLink).toBeNull()
})
