import {
  search,
  waitForAnswerBot,
  mockInteractionEndpoint,
  waitForGetInTouchButton,
} from 'e2e/helpers/answer-bot-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'

test('does not display get in touch button when there are no channels available', async () => {
  await loadWidget('answerBot')
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await page.waitFor(3000)
  await widget.expectNotToSeeText('Get in touch')
  await expect(page).toPassAxeTests()
})

describe('channels available', () => {
  afterEach(async () => {
    await expect(page).toPassAxeTests()
  })

  test('displays button after greeting', async () => {
    await loadWidget('answerBot', 'contactForm')
    await widget.openByKeyboard()
    await waitForAnswerBot()
    await waitForGetInTouchButton()
    await widget.expectToSeeText('Get in touch')
  })

  test('displays button after asking a question', async () => {
    await loadWidget()
      .withPresets('answerBot', 'contactForm')
      .intercept(mockInteractionEndpoint())
      .load()
    await widget.openByKeyboard()
    await waitForAnswerBot()
    await widget.expectNotToSeeText('Get in touch')
    await search('Help')
    await widget.expectNotToSeeText('Get in touch')
    await widget.waitForText('Here are some articles that may help:')
    await waitForGetInTouchButton()
    await widget.waitForText('Or you can get in touch.')
    await widget.expectToSeeText('Get in touch')
  })
})
