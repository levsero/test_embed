import {
  search,
  waitForAnswerBot,
  mockInteractionEndpoint,
  mockViewedEndpoint,
} from 'e2e/helpers/answer-bot-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'

test('hides the logo in answer bot when requested', async () => {
  await loadWidget()
    .withPresets('answerBot', {
      hideZendeskLogo: true,
    })
    .intercept(mockInteractionEndpoint())
    .intercept(mockViewedEndpoint())
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  expect(await widget.zendeskLogoVisible()).toEqual(false)
  await search('Help')
  await widget.waitForText('Here are some articles that may help:')
  await widget.clickText('The first article')
  await widget.waitForText('first article')
  expect(await widget.zendeskLogoVisible()).toEqual(false)
  await expect(page).toPassAxeTests()
})
