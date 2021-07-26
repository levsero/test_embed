import { openChattingScreen } from 'e2e/helpers/chat-embed'
import widget from 'e2e/helpers/widget'

test('chat:send sends a chat message', async () => {
  await openChattingScreen()

  await page.evaluate(() => {
    zE('webWidget', 'chat:send', 'The Screaming Mimi')
  })

  await widget.expectToSeeText('The Screaming Mimi')
})
