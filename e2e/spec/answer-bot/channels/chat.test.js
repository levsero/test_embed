import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { waitForAnswerBot, waitForGetInTouchButton } from 'e2e/helpers/answer-bot-embed'
import { queries, wait } from 'pptr-testing-library'
import zChat from 'e2e/helpers/zChat'

test('clicking chat channel goes to chat embed', async () => {
  await loadWidget('answerBot', 'chat')
  await zChat.online()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await waitForGetInTouchButton()
  const doc = await widget.getDocument()
  const button = await queries.getByText(doc, 'Get in touch')
  await button.click()
  await wait(() => queries.getByText(doc, 'How do you want to get in touch?'))
  const chatButton = await queries.queryByText(doc, 'Live chat')
  expect(chatButton).toBeTruthy()
  await chatButton.click()
  expect(await queries.queryByText(doc, 'Chat with us')).toBeTruthy()
})
