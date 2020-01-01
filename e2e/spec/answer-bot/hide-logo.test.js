import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import {
  search,
  waitForAnswerBot,
  mockInteractionEndpoint,
  mockViewedEndpoint
} from 'e2e/helpers/answer-bot-embed'
import { queries, wait } from 'pptr-testing-library'

test('hides the logo in answer bot when requested', async () => {
  await loadWidget()
    .withPresets('answerBot', {
      hideZendeskLogo: true
    })
    .intercept(mockInteractionEndpoint())
    .intercept(mockViewedEndpoint())
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  expect(await widget.zendeskLogoVisible()).toEqual(false)

  const doc = await widget.getDocument()
  await search('Help')
  await wait(() => queries.getByText(doc, 'Here are some articles that may help:'))
  const link = await queries.getByText(doc, 'The first article')
  await link.click()
  await wait(() => queries.queryByText(doc, 'first article'))
  expect(await widget.zendeskLogoVisible()).toEqual(false)
})
