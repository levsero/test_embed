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
import { queries, wait } from 'pptr-testing-library'

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

  const doc = await widget.getDocument()
  await search('Help')
  await wait(() => queries.getByText(doc, 'Here are some articles that may help:'))
  const link = await queries.getByText(doc, title)
  await link.click()
}

beforeEach(async () => {
  await buildWidget().load()
  await goToArticle('The second article')
})

describe('clicking yes', () => {
  it('shows the expected messages after', async () => {
    await widget.clickBack()
    const doc = await widget.getDocument(),
      frame = await widget.getFrame()
    await wait(() =>
      queries.getByText(doc, 'Did the article you viewed help to answer your question?')
    )
    await expect(frame).toClick('button', { text: 'Yes' })
    await wait(async () => {
      expect(await queries.queryByText(doc, 'Nice. Knowledge is power.')).toBeTruthy()
    })
    expect(resolutionEndpoint).toHaveBeenCalled()
  })
})

describe('clicking no', () => {
  it('shows the expected messages after', async () => {
    await widget.clickBack()
    const doc = await widget.getDocument(),
      frame = await widget.getFrame()
    await wait(() =>
      queries.getByText(doc, 'Did the article you viewed help to answer your question?')
    )
    await expect(frame).toClick('button', { text: 'No' })
    await wait(() => queries.getByText(doc, 'Please tell us why.'))
    await expect(frame).toClick('button', {
      text: "It's related, but it didn't answer my question"
    })
    await wait(async () => {
      expect(
        await queries.queryByText(doc, 'I see. Your question is still unresolved.')
      ).toBeTruthy()
    })
    expect(rejectionEndpoint).toHaveBeenCalled()
  })
})
