import {
  mockInteractionEndpoint,
  mockViewedEndpoint,
  search,
  waitForAnswerBot,
} from 'e2e/helpers/answer-bot-embed'
import { assertOriginalArticleLink } from 'e2e/helpers/help-center-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { wait } from 'pptr-testing-library'

const buildWidget = () => loadWidget().withPresets('answerBot').intercept(mockInteractionEndpoint())

test('article displayed with expected properties', async () => {
  await buildWidget().intercept(mockViewedEndpoint()).load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await search('Help')
  await widget.waitForText('Here are some articles that may help:')
  await widget.clickText('The second article')
  await widget.expectToSeeText('body of second article')
  await assertOriginalArticleLink(
    'https://answerbot.zendesk.com/hc/en-us/articles/2nd-article?auth_token=eyJ'
  )
  expect(await widget.zendeskLogoVisible()).toBeTruthy()
  await expect(page).toPassAxeTests()
})

test('sends article viewed request when article is viewed', async () => {
  const endpoint = jest.fn()
  await buildWidget().intercept(mockViewedEndpoint(endpoint)).load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await search('Help')
  await widget.waitForText('Here are some articles that may help:')
  await widget.clickText('The second article')
  await widget.expectToSeeText('body of second article')
  await wait(() => {
    expect(endpoint).toHaveBeenCalled()
  })
  const params = JSON.parse(endpoint.mock.calls[0][0])
  expect(params).toEqual({
    interaction_access_token: 'eyJ0eXAi',
    deflection_id: 360060729351,
    article_id: 360002874213,
    resolution_channel_id: 67,
  })
  await expect(page).toPassAxeTests()
})
