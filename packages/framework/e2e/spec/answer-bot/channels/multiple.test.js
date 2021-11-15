import { waitForAnswerBot, waitForGetInTouchButton } from 'e2e/helpers/answer-bot-embed'
import { queryAllByText } from 'e2e/helpers/queries'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'

test('displays all channels available', async () => {
  await loadWidget('answerBot', 'chat', 'contactForm')
  await zChat.online()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await waitForGetInTouchButton()
  await widget.clickButton('Get in touch')
  await widget.waitForText('How do you want to get in touch?')
  const buttons = await queryAllByText(['Live chat', 'Leave a message'])
  expect(buttons).toHaveLength(2)
  await expect(page).toPassAxeTests()
})
