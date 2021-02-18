import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import {
  search,
  waitForAnswerBot,
  mockInteractionEndpoint,
  mockViewedEndpoint,
} from 'e2e/helpers/answer-bot-embed'
import { queries } from 'pptr-testing-library'

test('hides the original article link', async () => {
  await loadWidget()
    .withPresets('answerBot')
    .intercept(mockInteractionEndpoint())
    .intercept(mockViewedEndpoint())
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          helpCenter: {
            originalArticleButton: false,
          },
        },
      }
    })
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await search('Help')
  await widget.waitForText('Here are some articles that may help:')
  await widget.clickText('The second article')
  await widget.waitForText('body of second article')
  const originalArticleLink = await queries.queryByTitle(
    await widget.getDocument(),
    'View original article'
  )
  expect(originalArticleLink).toBeNull()
})
