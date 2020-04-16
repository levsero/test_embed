import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { mockBlipEndpoint, getBlipPayload, blipMetadata } from 'e2e/helpers/blips'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'

export const assertHCArticleViewedPayload = url => {
  const payload = getBlipPayload(url)

  expect(payload).toEqual({
    channel: 'web_widget',
    userAction: {
      category: 'helpCenter',
      action: 'click',
      label: 'helpCenterForm',
      value: {
        query: 'Help',
        resultsCount: 3,
        uniqueSearchResultClick: true,
        articleId: expect.any(Number),
        locale: 'en-gb',
        contextualSearch: false,
        answerBot: false
      }
    },
    ...blipMetadata
  })
}

test('sends Help Center article view blips in the correct format', async () => {
  const blipEndpoint = jest.fn()

  await loadWidget()
    .withPresets('helpCenter')
    .intercept(mockSearchEndpoint())
    .intercept(mockBlipEndpoint(blipEndpoint))
    .load()

  await launcher.click()
  await waitForHelpCenter()

  const widgetDoc = await widget.getDocument()
  await wait(() => queries.getByPlaceholderText(widgetDoc, 'How can we help?'))

  await page.keyboard.type('Help')
  await page.keyboard.press('Enter')
  await wait(() => queries.getByText(widgetDoc, 'Top results'))

  blipEndpoint.mockClear()

  const result = await queries.getByText(widgetDoc, 'Welcome to your Help Center!')
  await result.click()
  await wait(async () => {
    await queries.queryByText(widgetDoc, 'This is the body.')
  })

  const blipUrl = blipEndpoint.mock.calls[0][0]

  assertHCArticleViewedPayload(blipUrl)
})
