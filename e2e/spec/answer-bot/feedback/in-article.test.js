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
import { getJsonPayload } from 'e2e/helpers/utils'
import { queries, wait } from 'pptr-testing-library'

const buildWidget = () =>
  loadWidget()
    .withPresets('answerBot')
    .intercept(mockInteractionEndpoint())
    .intercept(mockViewedEndpoint())

const goToArticle = async title => {
  await widget.openByKeyboard()
  await waitForAnswerBot()

  const doc = await widget.getDocument()
  await search('Help')
  await wait(() => queries.getByText(doc, 'Here are some articles that may help:'))
  const link = await queries.getByText(doc, title)
  await link.click()
  await wait(() => queries.getByText(doc, 'Does this article answer your question?'))
}

const answerFeedback = async answer => {
  const doc = await widget.getDocument(),
    frame = await widget.getFrame()
  await expect(frame).toClick('button', { text: answer })
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Does this article answer your question?')).toBeNull()
  })
}

describe('clicking yes', () => {
  it('sends request to answer bot with expected parameters', async () => {
    const endpoint = jest.fn()
    await buildWidget()
      .intercept(mockResolutionEndpoint(endpoint))
      .load()
    await goToArticle('The second article')
    await answerFeedback('Yes')
    expect(getJsonPayload(endpoint)).toEqual({
      article_id: 360002874213,
      deflection_id: 360060729351,
      interaction_access_token: 'eyJ0eXAi',
      resolution_channel_id: 67
    })
  })

  describe('after resolution', () => {
    beforeEach(async () => {
      await buildWidget()
        .intercept(mockResolutionEndpoint())
        .load()
      await goToArticle('The second article')
      await answerFeedback('Yes')
    })

    it('shows expected message in coversation', async () => {
      await widget.clickBack()
      const doc = await widget.getDocument()
      await wait(async () => {
        expect(await queries.queryByText(doc, 'Nice. Knowledge is power.')).toBeTruthy()
      })
    })

    it('will not ask for feedback again', async () => {
      await widget.clickBack()
      const doc = await widget.getDocument()
      const link = await queries.getByText(doc, 'The third article')
      await link.click()
      await page.waitFor(3000)
      expect(await queries.queryByText(doc, 'Does this article answer your question?')).toBeNull()
    })
  })
})

describe('clicking no', () => {
  it('sends request to answer bot with expected parameters', async () => {
    const endpoint = jest.fn()
    await buildWidget()
      .intercept(mockRejectionEndpoint(endpoint))
      .load()
    await goToArticle('The second article')
    await answerFeedback('No')
    const doc = await widget.getDocument()
    await queries.getByText(doc, 'Please tell us why.')
    const button = await queries.getByText(doc, "It's not related to my question")
    await button.click()
    await wait(() => {
      expect(getJsonPayload(endpoint)).toEqual({
        article_id: 360002874213,
        deflection_id: 360060729351,
        interaction_access_token: 'eyJ0eXAi',
        resolution_channel_id: 67,
        reason_id: 1
      })
    })
  })

  describe('after rejection', () => {
    beforeEach(async () => {
      await buildWidget()
        .intercept(mockRejectionEndpoint())
        .load()
      await goToArticle('The second article')
      await answerFeedback('No')
      const doc = await widget.getDocument()
      await queries.getByText(doc, 'Please tell us why.')
      const button = await queries.getByText(doc, "It's related, but it didn't answer my question")
      await button.click()
    })

    it('shows expected message in coversation', async () => {
      const doc = await widget.getDocument()
      await wait(async () => {
        expect(
          await queries.queryByText(doc, 'I see. Your question is still unresolved.')
        ).toBeTruthy()
      })
    })

    it('will not ask for feedback again from the same article', async () => {
      const doc = await widget.getDocument()
      const link = await queries.getByText(doc, 'The second article')
      await link.click()
      await page.waitFor(3000)
      expect(await queries.queryByText(doc, 'Does this article answer your question?')).toBeNull()
    })

    it('will ask for feedback from a different article', async () => {
      const doc = await widget.getDocument()
      const link = await queries.getByText(doc, 'The first article')
      await link.click()
      await queries.getByText(doc, 'first article')
      await wait(async () => {
        expect(
          await queries.queryByText(doc, 'Does this article answer your question?')
        ).toBeTruthy()
      })
    })
  })
})
