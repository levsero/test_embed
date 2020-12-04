/**
 * @group visual-regressions
 */
import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import {
  search,
  waitForAnswerBot,
  mockInteractionEndpoint,
  mockViewedEndpoint,
  mockRejectionEndpoint
} from 'e2e/helpers/answer-bot-embed'
import { assertScreenshot } from 'e2e/helpers/visual-regressions'

const buildWidget = () =>
  loadWidget()
    .withPresets('answerBot')
    .intercept(mockInteractionEndpoint())
    .intercept(mockViewedEndpoint())
    .intercept(mockRejectionEndpoint())

const searchAndViewArticle = async tag => {
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await search('Help')
  await widget.waitForText('Here are some articles that may help:')
  await assertScreenshot('answer-bot', { tag })
  await widget.clickText('The second article')
  await widget.waitForText('body of second article')
  await assertScreenshot('answer-bot-article', { tag })
  await widget.waitForText('Does this article answer your question?')
  await assertScreenshot('answer-bot-article-feedback', { tag })
  await widget.clickText('No, I need help')
  await widget.waitForText('Please tell us why.')
  await assertScreenshot('answer-bot-article-feedback-no', { tag })
}

describe('desktop', () => {
  test('search and view article', async () => {
    await buildWidget().load()
    await searchAndViewArticle()
  })
})

describe('mobile', () => {
  test('search and view article', async () => {
    await buildWidget()
      .useMobile()
      .load()
    await searchAndViewArticle('mobile')
  })
})
