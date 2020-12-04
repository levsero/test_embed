import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { waitForAnswerBot, waitForGetInTouchButton } from 'e2e/helpers/answer-bot-embed'
import { waitForContactForm } from 'e2e/helpers/support-embed'

beforeEach(async () => {
  await loadWidget('answerBot', 'contactForm')
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await waitForGetInTouchButton()
})

test('clicking contact us channel goes to contact form embed', async () => {
  await widget.clickButton('Get in touch')
  await widget.waitForText('How do you want to get in touch?')
  await widget.clickText('Leave a message')
  await waitForContactForm()
})

test('can go back to answer bot', async () => {
  await widget.clickButton('Get in touch')
  await widget.waitForText('How do you want to get in touch?')
  await widget.clickText('Leave a message')
  await waitForContactForm()
  await widget.clickBack()
  await widget.expectToSeeText('How do you want to get in touch?')
})
