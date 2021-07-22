import { openChattingScreen } from 'e2e/helpers/chat-embed'
import zChat from 'e2e/helpers/zChat'

test('chat:departments returns all departments for an account', async () => {
  await openChattingScreen()

  await zChat.updateDepartment({ status: 'online', id: 3, name: 'Pier 56' })
  await zChat.updateDepartment({ status: 'online', id: 58, name: 'Riptide' })

  const departments = await page.evaluate(() => zE('webWidget:get', 'chat:departments'))

  expect(departments).toEqual([
    { status: 'online', id: 3, name: 'Pier 56' },
    { status: 'online', id: 58, name: 'Riptide' },
  ])
})
