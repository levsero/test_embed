import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { waitForAnswerBot, mockInteractionEndpoint } from 'e2e/helpers/answer-bot-embed'
import { allowsInputTextEditing } from '../shared-examples'
import { queries, wait } from 'pptr-testing-library'
import searchResults from 'e2e/fixtures/responses/answer-bot-interaction.json'
import { queryAllByText } from 'e2e/helpers/queries'
import { getJsonPayload } from 'e2e/helpers/utils'
import { TEST_IDS } from 'src/constants/shared'

const search = async (doc, query = 'Help') => {
  const input = await queries.getByPlaceholderText(doc, 'Type your question here...')
  await allowsInputTextEditing(input, query)
  await page.keyboard.press('Enter')
  // input is cleared after search
  await wait(async () => {
    const value = await input.getProperty('value')
    expect(await value.jsonValue()).toEqual('')
  })
}

const buildWidget = () => loadWidget().withPresets('answerBot')

test('searches interaction endpoint with expected parameters', async () => {
  const endpoint = jest.fn()
  await buildWidget()
    .intercept(mockInteractionEndpoint(searchResults, endpoint))
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  const doc = await widget.getDocument()
  await search(doc)
  await widget.waitForTestId(TEST_IDS.HC_ARTICLE_TITLE, { visible: true })
  expect(getJsonPayload(endpoint)).toEqual(
    expect.objectContaining({
      via_id: 67,
      deflection_channel_id: 67,
      interaction_reference_type: 1,
      interaction_reference: expect.any(String),
      locale: 'en-gb',
      enquiry: 'Help',
      labels: []
    })
  )
})

test('displays expected components in the conversation', async () => {
  await buildWidget()
    .intercept(mockInteractionEndpoint())
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  const doc = await widget.getDocument()
  await search(doc)
  await widget.waitForTestId(TEST_IDS.HC_ARTICLE_TITLE, { visible: true })
  await expect(
    await queryAllByText(['The first article', 'The second article', 'The third article'])
  ).toAppearInOrder()
  expect(await widget.zendeskLogoVisible()).toEqual(true)
})

test('sending messages in quick succession will batch it into a single query', async () => {
  const endpoint = jest.fn()
  await buildWidget()
    .intercept(mockInteractionEndpoint(searchResults, endpoint))
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  const doc = await widget.getDocument()
  await search(doc, 'First message')
  await search(doc, 'Second message')
  await search(doc, 'Third message')
  await widget.waitForTestId(TEST_IDS.HC_ARTICLE_TITLE, { visible: true })
  expect(getJsonPayload(endpoint)).toEqual(
    expect.objectContaining({
      enquiry: 'First message Second message Third message'
    })
  )
})

test('empty result will display expected message', async () => {
  await buildWidget()
    .intercept(
      mockInteractionEndpoint({
        deflection: { id: 1, auth_token: 'abc' },
        deflection_articles: []
      })
    )
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  const doc = await widget.getDocument()
  await search(doc)
  await wait(async () => {
    expect(await queries.queryByText(doc, "I couldn't find any relevant articles.")).toBeTruthy()
  })
})
