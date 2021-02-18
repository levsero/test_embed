import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { waitForAnswerBot, mockInteractionEndpoint, search } from 'e2e/helpers/answer-bot-embed'
import searchResults from 'e2e/fixtures/responses/answer-bot-interaction.json'
import { queryAllByText } from 'e2e/helpers/queries'
import { getJsonPayload } from 'e2e/helpers/utils'
import { TEST_IDS } from 'src/constants/shared'

const buildWidget = () => loadWidget().withPresets('answerBot')

test('searches interaction endpoint with expected parameters', async () => {
  const endpoint = jest.fn()
  await buildWidget().intercept(mockInteractionEndpoint(searchResults, endpoint)).load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await search('Help')
  await widget.waitForTestId(TEST_IDS.HC_ARTICLE_TITLE, { visible: true })
  expect(getJsonPayload(endpoint)).toEqual(
    expect.objectContaining({
      via_id: 67,
      deflection_channel_id: 67,
      interaction_reference_type: 1,
      interaction_reference: expect.any(String),
      locale: 'en-gb',
      enquiry: 'Help',
      labels: [],
    })
  )
})

test('displays expected components in the conversation', async () => {
  await buildWidget().intercept(mockInteractionEndpoint()).load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await search('Help')
  await widget.waitForTestId(TEST_IDS.HC_ARTICLE_TITLE, { visible: true })
  await expect(
    await queryAllByText(['The first article', 'The second article', 'The third article'])
  ).toAppearInOrder()
  expect(await widget.zendeskLogoVisible()).toEqual(true)
})

test('sending messages in quick succession will batch it into a single query', async () => {
  const endpoint = jest.fn()
  await buildWidget().intercept(mockInteractionEndpoint(searchResults, endpoint)).load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await search('First message')
  await search('Second message')
  await search('Third message')
  await widget.waitForTestId(TEST_IDS.HC_ARTICLE_TITLE, { visible: true })
  expect(getJsonPayload(endpoint)).toEqual(
    expect.objectContaining({
      enquiry: 'First message Second message Third message',
    })
  )
})

test('empty result will display expected message', async () => {
  await buildWidget()
    .intercept(
      mockInteractionEndpoint({
        deflection: { id: 1, auth_token: 'abc' },
        deflection_articles: [],
      })
    )
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await search('Help')
  await widget.waitForText("I couldn't find any relevant articles.")
})
