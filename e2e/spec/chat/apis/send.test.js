import widget from '../../../helpers/widget'
import { getChatReady } from 'e2e/helpers/chat-embed'

test('chat:send sends a chat message', async () => {
  await getChatReady()

  await page.evaluate(() => {
    zE('webWidget', 'chat:send', 'The Screaming Mimi')
  })

  await widget.expectToSeeText('The Screaming Mimi')
})
