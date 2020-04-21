import zChat from 'e2e/helpers/zChat'
import { getChatReady } from 'e2e/helpers/chat-embed'

test('chat:departments returns all departments for an account', async () => {
  await getChatReady()

  await zChat.updateDepartment({ status: 'online', id: 3, name: 'Pier 56' })
  await zChat.updateDepartment({ status: 'online', id: 58, name: 'Riptide' })

  const departments = await page.evaluate(() => $zopim.livechat.departments.getAllDepartments())

  expect(departments).toEqual([
    { status: 'online', id: 3, name: 'Pier 56' },
    { status: 'online', id: 58, name: 'Riptide' }
  ])
})
