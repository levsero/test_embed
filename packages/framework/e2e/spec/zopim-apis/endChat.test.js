import { agentJoinsChat, openChattingScreen, visitorLeavesChat } from 'e2e/helpers/chat-embed'
import widget from 'e2e/helpers/widget'

test('endChat() ends a chat', async () => {
  await openChattingScreen()
  await agentJoinsChat('Murray Bozinsky')
  await widget.waitForText('Murray Bozinsky joined the chat')
  await visitorLeavesChat('Visitor 1')

  await page.evaluate(() => $zopim.livechat.endChat())

  await widget.waitForText('Chat ended')
})
