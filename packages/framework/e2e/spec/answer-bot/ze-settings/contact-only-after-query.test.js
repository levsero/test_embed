import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import {
  mockInteractionEndpoint,
  waitForAnswerBot,
  search,
  waitForGetInTouchButton,
} from 'e2e/helpers/answer-bot-embed'

test('only show get in touch button after query', async () => {
  await loadWidget()
    .withPresets('answerBot', 'contactForm')
    .intercept(mockInteractionEndpoint())
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          answerBot: {
            contactOnlyAfterQuery: true,
          },
        },
      }
    })
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await page.waitFor(3000)
  await widget.expectNotToSeeText('Get in touch')
  await search('help')
  await widget.waitForText('Here are some articles that may help:')
  await waitForGetInTouchButton()
  await widget.expectToSeeText('Get in touch')
})
