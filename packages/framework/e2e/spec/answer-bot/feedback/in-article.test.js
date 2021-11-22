import {
  search,
  waitForAnswerBot,
  mockInteractionEndpoint,
  mockViewedEndpoint,
  mockResolutionEndpoint,
  mockRejectionEndpoint,
} from 'e2e/helpers/answer-bot-embed'
import launcher from 'e2e/helpers/launcher'
import { getJsonPayload } from 'e2e/helpers/utils'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries, wait } from 'pptr-testing-library'
import { TEST_IDS } from 'src/constants/shared'

const buildWidget = () =>
  loadWidget()
    .withPresets('answerBot')
    .intercept(mockInteractionEndpoint())
    .intercept(mockViewedEndpoint())

const goToArticle = async (title) => {
  await launcher.click()
  await waitForAnswerBot()
  await search('Help')
  await widget.waitForTestId(TEST_IDS.HC_ARTICLE_TITLE, { visible: true })
  await widget.clickText(title)
  await widget.waitForText('Does this article answer your question?')
}

const answerFeedback = async (answer) => {
  await widget.clickText(answer, { exact: false })
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Does this article answer your question?')).toBeNull()
  })
}

describe('clicking yes', () => {
  it('sends request to answer bot with expected parameters', async () => {
    const endpoint = jest.fn()
    await buildWidget().intercept(mockResolutionEndpoint(endpoint)).load()
    await goToArticle('The second article')
    await answerFeedback('Yes')
    expect(getJsonPayload(endpoint)).toEqual({
      article_id: 360002874213,
      deflection_id: 360060729351,
      interaction_access_token: 'eyJ0eXAi',
      resolution_channel_id: 67,
    })
    await expect(page).toPassAxeTests()
  })

  describe('after resolution', () => {
    beforeEach(async () => {
      await buildWidget().intercept(mockResolutionEndpoint()).load()
      await goToArticle('The second article')
      await answerFeedback('Yes')
    })

    it('shows expected message in coversation', async () => {
      await widget.clickBack()
      await widget.waitForText('Nice. Knowledge is power.')
      await expect(page).toPassAxeTests()
    })

    it('will not ask for feedback again', async () => {
      await widget.clickBack()
      await widget.clickText('The third article')
      await page.waitFor(3000)
      await widget.expectNotToSeeText('Does this article answer your question?')
      await expect(page).toPassAxeTests()
    })
  })
})

describe('clicking no', () => {
  it('sends request to answer bot with expected parameters', async () => {
    const endpoint = jest.fn()
    await buildWidget().intercept(mockRejectionEndpoint(endpoint)).load()
    await goToArticle('The second article')
    await answerFeedback('No')
    await widget.waitForText('Please tell us why.')
    await widget.clickText("It's not related to my question")
    await wait(() => {
      expect(getJsonPayload(endpoint)).toEqual({
        article_id: 360002874213,
        deflection_id: 360060729351,
        interaction_access_token: 'eyJ0eXAi',
        resolution_channel_id: 67,
        reason_id: 1,
      })
    })
    await expect(page).toPassAxeTests()
  })

  describe('after rejection', () => {
    beforeEach(async () => {
      await buildWidget().intercept(mockRejectionEndpoint()).load()
      await goToArticle('The second article')
      await answerFeedback('No')
      await widget.waitForText('Please tell us why.')
      await widget.clickText("It's related, but it didn't answer my question")
    })

    it('shows expected message in conversation', async () => {
      await widget.waitForText('I see. Your question is still unresolved.')
      await expect(page).toPassAxeTests()
    })

    it('will not ask for feedback again from the same article', async () => {
      await widget.clickText('The second article')
      await page.waitFor(3000)
      await widget.expectNotToSeeText('Does this article answer your question?')
      await expect(page).toPassAxeTests()
    })

    it('will ask for feedback from a different article', async () => {
      await widget.clickText('The first article')
      await widget.waitForText('Does this article answer your question?')
      await expect(page).toPassAxeTests()
    })
  })
})
