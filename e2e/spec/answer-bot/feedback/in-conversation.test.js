import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import {
  search,
  waitForAnswerBot,
  mockInteractionEndpoint,
  mockViewedEndpoint,
  mockResolutionEndpoint,
  mockRejectionEndpoint
} from 'e2e/helpers/answer-bot-embed'

const resolutionEndpoint = jest.fn(),
  rejectionEndpoint = jest.fn()

const buildWidget = () =>
  loadWidget()
    .withPresets('answerBot')
    .intercept(mockInteractionEndpoint())
    .intercept(mockViewedEndpoint())
    .intercept(mockResolutionEndpoint(resolutionEndpoint))
    .intercept(mockRejectionEndpoint(rejectionEndpoint))

const goToArticle = async title => {
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await search('Help')
  await widget.waitForText('Here are some articles that may help:')
  await widget.clickText(title)
}

beforeEach(async () => {
  await buildWidget().load()
  await goToArticle('The second article')
})

describe('clicking yes', () => {
  it('shows the expected messages after', async () => {
    await widget.clickBack()
    await widget.waitForText('Did the article you viewed help to answer your question?')
    await widget.clickButton('Yes')
    await widget.waitForText('Nice. Knowledge is power.')
    expect(resolutionEndpoint).toHaveBeenCalled()
  })
})

describe('clicking no', () => {
  it('shows the expected messages after', async () => {
    await widget.clickBack()
    await widget.waitForText('Did the article you viewed help to answer your question?')
    await widget.clickText('No', { exact: false })
    await widget.waitForText('Please tell us why.')
    await widget.clickButton("It's related, but it didn't answer my question")
    await widget.waitForText('I see. Your question is still unresolved.')
    expect(rejectionEndpoint).toHaveBeenCalled()
  })
})
