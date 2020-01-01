import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import {
  search,
  waitForAnswerBot,
  mockInteractionEndpoint,
  mockViewedEndpoint
} from 'e2e/helpers/answer-bot-embed'
import { queries, wait } from 'pptr-testing-library'

const assertOriginalArticleLink = async doc => {
  const originalArticleLink = await queries.queryByTitle(doc, 'View original article')
  expect(originalArticleLink).toBeTruthy()
  const href = await originalArticleLink.getProperty('href')
  expect(await href.jsonValue()).toEqual(
    'https://answerbot.zendesk.com/hc/en-us/articles/2nd-article?auth_token=eyJ'
  )
}

const buildWidget = () =>
  loadWidget()
    .withPresets('answerBot')
    .intercept(mockInteractionEndpoint())

test('article displayed with expected properties', async () => {
  await buildWidget()
    .intercept(mockViewedEndpoint())
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()

  const doc = await widget.getDocument()
  await search('Help')
  await wait(() => queries.getByText(doc, 'Here are some articles that may help:'))
  const link = await queries.getByText(doc, 'The second article')
  await link.click()
  const body = await queries.queryByText(doc, 'body of second article')
  expect(body).toBeTruthy()
  await assertOriginalArticleLink(doc)
  expect(await widget.zendeskLogoVisible()).toBeTruthy()
})

test('sends article viewed request when article is viewed', async () => {
  const endpoint = jest.fn()
  await buildWidget()
    .intercept(mockViewedEndpoint(endpoint))
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()

  const doc = await widget.getDocument()
  await search('Help')
  await wait(() => queries.getByText(doc, 'Here are some articles that may help:'))
  const link = await queries.getByText(doc, 'The second article')
  await link.click()
  await queries.getByText(doc, 'body of second article')
  await wait(() => {
    expect(endpoint).toHaveBeenCalled()
  })
  const params = JSON.parse(endpoint.mock.calls[0][0])
  expect(params).toEqual({
    interaction_access_token: 'eyJ0eXAi',
    deflection_id: 360060729351,
    article_id: 360002874213,
    resolution_channel_id: 67
  })
})
