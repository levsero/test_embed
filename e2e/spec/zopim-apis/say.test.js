import widget from 'e2e/helpers/widget'
import { openChattingScreen } from 'e2e/helpers/chat-embed'

test('livechat.say() sends a chat message', async () => {
  await openChattingScreen()

  await page.evaluate(() => $zopim.livechat.say('The Screaming Mimi'))

  await widget.expectToSeeText('The Screaming Mimi')
})
