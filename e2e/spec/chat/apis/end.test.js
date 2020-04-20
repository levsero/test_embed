import widget from '../../../helpers/widget'
import { agentJoinsChat, getChatReady, visitorLeavesChat } from 'e2e/helpers/chat-embed'

test('chat:end ends a chat', async () => {
  await getChatReady()
  await agentJoinsChat('Murray Bozinsky')
  await visitorLeavesChat('Visitor 1')

  await page.evaluate(() => zE('webWidget', 'chat:end'))

  await widget.expectToSeeText('Chat ended')
})
